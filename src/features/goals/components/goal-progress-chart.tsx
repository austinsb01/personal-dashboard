"use client";

// Current progress (0-100) for each goal as horizontal bars. A snapshot, not a
// trend (goal progress is not historized). Presentational.

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  CHART_COLORS,
  axisTick,
  gridStroke,
  tooltipStyle,
} from "@/components/charts/chart-theme";

export type GoalProgressPoint = { title: string; progress: number };

export function GoalProgressChart({ data }: { data: GoalProgressPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 12, bottom: 0, left: 8 }}
      >
        <CartesianGrid horizontal={false} stroke={gridStroke} />
        <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} tick={axisTick} />
        <YAxis type="category" dataKey="title" width={100} tickLine={false} axisLine={false} tick={axisTick} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value) => [`${value}%`, "Progress"]}
        />
        <Bar dataKey="progress" name="Progress" fill={CHART_COLORS[1]} radius={[0, 3, 3, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
