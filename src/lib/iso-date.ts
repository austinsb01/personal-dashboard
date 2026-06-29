// Shared ISO-day helpers for the per-day feature views (workouts, nutrition).
// Day strings are YYYY-MM-DD, handled in UTC to avoid timezone drift.

export const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

// True only for well-formed YYYY-MM-DD day strings.
export function isIsoDate(value: string): boolean {
  return ISO_DATE_PATTERN.test(value);
}

// Today as an ISO day string.
export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
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
