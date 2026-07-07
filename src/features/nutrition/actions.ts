"use server";

// Server actions for the nutrition feature. Validates at the boundary, then
// delegates to the repository. logEntryAction is useActionState-shaped, with the
// date bound ahead of prevState.

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { isIsoDate } from "@/lib/iso-date";
import { logEntrySchema } from "./validation";
import { nutritionRepo } from "./repo";
import { logRecipeSchema } from "@/features/recipes/validation";
import { recipesRepo } from "@/features/recipes/repo";

const idSchema = z.uuid();

export type NutritionFormState = {
  ok: boolean;
  errors?: Record<string, string[] | undefined>;
};

export async function logEntryAction(
  date: string,
  _prev: NutritionFormState,
  formData: FormData,
): Promise<NutritionFormState> {
  if (!isIsoDate(date)) return { ok: false, errors: { form: ["Invalid date."] } };
  const parsed = logEntrySchema.safeParse({
    name: formData.get("name"),
    servingLabel: formData.get("servingLabel"),
    calories: formData.get("calories"),
    proteinG: formData.get("proteinG"),
    carbsG: formData.get("carbsG"),
    fatG: formData.get("fatG"),
    mealType: formData.get("mealType"),
    quantity: formData.get("quantity"),
  });
  if (!parsed.success) return { ok: false, errors: z.flattenError(parsed.error).fieldErrors };
  try {
    await nutritionRepo.logEntry(date, parsed.data);
  } catch (error) {
    console.error("Failed to log meal entry:", error);
    return { ok: false, errors: { form: ["Could not log the food."] } };
  }
  revalidatePath("/nutrition");
  return { ok: true };
}

export async function logRecipeAction(
  date: string,
  _prev: NutritionFormState,
  formData: FormData,
): Promise<NutritionFormState> {
  if (!isIsoDate(date)) return { ok: false, errors: { form: ["Invalid date."] } };
  const parsed = logRecipeSchema.safeParse({
    recipeId: formData.get("recipeId"),
    mealType: formData.get("mealType"),
    multiplier: formData.get("multiplier") || undefined,
  });
  if (!parsed.success) return { ok: false, errors: z.flattenError(parsed.error).fieldErrors };
  try {
    const recipe = await recipesRepo.findWithItems(parsed.data.recipeId);
    if (!recipe) return { ok: false, errors: { form: ["That recipe no longer exists."] } };
    await nutritionRepo.logRecipeEntries(
      date,
      parsed.data.mealType,
      recipe.id,
      recipe.items,
      parsed.data.multiplier,
    );
  } catch (error) {
    console.error("Failed to log recipe:", error);
    return { ok: false, errors: { form: ["Could not log the recipe."] } };
  }
  revalidatePath("/nutrition");
  revalidatePath("/meal-prep");
  return { ok: true };
}

export async function removeEntryAction(id: string) {
  if (!idSchema.safeParse(id).success) return;
  await nutritionRepo.removeEntry(id);
  revalidatePath("/nutrition");
}
