# components/layout

The dashboard shell: the persistent frame that wraps every route.

## Contents

- `dashboard-shell.tsx` - top-level layout that places the sidebar beside the
  main content region. Full viewport height (`h-dvh`); the content area
  scrolls in a centered `max-w-5xl` column. Applied once in `app/layout.tsx`.
- `sidebar.tsx` - primary navigation. Renders the Overview link plus collapsible
  dropdown groups from `@/lib/navigation` (`NAV_OVERVIEW`, `NAV_GROUPS`),
  highlights the active route, and hosts the theme toggle. Client component
  because it reads the current pathname and tracks open/closed groups.

## Notes

A mobile navigation drawer is deferred to the later polish phase; the sidebar
is currently always visible.
