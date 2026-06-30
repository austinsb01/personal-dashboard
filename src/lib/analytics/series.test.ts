// Tests for the day-series fill helper.

import { describe, expect, it } from "vitest";

import { fillDays, pivotDays, weekAxis } from "./series";

describe("fillDays", () => {
  const days = ["2026-06-28", "2026-06-29", "2026-06-30"];
  const empty = { calories: 0 };

  it("returns one row per axis day, in order", () => {
    const filled = fillDays(days, [{ day: "2026-06-29", calories: 500 }], empty);
    expect(filled.map((row) => row.day)).toEqual(days);
  });

  it("keeps values for days that have data", () => {
    const filled = fillDays(days, [{ day: "2026-06-29", calories: 500 }], empty);
    expect(filled[1]).toEqual({ day: "2026-06-29", calories: 500 });
  });

  it("fills missing days with the empty value", () => {
    const filled = fillDays(days, [{ day: "2026-06-29", calories: 500 }], empty);
    expect(filled[0]).toEqual({ day: "2026-06-28", calories: 0 });
    expect(filled[2]).toEqual({ day: "2026-06-30", calories: 0 });
  });
});

describe("pivotDays", () => {
  const days = ["2026-06-29", "2026-06-30"];
  const rows = [
    { day: "2026-06-29", key: "Work", value: 2 },
    { day: "2026-06-29", key: "Reading", value: 1 },
    { day: "2026-06-30", key: "Work", value: 3 },
  ];

  it("lists the distinct keys sorted", () => {
    expect(pivotDays(days, rows).keys).toEqual(["Reading", "Work"]);
  });

  it("produces one row per day with a column per key, zero when absent", () => {
    const { data } = pivotDays(days, rows);
    expect(data).toEqual([
      { day: "2026-06-29", Work: 2, Reading: 1 },
      { day: "2026-06-30", Work: 3, Reading: 0 },
    ]);
  });
});

describe("weekAxis", () => {
  it("lists Monday-aligned week starts covering the window", () => {
    // 2026-06-29 is a Monday; 2026-07-12 is a Sunday.
    expect(weekAxis("2026-06-29", "2026-07-12")).toEqual([
      "2026-06-29",
      "2026-07-06",
    ]);
  });

  it("includes the week that contains a mid-week start", () => {
    expect(weekAxis("2026-07-01", "2026-07-05")).toEqual(["2026-06-29"]);
  });
});
