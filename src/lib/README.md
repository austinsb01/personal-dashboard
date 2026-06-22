# lib

Framework-agnostic helpers and shared data. Nothing here renders UI directly.

## Contents

- `utils.ts` - the `cn()` helper that merges Tailwind class names.
- `navigation.ts` - `NAV_ITEMS`, the single source of truth for the primary
  navigation. Add or reorder dashboard sections here and the sidebar and
  overview grid update automatically.
