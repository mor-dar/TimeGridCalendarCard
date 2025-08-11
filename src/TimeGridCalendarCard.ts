import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant, TimeGridCalendarCardConfig, HACalendarEventStringy as _Hack } from './types';
import { VERSION, isAllDay, toIso, regexAnyMatch, hashKey } from './utils';

// FullCalendar imports
import { Calendar, type EventInput } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import allLocales from '@fullcalendar/core/locales-all';

// Register in card picker
// @ts-ignore
(window as any).customCards = (window as any).customCards || [];
// @ts-ignore
(window as any).customCards.push({
  type: 'custom:TimeGridCalendarCard',
  name: 'Time Grid Calendar Card',
  description: 'FullCalendar time-grid day view for calendar.* entities',
  preview: true,
});

@customElement('time-grid-calendar-card')
export class TimeGridCalendarCard extends LitElement {
  // --- HA wiring ---
  @property({ attribute: false }) public hass?: HomeAssistant;
  private _config!: TimeGridCalendarCardConfig;

  // --- state ---
  @state() private _error: string | null = null;
  private _calendar?: Calendar;
  private _calendarEl?: HTMLDivElement;
  private _ro?: ResizeObserver;
  private _raf?: number;
  private _lastW = 0;
  private _lastH = 0;
  private _lastLocale?: string;
  private _lastDir?: 'ltr' | 'rtl';
  private _lastTz?: string;

  // cache: key -> { ts, events }
  private _cache = new Map<string, { ts: number; events: EventInput[] }>();
  private _inflight = new Map<string, Promise<EventInput[]>>();

