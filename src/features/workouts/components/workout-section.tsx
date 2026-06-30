// Server section for the workout analytics card: lists exercises that have sets,
// loads per-session volume for the selected one (or the first), and renders the
// progression chart with an exercise picker. Shows an empty state when there is
// no strength data yet.

import { ChartCard } from "@/components/charts/chart-card";
import { workoutsRepo } from "@/features/workouts/repo";
import { ExercisePicker } from "@/features/workouts/components/exercise-picker";
import { WorkoutProgressChart } from "@/features/workouts/components/workout-progress-chart";

export async function WorkoutSection({
  from,
  to,
  range,
  exercise,
}: {
  from: string;
  to: string;
  range: string;
  exercise?: string;
}) {
  const names = (await workoutsRepo.listExercisesWithSets()).map(
    (row) => row.name,
  );

  if (names.length === 0) {
    return (
      <ChartCard title="Workout volume" description="Total volume per session">
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          No workouts logged yet.
        </div>
      </ChartCard>
    );
  }

  const selected =
    names.find((name) => name.toLowerCase() === exercise?.toLowerCase()) ??
    names[0];
  const rows = await workoutsRepo.exerciseVolumeByDate(selected, from, to);
  const data = rows.map((row) => ({
    day: row.day,
    volume: Math.round(Number(row.volume)),
  }));

  return (
    <ChartCard
      title="Workout volume"
      description="Total volume per session"
      action={
        <ExercisePicker exercises={names} selected={selected} range={range} />
      }
    >
      <WorkoutProgressChart data={data} />
    </ChartCard>
  );
}
