// Typed data access for the nutrition feature. The only place its rows are read
// or written. Foods are find-or-create by name (case-insensitive), so logging a
// known food reuses its catalog row and stored macros.

import { asc, between, eq, sql } from "drizzle-orm";

import { db } from "@/db/client";
import { foods, mealEntries } from "./schema";
import type { LogEntryInput } from "./validation";

// Returns the food row for a name (case-insensitive), creating it if needed.
async function findOrCreateFood(input: LogEntryInput) {
  const byName = sql`lower(${foods.name}) = lower(${input.name})`;
  const [existing] = await db.select().from(foods).where(byName).limit(1);
  if (existing) return existing;
  const [created] = await db
    .insert(foods)
    .values({
      name: input.name,
      servingLabel: input.servingLabel,
      calories: input.calories,
      proteinG: input.proteinG,
      carbsG: input.carbsG,
      fatG: input.fatG,
    })
    .onConflictDoNothing()
    .returning();
  if (created) return created;
  const [row] = await db.select().from(foods).where(byName).limit(1);
  return row;
}

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
      })
      .from(mealEntries)
      .innerJoin(foods, eq(mealEntries.foodId, foods.id))
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

  async removeEntry(id: string) {
    await db.delete(mealEntries).where(eq(mealEntries.id, id));
  },
};
