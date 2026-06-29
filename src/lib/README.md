# lib

Framework-agnostic helpers and shared data. Nothing here renders UI directly.

## Contents

- `utils.ts` - the `cn()` helper that merges Tailwind class names.
- `navigation.ts` - the single source of truth for the primary navigation:
  `NAV_OVERVIEW` (the top-level Overview link) and `NAV_GROUPS` (the collapsible
  dropdown groups and their page leaves). Add or reorder a page or group here and
  the sidebar and overview grid update automatically.
- `env.ts` - validates required environment variables (currently `DATABASE_URL`)
  with Zod at load time and exports a typed, frozen `env` object. The single
  source of truth for config; nothing else reads `process.env` directly.
