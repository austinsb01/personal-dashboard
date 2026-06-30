// Shared visual constants for the analytics charts so every chart pulls its
// series colors, axis ticks, tooltip, and grid from one place (all design
// tokens, no hardcoded values).

export const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const;

export const axisTick = { fontSize: 11, fill: "var(--muted-foreground)" } as const;

export const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "0.5rem",
  fontSize: "12px",
  color: "var(--popover-foreground)",
} as const;

export const gridStroke = "var(--border)";
