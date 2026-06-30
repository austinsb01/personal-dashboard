# components/charts

Shared, feature-agnostic building blocks for the analytics charts. Each feature
owns its own chart and data loading; these are the pieces they all reuse.

## Contents

- `chart-card.tsx` - the consistent card frame for a chart (title, optional
  description and action slot, fixed-height chart area). Composes the `Card`
  primitive.
- `chart-theme.ts` - shared visual constants sourced from the design tokens:
  `CHART_COLORS` (the `--chart-1..5` series palette), `axisTick`, `tooltipStyle`,
  and `gridStroke`. Charts never hardcode colors.
- `range-toggle.tsx` - the 7/30/90 day selector. Server-rendered links that set
  `?range` while preserving the other query params, so the page re-renders with
  fresh server data.

## Rules

Charts are client components (Recharts), but they stay presentational: data is
aggregated server-side in each feature's repo and passed in as plain props. See
`CLAUDE.md` for the server-fetches-client-renders convention.
