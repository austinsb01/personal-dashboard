// Zod validation for recipes: a recipe is a name, optional note, and one or more
// items (a food with per-serving macros and a quantity). logRecipeSchema
// validates logging an existing recipe into a day's meal. Numeric fields are
// coerced from FormData strings. Food-macro constraints mirror the meal-log
// schema so the shared foods catalog stays consistent.

import { z } from "zod";

import { mealType } from "../nutrition/schema";

export const MEAL_TYPES = mealType.enumValues;

function nameField(label: string) {
  return z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(80, `${label} must be 80 characters or fewer`);
}

export const recipeItemSchema = z.object({
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
  quantity: z.coerce.number().positive("Quantity must be greater than 0").max(1000),
});

export const recipeSchema = z.object({
  name: nameField("Recipe name"),
  note: z
    .string()
    .trim()
    .max(500, "Note must be 500 characters or fewer")
    .optional()
    .transform((value) => (value ? value : undefined)),
  items: z.array(recipeItemSchema).min(1, "Add at least one ingredient"),
});

export const logRecipeSchema = z.object({
  recipeId: z.uuid(),
  mealType: z.enum(MEAL_TYPES),
  multiplier: z.coerce
    .number()
    .int("Multiplier must be a whole number")
    .positive("Multiplier must be at least 1")
    .max(100)
    .default(1),
});

export type RecipeItemInput = z.infer<typeof recipeItemSchema>;
export type RecipeInput = z.infer<typeof recipeSchema>;
export type LogRecipeInput = z.infer<typeof logRecipeSchema>;
