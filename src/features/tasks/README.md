# tasks

The to-do list, organized by day. A month calendar sits on top and the selected
day's list sits below it; each calendar day is tinted by how much got done.

## How days work

- Every task has a `day`. While a task is open, that is the day it is planned
  for; once it is checked off, it is the day it was done.
- Unfinished tasks from past days carry over and show under today until they are
  checked off. Past days therefore read as a log of what was actually done.
- Adding to a past day logs the item as already done. Reopening a past item
  sends it back to today.
- "Today" is computed in the `APP_TIME_ZONE` time zone (see `src/lib/env.ts`).

## Contents

- `schema.ts` - the Drizzle `tasks` table, the `task_priority` enum, and the
  `Task` and `DayTask` types derived from it. The `priority` and `due_date`
  columns are kept but no longer shown in the UI.
- `constants.ts` - priorities, the title length limit, the route path, and the
  heat-level thresholds.
- `validation.ts` - Zod schemas for the create, toggle, and delete inputs.
- `repo.ts` - the only place task rows are read or written.
- `actions.ts` - server actions: validate, call the repo, return a result.
- `calendar.ts` - pure month-grid date math (weeks, month stepping, titles).
- `day-summary.ts` - pure per-day rules: carry-over, per-day counts, heat level.
- `optimistic.ts` - the pure reducer behind the board's optimistic updates.
- `components/` - the UI:
  - `task-board.tsx` - client root; owns the selected day and optimistic state.
  - `month-calendar.tsx`, `month-nav.tsx`, `day-cell.tsx`, `calendar-legend.tsx`,
    `intensity-styles.ts` - the calendar.
  - `day-panel.tsx`, `quick-add-form.tsx`, `task-item.tsx` - the selected day.
  - `task-section.tsx`, `tasks-completed-chart.tsx` - the weekly completed-tasks
    chart for the (currently hidden) analytics page, fed by
    `tasksRepo.completedByWeek`.

## Tests

Unit tests cover the date math, day rules, reducer, and validation. A component
test (`components/task-board.test.tsx`) covers day selection, carry-over, and
the add, check-off, and delete flows against mocked server actions.
