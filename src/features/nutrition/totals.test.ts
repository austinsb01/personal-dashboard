// Tests for the pure nutrition day-summary helper.

import { describe, expect, it } from "vitest";

import { entryTotals, groupMealEntries, summarizeDay, type DayEntry } from "./totals";

function entry(over: Partial<DayEntry>): DayEntry {
  return {
    id: "1",
    mealType: "breakfast",
    quantity: 1,
    foodName: "Food",
    servingLabel: "1 serving",
    calories: 100,
    proteinG: 10,
    carbsG: 20,
    fatG: 5,
    sourceRecipeId: null,
    recipeName: null,
    ...over,
  };
}

describe("entryTotals", () => {
  it("scales per-serving nutrition by quantity", () => {
    const totals = entryTotals(entry({ calories: 300, proteinG: 10, quantity: 1.5 }));
    expect(totals.calories).toBe(450);
    expect(totals.proteinG).toBe(15);
  });
});

describe("summarizeDay", () => {
  it("returns no meals and a zero total for an empty day", () => {
    const summary = summarizeDay([]);
    expect(summary.meals).toEqual([]);
    expect(summary.total).toEqual({ calories: 0, proteinG: 0, carbsG: 0, fatG: 0 });
  });

  it("groups entries by meal in canonical order, omitting empty meals", () => {
    const summary = summarizeDay([
      entry({ id: "a", mealType: "dinner" }),
      entry({ id: "b", mealType: "breakfast" }),
    ]);
    expect(summary.meals.map((m) => m.mealType)).toEqual(["breakfast", "dinner"]);
  });

  it("sums per-meal and day totals across entries", () => {
    const summary = summarizeDay([
      entry({ id: "a", mealType: "breakfast", calories: 200, quantity: 2 }),
      entry({ id: "b", mealType: "breakfast", calories: 100, quantity: 1 }),
      entry({ id: "c", mealType: "lunch", calories: 500, quantity: 1 }),
    ]);
    const breakfast = summary.meals.find((m) => m.mealType === "breakfast");
    expect(breakfast?.totals.calories).toBe(500);
    expect(summary.total.calories).toBe(1000);
  });
});

describe("groupMealEntries", () => {
  it("keeps untagged foods as standalone groups", () => {
    const groups = groupMealEntries([entry({ id: "a" }), entry({ id: "b" })]);
    expect(groups).toHaveLength(2);
    expect(groups.every((g) => g.kind === "food")).toBe(true);
  });

  it("collapses entries sharing a recipe into one recipe group with summed totals", () => {
    const groups = groupMealEntries([
      entry({ id: "a", sourceRecipeId: "r1", recipeName: "Chicken Bowl", calories: 200 }),
      entry({ id: "b", sourceRecipeId: "r1", recipeName: "Chicken Bowl", calories: 300 }),
      entry({ id: "c", foodName: "Apple", calories: 95 }),
    ]);
    expect(groups).toHaveLength(2);
    const recipe = groups.find((g) => g.kind === "recipe");
    expect(recipe?.kind === "recipe" && recipe.recipeName).toBe("Chicken Bowl");
    expect(recipe?.kind === "recipe" && recipe.totals.calories).toBe(500);
    expect(recipe?.kind === "recipe" && recipe.entries).toHaveLength(2);
  });
});
