// Zod validation for workout input: starting a workout (day type), adding a
// strength set, and adding a cardio session.

import { z } from "zod";

function nameField(label: string) {
  return z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(80, `${label} must be 80 characters or fewer`);
}

export const startWorkoutSchema = z.object({
  workoutDay: nameField("Workout day"),
});

export const addSetSchema = z.object({
  exercise: nameField("Exercise"),
  reps: z.coerce
    .number()
    .int("Reps must be a whole number")
    .min(1, "Reps must be at least 1")
    .max(10000),
  weight: z.coerce
    .number()
    .min(0, "Weight cannot be negative")
    .max(10000),
});

export const addCardioSchema = z.object({
  exercise: nameField("Exercise"),
  durationMinutes: z.coerce
    .number()
    .int("Duration must be a whole number")
    .min(1, "Duration must be at least 1 minute")
    .max(1440),
  distance: z.coerce
    .number()
    .min(0, "Distance cannot be negative")
    .max(100000)
    .nullable()
    .optional(),
});

export type StartWorkoutInput = z.infer<typeof startWorkoutSchema>;
export type AddSetInput = z.infer<typeof addSetSchema>;
export type AddCardioInput = z.infer<typeof addCardioSchema>;
