// Tests for daily-targets validation.

import { describe, expect, it } from "vitest";

import { targetsSchema } from "./validation";

const valid = {
  waterOz: "64",
  calories: "2000",
  proteinG: "150",
  carbsG: "200",
  fatG: "60",
};

describe("targetsSchema", () => {
  it("accepts and coerces valid targets", () => {
    const parsed = targetsSchema.parse(valid);
    expect(parsed.calories).toBe(2000);
    expect(parsed.waterOz).toBe(64);
  });

  it("rejects a non-positive water goal", () => {
    expect(targetsSchema.safeParse({ ...valid, waterOz: "0" }).success).toBe(false);
  });

  it("rejects a non-positive calorie goal", () => {
    expect(targetsSchema.safeParse({ ...valid, calories: "0" }).success).toBe(false);
  });

  it("allows a zero macro goal", () => {
    expect(targetsSchema.safeParse({ ...valid, carbsG: "0" }).success).toBe(true);
  });

  it("rejects negative macros", () => {
    expect(targetsSchema.safeParse({ ...valid, proteinG: "-1" }).success).toBe(false);
  });

  it("rejects values over the max", () => {
    expect(targetsSchema.safeParse({ ...valid, waterOz: "99999" }).success).toBe(false);
  });
});
