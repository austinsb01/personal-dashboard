// Server-rendered day view: a date header with prev/next navigation, a strength
// section (start a workout or add sets, grouped by exercise), and a cardio
// section. Mutations are forms bound to server actions.

import Link from "next/link";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";

import { addDays, formatDay } from "@/lib/iso-date";
import {
  removeSetAction,
  removeCardioAction,
} from "@/features/workouts/actions";
import {
  StartWorkoutForm,
  AddSetForm,
  AddCardioForm,
} from "@/features/workouts/components/workout-forms";

type SetRow = { id: string; reps: number; weight: number; exerciseName: string };
type CardioRow = {
  id: string;
  durationMinutes: number;
  distance: number | null;
  exerciseName: string;
};

type DayViewProps = {
  date: string;
  workout: { id: string; dayName: string } | null;
  dayTypeOptions: string[];
  sets: SetRow[];
  exerciseSuggestions: string[];
  cardio: CardioRow[];
  cardioExerciseOptions: string[];
};

function groupByExercise(sets: SetRow[]) {
  const order: string[] = [];
  const byExercise = new Map<string, SetRow[]>();
  for (const set of sets) {
    if (!byExercise.has(set.exerciseName)) {
      byExercise.set(set.exerciseName, []);
      order.push(set.exerciseName);
    }
    byExercise.get(set.exerciseName)!.push(set);
  }
  return order.map((name) => ({ name, sets: byExercise.get(name)! }));
}

const navLinkClass =
  "flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground";

export function DayView(props: DayViewProps) {
  const { date, workout } = props;
  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center justify-between gap-3">
        <Link
          href={`/workouts?date=${addDays(date, -1)}`}
          aria-label="Previous day"
          className={navLinkClass}
        >
          <ChevronLeft className="size-5" />
        </Link>
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-semibold tracking-tight">
            {formatDay(date)}
          </h1>
          {workout && (
            <span className="text-xs text-muted-foreground">{workout.dayName}</span>
          )}
        </div>
        <Link
          href={`/workouts?date=${addDays(date, 1)}`}
          aria-label="Next day"
          className={navLinkClass}
        >
          <ChevronRight className="size-5" />
        </Link>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Strength
        </h2>
        {!workout ? (
          <StartWorkoutForm date={date} dayTypes={props.dayTypeOptions} />
        ) : (
          <div className="flex flex-col gap-4">
            <AddSetForm
              workoutId={workout.id}
              date={date}
              suggestions={props.exerciseSuggestions}
            />
            {props.sets.length === 0 ? (
              <p className="text-sm text-muted-foreground">No sets yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {groupByExercise(props.sets).map((group) => (
                  <div key={group.name} className="rounded-lg border bg-card px-3 py-2.5">
                    <div className="mb-1.5 text-sm font-medium">{group.name}</div>
                    <ul className="flex flex-col gap-1">
                      {group.sets.map((set) => (
                        <li
                          key={set.id}
                          className="group flex items-center justify-between gap-3 text-sm text-muted-foreground"
                        >
                          <span className="tabular-nums">
                            {set.weight} lbs × {set.reps}
                          </span>
                          <form action={removeSetAction.bind(null, set.id)}>
                            <button
                              type="submit"
                              aria-label="Delete set"
                              className="flex opacity-0 transition-opacity hover:text-destructive focus-visible:opacity-100 group-hover:opacity-100"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </form>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Cardio
        </h2>
        <AddCardioForm date={date} exercises={props.cardioExerciseOptions} />
        {props.cardio.length === 0 ? (
          <p className="text-sm text-muted-foreground">No cardio yet.</p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {props.cardio.map((entry) => (
              <li
                key={entry.id}
                className="group flex items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2.5"
              >
                <span className="text-sm">{entry.exerciseName}</span>
                <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
                  <span className="tabular-nums">
                    {entry.durationMinutes} min
                    {entry.distance != null ? ` · ${entry.distance} mi` : ""}
                  </span>
                  <form action={removeCardioAction.bind(null, entry.id)}>
                    <button
                      type="submit"
                      aria-label="Delete cardio"
                      className="flex opacity-0 transition-opacity hover:text-destructive focus-visible:opacity-100 group-hover:opacity-100"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
