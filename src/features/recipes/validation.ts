// Zod validation for recipes: a recipe is a name, optional note, and one or more
// items (a food with per-serving macros and a quantity). logRecipeSchema
// validates logging an existing recipe into a day's meal. Item macro fields and
// the meal-type list are shared with the meal-log schema (single source of truth).

import { z } from "zod";

import {
  MEAL_TYPES,
  foodMacrosSchema,
  quantitySchema,
  nameField,
} from "../nutrition/validation";

export const recipeItemSchema = foodMacrosSchema.extend({ quantity: quantitySchema });

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
