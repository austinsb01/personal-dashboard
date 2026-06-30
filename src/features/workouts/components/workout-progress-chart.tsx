"use client";

// Workout progression chart: total volume (reps x weight) per session for the
// selected exercise over the window. Presentational; data is aggregated
// server-side. Sessions are discrete points, so dots are shown.

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

export type VolumePoint = { day: string; volume: number };

export function WorkoutProgressChart({ data }: { data: VolumePoint[] }) {
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
        <YAxis width={44} tickLine={false} axisLine={false} tick={axisTick} />
        <Tooltip
          contentStyle={tooltipStyle}
          labelFormatter={(label) => formatDay(String(label))}
        />
        <Line
          type="monotone"
          dataKey="volume"
          name="Volume (lbs)"
          stroke={CHART_COLORS[0]}
          dot={{ r: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
