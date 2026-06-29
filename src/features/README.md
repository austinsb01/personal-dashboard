# features

Feature-first domains. Each subdirectory owns one tracking area end to end and
follows a consistent internal layout: `schema.ts` (Drizzle table), `repo.ts`
(typed data access), `actions.ts` (server actions), `validation.ts` (Zod
schemas), and `components/` (UI).

## Contents

- `tasks/` - to-do tasks: priorities, due dates, and completion state.
