// Tests for the pure meal-prep week helpers: the Mon-Sun range for a date, the
// per-day summaries, and the ingredient rollup across a week.

import { describe, expect, it } from "vitest";

import { weekRange, rollUpIngredients, summarizeWeekDays, type RangeEntry } from "./week";

function rangeEntry(over: Partial<RangeEntry>): RangeEntry {
  return {
    id: "x",
    day: "2026-07-06",
    mealType: "lunch",
    quantity: 1,
    foodName: "Chicken breast",
    servingLabel: "100 g",
    calories: 165,
    proteinG: 31,
    carbsG: 0,
    fatG: 3.6,
    sourceRecipeId: null,
    recipeName: null,
    ...over,
  };
}

describe("weekRange", () => {
  it("returns Monday through Sunday for a mid-week date", () => {
    const range = weekRange("2026-07-08"); // a Wednesday
    expect(range.from).toBe("2026-07-06");
    expect(range.to).toBe("2026-07-12");
    expect(range.days).toHaveLength(7);
    expect(range.days[0]).toBe("2026-07-06");
    expect(range.days[6]).toBe("2026-07-12");
  });

  it("treats Sunday as the last day of the same week", () => {
    const range = weekRange("2026-07-12"); // a Sunday
    expect(range.from).toBe("2026-07-06");
    expect(range.to).toBe("2026-07-12");
  });
});

describe("rollUpIngredients", () => {
  it("sums servings and macros per food and lists the recipes/days using it", () => {
    const rollup = rollUpIngredients([
      rangeEntry({ id: "a", day: "2026-07-06", quantity: 1.5, sourceRecipeId: "r1", recipeName: "Chicken Bowl" }),
      rangeEntry({ id: "b", day: "2026-07-07", quantity: 1.5, sourceRecipeId: "r1", recipeName: "Chicken Bowl" }),
      rangeEntry({ id: "c", day: "2026-07-06", foodName: "Apple", calories: 95, proteinG: 0, carbsG: 25, fatG: 0, quantity: 1 }),
    ]);
    expect(rollup).toHaveLength(2);
    const chicken = rollup.find((r) => r.foodName === "Chicken breast");
    expect(chicken?.totalQuantity).toBe(3);
    expect(chicken?.totals.calories).toBe(Math.round(165 * 3));
    expect(chicken?.usedIn.map((u) => u.label)).toContain("Chicken Bowl");
  });

  it("sorts the biggest calorie contributor first", () => {
    const rollup = rollUpIngredients([
      rangeEntry({ id: "a", foodName: "Apple", calories: 95, quantity: 1 }),
      rangeEntry({ id: "b", foodName: "Rice", calories: 200, quantity: 3 }),
    ]);
    expect(rollup[0].foodName).toBe("Rice");
  });
});

describe("summarizeWeekDays", () => {
  it("produces one summary per day in the range, empty days included", () => {
    const range = weekRange("2026-07-08");
    const days = summarizeWeekDays(range, [rangeEntry({ day: "2026-07-06" })]);
    expect(days).toHaveLength(7);
    expect(days[0].day).toBe("2026-07-06");
    expect(days[0].total.calories).toBe(165);
    expect(days[1].total.calories).toBe(0);
  });
});
