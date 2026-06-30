# tasks

To-do tasks: a title, priority, optional due date, and completion state. One
vertical slice (schema, repo, actions, validation, UI) for the dashboard's
to-do area.

## Contents

- `schema.ts` - the Drizzle `tasks` table and the `task_priority` enum. The
  single source of truth that the repository and derived types build on.
- Analytics: a nullable `completed_at` column records when a task was finished;
  `tasksRepo.completedByWeek` plus `components/` (a task section and a weekly
  completed-tasks chart) feed the analytics page.
