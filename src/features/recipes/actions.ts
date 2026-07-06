"use server";

// Server actions for recipes. Validates at the boundary, then delegates to the
// repository. createRecipeAction is useActionState-shaped; the item rows are
// parsed out of indexed FormData fields.

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { recipeSchema } from "./validation";
import { recipesRepo } from "./repo";

const idSchema = z.uuid();

export type RecipeFormState = {
  ok: boolean;
  errors?: Record<string, string[] | undefined>;
};

// Rebuilds the recipe items array from name[i]/servingLabel[i]/... FormData keys.
function readItems(formData: FormData) {
  const names = formData.getAll("name");
  const servingLabels = formData.getAll("servingLabel");
  const calories = formData.getAll("calories");
  const proteinG = formData.getAll("proteinG");
  const carbsG = formData.getAll("carbsG");
  const fatG = formData.getAll("fatG");
  const quantities = formData.getAll("quantity");
  return names.map((name, i) => ({
    name,
    servingLabel: servingLabels[i],
    calories: calories[i],
    proteinG: proteinG[i],
    carbsG: carbsG[i],
    fatG: fatG[i],
    quantity: quantities[i],
  }));
}

function parseRecipe(formData: FormData) {
  return recipeSchema.safeParse({
    name: formData.get("recipeName"),
    note: formData.get("note") ?? undefined,
    items: readItems(formData),
  });
}

export async function createRecipeAction(
  _prev: RecipeFormState,
  formData: FormData,
): Promise<RecipeFormState> {
  const parsed = parseRecipe(formData);
  if (!parsed.success) return { ok: false, errors: z.flattenError(parsed.error).fieldErrors };
  try {
    await recipesRepo.createRecipe(parsed.data);
  } catch (error) {
    console.error("Failed to create recipe:", error);
    return { ok: false, errors: { form: ["Could not save the recipe. Is the name already used?"] } };
  }
  revalidatePath("/recipes");
  return { ok: true };
}

export async function deleteRecipeAction(id: string) {
  if (!idSchema.safeParse(id).success) return;
  await recipesRepo.deleteRecipe(id);
  revalidatePath("/recipes");
}
