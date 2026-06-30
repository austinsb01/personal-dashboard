"use client";

// Time trend chart: daily hours stacked by activity over the selected window.
// Presentational; the data is aggregated and pivoted server-side.

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
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
import type { StackedPoint } from "@/lib/analytics/series";

export function TimeTrendChart({
  data,
  keys,
}: {
  data: StackedPoint[];
  keys: string[];
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
        />
        <Legend wrapperStyle={{ fontSize: "12px" }} />
        {keys.map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            stackId="time"
            fill={CHART_COLORS[index % CHART_COLORS.length]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
