import { describe, expect, it } from "vitest";

import {
  createSessionToken,
  verifyPassword,
  verifySessionToken,
} from "./session";

const SECRET = "test-secret-at-least-16-chars";

describe("session token", () => {
  it("verifies a freshly created token before expiry", async () => {
    const now = 1_000_000;
    const token = await createSessionToken(SECRET, now + 10_000);
    expect(await verifySessionToken(token, SECRET, now)).toBe(true);
  });

  it("rejects an expired token", async () => {
    const token = await createSessionToken(SECRET, 1_000);
    expect(await verifySessionToken(token, SECRET, 2_000)).toBe(false);
  });

  it("rejects a tampered signature", async () => {
    const token = await createSessionToken(SECRET, 10_000);
    const tampered = token.slice(0, -1) + (token.at(-1) === "0" ? "1" : "0");
    expect(await verifySessionToken(tampered, SECRET, 0)).toBe(false);
  });

  it("rejects a token signed with a different secret", async () => {
    const token = await createSessionToken(SECRET, 10_000);
    expect(await verifySessionToken(token, "different-secret-16", 0)).toBe(false);
  });

  it("rejects a malformed token", async () => {
    expect(await verifySessionToken("garbage", SECRET, 0)).toBe(false);
  });
});

describe("verifyPassword", () => {
  it("accepts the correct password", async () => {
    expect(await verifyPassword("hunter2ish", "hunter2ish", SECRET)).toBe(true);
  });

  it("rejects a wrong password", async () => {
    expect(await verifyPassword("wrong", "hunter2ish", SECRET)).toBe(false);
  });
});
