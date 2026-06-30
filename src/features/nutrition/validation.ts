// Zod validation for nutrition input: logging a food into a day's meal. The
// food's per-serving macros travel with the entry so the repo can find-or-create
// the food by name. Numeric fields are coerced from FormData strings.

import { z } from "zod";

import { mealType } from "./schema";

// The meal-type values, derived from the Drizzle enum (single source of truth).
export const MEAL_TYPES = mealType.enumValues;

function nameField(label: string) {
  return z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(80, `${label} must be 80 characters or fewer`);
}

export const logEntrySchema = z.object({
  name: nameField("Food"),
  servingLabel: nameField("Serving"),
  calories: z.coerce
    .number()
    .int("Calories must be a whole number")
    .min(0, "Calories cannot be negative")
    .max(100000),
  proteinG: z.coerce.number().min(0, "Protein cannot be negative").max(10000),
  carbsG: z.coerce.number().min(0, "Carbs cannot be negative").max(10000),
  fatG: z.coerce.number().min(0, "Fat cannot be negative").max(10000),
  mealType: z.enum(MEAL_TYPES),
  quantity: z.coerce
    .number()
    .positive("Quantity must be greater than 0")
    .max(1000),
});

export type LogEntryInput = z.infer<typeof logEntrySchema>;
export type MealType = (typeof MEAL_TYPES)[number];
