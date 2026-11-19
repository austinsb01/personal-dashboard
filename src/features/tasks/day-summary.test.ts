// Tests for the per-day task rules: carry-over, grouping, and the heat level.

import { describe, expect, it } from "vitest";

import {
  effectiveDay,
  intensityLevel,
  isPastDay,
  summarizeDays,
  tasksForDay,
} from "./day-summary";

const TODAY = "2026-11-19";

function task(id: string, day: string, isCompleted: boolean) {
  return { id, title: id, day, isCompleted };
}

describe("isPastDay", () => {
  it("is true only for days before today", () => {
    expect(isPastDay("2026-11-18", TODAY)).toBe(true);
    expect(isPastDay(TODAY, TODAY)).toBe(false);
    expect(isPastDay("2026-11-20", TODAY)).toBe(false);
  });
});

describe("effectiveDay", () => {
  it("carries an unfinished past task over to today", () => {
    expect(effectiveDay(task("a", "2026-11-10", false), TODAY)).toBe(TODAY);
  });

  it("keeps a finished past task on the day it was done", () => {
    expect(effectiveDay(task("a", "2026-11-10", true), TODAY)).toBe("2026-11-10");
  });

  it("keeps an unfinished future task on its planned day", () => {
    expect(effectiveDay(task("a", "2026-11-25", false), TODAY)).toBe("2026-11-25");
  });
});

describe("tasksForDay", () => {
  it("returns the day's tasks plus carried-over ones for today", () => {
    const tasks = [
      task("old-open", "2026-11-10", false),
      task("old-done", "2026-11-10", true),
      task("today-open", TODAY, false),
    ];
    expect(tasksForDay(tasks, TODAY, TODAY).map((item) => item.id)).toEqual([
      "old-open",
      "today-open",
    ]);
    expect(tasksForDay(tasks, "2026-11-10", TODAY).map((item) => item.id)).toEqual([
      "old-done",
    ]);
  });
});

describe("summarizeDays", () => {
  it("counts done and total tasks per effective day", () => {
    const summaries = summarizeDays(
      [
        task("a", "2026-11-10", true),
        task("b", "2026-11-10", true),
        task("c", "2026-11-10", false),
        task("d", TODAY, true),
      ],
      TODAY,
    );
    expect(summaries.get("2026-11-10")).toEqual({ done: 2, total: 2 });
    expect(summaries.get(TODAY)).toEqual({ done: 1, total: 2 });
  });

  it("has no entry for a day without tasks", () => {
    expect(summarizeDays([], TODAY).get(TODAY)).toBeUndefined();
  });
});

describe("intensityLevel", () => {
  it("is zero when nothing was done", () => {
    expect(intensityLevel(0)).toBe(0);
  });

  it("steps up as more gets done", () => {
    expect(intensityLevel(1)).toBe(1);
    expect(intensityLevel(3)).toBe(2);
    expect(intensityLevel(5)).toBe(3);
  });

  it("caps at the top level", () => {
    expect(intensityLevel(7)).toBe(4);
    expect(intensityLevel(40)).toBe(4);
  });
});
