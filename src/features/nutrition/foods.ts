// Shared foods access for the nutrition domain: the FoodMacros shape and the
// find-or-create-by-name helper. Both meal logging and recipes reuse this so
// the find-or-create logic lives in exactly one place.

import { sql } from "drizzle-orm";

import { db } from "@/db/client";
import { foods } from "./schema";

export type FoodMacros = {
  name: string;
  servingLabel: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
};

// Returns the food row for a name (case-insensitive), creating it if needed.
export async function findOrCreateFood(input: FoodMacros) {
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
