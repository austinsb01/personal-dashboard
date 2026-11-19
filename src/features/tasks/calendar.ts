// Month-grid date math for the to-do calendar. Pure functions over ISO day
// strings (YYYY-MM-DD), computed in UTC. Weeks run Sunday to Saturday.

import { addDays, DISPLAY_LOCALE } from "@/lib/iso-date";

const DAYS_PER_WEEK = 7;

const MS_PER_DAY = 86_400_000;

export const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

// Day of the week for an ISO day, 0 (Sunday) to 6 (Saturday).
function weekdayIndex(isoDate: string): number {
  return new Date(`${isoDate}T00:00:00Z`).getUTCDay();
}

// First day of the month containing the given day.
export function monthStart(isoDate: string): string {
  return `${isoDate.slice(0, 7)}-01`;
}

// First day of the month the given number of months away.
export function addMonths(isoDate: string, months: number): string {
  const [year, month] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1 + months, 1)).toISOString().slice(0, 10);
}

// True when both days fall in the same calendar month.
export function isSameMonth(first: string, second: string): boolean {
  return monthStart(first) === monthStart(second);
}

// Formats a day's month for the calendar title, e.g. "November 2026".
export function formatMonth(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString(DISPLAY_LOCALE, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

// Full weeks covering the day's month, padded with adjacent-month days.
export function monthGrid(isoDate: string): string[][] {
  const first = monthStart(isoDate);
  const last = addDays(addMonths(first, 1), -1);
  const gridStart = addDays(first, -weekdayIndex(first));
  const gridEnd = addDays(last, DAYS_PER_WEEK - 1 - weekdayIndex(last));
  const dayCount = (Date.parse(gridEnd) - Date.parse(gridStart)) / MS_PER_DAY + 1;
  return Array.from({ length: dayCount / DAYS_PER_WEEK }, (_, week) =>
    Array.from({ length: DAYS_PER_WEEK }, (_, weekday) =>
      addDays(gridStart, week * DAYS_PER_WEEK + weekday),
    ),
  );
}