  static styles = css`
    ha-card {
      overflow: hidden;
    }
    .wrapper {
      position: relative;
      block-size: var(--tgcc-height, 520px); /* card height for internal scroll */
    }
    /* FullCalendar theming via CSS vars, applied on our container */
    .tgcc {
      /* backgrounds */
      --fc-page-bg-color: var(--card-background-color, var(--ha-card-background, var(--primary-background-color)));
      --fc-neutral-bg-color: var(--card-background-color, var(--ha-card-background, var(--primary-background-color)));
      --fc-today-bg-color: transparent; /* remove green/brown tint */
      /* borders + now indicator */
      --fc-border-color: var(--divider-color, rgba(128,128,128,.3));
      --fc-now-indicator-color: var(--accent-color, var(--primary-color));
    }
    /* Ensure inner scroller can scroll independently */
    .tgcc .fc-scroller {
      overflow-y: auto !important;
    }
    .fc .fc-timegrid-slot { /* compact density tweak */ }
    .error {
      color: var(--error-color);
      padding: 8px 16px;
    }
    
    /* Essential FullCalendar styles */
    .fc {
      direction: ltr;
      text-align: left;
    }
    .fc table {
      border-collapse: collapse;
      border-spacing: 0;
      font-size: 1em;
    }
    .fc th {
      text-align: center;
    }
    .fc th,
    .fc td {
      vertical-align: top;
      padding: 0;
    }
    .fc a[data-navlink] {
      cursor: pointer;
    }
    .fc a[data-navlink]:hover {
      text-decoration: underline;
    }
    .fc-direction-ltr {
      direction: ltr;
      text-align: left;
    }
    .fc-direction-rtl {
      direction: rtl;
      text-align: right;
    }
    .fc-theme-standard td,
    .fc-theme-standard th {
      border: 1px solid var(--fc-border-color, #ddd);
    }
    .fc-theme-standard .fc-scrollgrid {
      border: 1px solid var(--fc-border-color, #ddd);
    }
    .fc-theme-standard .fc-scrollgrid-liquid {
      border-width: 1px 0;
    }
    .fc-theme-standard .fc-scrollgrid-liquid > .fc-scrollgrid-section > .fc-scrollgrid-section-header > .fc-scrollgrid-section-body,
    .fc-theme-standard .fc-scrollgrid-liquid > .fc-scrollgrid-section > .fc-scrollgrid-section-footer > .fc-scrollgrid-section-body {
      border-left: 1px solid var(--fc-border-color, #ddd);
      border-right: 1px solid var(--fc-border-color, #ddd);
    }
    .fc-theme-standard .fc-scrollgrid-liquid > .fc-scrollgrid-section:first-child > .fc-scrollgrid-section-header > .fc-scrollgrid-section-body,
    .fc-theme-standard .fc-scrollgrid-liquid > .fc-scrollgrid-section:first-child > .fc-scrollgrid-section-footer > .fc-scrollgrid-section-body {
      border-top: 1px solid var(--fc-border-color, #ddd);
    }
    .fc-theme-standard .fc-scrollgrid-liquid > .fc-scrollgrid-section:last-child > .fc-scrollgrid-section-header > .fc-scrollgrid-section-body,
    .fc-theme-standard .fc-scrollgrid-liquid > .fc-scrollgrid-section:last-child > .fc-scrollgrid-section-footer > .fc-scrollgrid-section-body {
      border-bottom: 1px solid var(--fc-border-color, #ddd);
    }
    .fc-event {
      position: relative;
      display: block;
      font-size: 0.85em;
      line-height: 1.4;
      border-radius: 3px;
      border: 1px solid #3788d8;
      background-color: #3788d8;
      color: #fff;
      cursor: pointer;
    }
    .fc-event-harness,
    .fc-event-harness-abs {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }
    .fc-event-harness > .fc-event,
    .fc-event-harness-abs > .fc-event {
      position: relative;
      z-index: 1;
    }
    .fc-event-main {
      z-index: 2;
      position: relative;
    }
    .fc-event-main-frame {
      position: relative;
      display: flex;
      flex-direction: column;
      cursor: pointer;
    }
    .fc-event-time {
      overflow: hidden;
      font-weight: bold;
    }
    .fc-event-title-container {
      flex-grow: 1;
      flex-shrink: 1;
      min-width: 0;
    }
    .fc-event-title {
      display: inline-block;
      vertical-align: top;
      left: 0;
      right: 0;
      max-width: 100%;
      overflow: hidden;
    }
    .fc-timegrid {
      flex-direction: column;
      min-height: 100%;
    }
    .fc-timegrid-header .fc-scrollgrid-section {
      height: auto;
    }
    .fc-timegrid-header .fc-scrollgrid-section table {
      height: 100%;
    }
    .fc-timegrid-body {
      position: relative;
      z-index: 1;
      flex-grow: 1;
    }
    .fc-timegrid-divider {
      padding: 0 0 2px;
    }
    .fc-timegrid-slots {
      position: relative;
    }
    .fc-timegrid-slot {
      height: 1.5em;
      border-bottom: 0;
    }
    .fc-timegrid-slot:empty:before {
      content: '\\00a0';
    }
    .fc-timegrid-slot-minor {
      border-top-style: dotted;
    }
    .fc-timegrid-slot-label-cushion {
      display: inline-block;
      white-space: nowrap;
    }
    .fc-timegrid-slot-label {
      vertical-align: middle;
    }
    .fc-timegrid-axis-cushion,
    .fc-timegrid-slot-label-cushion {
      padding: 0 4px;
    }
    .fc-timegrid-axis-frame-liquid {
      height: 100%;
    }
    .fc-timegrid-axis-frame {
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    .fc-timegrid-axis-cushion {
      max-width: 60px;
      flex-shrink: 0;
    }
    .fc-timegrid-now-indicator-line {
      position: absolute;
      z-index: 4;
      left: 0;
      right: 0;
      border-style: solid;
      border-color: red;
      border-width: 1px 0 0;
    }
    .fc-timegrid-now-indicator-arrow {
      position: absolute;
      z-index: 4;
      margin-top: -5px;
      border-style: solid;
      border-color: red;
    }
    .fc-direction-ltr .fc-timegrid-now-indicator-arrow {
      left: 0;
      border-width: 5px 0 5px 6px;
      border-top-color: transparent;
      border-bottom-color: transparent;
    }
    .fc-direction-rtl .fc-timegrid-now-indicator-arrow {
      right: 0;
      border-width: 5px 6px 5px 0;
      border-top-color: transparent;
      border-bottom-color: transparent;
    }
  `;

  // Use light DOM so FullCalendar CSS injected in <head> applies without shadow boundary issues
  protected createRenderRoot() { return this; }

  public setConfig(config: TimeGridCalendarCardConfig): void {
    if (!config || !Array.isArray(config.entities) || config.entities.length === 0) {
      throw new Error('entities is required and must list one or more calendar.* entity_ids');
    }
    this._config = {
      minTime: '06:00:00',
      maxTime: '22:00:00',
      slotDuration: '00:30:00',
      nowIndicator: true,
      scrollTime: '07:00:00',
      slotEventOverlap: true,
      cacheMinutes: 10,
      suppressDuplicates: true,
      todayOnly: false,
      height: 520,
      ...config,
    };
  }

