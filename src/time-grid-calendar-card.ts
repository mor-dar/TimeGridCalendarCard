import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant, TimeGridCalendarCardConfig, HACalendarEventStringy as _Hack } from './types';
import { VERSION, isAllDay, toIso, regexAnyMatch, hashKey } from './utils';

// FullCalendar imports
import { Calendar, type EventInput } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import allLocales from '@fullcalendar/core/locales-all';
import '@fullcalendar/core/index.css';
import '@fullcalendar/timegrid/index.css';

// Register in card picker
// @ts-ignore
(window as any).customCards = (window as any).customCards || [];
// @ts-ignore
(window as any).customCards.push({
  type: 'time-grid-calendar-card',
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

  // cache: key -> { ts, events }
  private _cache = new Map<string, { ts: number; events: EventInput[] }>();
  private _inflight = new Map<string, Promise<EventInput[]>>();

  static styles = css`
    ha-card {
      overflow: hidden;
    }
    .wrapper {
      position: relative;
    }
    .fc .fc-timegrid-slot { /* compact density tweak */ }
    .error {
      color: var(--error-color);
      padding: 8px 16px;
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
      ...config,
    };
  }

  public getCardSize(): number { return 6; }

  protected render() {
    return html`
      <ha-card header="${this._headerText()}">
        ${this._error ? html`<div class="error">${this._error}</div>` : nothing}
        <div class="wrapper">
          <div id="fc"></div>
        </div>
      </ha-card>
    `;
  }

  private _headerText(): string {
    return 'Time Grid Calendar';
  }

  protected firstUpdated(): void {
    this._calendarEl = this.querySelector('#fc') as HTMLDivElement;
    this._initCalendar();
  }

  protected updated(): void {
    // On updates (locale/tz/config), adjust calendar options
    if (this._calendar && this.hass) {
      const locale = this.hass.locale?.language ?? 'en';
      const dir = (document?.dir as 'ltr' | 'rtl') || 'ltr';
      const tz = this.hass.config?.time_zone || 'local';
      const opts: any = {
        locale,
        locales: allLocales,
        direction: dir,
        timeZone: tz,
        slotMinTime: this._config.minTime,
        slotMaxTime: this._config.maxTime,
        slotDuration: this._config.slotDuration,
        nowIndicator: this._config.nowIndicator,
        scrollTime: this._config.scrollTime,
        slotEventOverlap: this._config.slotEventOverlap,
      };
      this._calendar.setOption('locale', opts.locale);
      this._calendar.setOption('locales', opts.locales);
      this._calendar.setOption('direction', opts.direction);
      this._calendar.setOption('timeZone', opts.timeZone);
      this._calendar.setOption('slotMinTime', opts.slotMinTime);
      this._calendar.setOption('slotMaxTime', opts.slotMaxTime);
      this._calendar.setOption('slotDuration', opts.slotDuration);
      this._calendar.setOption('nowIndicator', opts.nowIndicator);
      this._calendar.setOption('scrollTime', opts.scrollTime);
      this._calendar.setOption('slotEventOverlap', opts.slotEventOverlap);
      this._calendar.updateSize();
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback?.();
    this._calendar?.destroy();
    this._calendar = undefined;
  }

  private _initCalendar(): void {
    if (!this._calendarEl) return;
    const locale = this.hass?.locale?.language ?? 'en';
    const dir = (document?.dir as 'ltr' | 'rtl') || 'ltr';
    const tz = this.hass?.config?.time_zone || 'local';

    this._calendar = new Calendar(this._calendarEl, {
      plugins: [timeGridPlugin, interactionPlugin],
      initialView: 'timeGridDay',
      headerToolbar: { left: 'prev,next today', center: 'title', right: '' },
      navLinks: true,
      height: 'auto',
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
      eventClick: (info) => this._onEventClick(info),
      eventSources: [
        {
          id: 'ha-calendars',
          events: async (info, success, failure) => {
            try {
              const evts = await this._fetchMergedEvents(info.startStr, info.endStr);
              success(evts);
            } catch (e: any) {
              console.error(e);
              this._error = e?.message ?? String(e);
              failure(e);
              this.requestUpdate();
            }
          },
        },
      ],
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
      type: 'custom:time-grid-calendar-card',
      entities: ['calendar.family', 'calendar.me'],
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