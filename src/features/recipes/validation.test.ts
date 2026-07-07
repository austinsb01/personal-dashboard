// Tests for recipe input validation: building a recipe from foods, and logging
// an existing recipe into a day's meal.

import { describe, expect, it } from "vitest";

import { recipeSchema, logRecipeSchema } from "./validation";

const validItem = {
  name: "Chicken breast",
  servingLabel: "100 g",
  calories: "165",
  proteinG: "31",
  carbsG: "0",
  fatG: "3.6",
  quantity: "1.5",
};

const validRecipe = {
  name: "Chicken Bowl",
  note: "high-protein lunch",
  items: [validItem],
};

describe("recipeSchema", () => {
  it("accepts a well-formed recipe and coerces item numbers", () => {
    const parsed = recipeSchema.parse(validRecipe);
    expect(parsed.name).toBe("Chicken Bowl");
    expect(parsed.items[0].calories).toBe(165);
    expect(parsed.items[0].quantity).toBe(1.5);
  });

  it("trims the recipe name and treats a blank note as undefined", () => {
    const parsed = recipeSchema.parse({ ...validRecipe, name: "  Chicken Bowl  ", note: "   " });
    expect(parsed.name).toBe("Chicken Bowl");
    expect(parsed.note).toBeUndefined();
  });

  it("rejects a recipe with no items", () => {
    expect(recipeSchema.safeParse({ ...validRecipe, items: [] }).success).toBe(false);
  });

  it("rejects an empty recipe name", () => {
    expect(recipeSchema.safeParse({ ...validRecipe, name: "  " }).success).toBe(false);
  });

  it("rejects an item with a non-positive quantity", () => {
    const items = [{ ...validItem, quantity: "0" }];
    expect(recipeSchema.safeParse({ ...validRecipe, items }).success).toBe(false);
  });
});

describe("logRecipeSchema", () => {
  it("accepts a recipe id, meal type, and multiplier", () => {
    const parsed = logRecipeSchema.parse({
      recipeId: "b3f1c2d4-5e6f-4a1b-8c2d-9e0f1a2b3c4d",
      mealType: "lunch",
      multiplier: "2",
    });
    expect(parsed.multiplier).toBe(2);
    expect(parsed.mealType).toBe("lunch");
  });

  it("defaults the multiplier to 1 when omitted", () => {
    const parsed = logRecipeSchema.parse({
      recipeId: "b3f1c2d4-5e6f-4a1b-8c2d-9e0f1a2b3c4d",
      mealType: "dinner",
    });
    expect(parsed.multiplier).toBe(1);
  });

  it("rejects a non-uuid recipe id", () => {
    expect(logRecipeSchema.safeParse({ recipeId: "nope", mealType: "lunch" }).success).toBe(false);
  });

  it("rejects a fractional multiplier", () => {
    const input = { recipeId: "b3f1c2d4-5e6f-4a1b-8c2d-9e0f1a2b3c4d", mealType: "lunch", multiplier: "1.5" };
    expect(logRecipeSchema.safeParse(input).success).toBe(false);
  });
});
