import { describe, it, expect } from "vitest";

import { addDays } from "./date";

describe("addDays", () => {
  it("adds and subtracts days across month and year boundaries", () => {
    expect(addDays("2026-06-29", 1)).toBe("2026-06-30");
    expect(addDays("2026-06-30", 1)).toBe("2026-07-01");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
    expect(addDays("2026-01-01", -1)).toBe("2025-12-31");
  });
});
