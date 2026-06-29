import { describe, it, expect } from "vitest";

import {
  startWorkoutSchema,
  addSetSchema,
  addCardioSchema,
} from "./validation";

describe("startWorkoutSchema", () => {
  it("trims the workout day and rejects empty", () => {
    expect(startWorkoutSchema.parse({ workoutDay: "  Chest day  " }).workoutDay).toBe(
      "Chest day",
    );
    expect(() => startWorkoutSchema.parse({ workoutDay: "  " })).toThrow();
  });
});

describe("addSetSchema", () => {
  it("accepts a valid set and coerces numeric strings", () => {
    expect(
      addSetSchema.parse({ exercise: "Bench Press", reps: "10", weight: "135.5" }),
    ).toEqual({ exercise: "Bench Press", reps: 10, weight: 135.5 });
  });

  it("rejects non-positive reps, negative weight, and missing exercise", () => {
    expect(() => addSetSchema.parse({ exercise: "Bench", reps: 0, weight: 100 })).toThrow();
    expect(() => addSetSchema.parse({ exercise: "Bench", reps: 5, weight: -1 })).toThrow();
    expect(() => addSetSchema.parse({ exercise: "  ", reps: 5, weight: 100 })).toThrow();
  });
});

describe("addCardioSchema", () => {
  it("accepts duration and optional distance", () => {
    expect(
      addCardioSchema.parse({ exercise: "Running", durationMinutes: "30", distance: "5" }),
    ).toEqual({ exercise: "Running", durationMinutes: 30, distance: 5 });
    expect(
      addCardioSchema.parse({ exercise: "Running", durationMinutes: 20, distance: null })
        .distance,
    ).toBeNull();
  });

  it("rejects non-positive duration", () => {
    expect(() => addCardioSchema.parse({ exercise: "Running", durationMinutes: 0 })).toThrow();
  });
});
