import { describe, it, expect } from "vitest";

import { startTimerSchema } from "./validation";

describe("startTimerSchema", () => {
  it("accepts and trims an activity", () => {
    expect(startTimerSchema.parse({ activity: "  Coding  " }).activity).toBe(
      "Coding",
    );
  });

  it("rejects an empty or whitespace-only activity", () => {
    expect(() => startTimerSchema.parse({ activity: "   " })).toThrow();
  });

  it("rejects an activity longer than 120 characters", () => {
    expect(() => startTimerSchema.parse({ activity: "a".repeat(121) })).toThrow();
  });
});
