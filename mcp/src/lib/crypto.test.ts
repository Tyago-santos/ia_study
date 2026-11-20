import { describe, expect, it } from "vitest";

import { decrypt, encrypt } from "./crypto.js";

describe("crypto", () => {
  it("round-trips", () => {
    const secret = "a".repeat(32);
    const value = "jwt-token-123";
    const enc = encrypt(secret, value);
    expect(enc).not.toBe(value);
    expect(decrypt(secret, enc)).toBe(value);
  });

  it("fails on tampered payload", () => {
    const secret = "b".repeat(32);
    const enc = encrypt(secret, "x");
    const tampered = enc.slice(0, -2) + "AA";
    expect(() => decrypt(secret, tampered)).toThrow();
  });

  it("fails with wrong secret", () => {
    const enc = encrypt("c".repeat(32), "x");
    expect(() => decrypt("d".repeat(32), enc)).toThrow();
  });
});
