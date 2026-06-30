import { RangeToggle } from "@/components/charts/range-toggle";
import { NutritionSection } from "@/features/nutrition/components/nutrition-section";
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
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold tracking-tight">Analytics</h1>
        <RangeToggle
          basePath="/analytics"
          active={range}
          params={{ exercise: params.exercise }}
        />
      </header>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <NutritionSection from={from} to={to} days={days} />
        </div>
        <TimeSection from={from} to={to} days={days} />
        <WorkoutSection from={from} to={to} range={range} exercise={params.exercise} />
        <TaskSection from={from} to={to} />
        <GoalSection />
      </div>
    </div>
  );
}
