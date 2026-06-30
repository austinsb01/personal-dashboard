"use client";

// Tasks completed per week (Monday-aligned) over the selected window.
// Presentational; counts are aggregated and gap-filled server-side.

import {
  CartesianGrid,
  Line,
  LineChart,
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

export type WeeklyCountPoint = { day: string; count: number };

export function TasksCompletedChart({ data }: { data: WeeklyCountPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
        <CartesianGrid vertical={false} stroke={gridStroke} />
        <XAxis
          dataKey="day"
          tickFormatter={formatDayShort}
          tickLine={false}
          axisLine={false}
          minTickGap={24}
          tick={axisTick}
        />
        <YAxis width={28} allowDecimals={false} tickLine={false} axisLine={false} tick={axisTick} />
        <Tooltip
          contentStyle={tooltipStyle}
          labelFormatter={(label) => `Week of ${formatDay(String(label))}`}
        />
        <Line
          type="monotone"
          dataKey="count"
          name="Completed"
          stroke={CHART_COLORS[0]}
          dot={{ r: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
