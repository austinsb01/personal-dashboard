// Typed data access for the nutrition feature. The only place its rows are read
// or written. Food find-or-create lives in ./foods so recipes reuse it.

import { asc, between, eq, sql } from "drizzle-orm";

import { db } from "@/db/client";
import { foods, mealEntries } from "./schema";
import { recipes } from "../recipes/schema";
import { findOrCreateFood } from "./foods";
import type { LogEntryInput } from "./validation";

export const nutritionRepo = {
  // Full food catalog, for autocomplete and macro autofill.
  listFoods() {
    return db
      .select({
        name: foods.name,
        servingLabel: foods.servingLabel,
        calories: foods.calories,
        proteinG: foods.proteinG,
        carbsG: foods.carbsG,
        fatG: foods.fatG,
      })
      .from(foods)
      .orderBy(asc(foods.name));
  },

  // Entries for a date with each food's per-serving nutrition, oldest first.
  listEntriesForDay(loggedOn: string) {
    return db
      .select({
        id: mealEntries.id,
        mealType: mealEntries.mealType,
        quantity: mealEntries.quantity,
        foodName: foods.name,
        servingLabel: foods.servingLabel,
        calories: foods.calories,
        proteinG: foods.proteinG,
        carbsG: foods.carbsG,
        fatG: foods.fatG,
        sourceRecipeId: mealEntries.sourceRecipeId,
        recipeName: recipes.name,
      })
      .from(mealEntries)
      .innerJoin(foods, eq(mealEntries.foodId, foods.id))
      .leftJoin(recipes, eq(mealEntries.sourceRecipeId, recipes.id))
      .where(eq(mealEntries.loggedOn, loggedOn))
      .orderBy(asc(mealEntries.createdAt));
  },

  // Per-day calorie and macro totals over a window, days with entries only.
  dailyTotals(from: string, to: string) {
    return db
      .select({
        day: mealEntries.loggedOn,
        calories: sql<number>`coalesce(sum(${foods.calories} * ${mealEntries.quantity}), 0)`,
        proteinG: sql<number>`coalesce(sum(${foods.proteinG} * ${mealEntries.quantity}), 0)`,
        carbsG: sql<number>`coalesce(sum(${foods.carbsG} * ${mealEntries.quantity}), 0)`,
        fatG: sql<number>`coalesce(sum(${foods.fatG} * ${mealEntries.quantity}), 0)`,
      })
      .from(mealEntries)
      .innerJoin(foods, eq(mealEntries.foodId, foods.id))
      .where(between(mealEntries.loggedOn, from, to))
      .groupBy(mealEntries.loggedOn)
      .orderBy(asc(mealEntries.loggedOn));
  },

  // Entries across a date window with food macros and any source-recipe name,
  // for the weekly meal-prep view. Ordered by day then insertion.
  listEntriesForRange(from: string, to: string) {
    return db
      .select({
        id: mealEntries.id,
        day: mealEntries.loggedOn,
        mealType: mealEntries.mealType,
        quantity: mealEntries.quantity,
        foodName: foods.name,
        servingLabel: foods.servingLabel,
        calories: foods.calories,
        proteinG: foods.proteinG,
        carbsG: foods.carbsG,
        fatG: foods.fatG,
        sourceRecipeId: mealEntries.sourceRecipeId,
        recipeName: recipes.name,
      })
      .from(mealEntries)
      .innerJoin(foods, eq(mealEntries.foodId, foods.id))
      .leftJoin(recipes, eq(mealEntries.sourceRecipeId, recipes.id))
      .where(between(mealEntries.loggedOn, from, to))
      .orderBy(asc(mealEntries.loggedOn), asc(mealEntries.createdAt));
  },

  // Logs a food into a day's meal (find-or-creates the food).
  async logEntry(loggedOn: string, input: LogEntryInput) {
    const food = await findOrCreateFood(input);
    await db.insert(mealEntries).values({
      loggedOn,
      mealType: input.mealType,
      foodId: food.id,
      quantity: input.quantity,
    });
  },

  // Logs every item of a recipe into a day's meal, scaled by a whole multiplier,
  // tagging each created entry with the source recipe.
  async logRecipeEntries(
    loggedOn: string,
    mealTypeValue: LogEntryInput["mealType"],
    sourceRecipeId: string,
    items: { foodId: string; quantity: number }[],
    multiplier: number,
  ) {
    if (items.length === 0) return;
    await db.insert(mealEntries).values(
      items.map((item) => ({
        loggedOn,
        mealType: mealTypeValue,
        foodId: item.foodId,
        quantity: item.quantity * multiplier,
        sourceRecipeId,
      })),
    );
  },

  async removeEntry(id: string) {
    await db.delete(mealEntries).where(eq(mealEntries.id, id));
  },
};
