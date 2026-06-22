# components

React components, split by purpose to keep responsibilities clear.

## Organization

- `ui/` - shadcn/ui primitives (Button, Card, Separator, and so on). These are
  generated and owned in-repo; restyle via the theme tokens in
  `app/globals.css` rather than hardcoding colors here.
- `layout/` - app shell pieces (sidebar, dashboard shell). See
  `layout/README.md`.
- Root level (for example `coming-soon.tsx`) - shared, app-specific components
  reused across multiple routes or features.

## Rules

Build a UI primitive once and compose it; do not re-implement the same widget
per feature. See the reuse and single-source-of-truth rules in the project
`CLAUDE.md`.
