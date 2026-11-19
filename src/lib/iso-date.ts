// Shared ISO-day helpers for the per-day feature views (tasks, workouts,
// nutrition). Day strings are YYYY-MM-DD and day math runs in UTC to avoid
// drift; only "today" depends on a time zone, which the caller passes in.

export const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const DEFAULT_TIME_ZONE = "UTC";

export const DISPLAY_LOCALE = "en-US";

// True only for well-formed YYYY-MM-DD day strings.
export function isIsoDate(value: string): boolean {
  return ISO_DATE_PATTERN.test(value);
}

// Today as an ISO day string in the given IANA time zone (UTC by default).
export function todayIso(
  timeZone: string = DEFAULT_TIME_ZONE,
  now: Date = new Date(),
): string {
  const parts = new Intl.DateTimeFormat(DISPLAY_LOCALE, {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((entry) => entry.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

// Returns the ISO day string offset by the given number of days.
export function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

// Formats an ISO day string for display, e.g. "Mon, Jun 29".
export function formatDay(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

// Formats an ISO day string compactly, e.g. "Jun 29" (for chart axes).
export function formatDayShort(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

// Formats an ISO day string in full, e.g. "Monday, June 29". Uses a fixed
// locale so server and client render the same text.
export function formatDayLong(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString(DISPLAY_LOCALE, {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
