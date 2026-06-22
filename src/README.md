# src

Application source for the Personal Dashboard.

## Layout

- `app/` - Next.js App Router routes. Each route folder holds a `page.tsx`.
  The root `layout.tsx` wraps every page in the dashboard shell.
- `components/` - React components. See `components/README.md` for the split
  between generated UI primitives, layout, and shared components.
- `lib/` - Framework-agnostic helpers and shared data. See `lib/README.md`.
- `features/` - Feature-first modules (tasks, time, workouts, nutrition).
  Created per feature as each is built; see the project `CLAUDE.md` for the
  expected internal layout (`schema.ts`, `repo.ts`, `actions.ts`, etc.).

## Conventions

Conventions for this project (file size limits, documentation rules, single
source of truth, and more) live in the project `CLAUDE.md` at the repo root.
