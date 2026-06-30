// Zod validation for the daily targets form. Numbers are coerced from FormData
// strings; the water goal and calories must be positive, macro goals may be zero.

import { z } from "zod";

import { MAX_TARGET } from "./constants";

export const targetsSchema = z.object({
  waterOz: z.coerce
    .number()
    .positive("Water goal must be greater than 0")
    .max(MAX_TARGET.waterOz),
  calories: z.coerce
    .number()
    .int("Calories must be a whole number")
    .positive("Calories must be greater than 0")
    .max(MAX_TARGET.calories),
  proteinG: z.coerce.number().min(0, "Protein cannot be negative").max(MAX_TARGET.proteinG),
  carbsG: z.coerce.number().min(0, "Carbs cannot be negative").max(MAX_TARGET.carbsG),
  fatG: z.coerce.number().min(0, "Fat cannot be negative").max(MAX_TARGET.fatG),
});

export type TargetsInput = z.infer<typeof targetsSchema>;
