// Server section for the tasks analytics card: loads weekly completion counts
// for the window, zero-fills empty weeks, and renders the bar chart.

import { ChartCard } from "@/components/charts/chart-card";
import { fillDays, weekAxis } from "@/lib/analytics/series";
import { tasksRepo } from "@/features/tasks/repo";
import { TasksCompletedChart } from "@/features/tasks/components/tasks-completed-chart";

const EMPTY = { count: 0 };

export async function TaskSection({
  from,
  to,
}: {
  from: string;
  to: string;
}) {
  const rows = await tasksRepo.completedByWeek(from, to);
  const data = fillDays(
    weekAxis(from, to),
    rows.map((row) => ({ day: row.day, count: Number(row.count) })),
    EMPTY,
  );
  return (
    <ChartCard title="Tasks completed" description="Per week">
      <TasksCompletedChart data={data} />
    </ChartCard>
  );
}
