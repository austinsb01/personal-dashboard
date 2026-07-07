// Typed data access for recipes. The only place recipe rows are read or written.
// Item foods are find-or-create by name (shared with meal logging), so a recipe
// reuses catalog foods and their stored macros.

import { asc, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { recipes, recipeItems } from "./schema";
import { foods } from "../nutrition/schema";
import { findOrCreateFood } from "../nutrition/foods";
import type { RecipeInput } from "./validation";

// Resolves each recipe item's food (find-or-create) into a foodId+quantity row,
// before any recipe row is written.
async function resolveItems(input: RecipeInput) {
  const resolved: { foodId: string; quantity: number }[] = [];
  for (const item of input.items) {
    const food = await findOrCreateFood(item);
    resolved.push({ foodId: food.id, quantity: item.quantity });
  }
  return resolved;
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

  // Creates a recipe and its items. Foods are resolved first so a bad ingredient
  // fails before any row is written; item rows insert in one statement, and the
  // recipe is removed if that insert fails (the neon-http driver has no
  // transactions, so failure is compensated manually).
  async createRecipe(input: RecipeInput) {
    const items = await resolveItems(input);
    const [recipe] = await db
      .insert(recipes)
      .values({ name: input.name, note: input.note ?? null })
      .returning();
    if (items.length === 0) return;
    try {
      await db.insert(recipeItems).values(
        items.map((item) => ({ recipeId: recipe.id, ...item })),
      );
    } catch (error) {
      await db.delete(recipes).where(eq(recipes.id, recipe.id));
      throw error;
    }
  },

  // Deletes a recipe. Items cascade; logged entries keep their food and go
  // untagged (source_recipe_id set null).
  async deleteRecipe(id: string) {
    await db.delete(recipes).where(eq(recipes.id, id));
  },
};

export type RecipeWithItems = NonNullable<Awaited<ReturnType<typeof recipesRepo.findWithItems>>>;
export type RecipeListItem = Awaited<ReturnType<typeof recipesRepo.listRecipes>>[number];
