import { describe, expect, it } from "vitest";

import { allTools } from "./index.js";

describe("tool inventory", () => {
  it("has unique names", () => {
    const names = allTools.map((t) => t.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("includes login and core tools", () => {
    const names = allTools.map((t) => t.name);
    expect(names).toContain("login");
    expect(names).toContain("logout");
    expect(names).toContain("session_status");
    expect(names).toContain("list_subjects");
  });

  it("core profile filters down", () => {
    const core = allTools.filter((t) => t.profile === "core");
    const full = allTools.filter((t) => t.profile === "full");
    expect(core.length + full.length).toBe(allTools.length);
    expect(core.length).toBeGreaterThan(0);
  });

  it("total count is ~60", () => {
    expect(allTools.length).toBeGreaterThanOrEqual(50);
    expect(allTools.length).toBeLessThanOrEqual(75);
  });
});
