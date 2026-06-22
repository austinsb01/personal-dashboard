# components/layout

The dashboard shell: the persistent frame that wraps every route.

## Contents

- `dashboard-shell.tsx` - top-level layout that places the sidebar beside the
  main content region. Applied once in the root `app/layout.tsx`.
- `sidebar.tsx` - primary navigation. Renders links from `NAV_ITEMS`
  (`@/lib/navigation`) and highlights the active route. Client component
  because it reads the current pathname.

## Notes

A mobile navigation drawer is deferred to the later polish phase; the sidebar
is currently always visible.
