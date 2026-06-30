// Tests for the shared ISO-day helpers used by the per-day feature views.

import { describe, expect, it } from "vitest";

import { addDays, formatDay, formatDayShort, isIsoDate, todayIso } from "./iso-date";

describe("isIsoDate", () => {
  it("accepts a well-formed YYYY-MM-DD string", () => {
    expect(isIsoDate("2026-06-29")).toBe(true);
  });

  it("rejects malformed or non-date strings", () => {
    expect(isIsoDate("2026-6-9")).toBe(false);
    expect(isIsoDate("06-29-2026")).toBe(false);
    expect(isIsoDate("not-a-date")).toBe(false);
    expect(isIsoDate("")).toBe(false);
  });
});

describe("addDays", () => {
  it("adds days within a month", () => {
    expect(addDays("2026-06-29", 1)).toBe("2026-06-30");
  });

  it("rolls over a month boundary", () => {
    expect(addDays("2026-06-30", 1)).toBe("2026-07-01");
  });

  it("rolls back across a year boundary with a negative offset", () => {
    expect(addDays("2026-01-01", -1)).toBe("2025-12-31");
  });

  it("handles a leap day", () => {
    expect(addDays("2028-02-28", 1)).toBe("2028-02-29");
  });
});

describe("formatDay", () => {
  it("formats an ISO day as a short weekday and date", () => {
    expect(formatDay("2026-06-29")).toBe("Mon, Jun 29");
  });
});

describe("formatDayShort", () => {
  it("formats an ISO day as a short month and day", () => {
    expect(formatDayShort("2026-06-29")).toBe("Jun 29");
  });
});

describe("todayIso", () => {
  it("returns a valid ISO day string", () => {
    expect(isIsoDate(todayIso())).toBe(true);
  });
});
