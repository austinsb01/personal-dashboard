# lib/analytics

Pure helpers for the analytics charts: date-range math and series shaping. No UI
and no data access; everything here is deterministic and unit-tested.

## Contents

- `range.ts` - the chart time window. `RANGE_OPTIONS` / `DEFAULT_RANGE` (the
  7/30/90 day choices, single source for the range toggle), `parseRange`
  (validates the `?range` param), `rangeWindow` (the inclusive `[from, to]`
  window ending today), and `dayAxis` (the continuous list of ISO days that
  forms a chart's x-axis).
- `series.ts` - reshapes sparse query rows for charts: `fillDays` (merge
  day-keyed rows onto a day axis, zero-filling gaps), `pivotDays` (turn
  `{day, key, value}` rows into one row per day with a column per key, for
  stacked charts), and `weekAxis` (Monday-aligned week starts covering a window).
