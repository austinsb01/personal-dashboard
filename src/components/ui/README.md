# components/ui

Reusable UI primitives. shadcn/ui components are generated and owned in-repo;
restyle them via the theme tokens in `app/globals.css`, never with hardcoded
colors. Build a primitive once here and compose it across features.

## Contents

- `button.tsx` - the `Button` primitive with variants (default, outline, ghost,
  secondary, destructive, link) and sizes.
- `card.tsx` - `Card` and its parts (`CardHeader`, `CardTitle`, `CardDescription`).
- `select.tsx` - native `<select>` styled to match `Input`.
- `separator.tsx` - thin divider line.
- `theme-toggle.tsx` - light/dark toggle backed by `next-themes`; mounted in the
  sidebar. Client component with a mount guard to avoid hydration mismatch.
