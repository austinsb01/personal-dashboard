// Server section for the time analytics card: loads daily hours per activity for
// the window, pivots them into a stacked series, and renders the chart.

import { ChartCard } from "@/components/charts/chart-card";
import { pivotDays } from "@/lib/analytics/series";
import { timeRepo } from "@/features/time/repo";
import { TimeTrendChart } from "@/features/time/components/time-trend-chart";

export async function TimeSection({
  from,
  to,
  days,
}: {
  from: string;
  to: string;
  days: string[];
}) {
  const rows = await timeRepo.dailyByActivity(from, to);
  const { keys, data } = pivotDays(
    days,
    rows.map((row) => ({
      day: row.day,
      key: row.activity,
      value: Math.round(Number(row.hours) * 10) / 10,
    })),
  );
  return (
    <ChartCard title="Time" description="Daily hours by activity">
      <TimeTrendChart data={data} keys={keys} />
    </ChartCard>
  );
}
