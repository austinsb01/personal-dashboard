import { workoutsRepo } from "@/features/workouts/repo";
import { DayView } from "@/features/workouts/components/day-view";
import { isIsoDate, todayIso } from "@/lib/iso-date";

export const dynamic = "force-dynamic";

export default async function WorkoutsPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const params = await searchParams;
  const date = params.date && isIsoDate(params.date) ? params.date : todayIso();

  const [workout, dayTypes, cardio, cardioExercises] = await Promise.all([
    workoutsRepo.findByDate(date),
    workoutsRepo.listWorkoutDays(),
    workoutsRepo.listCardio(date),
    workoutsRepo.listCardioExercises(),
  ]);

  const sets = workout ? await workoutsRepo.listSets(workout.id) : [];
  const exerciseSuggestions = workout
    ? await workoutsRepo.exercisesForWorkoutDay(workout.workoutDayId)
    : [];

  return (
    <DayView
      date={date}
      workout={workout ? { id: workout.id, dayName: workout.dayName } : null}
      dayTypeOptions={dayTypes.map((day) => day.name)}
      sets={sets}
      exerciseSuggestions={exerciseSuggestions.map((row) => row.name)}
      cardio={cardio}
      cardioExerciseOptions={cardioExercises.map((row) => row.name)}
    />
  );
}
