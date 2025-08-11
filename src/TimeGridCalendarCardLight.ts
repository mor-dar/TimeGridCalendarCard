import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant, TimeGridCalendarCardConfig } from './types';

interface SimpleEvent {
  title: string;
  start: Date;
  end: Date;
  color?: string;
  entityId: string;
  allDay?: boolean;
}

interface PositionedEvent extends SimpleEvent {
  column: number;
  totalColumns: number;
}

@customElement('time-grid-calendar-card')
export class TimeGridCalendarCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  private _config!: TimeGridCalendarCardConfig;
  
  @state() private _events: SimpleEvent[] = [];
  @state() private _loading = false;
  @state() private _error: string | null = null;
  @state() private _currentDate = new Date();
  
  static styles = css`
    :host {
      display: block;
      --grid-color: var(--divider-color, rgba(128,128,128,.3));
      --now-color: var(--accent-color, var(--primary-color, #03a9f4));
      --header-height: 40px;
      --hour-width: 60px;
    }
    ha-card {
      overflow: hidden;
      height: 100%;
    }
    .header {
      height: var(--header-height);
      display: flex;
      align-items: center;
      padding: 0 16px;
      border-bottom: 1px solid var(--grid-color);
      background: var(--card-background-color);
    }
    .header button {
      background: none;
      border: none;
      color: var(--primary-text-color);
      cursor: pointer;
      padding: 8px;
      margin: 0 4px;
      border-radius: 4px;
    }
    .header button:hover {
      background: var(--secondary-background-color);
    }
    .date-display {
      flex: 1;
      text-align: center;
      font-weight: 500;
    }
    .grid-container {
      height: calc(100% - var(--header-height));
      overflow-y: auto;
      position: relative;
      background: var(--card-background-color);
    }
    .grid-container.with-all-day {
      height: calc(100% - var(--header-height) - var(--all-day-height, 50px));
    }
    .time-grid {
      position: relative;
      min-height: 100%;
    }
    .hour-row {
      height: 60px;
      border-top: 1px solid var(--grid-color);
      position: relative;
    }
    .hour-row:first-child {
      border-top: none;
    }
    .hour-label {
      position: absolute;
      left: 0;
      top: -10px;
      width: var(--hour-width);
      text-align: center;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .event-container {
      position: absolute;
      left: var(--hour-width);
      right: 0;
      top: 0;
      bottom: 0;
    }
    .event {
      position: absolute;
      background: var(--primary-color);
      color: white;
      padding: 4px;
      border-radius: 4px;
      font-size: 12px;
      overflow: hidden;
      cursor: pointer;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
      margin-right: 2px;
      border-left: 3px solid rgba(0,0,0,0.2);
    }
    .event:hover {
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      z-index: 10;
    }
    .event-title {
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .event-time {
      font-size: 11px;
      opacity: 0.9;
    }
    .now-indicator {
      position: absolute;
      left: var(--hour-width);
      right: 0;
      height: 2px;
      background: var(--now-color);
      pointer-events: none;
      z-index: 5;
    }
    .now-indicator::before {
      content: '';
      position: absolute;
      left: -8px;
      top: -4px;
      width: 10px;
      height: 10px;
      background: var(--now-color);
      border-radius: 50%;
    }
    .loading {
      padding: 20px;
      text-align: center;
      color: var(--secondary-text-color);
    }
    .error {
      padding: 16px;
      color: var(--error-color);
    }
    .all-day-section {
      padding: 8px 16px;
      border-bottom: 1px solid var(--grid-color);
      background: var(--card-background-color);
      min-height: var(--all-day-height, 50px);
    }
    .all-day-label {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin-bottom: 4px;
    }
    .all-day-events {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }
    .all-day-event {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      background: var(--primary-color);
      color: white;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 200px;
    }
    .all-day-event:hover {
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
  `;

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

  connectedCallback(): void {
    super.connectedCallback();
    this._loadEvents();
    // Update now indicator every minute
    this._nowInterval = window.setInterval(() => {
      this.requestUpdate();
    }, 60000);
  }

  protected firstUpdated(changedProperties: Map<string, any>): void {
    super.firstUpdated(changedProperties);
    // Delay scroll to ensure DOM is fully ready
    setTimeout(() => {
      this._scrollToCurrentTime();
    }, 250);
  }

  protected updated(changedProperties: Map<string, any>): void {
    super.updated(changedProperties);
    // Scroll to current time when date changes to today or after events load
    if ((changedProperties.has('_currentDate') && this._isToday(this._currentDate)) || 
        changedProperties.has('_events')) {
      // Small delay to ensure DOM is updated
      setTimeout(() => this._scrollToCurrentTime(), 100);
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._nowInterval) {
      clearInterval(this._nowInterval);
      this._nowInterval = undefined;
    }
  }

  private _nowInterval?: number;

  protected render() {
    if (this._error) {
      return html`
        <ha-card>
          <div class="error">${this._error}</div>
        </ha-card>
      `;
    }

    if (this._loading) {
      return html`
        <ha-card>
          <div class="loading">Loading events...</div>
        </ha-card>
      `;
    }

    const hours = this._getHours();
    const todayEvents = this._filterTodayEvents();
    const allDayEvents = this._filterAllDayEvents();
    const timedEvents = todayEvents.filter(e => !e.allDay);
    const nowPosition = this._getNowPosition();

    return html`
      <ha-card style="height: ${this._config.height}px">
        ${!this._config.todayOnly ? html`
          <div class="header">
            <button @click=${this._previousDay}>‹</button>
            <div class="date-display">
              ${this._formatDate(this._currentDate)}
            </div>
            <button @click=${this._nextDay}>›</button>
            <button @click=${this._today}>Today</button>
          </div>
        ` : html`
          <div class="header">
            <div class="date-display">
              ${this._formatDate(this._currentDate)}
            </div>
          </div>
        `}
        
        ${allDayEvents.length > 0 ? html`
          <div class="all-day-section">
            <div class="all-day-label">All day</div>
            <div class="all-day-events">
              ${allDayEvents.map(event => html`
                <div 
                  class="all-day-event"
                  style="background-color: ${event.color || 'var(--primary-color)'}"
                  @click=${() => this._handleEventClick(event)}
                >
                  ${event.title}
                </div>
              `)}
            </div>
          </div>
        ` : nothing}
        
        <div class="grid-container ${allDayEvents.length > 0 ? 'with-all-day' : ''}">
          <div class="time-grid">
            ${hours.map(hour => html`
              <div class="hour-row" data-hour="${hour}">
                <div class="hour-label">${this._formatHour(hour)}</div>
              </div>
            `)}
            
            <div class="event-container">
              ${this._layoutEvents(timedEvents).map(event => this._renderEvent(event))}
            </div>
            
            ${this._config.nowIndicator && nowPosition !== null ? html`
              <div class="now-indicator" style="top: ${nowPosition}px"></div>
            ` : nothing}
          </div>
        </div>
      </ha-card>
    `;
  }

  private _renderEvent(event: PositionedEvent) {
    const position = this._calculateEventPosition(event);
    if (!position) return nothing;

    const width = `calc((100% - 8px) / ${event.totalColumns})`;
    const left = `calc(${width} * ${event.column})`;

    return html`
      <div
        class="event"
        style="
          top: ${position.top}px;
          height: ${position.height}px;
          left: ${left};
          width: ${width};
          background-color: ${event.color || 'var(--primary-color)'};
        "
        @click=${() => this._handleEventClick(event)}
      >
        <div class="event-title">${event.title}</div>
        <div class="event-time">
          ${this._formatTime(event.start)} - ${this._formatTime(event.end)}
        </div>
      </div>
    `;
  }

  private _calculateEventPosition(event: SimpleEvent) {
    const minHour = parseInt(this._config?.minTime?.split(':')[0] || '6');
    const maxHour = parseInt(this._config?.maxTime?.split(':')[0] || '22');
    const hourHeight = 60;

    const startHour = event.start.getHours() + event.start.getMinutes() / 60;
    const endHour = event.end.getHours() + event.end.getMinutes() / 60;

    if (endHour <= minHour || startHour >= maxHour) return null;

    const clampedStart = Math.max(startHour, minHour);
    const clampedEnd = Math.min(endHour, maxHour);

    const top = (clampedStart - minHour) * hourHeight;
    const height = Math.max((clampedEnd - clampedStart) * hourHeight, 20);

    return { top, height };
  }

  private _getNowPosition(): number | null {
    const now = new Date();
    const minHour = parseInt(this._config?.minTime?.split(':')[0] || '6');
    const maxHour = parseInt(this._config?.maxTime?.split(':')[0] || '22');
    const currentHour = now.getHours() + now.getMinutes() / 60;

    if (currentHour < minHour || currentHour > maxHour) return null;
    if (!this._isToday(this._currentDate)) return null;

    return (currentHour - minHour) * 60;
  }

  private _getHours(): number[] {
    const minHour = parseInt(this._config?.minTime?.split(':')[0] || '6');
    const maxHour = parseInt(this._config?.maxTime?.split(':')[0] || '22');
    const hours = [];
    for (let h = minHour; h <= maxHour; h++) {
      hours.push(h);
    }
    return hours;
  }

  private _formatHour(hour: number): string {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${h} ${ampm}`;
  }

  private _formatTime(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    const m = minutes.toString().padStart(2, '0');
    return `${h}:${m} ${ampm}`;
  }

  private _formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  private _isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  private _filterTodayEvents(): SimpleEvent[] {
    return this._events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === this._currentDate.toDateString();
    });
  }

  private _filterAllDayEvents(): SimpleEvent[] {
    return this._filterTodayEvents().filter(event => event.allDay === true);
  }

  private _layoutEvents(events: SimpleEvent[]): PositionedEvent[] {
    if (events.length === 0) return [];
    
    // Sort events by start time, then by duration (longer events first)
    const sorted = [...events].sort((a, b) => {
      const startDiff = a.start.getTime() - b.start.getTime();
      if (startDiff !== 0) return startDiff;
      // For same start time, put longer events first
      const durationA = a.end.getTime() - a.start.getTime();
      const durationB = b.end.getTime() - b.start.getTime();
      return durationB - durationA;
    });

    // Group overlapping events
    const groups: SimpleEvent[][] = [];
    let currentGroup: SimpleEvent[] = [];
    let groupEnd = new Date(0);

    for (const event of sorted) {
      if (event.start >= groupEnd) {
        // Start a new group
        if (currentGroup.length > 0) {
          groups.push(currentGroup);
        }
        currentGroup = [event];
        groupEnd = event.end;
      } else {
        // Add to current group and extend group end if needed
        currentGroup.push(event);
        if (event.end > groupEnd) {
          groupEnd = event.end;
        }
      }
    }
    
    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    // Position events within each group
    const positioned: PositionedEvent[] = [];
    
    for (const group of groups) {
      const columns: SimpleEvent[][] = [];
      
      for (const event of group) {
        // Find the first column where this event fits
        let placed = false;
        for (let col = 0; col < columns.length; col++) {
          const column = columns[col];
          // Check if event overlaps with any event in this column
          const overlaps = column.some(e => 
            event.start < e.end && event.end > e.start
          );
          
          if (!overlaps) {
            column.push(event);
            placed = true;
            break;
          }
        }
        
        // If didn't fit in any column, create a new one
        if (!placed) {
          columns.push([event]);
        }
      }
      
      // Assign column positions to events
      const totalColumns = columns.length;
      for (let col = 0; col < columns.length; col++) {
        for (const event of columns[col]) {
          positioned.push({
            ...event,
            column: col,
            totalColumns: totalColumns
          });
        }
      }
    }
    
    return positioned;
  }

  private async _loadEvents() {
    if (!this.hass) return;

    this._loading = true;
    this._error = null;

    try {
      const start = new Date(this._currentDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);

      const events: SimpleEvent[] = [];

      for (const entityId of this._config.entities) {
        const url = `calendars/${entityId}?start=${start.toISOString()}&end=${end.toISOString()}`;
        const response = await this.hass.callApi<any[]>('GET', url);
        
        for (const evt of response) {
          const startDate = new Date(evt.start.dateTime || evt.start.date || evt.start);
          const endDate = new Date(evt.end.dateTime || evt.end.date || evt.end);
          
          // Check if this is an all-day event
          const isAllDay = (evt.start.date && !evt.start.dateTime) || 
                           (evt.end.date && !evt.end.dateTime);
          
          events.push({
            title: evt.summary || 'Untitled',
            start: startDate,
            end: endDate,
            color: this._config.colors?.[entityId],
            entityId: entityId,
            allDay: isAllDay,
          });
        }
      }

      this._events = events;
    } catch (error: any) {
      this._error = error.message || 'Failed to load events';
    } finally {
      this._loading = false;
    }
  }

  private _handleEventClick(event: SimpleEvent) {
    const ev = new CustomEvent('hass-more-info', {
      detail: { entityId: event.entityId },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(ev);
  }

  private _previousDay() {
    this._currentDate = new Date(this._currentDate);
    this._currentDate.setDate(this._currentDate.getDate() - 1);
    this._loadEvents();
  }

  private _nextDay() {
    this._currentDate = new Date(this._currentDate);
    this._currentDate.setDate(this._currentDate.getDate() + 1);
    this._loadEvents();
  }

  private _today() {
    this._currentDate = new Date();
    this._loadEvents();
  }

  private _scrollToCurrentTime() {
    // Only scroll if showing today
    if (!this._isToday(this._currentDate)) return;
    
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      const container = this.renderRoot?.querySelector('.grid-container') as HTMLElement;
      if (!container) return;
      
      const now = new Date();
      const currentHour = now.getHours() + now.getMinutes() / 60;
      const minHour = parseInt(this._config?.minTime?.split(':')[0] || '6');
      const maxHour = parseInt(this._config?.maxTime?.split(':')[0] || '22');
      
      // Don't scroll if current time is outside visible range
      if (currentHour < minHour || currentHour > maxHour) return;
      
      // Calculate scroll position to center current time
      const hourHeight = 60;
      const scrollPosition = (currentHour - minHour) * hourHeight;
      
      // Center the current time in the viewport
      const containerHeight = container.clientHeight;
      const centeredPosition = scrollPosition - (containerHeight / 2) + (hourHeight / 2);
      
      // Smooth scroll to position
      container.scrollTo({
        top: Math.max(0, centeredPosition),
        behavior: 'smooth'
      });
    });
  }

  public getCardSize(): number { 
    return 6; 
  }

  static getStubConfig() {
    return {
      type: 'custom:TimeGridCalendarCard',
      entities: ['calendar.personal'],
      minTime: '06:00:00',
      maxTime: '22:00:00',
    };
  }
}

if (!customElements.get('time-grid-calendar-card')) {
  customElements.define('time-grid-calendar-card', TimeGridCalendarCard);
}