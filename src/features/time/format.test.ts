import { describe, it, expect } from "vitest";

import { formatClock, formatDuration } from "./format";

describe("formatClock", () => {
  it("formats seconds as H:MM:SS", () => {
    expect(formatClock(0)).toBe("0:00:00");
    expect(formatClock(65)).toBe("0:01:05");
    expect(formatClock(3661)).toBe("1:01:01");
  });
});

describe("formatDuration", () => {
  it("formats a human-readable duration", () => {
    expect(formatDuration(0)).toBe("<1m");
    expect(formatDuration(59)).toBe("<1m");
    expect(formatDuration(60)).toBe("1m");
    expect(formatDuration(1500)).toBe("25m");
    expect(formatDuration(3600)).toBe("1h 0m");
    expect(formatDuration(5400)).toBe("1h 30m");
  });
});
