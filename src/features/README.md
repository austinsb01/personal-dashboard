# features

Feature-first domains. Each subdirectory owns one tracking area end to end and
follows a consistent internal layout: `schema.ts` (Drizzle table), `repo.ts`
(typed data access), `actions.ts` (server actions), `validation.ts` (Zod
schemas), and `components/` (UI).

## Contents

Only `tasks/` is currently linked in the sidebar. The other features are hidden
(see `isEnabled` in `src/lib/navigation.ts`) but fully intact.

- `tasks/` - the to-do list by day: a month calendar with the selected day's list below, carry-over of unfinished items, and a per-day heat indicator. The only feature currently shown in the app.
- `goals/` - longer-term goals: progress, optional description and target date.
- `time/` - time tracking: a start/stop timer over free-text activities.
- `workouts/` - gym and workouts: per-day view, reusable day types and exercises, sets, and cardio.
- `nutrition/` - food and nutrition: per-day view, a reusable food catalog with macros, and meal entries grouped by meal with daily totals. Entries logged from a recipe are tagged and grouped under the recipe name.
- `recipes/` - reusable recipes: a named meal built from catalog foods, logged to a day in one action (expands into tagged meal entries).
- `meal-prep/` - the weekly meal-prep view: a read-only rollup of a week's ingredients with macros against daily targets. Reads the nutrition log; owns no tables.
- `water/` - water intake: per-day tracker in fluid ounces with quick-add, a daily goal progress bar, and a deletable entries list.
- `settings/` - editable daily targets (water goal and nutrition goals), stored as a singleton config row and used by the water and nutrition views and analytics.
