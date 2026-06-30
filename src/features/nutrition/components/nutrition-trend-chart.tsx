"use client";

// Nutrition trend chart: daily calories (area, left axis) with protein, carbs,
// and fat (lines, right axis) over the selected window. Presentational; the data
// is aggregated and gap-filled server-side.

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatDay, formatDayShort } from "@/lib/iso-date";

export type NutritionTrendPoint = {
  day: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
};

const axisTick = { fontSize: 11, fill: "var(--muted-foreground)" };

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "0.5rem",
  fontSize: "12px",
  color: "var(--popover-foreground)",
};

export function NutritionTrendChart({
  data,
}: {
  data: NutritionTrendPoint[];
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="day"
          tickFormatter={formatDayShort}
          tickLine={false}
          axisLine={false}
          minTickGap={24}
          tick={axisTick}
        />
        <YAxis yAxisId="cal" width={40} tickLine={false} axisLine={false} tick={axisTick} />
        <YAxis yAxisId="macro" orientation="right" width={32} tickLine={false} axisLine={false} tick={axisTick} />
        <Tooltip
          contentStyle={tooltipStyle}
          labelFormatter={(label) => formatDay(String(label))}
        />
        <Legend wrapperStyle={{ fontSize: "12px" }} />
        <Area
          yAxisId="cal"
          type="monotone"
          dataKey="calories"
          name="Calories"
          stroke="var(--chart-1)"
          fill="var(--chart-1)"
          fillOpacity={0.15}
        />
        <Line yAxisId="macro" type="monotone" dataKey="proteinG" name="Protein (g)" stroke="var(--chart-2)" dot={false} />
        <Line yAxisId="macro" type="monotone" dataKey="carbsG" name="Carbs (g)" stroke="var(--chart-3)" dot={false} />
        <Line yAxisId="macro" type="monotone" dataKey="fatG" name="Fat (g)" stroke="var(--chart-4)" dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
