import { describe, expect, it } from "vitest";

import { SessionStore, type Queryable } from "./session-store.js";

function makePool() {
  const rows = new Map<string, any>();
  const pool: Queryable = {
    async query(text, values) {
      if (text.startsWith("INSERT")) {
        const [clientId, userId, email, encToken, encPass, expiresAt] = values as any[];
        rows.set(clientId, {
          client_id: clientId,
          user_id: userId,
          email,
          encrypted_token: encToken,
          encrypted_password: encPass,
          expires_at: expiresAt,
        });
        return { rows: [], rowCount: 1 };
      }
      if (text.startsWith("SELECT")) {
        const [clientId] = values as any[];
        const r = rows.get(clientId);
        return { rows: r ? [r] : [], rowCount: r ? 1 : 0 };
      }
      if (text.startsWith("DELETE") && text.includes("expires_at")) {
        let n = 0;
        for (const [k, v] of rows) {
          if (new Date(v.expires_at).getTime() <= Date.now()) {
            rows.delete(k);
            n++;
          }
        }
        return { rows: [], rowCount: n };
      }
      if (text.startsWith("DELETE")) {
        const [clientId] = values as any[];
        const existed = rows.delete(clientId);
        return { rows: [], rowCount: existed ? 1 : 0 };
      }
      throw new Error("unexpected query: " + text);
    },
  };
  return { pool, rows };
}

describe("SessionStore", () => {
  it("saves and retrieves a session", async () => {
    const { pool } = makePool();
    const store = new SessionStore(pool, "s".repeat(32));
    const expiresAt = new Date(Date.now() + 60_000);
    await store.save({
      clientId: "c1",
      userId: "u1",
      email: "a@b.com",
      token: "tok",
      password: "pw",
      expiresAt,
    });
    const got = await store.get("c1");
    expect(got).not.toBeNull();
    expect(got!.token).toBe("tok");
    expect(got!.password).toBe("pw");
    expect(got!.email).toBe("a@b.com");
  });

  it("returns null and deletes expired session", async () => {
    const { pool } = makePool();
    const store = new SessionStore(pool, "s".repeat(32));
    await store.save({
      clientId: "c2",
      userId: "u2",
      email: "x@y.com",
      token: "t",
      password: "p",
      expiresAt: new Date(Date.now() - 1000),
    });
    expect(await store.get("c2")).toBeNull();
  });

  it("delete removes session", async () => {
    const { pool } = makePool();
    const store = new SessionStore(pool, "s".repeat(32));
    await store.save({ clientId: "c3", userId: "u", email: "e", token: "t", password: "p", expiresAt: new Date(Date.now() + 60_000) });
    await store.delete("c3");
    expect(await store.get("c3")).toBeNull();
  });
});
