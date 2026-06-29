import { describe, it, expect } from "vitest";

import { createTaskSchema } from "./validation";

describe("createTaskSchema", () => {
  it("accepts a task with just a title and defaults priority to medium", () => {
    const result = createTaskSchema.parse({ title: "Buy groceries" });
    expect(result.title).toBe("Buy groceries");
    expect(result.priority).toBe("medium");
  });

  it("trims surrounding whitespace from the title", () => {
    const result = createTaskSchema.parse({ title: "  Walk dog  " });
    expect(result.title).toBe("Walk dog");
  });

  it("rejects a title that is empty or whitespace only", () => {
    expect(() => createTaskSchema.parse({ title: "   " })).toThrow();
  });

  it("rejects a title longer than 200 characters", () => {
    expect(() => createTaskSchema.parse({ title: "a".repeat(201) })).toThrow();
  });

  it("accepts a valid priority value", () => {
    const result = createTaskSchema.parse({ title: "Task", priority: "high" });
    expect(result.priority).toBe("high");
  });

  it("rejects an unknown priority value", () => {
    expect(() =>
      createTaskSchema.parse({ title: "Task", priority: "urgent" }),
    ).toThrow();
  });

  it("accepts a null due date", () => {
    const result = createTaskSchema.parse({ title: "Task", dueDate: null });
    expect(result.dueDate).toBeNull();
  });
});
