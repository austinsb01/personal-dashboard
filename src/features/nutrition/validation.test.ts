// Tests for nutrition input validation: logging a food into a day's meal.

import { describe, expect, it } from "vitest";

import { logEntrySchema } from "./validation";

const valid = {
  name: "Oatmeal",
  servingLabel: "1 cup",
  calories: "300",
  proteinG: "10",
  carbsG: "54",
  fatG: "5",
  mealType: "breakfast",
  quantity: "1.5",
};

describe("logEntrySchema", () => {
  it("accepts and coerces a well-formed entry", () => {
    const parsed = logEntrySchema.parse(valid);
    expect(parsed.calories).toBe(300);
    expect(parsed.quantity).toBe(1.5);
    expect(parsed.mealType).toBe("breakfast");
  });

  it("trims the food name", () => {
    const parsed = logEntrySchema.parse({ ...valid, name: "  Oatmeal  " });
    expect(parsed.name).toBe("Oatmeal");
  });

  it("rejects an empty food name", () => {
    expect(logEntrySchema.safeParse({ ...valid, name: "   " }).success).toBe(false);
  });

  it("rejects an empty serving label", () => {
    expect(logEntrySchema.safeParse({ ...valid, servingLabel: "" }).success).toBe(false);
  });

  it("rejects negative calories", () => {
    expect(logEntrySchema.safeParse({ ...valid, calories: "-1" }).success).toBe(false);
  });

  it("rejects negative macros", () => {
    expect(logEntrySchema.safeParse({ ...valid, proteinG: "-5" }).success).toBe(false);
  });

  it("rejects a non-positive quantity", () => {
    expect(logEntrySchema.safeParse({ ...valid, quantity: "0" }).success).toBe(false);
  });

  it("rejects an unknown meal type", () => {
    expect(logEntrySchema.safeParse({ ...valid, mealType: "brunch" }).success).toBe(false);
  });
});
