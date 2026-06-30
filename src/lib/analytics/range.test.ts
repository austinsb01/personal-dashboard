// Tests for the analytics date-range helpers.

import { describe, expect, it } from "vitest";

import {
  DEFAULT_RANGE,
  RANGE_OPTIONS,
  dayAxis,
  parseRange,
  rangeWindow,
} from "./range";

describe("parseRange", () => {
  it("accepts the supported range keys", () => {
    for (const key of RANGE_OPTIONS) {
      expect(parseRange(key)).toBe(key);
    }
  });

  it("falls back to the default for unknown or missing values", () => {
    expect(parseRange("abc")).toBe(DEFAULT_RANGE);
    expect(parseRange(undefined)).toBe(DEFAULT_RANGE);
    expect(parseRange("365")).toBe(DEFAULT_RANGE);
  });
});

describe("rangeWindow", () => {
  it("returns an inclusive window of `range` days ending on the given day", () => {
    expect(rangeWindow("7", "2026-06-30")).toEqual({
      from: "2026-06-24",
      to: "2026-06-30",
    });
  });

  it("spans a month boundary correctly", () => {
    expect(rangeWindow("30", "2026-06-30").from).toBe("2026-06-01");
  });
});

describe("dayAxis", () => {
  it("lists every day from start to end inclusive", () => {
    const days = dayAxis("2026-06-28", "2026-06-30");
    expect(days).toEqual(["2026-06-28", "2026-06-29", "2026-06-30"]);
  });

  it("produces one entry per day for the window length", () => {
    const { from, to } = rangeWindow("30", "2026-06-30");
    expect(dayAxis(from, to)).toHaveLength(30);
  });
});
