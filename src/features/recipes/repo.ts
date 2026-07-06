// Typed data access for recipes. The only place recipe rows are read or written.
// Item foods are find-or-create by name (shared with meal logging), so a recipe
// reuses catalog foods and their stored macros.

import { asc, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { recipes, recipeItems } from "./schema";
import { foods } from "../nutrition/schema";
import { findOrCreateFood } from "../nutrition/foods";
import type { RecipeInput } from "./validation";

async function replaceItems(recipeId: string, input: RecipeInput) {
  await db.delete(recipeItems).where(eq(recipeItems.recipeId, recipeId));
  for (const item of input.items) {
    const food = await findOrCreateFood(item);
    await db.insert(recipeItems).values({
      recipeId,
      foodId: food.id,
      quantity: item.quantity,
    });
  }
}

export const recipesRepo = {
  // All recipes by name, for the recipe list and log-recipe picker.
  listRecipes() {
    return db
      .select({ id: recipes.id, name: recipes.name, note: recipes.note })
      .from(recipes)
      .orderBy(asc(recipes.name));
  },

  // A recipe with its items (each carrying the food's per-serving macros), or null.
  async findWithItems(id: string) {
    const [recipe] = await db.select().from(recipes).where(eq(recipes.id, id)).limit(1);
    if (!recipe) return null;
    const items = await db
      .select({
        foodId: recipeItems.foodId,
        quantity: recipeItems.quantity,
        foodName: foods.name,
        servingLabel: foods.servingLabel,
        calories: foods.calories,
        proteinG: foods.proteinG,
        carbsG: foods.carbsG,
        fatG: foods.fatG,
      })
      .from(recipeItems)
      .innerJoin(foods, eq(recipeItems.foodId, foods.id))
      .where(eq(recipeItems.recipeId, id))
      .orderBy(asc(foods.name));
    return { ...recipe, items };
  },

  // Creates a recipe and its items (find-or-creating each food).
  async createRecipe(input: RecipeInput) {
    const [recipe] = await db
      .insert(recipes)
      .values({ name: input.name, note: input.note ?? null })
      .returning();
    await replaceItems(recipe.id, input);
  },

  // Updates a recipe's name/note and replaces its items.
  async updateRecipe(id: string, input: RecipeInput) {
    await db
      .update(recipes)
      .set({ name: input.name, note: input.note ?? null })
      .where(eq(recipes.id, id));
    await replaceItems(id, input);
  },

  // Deletes a recipe. Items cascade; logged entries keep their food and go
  // untagged (source_recipe_id set null).
  async deleteRecipe(id: string) {
    await db.delete(recipes).where(eq(recipes.id, id));
  },
};

export type RecipeWithItems = NonNullable<Awaited<ReturnType<typeof recipesRepo.findWithItems>>>;
export type RecipeListItem = Awaited<ReturnType<typeof recipesRepo.listRecipes>>[number];
