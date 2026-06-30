// Tests for water input validation: adding an amount (fluid ounces).

import { describe, expect, it } from "vitest";

import { addWaterSchema } from "./validation";

describe("addWaterSchema", () => {
  it("accepts and coerces a positive amount", () => {
    expect(addWaterSchema.parse({ amountOz: "8" }).amountOz).toBe(8);
  });

  it("rejects zero or negative amounts", () => {
    expect(addWaterSchema.safeParse({ amountOz: "0" }).success).toBe(false);
    expect(addWaterSchema.safeParse({ amountOz: "-5" }).success).toBe(false);
  });

  it("rejects amounts over the per-entry max", () => {
    expect(addWaterSchema.safeParse({ amountOz: "1000" }).success).toBe(false);
  });

  it("rejects non-numeric input", () => {
    expect(addWaterSchema.safeParse({ amountOz: "abc" }).success).toBe(false);
  });
});
