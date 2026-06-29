"use server";

// Server actions for the workouts feature. Validates at the boundary, then
// delegates to the repository. The create actions are useActionState-shaped
// (with the date / workout id bound ahead of prevState).

import { z } from "zod";
import { revalidatePath } from "next/cache";

import {
  startWorkoutSchema,
  addSetSchema,
  addCardioSchema,
} from "./validation";
import { workoutsRepo } from "./repo";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const idSchema = z.uuid();

export type WorkoutFormState = {
  ok: boolean;
  errors?: Record<string, string[] | undefined>;
};

export async function startWorkoutAction(
  date: string,
  _prev: WorkoutFormState,
  formData: FormData,
): Promise<WorkoutFormState> {
  if (!datePattern.test(date)) return { ok: false, errors: { form: ["Invalid date."] } };
  const parsed = startWorkoutSchema.safeParse({
    workoutDay: formData.get("workoutDay"),
  });
  if (!parsed.success) return { ok: false, errors: z.flattenError(parsed.error).fieldErrors };
  try {
    await workoutsRepo.startWorkout(date, parsed.data.workoutDay);
  } catch (error) {
    console.error("Failed to start workout:", error);
    return { ok: false, errors: { form: ["Could not start the workout."] } };
  }
  revalidatePath("/workouts");
  return { ok: true };
}

export async function addSetAction(
  workoutId: string,
  date: string,
  _prev: WorkoutFormState,
  formData: FormData,
): Promise<WorkoutFormState> {
  if (!idSchema.safeParse(workoutId).success || !datePattern.test(date)) {
    return { ok: false, errors: { form: ["Invalid request."] } };
  }
  const parsed = addSetSchema.safeParse({
    exercise: formData.get("exercise"),
    reps: formData.get("reps"),
    weight: formData.get("weight"),
  });
  if (!parsed.success) return { ok: false, errors: z.flattenError(parsed.error).fieldErrors };
  try {
    await workoutsRepo.addSet(workoutId, parsed.data);
  } catch (error) {
    console.error("Failed to add set:", error);
    return { ok: false, errors: { form: ["Could not add the set."] } };
  }
  revalidatePath("/workouts");
  return { ok: true };
}

export async function addCardioAction(
  date: string,
  _prev: WorkoutFormState,
  formData: FormData,
): Promise<WorkoutFormState> {
  if (!datePattern.test(date)) return { ok: false, errors: { form: ["Invalid date."] } };
  const parsed = addCardioSchema.safeParse({
    exercise: formData.get("exercise"),
    durationMinutes: formData.get("durationMinutes"),
    distance: formData.get("distance") || null,
  });
  if (!parsed.success) return { ok: false, errors: z.flattenError(parsed.error).fieldErrors };
  try {
    await workoutsRepo.addCardio(date, parsed.data);
  } catch (error) {
    console.error("Failed to add cardio:", error);
    return { ok: false, errors: { form: ["Could not add cardio."] } };
  }
  revalidatePath("/workouts");
  return { ok: true };
}

export async function removeSetAction(id: string) {
  if (!idSchema.safeParse(id).success) return;
  await workoutsRepo.removeSet(id);
  revalidatePath("/workouts");
}

export async function removeCardioAction(id: string) {
  if (!idSchema.safeParse(id).success) return;
  await workoutsRepo.removeCardio(id);
  revalidatePath("/workouts");
}
