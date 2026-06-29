# time

Time tracking: a start/stop timer over free-text activities. Each timed session
is one row; `ended_at` is null while running. Duration is computed from the
timestamps. One vertical slice (schema, repo, actions, validation, UI).

## Contents

- `schema.ts` - the Drizzle `time_entries` table. The single source of truth
  that the repository and derived types build on.
