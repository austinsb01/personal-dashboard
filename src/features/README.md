# features

Feature-first domains. Each subdirectory owns one tracking area end to end and
follows a consistent internal layout: `schema.ts` (Drizzle table), `repo.ts`
(typed data access), `actions.ts` (server actions), `validation.ts` (Zod
schemas), and `components/` (UI).

## Contents

- `tasks/` - to-do tasks: priorities, due dates, and completion state.
- `goals/` - longer-term goals: progress, optional description and target date.
- `time/` - time tracking: a start/stop timer over free-text activities.
- `workouts/` - gym and workouts: per-day view, reusable day types and exercises, sets, and cardio.
- `nutrition/` - food and nutrition: per-day view, a reusable food catalog with macros, and meal entries grouped by meal with daily totals.
- `water/` - water intake: per-day tracker in fluid ounces with quick-add, a daily goal progress bar, and a deletable entries list.
- `settings/` - editable daily targets (water goal and nutrition goals), stored as a singleton config row and used by the water and nutrition views and analytics.
