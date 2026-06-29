"use client";

// Client input forms for the workouts feature: start a workout (day type),
// add a strength set, and add cardio. Datalists provide reuse-or-create
// autocomplete; create forms reset on success.

import { useActionState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  startWorkoutAction,
  addSetAction,
  addCardioAction,
  type WorkoutFormState,
} from "@/features/workouts/actions";

const initialState: WorkoutFormState = { ok: false };

function Datalist({ id, options }: { id: string; options: string[] }) {
  return (
    <datalist id={id}>
      {options.map((option) => (
        <option key={option} value={option} />
      ))}
    </datalist>
  );
}

function firstError(state: WorkoutFormState, keys: string[]): string | undefined {
  for (const key of keys) {
    const message = state.errors?.[key]?.[0];
    if (message) return message;
  }
  return undefined;
}

export function StartWorkoutForm({
  date,
  dayTypes,
}: {
  date: string;
  dayTypes: string[];
}) {
  const [state, formAction, pending] = useActionState(
    startWorkoutAction.bind(null, date),
    initialState,
  );
  const error = firstError(state, ["workoutDay", "form"]);
  return (
    <form action={formAction} className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <Input
          name="workoutDay"
          list="workout-days"
          placeholder="Workout day (e.g. Chest day)"
          aria-label="Workout day"
          required
        />
        <Datalist id="workout-days" options={dayTypes} />
        <Button type="submit" disabled={pending}>
          {pending ? "Starting..." : "Start workout"}
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </form>
  );
}

export function AddSetForm({
  workoutId,
  date,
  suggestions,
}: {
  workoutId: string;
  date: string;
  suggestions: string[];
}) {
  const [state, formAction, pending] = useActionState(
    addSetAction.bind(null, workoutId, date),
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);
  const error = firstError(state, ["exercise", "reps", "weight", "form"]);
  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          name="exercise"
          list="exercise-suggestions"
          placeholder="Exercise"
          aria-label="Exercise"
          className="min-w-40 flex-1"
          required
        />
        <Datalist id="exercise-suggestions" options={suggestions} />
        <Input name="reps" type="number" min={1} placeholder="Reps" aria-label="Reps" className="w-20" required />
        <Input name="weight" type="number" min={0} step="0.5" placeholder="Weight" aria-label="Weight" className="w-24" required />
        <Button type="submit" disabled={pending}>
          {pending ? "Adding..." : "Add set"}
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </form>
  );
}

export function AddCardioForm({
  date,
  exercises,
}: {
  date: string;
  exercises: string[];
}) {
  const [state, formAction, pending] = useActionState(
    addCardioAction.bind(null, date),
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);
  const error = firstError(state, ["exercise", "durationMinutes", "distance", "form"]);
  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          name="exercise"
          list="cardio-suggestions"
          placeholder="Cardio (e.g. Running)"
          aria-label="Cardio activity"
          className="min-w-40 flex-1"
          required
        />
        <Datalist id="cardio-suggestions" options={exercises} />
        <Input name="durationMinutes" type="number" min={1} placeholder="Min" aria-label="Duration in minutes" className="w-20" required />
        <Input name="distance" type="number" min={0} step="0.1" placeholder="Distance" aria-label="Distance" className="w-24" />
        <Button type="submit" disabled={pending}>
          {pending ? "Adding..." : "Add cardio"}
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </form>
  );
}
