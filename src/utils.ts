export const VERSION = '0.1.0';

export function isAllDay(start: string | { date?: string; dateTime?: string }, end: string | { date?: string; dateTime?: string }): boolean {
  const s = typeof start === 'string' ? start : start.date ?? start.dateTime ?? '';
  const e = typeof end === 'string' ? end : end.date ?? end.dateTime ?? '';
  const looksDateOnly = (v: string) => v.length <= 10 && !v.includes('T');
  return looksDateOnly(s) || looksDateOnly(e);
}

export function toIso(input: string | { date?: string; dateTime?: string }): string {
  if (typeof input === 'string') return normalizeIso(input);
  if (input.dateTime) return normalizeIso(input.dateTime);
  if (input.date) return normalizeIso(input.date);
  return '';
}

function normalizeIso(v: string): string {
  // Ensure ISO 8601; if missing time, treat as midnight local
  if (!v.includes('T')) return v + 'T00:00:00';
  return v;
}

export function regexAnyMatch(patterns: string[] | undefined, text: string): boolean {
  if (!patterns || patterns.length === 0) return false;
  return patterns.some((p) => {
    try {
      const re = new RegExp(p, 'i');
      return re.test(text);
    } catch {
      return false;
    }
  });
}

export function hashKey(parts: (string | number | boolean | undefined)[]): string {
  return parts.map((p) => String(p ?? '')).join('|');
}