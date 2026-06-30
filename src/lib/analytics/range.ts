// Date-range helpers for the analytics charts: parsing the ?range param, the
// inclusive [from, to] window it maps to, and the continuous list of ISO days
// that forms a chart's x-axis. Day strings are YYYY-MM-DD (see lib/iso-date).

import { addDays } from "@/lib/iso-date";

export const RANGE_OPTIONS = ["7", "30", "90"] as const;
export type RangeKey = (typeof RANGE_OPTIONS)[number];
export const DEFAULT_RANGE: RangeKey = "30";

// Validates the ?range param, falling back to the default.
export function parseRange(value: string | undefined): RangeKey {
  return RANGE_OPTIONS.includes(value as RangeKey)
    ? (value as RangeKey)
    : DEFAULT_RANGE;
}

// Number of days in a range.
export function rangeDays(range: RangeKey): number {
  return Number(range);
}

// Inclusive window of `range` days ending on the given day.
export function rangeWindow(
  range: RangeKey,
  endIso: string,
): { from: string; to: string } {
  return { from: addDays(endIso, -(rangeDays(range) - 1)), to: endIso };
}

// Continuous list of ISO days from `from` to `to`, inclusive.
export function dayAxis(from: string, to: string): string[] {
  const days: string[] = [];
  let cursor = from;
  while (cursor <= to) {
    days.push(cursor);
    cursor = addDays(cursor, 1);
  }
  return days;
}
