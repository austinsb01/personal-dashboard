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

export type StackedPoint = { day: string; [series: string]: number | string };

// Pivots sparse {day, key, value} rows into one row per axis day with a numeric
// column per distinct key (0 when absent). Returns the sorted key list too, so
// the chart knows which series to render.
export function pivotDays(
  days: string[],
  rows: Array<{ day: string; key: string; value: number }>,
): { keys: string[]; data: StackedPoint[] } {
  const keys = [...new Set(rows.map((row) => row.key))].sort();
  const byDay = new Map<string, Record<string, number>>();
  for (const row of rows) {
    const entry = byDay.get(row.day) ?? {};
    entry[row.key] = (entry[row.key] ?? 0) + row.value;
    byDay.set(row.day, entry);
  }
  const data = days.map((day) => {
    const entry = byDay.get(day) ?? {};
    const point: StackedPoint = { day };
    for (const key of keys) point[key] = entry[key] ?? 0;
    return point;
  });
  return { keys, data };
}
