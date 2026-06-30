// Merges sparse, day-keyed rows onto a continuous day axis, filling days with no
// data using a supplied empty value. Keeps the axis order so charts render gaps
// as zero rather than skipping them.

export function fillDays<T extends object>(
  days: string[],
  rows: Array<T & { day: string }>,
  empty: T,
): Array<T & { day: string }> {
  const byDay = new Map(rows.map((row) => [row.day, row]));
  return days.map((day) => byDay.get(day) ?? { day, ...empty });
}
