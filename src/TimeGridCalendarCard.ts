import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant, TimeGridCalendarCardConfig } from './types';

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

  static styles = css`
    ha-card {
      overflow: hidden;
    }
    .wrapper {
      position: relative;
      height: 300px;
      padding: 20px;
    }
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
      todayOnly: false,
      height: 520,
      ...config,
    };
  }

  public getCardSize(): number { return 6; }

  protected render() {
    return html`
      <ha-card>
        ${this._error ? html`<div class="error">${this._error}</div>` : nothing}
        <div class="wrapper">
          <h2>Absolute Minimal Test Card</h2>
          <p>✅ Card rendered successfully!</p>
          <p>✅ Config entities: ${this._config?.entities?.length || 0}</p>
          <p>✅ HASS available: ${this.hass ? 'Yes' : 'No'}</p>
          <p>No FullCalendar imports, no complex lifecycle, no external dependencies.</p>
        </div>
      </ha-card>
    `;
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