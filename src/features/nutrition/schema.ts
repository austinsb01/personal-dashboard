// Drizzle tables for the food/nutrition feature: a reusable catalog of foods
// with per-serving macros, and dated meal entries that reference a food with a
// quantity (in servings) under a meal type.

import {
  pgTable,
  uuid,
  text,
  integer,
  real,
  date,
  timestamp,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";

export const mealType = pgEnum("meal_type", [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
]);

// Catalog of reusable foods with nutrition per serving, e.g. "Oatmeal".
export const foods = pgTable("foods", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  servingLabel: text("serving_label").notNull(),
  calories: integer("calories").notNull(),
  proteinG: real("protein_g").notNull(),
  carbsG: real("carbs_g").notNull(),
  fatG: real("fat_g").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// One logged food for a calendar date, under a meal type, in servings.
export const mealEntries = pgTable(
  "meal_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    loggedOn: date("logged_on", { mode: "string" }).notNull(),
    mealType: mealType("meal_type").notNull(),
    foodId: uuid("food_id")
      .notNull()
      .references(() => foods.id),
    quantity: real("quantity").notNull().default(1),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("meal_entries_logged_on_idx").on(table.loggedOn)],
);
