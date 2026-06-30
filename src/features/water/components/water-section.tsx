// Server section for the water analytics card: loads daily ounce totals for the
// window, gap-fills them, and renders the trend chart with the goal line.

import { ChartCard } from "@/components/charts/chart-card";
import { fillDays } from "@/lib/analytics/series";
import { waterRepo } from "@/features/water/repo";
import { DEFAULT_WATER_GOAL_OZ } from "@/features/water/constants";
import {
  WaterTrendChart,
  type WaterTrendPoint,
} from "@/features/water/components/water-trend-chart";

const EMPTY = { oz: 0 };

export async function WaterSection({
  from,
  to,
  days,
}: {
  from: string;
  to: string;
  days: string[];
}) {
  const rows = await waterRepo.dailyTotals(from, to);
  const data: WaterTrendPoint[] = fillDays(
    days,
    rows.map((row) => ({ day: row.day, oz: Math.round(Number(row.oz)) })),
    EMPTY,
  );
  return (
    <ChartCard title="Water" description="Daily ounces vs goal">
      <WaterTrendChart data={data} goal={DEFAULT_WATER_GOAL_OZ} />
    </ChartCard>
  );
}
