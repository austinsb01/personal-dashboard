// Tests for the task input schemas validated at the server-action boundary.

import { describe, expect, it } from "vitest";

import { createTaskSchema, taskDaySchema, toggleTaskSchema } from "./validation";

const TASK_ID = "5b0f3c1e-8f4a-4f0e-9d53-2f1c8a6f7b10";

describe("taskDaySchema", () => {
  it("accepts a real calendar day", () => {
    expect(taskDaySchema.parse("2026-11-19")).toBe("2026-11-19");
  });

  it("rejects malformed and impossible days", () => {
    expect(taskDaySchema.safeParse("2026-13-45").success).toBe(false);
    expect(taskDaySchema.safeParse("2026-02-30").success).toBe(false);
    expect(taskDaySchema.safeParse("11/19/2026").success).toBe(false);
    expect(taskDaySchema.safeParse("").success).toBe(false);
  });
});

describe("createTaskSchema", () => {
  it("accepts a title and a day", () => {
    const result = createTaskSchema.parse({ title: "Buy groceries", day: "2026-11-19" });
    expect(result).toEqual({ title: "Buy groceries", day: "2026-11-19" });
  });

  it("trims surrounding whitespace from the title", () => {
    const result = createTaskSchema.parse({ title: "  Walk dog  ", day: "2026-11-19" });
    expect(result.title).toBe("Walk dog");
  });

  it("rejects a title that is empty or whitespace only", () => {
    expect(createTaskSchema.safeParse({ title: "   ", day: "2026-11-19" }).success).toBe(false);
  });

  it("rejects a title longer than 200 characters", () => {
    const result = createTaskSchema.safeParse({ title: "a".repeat(201), day: "2026-11-19" });
    expect(result.success).toBe(false);
  });

  it("rejects a missing or invalid day", () => {
    expect(createTaskSchema.safeParse({ title: "Task" }).success).toBe(false);
    expect(createTaskSchema.safeParse({ title: "Task", day: "tomorrow" }).success).toBe(false);
  });
});

describe("toggleTaskSchema", () => {
  it("accepts an id, a completion flag, and a day", () => {
    const input = { id: TASK_ID, isCompleted: true, day: "2026-11-19" };
    expect(toggleTaskSchema.parse(input)).toEqual(input);
  });

  it("rejects a non-uuid id", () => {
    const result = toggleTaskSchema.safeParse({ id: "42", isCompleted: true, day: "2026-11-19" });
    expect(result.success).toBe(false);
  });

  it("rejects a non-boolean completion flag", () => {
    const result = toggleTaskSchema.safeParse({ id: TASK_ID, isCompleted: "yes", day: "2026-11-19" });
    expect(result.success).toBe(false);
  });
});
