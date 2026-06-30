# water

Water intake, tracked per calendar date in fluid ounces. Each quick-add (8/12/16
oz) or custom amount is one row; the day's total is the sum for the date, shown
against a daily goal as a progress bar. Lives under the Nutrition nav group at
`/water`, but is its own normalized slice.

## Contents

- `constants.ts` - the fixed values in fluid ounces: the default daily goal, the
  quick-add amounts, and the per-entry maximum. Single source of truth.
- `schema.ts` - the Drizzle `water_entries` table (one row per logged amount on a
  date). The single source of truth for the feature's types.
- `validation.ts` - Zod validation for an added amount; the max comes from
  `constants.ts`.
- `repo.ts` - typed data access: a day's entries, the day's total, add/remove,
  and `dailyTotals` (per-day ounces over a window) for analytics.
- `actions.ts` - server actions: a bound quick-add, a useActionState custom add,
  and remove. All validate at the boundary and revalidate.
- `components/` - the day view (date nav, goal progress bar, entries), the input
  controls, and the analytics section and trend chart.
- Analytics: `repo.dailyTotals` feeds a daily-ounces bar chart with a goal
  reference line on the analytics page.