  public getCardSize(): number { return 6; }

  protected render() {
    return html`
      <ha-card>
        <style>
          /* Make FC inherit HA colors, remove today tint */
          .wrapper { block-size: var(--tgcc-height, 520px); }
          .tgcc {
            --fc-page-bg-color: var(--card-background-color, var(--ha-card-background, var(--primary-background-color)));
            --fc-neutral-bg-color: var(--card-background-color, var(--ha-card-background, var(--primary-background-color)));
            --fc-border-color: var(--divider-color, rgba(128, 128, 128, .3));
            --fc-now-indicator-color: var(--accent-color, var(--primary-color));
            --fc-today-bg-color: transparent; /* main fix */
          }
          /* In case some themes still override via class, force it off */
          .tgcc .fc-day-today,
          .tgcc .fc-timegrid-col.fc-day-today { background: transparent !important; }

          /* allow internal vertical scroll */
          .tgcc .fc-scroller { overflow-y: auto !important; }
        </style>

        ${this._error ? html`<div class="error">${this._error}</div>` : nothing}
        <div class="wrapper">
          <div id="fc" class="tgcc">
            <div style="padding: 20px; text-align: center;">
              Calendar card loaded successfully - initialization disabled for testing
            </div>
          </div>
        </div>
      </ha-card>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
  }

  protected firstUpdated(): void {
    this._calendarEl = this.querySelector('#fc') as HTMLDivElement;
    // Temporarily disable ResizeObserver to test if it's causing the issue
  }

  protected willUpdate() {
    // Temporarily disable calendar initialization to test basic rendering
    // if (!this._calendar && this.hass && this._calendarEl?.offsetParent) {
    //   this._initCalendar();
    // }
  }
  
  protected updated(): void {
    if (!this._calendar || !this.hass) return;
    
    // Set height once after render
    const h = typeof this._config.height === 'number' ? `${this._config.height}px` : (this._config.height || '520px');
    (this.querySelector('.wrapper') as HTMLElement)?.style.setProperty('--tgcc-height', h);
    
    // Update only when options actually change
    const locale = this.hass.locale?.language ?? 'en';
    const dir = (document?.dir as 'ltr' | 'rtl') || 'ltr';
    const tz = this.hass.config?.time_zone || 'local';

    if (locale !== this._lastLocale) {
      this._calendar.setOption('locale', locale);
      this._lastLocale = locale;
    }
    if (dir !== this._lastDir) {
      this._calendar.setOption('direction', dir);
      this._lastDir = dir;
    }
    if (tz !== this._lastTz) {
      this._calendar.setOption('timeZone', tz);
      this._lastTz = tz;
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback?.();
    if (this._ro) {
      this._ro.disconnect();
      this._ro = undefined;
    }
    if (this._raf) {
      cancelAnimationFrame(this._raf);
      this._raf = undefined;
    }
    if (this._calendar) {
      this._calendar.destroy();
      this._calendar = undefined;
    }
  }

  private _initCalendar(): void {
    if (!this._calendarEl) return;
    
    const locale = this.hass?.locale?.language ?? 'en';
    const dir = (document?.dir as 'ltr' | 'rtl') || 'ltr';
    const tz = this.hass?.config?.time_zone || 'local';
    
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    this._calendar = new Calendar(this._calendarEl, {
      plugins: [timeGridPlugin, interactionPlugin],
      initialView: 'timeGridDay',
      headerToolbar: this._config.todayOnly ? false : { left: 'prev,next today', center: '', right: '' },
      dayHeaders: !this._config.todayOnly,
      navLinks: !this._config.todayOnly,
      initialDate: today,
      height: '100%',
      handleWindowResize: false,      // important: avoid double layout work
      expandRows: true,
      stickyHeaderDates: true,
      firstDay: this.hass?.locale?.first_day_of_week ?? 0,
      dayHeaderFormat: { weekday: 'long', month: 'short', day: 'numeric' },
      slotLabelFormat: this._slotLabelFormat(),
      locales: allLocales,
      locale,
      direction: dir,
      timeZone: tz,
      nowIndicator: this._config.nowIndicator,
      slotMinTime: this._config.minTime,
      slotMaxTime: this._config.maxTime,
      slotDuration: this._config.slotDuration,
      scrollTime: this._config.scrollTime,
      slotEventOverlap: this._config.slotEventOverlap,
      validRange: this._config.todayOnly ? { start: startOfToday, end: endOfToday } : undefined,
      eventClick: (info) => this._onEventClick(info),
      // Temporarily disable event fetching to test if it causes the hang
      eventSources: [],
    });

    this._calendar.render();
  }

  private _slotLabelFormat(): any {
    const tf = this.hass?.locale?.time_format ?? 'system';
    const hour12 = tf === '12';
    return hour12 ? { hour: 'numeric', minute: '2-digit' } : { hour: '2-digit', minute: '2-digit', hour12: false };
  }

  private async _fetchMergedEvents(startStr: string, endStr: string): Promise<EventInput[]> {
    if (!this.hass) throw new Error('hass not available');

    const key = hashKey([startStr, endStr, ...this._config.entities]);
    const ttlMs = (this._config.cacheMinutes ?? 10) * 60 * 1000;
    const now = Date.now();

    // Cache hit
    const cached = this._cache.get(key);
    if (cached && now - cached.ts < ttlMs) {
      return cached.events;
    }

    // In-flight de-dupe
    const inflight = this._inflight.get(key);
    if (inflight) return inflight;

    const p = (async () => {
      const all = (
        await Promise.all(
          this._config.entities.map(async (entityId) => {
            const url = `calendars/${encodeURIComponent(entityId)}?start=${encodeURIComponent(startStr)}&end=${encodeURIComponent(endStr)}`;
            const rows = await this.hass!.callApi<any[]>('GET', url);
            return rows.map((e) => ({ event: e, entityId }));
          })
        )
      ).flat();

      // Map to FullCalendar events + filtering
      let mapped: EventInput[] = all
        .map(({ event, entityId }) => this._mapToEventInput(event, entityId))
        .filter((e): e is EventInput => Boolean(e));

      if (this._config.suppressDuplicates) {
        const seen = new Set<string>();
        mapped = mapped.filter((ev) => {
          const key = hashKey([ev.title, ev.start as string, ev.end as string, ev.allDay, ev.extendedProps?.entity_id]);
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      }

      // Save cache
      this._cache.set(key, { ts: now, events: mapped });
      this._inflight.delete(key);
      return mapped;
    })();

    this._inflight.set(key, p);
    return p;
  }

  private _mapToEventInput(raw: any, entityId: string): EventInput | null {
    const title: string = raw.summary || raw.title || 'Untitled';
    const startIso = toIso(raw.start);
    const endIso = toIso(raw.end);
    const allDay = raw.all_day ?? isAllDay(raw.start, raw.end);

    // Apply filters
    const filters = this._config.filters?.[entityId];
    if (filters) {
      if (filters.allow && !regexAnyMatch(filters.allow, title)) return null;
      if (filters.block && regexAnyMatch(filters.block, title)) return null;
    }

    const color = this._config.colors?.[entityId];

    const ev: EventInput = {
      id: raw.uid ? `${entityId}:${raw.uid}` : undefined,
      title,
      start: startIso,
      end: endIso,
      allDay,
      backgroundColor: color,
      borderColor: color,
      extendedProps: {
        entity_id: entityId,
        description: raw.description ?? '',
        location: raw.location ?? '',
        uid: raw.uid ?? '',
        source: 'home-assistant',
      },
    };
    return ev;
  }

  private _onEventClick(info: any) {
    const entityId = info.event.extendedProps?.entity_id;
    if (!entityId) return;
    // Open HA more-info for the calendar entity
    const ev = new CustomEvent('hass-more-info', {
      detail: { entityId },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(ev);
  }

  // Lovelace editor stub
  static getStubConfig(): Partial<TimeGridCalendarCardConfig> {
    return {
      type: 'custom:TimeGridCalendarCard',
      entities: ['calendar.personal', 'calendar.work'],
      minTime: '06:00:00',
      maxTime: '22:00:00',
      slotDuration: '00:30:00',
      nowIndicator: true,
      scrollTime: '07:00:00',
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'time-grid-calendar-card': TimeGridCalendarCard;
  }
}

if (!customElements.get('time-grid-calendar-card')) {
  customElements.define('time-grid-calendar-card', TimeGridCalendarCard);
}
