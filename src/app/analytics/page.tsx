import { RangeToggle } from "@/components/charts/range-toggle";
import { PageHeader } from "@/components/page-header";
import { NutritionSection } from "@/features/nutrition/components/nutrition-section";
import { WaterSection } from "@/features/water/components/water-section";
import { TimeSection } from "@/features/time/components/time-section";
import { WorkoutSection } from "@/features/workouts/components/workout-section";
import { TaskSection } from "@/features/tasks/components/task-section";
import { GoalSection } from "@/features/goals/components/goal-section";
import { dayAxis, parseRange, rangeWindow } from "@/lib/analytics/range";
import { todayIso } from "@/lib/iso-date";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string; exercise?: string }>;
}) {
  const params = await searchParams;
  const range = parseRange(params.range);
  const { from, to } = rangeWindow(range, todayIso());
  const days = dayAxis(from, to);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Analytics"
        action={
          <RangeToggle
            basePath="/analytics"
            active={range}
            params={{ exercise: params.exercise }}
          />
        }
      />
      <div className="flex flex-col gap-4">
        <NutritionSection from={from} to={to} days={days} />
        <div className="grid gap-4 sm:grid-cols-2">
          <WaterSection from={from} to={to} days={days} />
          <TimeSection from={from} to={to} days={days} />
          <WorkoutSection from={from} to={to} range={range} exercise={params.exercise} />
          <GoalSection />
        </div>
        <TaskSection from={from} to={to} />
      </div>
    </div>
  );
}
