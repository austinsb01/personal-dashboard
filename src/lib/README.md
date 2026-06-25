# lib

Framework-agnostic helpers and shared data. Nothing here renders UI directly.

## Contents

- `utils.ts` - the `cn()` helper that merges Tailwind class names.
- `navigation.ts` - `NAV_ITEMS`, the single source of truth for the primary
  navigation. Add or reorder dashboard sections here and the sidebar and
  overview grid update automatically.
- `env.ts` - validates required environment variables (currently `DATABASE_URL`)
  with Zod at load time and exports a typed, frozen `env` object. The single
  source of truth for config; nothing else reads `process.env` directly.
