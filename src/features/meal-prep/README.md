# meal-prep

The weekly meal-prep view: a read-only view over a week of the nutrition log that
rolls up ingredients for batch planning and shows the week's macros against daily
targets. It has no tables of its own; it reads `meal_entries` for a Mon-Sun
window through `nutritionRepo.listEntriesForRange`.

## What it holds

- `week.ts` - pure helpers, no database access. `weekRange` (the Mon-Sun window
  and its seven day strings for a date), `summarizeWeekDays` (per-day macro
  totals, empty days included), `rollUpIngredients` (every food used that week
  grouped with total servings, total macros, and the recipes/days that used it,
  sorted by calories), and `weekTotals` (week total and average per day). Unit
  tested in `week.test.ts`.
- `components/weekly-view.tsx` - the page body: week navigation, average-per-day
  macros against targets (reusing the nutrition `TargetsProgress`), the seven day
  cards, and the ingredient rollup.
- `components/day-card.tsx` - one day's card, linking to that day's nutrition
  view.
- `components/ingredient-rollup.tsx` - the expandable ingredient list (the
  batch/shopping list), using native `details`/`summary` to stay a server
  component.

## Route

`/meal-prep` (`src/app/meal-prep/page.tsx`) renders dynamically and navigates by
week via `?week=YYYY-MM-DD`. The ingredient rollup sums all entries in the week,
whether logged directly or via a recipe, so it always reflects what is actually
planned. Targets are daily, so the comparison shown is average-per-day versus the
daily target.
