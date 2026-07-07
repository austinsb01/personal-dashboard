// Drizzle tables for recipes: a named, reusable meal (recipes) composed of
// catalog foods with a per-ingredient quantity in servings (recipe_items).

import {
  pgTable,
  uuid,
  text,
  real,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

import { foods } from "../nutrition/schema";

// A named, reusable meal, e.g. "Chicken Bowl".
export const recipes = pgTable("recipes", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// One ingredient in a recipe: a catalog food and a quantity in servings.
export const recipeItems = pgTable(
  "recipe_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    recipeId: uuid("recipe_id")
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
    foodId: uuid("food_id")
      .notNull()
      .references(() => foods.id),
    quantity: real("quantity").notNull().default(1),
  },
  (table) => [index("recipe_items_recipe_id_idx").on(table.recipeId)],
);
