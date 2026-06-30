// Server section for the goals analytics card: loads current progress per goal
// and renders the horizontal bar chart, or an empty state when there are none.

import { ChartCard } from "@/components/charts/chart-card";
import { goalsRepo } from "@/features/goals/repo";
import { GoalProgressChart } from "@/features/goals/components/goal-progress-chart";

export async function GoalSection() {
  const data = await goalsRepo.listProgress();
  return (
    <ChartCard title="Goal progress" description="Current progress by goal">
      {data.length === 0 ? (
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          No goals yet.
        </div>
      ) : (
        <GoalProgressChart data={data} />
      )}
    </ChartCard>
  );
}
