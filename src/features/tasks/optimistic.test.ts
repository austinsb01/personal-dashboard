// Tests for the optimistic task-list reducer used by the to-do board.

import { describe, expect, it } from "vitest";

import { applyTaskChange, isPendingTask, pendingTaskId } from "./optimistic";

const TASKS = [
  { id: "a", title: "First", day: "2026-11-19", isCompleted: false },
  { id: "b", title: "Second", day: "2026-11-19", isCompleted: true },
];

describe("applyTaskChange", () => {
  it("appends an added task", () => {
    const added = { id: "c", title: "Third", day: "2026-11-20", isCompleted: false };
    const result = applyTaskChange(TASKS, { type: "add", task: added });
    expect(result.map((item) => item.id)).toEqual(["a", "b", "c"]);
  });

  it("sets completion and day on a toggled task", () => {
    const result = applyTaskChange(TASKS, {
      type: "toggle",
      id: "a",
      isCompleted: true,
      day: "2026-11-21",
    });
    expect(result[0]).toEqual({
      id: "a",
      title: "First",
      day: "2026-11-21",
      isCompleted: true,
    });
    expect(result[1]).toBe(TASKS[1]);
  });

  it("drops a removed task", () => {
    const result = applyTaskChange(TASKS, { type: "remove", id: "a" });
    expect(result.map((item) => item.id)).toEqual(["b"]);
  });

  it("does not mutate the input list", () => {
    const snapshot = structuredClone(TASKS);
    applyTaskChange(TASKS, { type: "toggle", id: "a", isCompleted: true, day: "2026-11-19" });
    applyTaskChange(TASKS, { type: "remove", id: "b" });
    expect(TASKS).toEqual(snapshot);
  });
});

describe("pending task ids", () => {
  it("marks generated ids as pending and real ids as not", () => {
    expect(isPendingTask({ id: pendingTaskId(1) })).toBe(true);
    expect(isPendingTask({ id: "5b0f3c1e-8f4a-4f0e-9d53-2f1c8a6f7b10" })).toBe(false);
  });
});
