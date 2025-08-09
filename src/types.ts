export interface HomeAssistant {
  callApi<T = any>(method: string, path: string, parameters?: any): Promise<T>;
  locale: {
    language: string; // e.g., 'en', 'he'
    time_format?: '12' | '24' | 'system';
    number_format?: string;
    first_day_of_week?: number;
  };
  config: {
    time_zone: string; // e.g., 'Asia/Jerusalem'
  };
}

export interface TimeGridCalendarCardConfig {
  type: string; // 'custom:TimeGridCalendarCard'
  entities: string[]; // calendar entity_ids
  colors?: Record<string, string>; // per-calendar color map
  minTime?: string; // '06:00:00'
  maxTime?: string; // '22:00:00'
  slotDuration?: string; // '00:30:00'
  nowIndicator?: boolean; // default true
  scrollTime?: string; // '07:00:00'
  slotEventOverlap?: boolean; // default true
  cacheMinutes?: number; // default 10
  suppressDuplicates?: boolean; // default true
  filters?: Record<string, { allow?: string[]; block?: string[] }>; // per calendar regex filters
  todayOnly?: boolean;        // when true: no toolbar, no date in header, no nav
  height?: number | string;   // fixed height for scrollable grid (e.g. 520 or "520px")
}

export interface HACalendarEventStringy {
  summary?: string;
  description?: string | null;
  location?: string | null;
  start: string | { date?: string; dateTime?: string };
  end: string | { date?: string; dateTime?: string };
  all_day?: boolean;
  uid?: string;
}