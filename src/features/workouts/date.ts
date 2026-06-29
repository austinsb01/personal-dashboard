// Date helpers for the per-day workouts view. Dates are ISO day strings
// (YYYY-MM-DD) handled in UTC to avoid timezone drift.

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
