import { describe, it, expect } from "vitest";

import { createGoalSchema, goalProgressSchema } from "./validation";

describe("createGoalSchema", () => {
  it("accepts a goal with just a title", () => {
    const result = createGoalSchema.parse({ title: "Run a marathon" });
    expect(result.title).toBe("Run a marathon");
  });

  it("trims the title and rejects an empty one", () => {
    expect(createGoalSchema.parse({ title: "  Read 12 books  " }).title).toBe(
      "Read 12 books",
    );
    expect(() => createGoalSchema.parse({ title: "   " })).toThrow();
  });

  it("accepts an optional description and target date", () => {
    const result = createGoalSchema.parse({
      title: "Save money",
      description: "Build a 6-month emergency fund",
      targetDate: null,
    });
    expect(result.description).toBe("Build a 6-month emergency fund");
    expect(result.targetDate).toBeNull();
  });

  it("rejects a description longer than 2000 characters", () => {
    expect(() =>
      createGoalSchema.parse({ title: "Goal", description: "a".repeat(2001) }),
    ).toThrow();
  });
});

describe("goalProgressSchema", () => {
  it("accepts 0 and 100 and coerces numeric strings", () => {
    expect(goalProgressSchema.parse(0)).toBe(0);
    expect(goalProgressSchema.parse(100)).toBe(100);
    expect(goalProgressSchema.parse("50")).toBe(50);
  });

  it("rejects out-of-range and non-integer values", () => {
    expect(() => goalProgressSchema.parse(-1)).toThrow();
    expect(() => goalProgressSchema.parse(101)).toThrow();
    expect(() => goalProgressSchema.parse(33.5)).toThrow();
  });
});
