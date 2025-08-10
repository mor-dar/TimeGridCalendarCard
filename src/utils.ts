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

// Cache compiled regexes to avoid recompiling on every call
const regexCache = new Map<string, RegExp>();

export function regexAnyMatch(patterns: string[] | undefined, text: string): boolean {
  if (!patterns || patterns.length === 0) return false;
  return patterns.some((p) => {
    let re = regexCache.get(p);
    if (!re) {
      try {
        re = new RegExp(p, 'i');
        regexCache.set(p, re);
        // Limit cache size to prevent memory issues
        if (regexCache.size > 100) {
          const firstKey = regexCache.keys().next().value;
          regexCache.delete(firstKey);
        }
      } catch {
        return false;
      }
    }
    return re.test(text);
  });
}

export function hashKey(parts: (string | number | boolean | undefined)[]): string {
  return parts.map((p) => String(p ?? '')).join('|');
}