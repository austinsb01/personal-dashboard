"use server";

// Server actions for recipes. Validates at the boundary, then delegates to the
// repository. createRecipeAction/updateRecipeAction are useActionState-shaped;
// the item rows are parsed out of indexed FormData fields.

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
  return names.map((_, i) => ({
    name: formData.getAll("name")[i],
    servingLabel: formData.getAll("servingLabel")[i],
    calories: formData.getAll("calories")[i],
    proteinG: formData.getAll("proteinG")[i],
    carbsG: formData.getAll("carbsG")[i],
    fatG: formData.getAll("fatG")[i],
    quantity: formData.getAll("quantity")[i],
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

export async function updateRecipeAction(
  id: string,
  _prev: RecipeFormState,
  formData: FormData,
): Promise<RecipeFormState> {
  if (!idSchema.safeParse(id).success) return { ok: false, errors: { form: ["Invalid recipe."] } };
  const parsed = parseRecipe(formData);
  if (!parsed.success) return { ok: false, errors: z.flattenError(parsed.error).fieldErrors };
  try {
    await recipesRepo.updateRecipe(id, parsed.data);
  } catch (error) {
    console.error("Failed to update recipe:", error);
    return { ok: false, errors: { form: ["Could not save the recipe."] } };
  }
  revalidatePath("/recipes");
  return { ok: true };
}

export async function deleteRecipeAction(id: string) {
  if (!idSchema.safeParse(id).success) return;
  await recipesRepo.deleteRecipe(id);
  revalidatePath("/recipes");
}
