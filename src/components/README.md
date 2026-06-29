# components

React components, split by purpose to keep responsibilities clear.

## Organization

- `ui/` - shadcn/ui primitives (Button, Card, Separator, theme toggle, and so
  on). These are generated and owned in-repo; restyle via the theme tokens in
  `app/globals.css` rather than hardcoding colors here.
- `layout/` - app shell pieces (sidebar, dashboard shell). See
  `layout/README.md`.
- Root level - shared, app-specific components reused across routes:
  `coming-soon.tsx` (placeholder for unbuilt feature areas) and
  `theme-provider.tsx` (the `next-themes` client wrapper mounted in the root
  layout to control the light/dark class).

## Rules

Build a UI primitive once and compose it; do not re-implement the same widget
per feature. See the reuse and single-source-of-truth rules in the project
`CLAUDE.md`.
