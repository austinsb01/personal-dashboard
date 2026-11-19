// Tests for the month-grid date math behind the to-do calendar.

import { describe, expect, it } from "vitest";

import {
  addMonths,
  formatMonth,
  isSameMonth,
  monthGrid,
  monthStart,
} from "./calendar";

describe("monthStart", () => {
  it("returns the first day of the day's month", () => {
    expect(monthStart("2026-11-19")).toBe("2026-11-01");
  });
});

describe("addMonths", () => {
  it("moves forward to the first of the next month", () => {
    expect(addMonths("2026-11-19", 1)).toBe("2026-12-01");
  });

  it("rolls back across a year boundary", () => {
    expect(addMonths("2026-01-15", -1)).toBe("2025-12-01");
  });

  it("does not skip a short month from a long month's last day", () => {
    expect(addMonths("2026-01-31", 1)).toBe("2026-02-01");
  });
});

describe("isSameMonth", () => {
  it("is true for two days in one month", () => {
    expect(isSameMonth("2026-11-01", "2026-11-30")).toBe(true);
  });

  it("is false across a month boundary", () => {
    expect(isSameMonth("2026-11-30", "2026-12-01")).toBe(false);
  });
});

describe("formatMonth", () => {
  it("formats the month and year", () => {
    expect(formatMonth("2026-11-01")).toBe("November 2026");
  });
});

describe("monthGrid", () => {
  it("starts on the month's first day when that is a Sunday", () => {
    const weeks = monthGrid("2026-11-19");
    expect(weeks[0][0]).toBe("2026-11-01");
  });

  it("pads the first and last weeks with adjacent-month days", () => {
    const weeks = monthGrid("2026-10-10");
    expect(weeks[0]).toEqual([
      "2026-09-27",
      "2026-09-28",
      "2026-09-29",
      "2026-09-30",
      "2026-10-01",
      "2026-10-02",
      "2026-10-03",
    ]);
    expect(weeks.at(-1)?.at(-1)).toBe("2026-10-31");
  });

  it("returns only full seven-day weeks", () => {
    const weeks = monthGrid("2026-11-19");
    expect(weeks).toHaveLength(5);
    expect(weeks.every((week) => week.length === 7)).toBe(true);
    expect(weeks.at(-1)?.at(-1)).toBe("2026-12-05");
  });

  it("covers a month that spans six weeks", () => {
    expect(monthGrid("2026-08-15")).toHaveLength(6);
  });
});
