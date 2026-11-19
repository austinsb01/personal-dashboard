# lib

Framework-agnostic helpers and shared data. Nothing here renders UI directly.

## Contents

- `utils.ts` - the `cn()` helper that merges Tailwind class names.
- `navigation.ts` - the single source of truth for the primary navigation. Lists
  every page in the app with an `isEnabled` flag and exports `NAV_GROUPS` (only
  the enabled pages, grouped) and `HOME_HREF` (where `/` redirects). Flip a flag
  to show or hide a page in the sidebar; hidden pages keep their routes.
- `env.ts` - validates environment variables with Zod at load time and exports a
  typed, frozen `env` object: `DATABASE_URL`, `APP_PASSWORD`, `AUTH_SECRET`, and
  the optional `APP_TIME_ZONE` (an IANA zone, default UTC). The single source of
  truth for config; nothing else reads `process.env` directly.
- `iso-date.ts` - shared helpers for ISO day strings (`YYYY-MM-DD`, day math in
  UTC): `isIsoDate`, `todayIso` (takes a time zone), `addDays`, `formatDay`,
  `formatDayShort`, and `formatDayLong`. Used by the per-day feature views and
  the analytics chart axes.
- `analytics/` - pure date-range and series helpers for the charts. See
  `analytics/README.md`.
