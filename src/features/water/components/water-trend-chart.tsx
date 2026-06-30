"use client";

// Water trend chart: daily ounces over the selected window as bars, with a
// reference line at the daily goal. Presentational; data is aggregated and
// gap-filled server-side.

import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatDay, formatDayShort } from "@/lib/iso-date";
import {
  CHART_COLORS,
  axisTick,
  gridStroke,
  tooltipStyle,
} from "@/components/charts/chart-theme";

export type WaterTrendPoint = { day: string; oz: number };

export function WaterTrendChart({
  data,
  goal,
}: {
  data: WaterTrendPoint[];
  goal: number;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
        <CartesianGrid vertical={false} stroke={gridStroke} />
        <XAxis
          dataKey="day"
          tickFormatter={formatDayShort}
          tickLine={false}
          axisLine={false}
          minTickGap={24}
          tick={axisTick}
        />
        <YAxis width={32} tickLine={false} axisLine={false} tick={axisTick} />
        <Tooltip
          contentStyle={tooltipStyle}
          labelFormatter={(label) => formatDay(String(label))}
          formatter={(value) => [`${value} oz`, "Water"]}
        />
        <ReferenceLine y={goal} stroke={CHART_COLORS[2]} strokeDasharray="4 4" />
        <Bar dataKey="oz" name="Water (oz)" fill={CHART_COLORS[0]} radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
