// Tests for the day-series fill helper.

import { describe, expect, it } from "vitest";

import { fillDays } from "./series";

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
