// Drizzle table for daily targets: a single-row config holding the daily water
// goal (oz) and the nutrition goals (calories and macros). The fixed id keeps it
// a singleton (the repo upserts on it).

import { pgTable, integer, real, timestamp } from "drizzle-orm/pg-core";

export const dailyTargets = pgTable("daily_targets", {
  id: integer("id").primaryKey().default(1),
  waterOz: real("water_oz").notNull(),
  calories: integer("calories").notNull(),
  proteinG: real("protein_g").notNull(),
  carbsG: real("carbs_g").notNull(),
  fatG: real("fat_g").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
