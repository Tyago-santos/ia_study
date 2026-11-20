import express from "express";
import pg from "pg";

import { createMcpExpressApp, requireBearerAuth } from "@modelcontextprotocol/express";
import { toNodeHandler } from "@modelcontextprotocol/node";
import { createMcpHandler } from "@modelcontextprotocol/server";

import { env } from "./config/env.js";
import { BackendClient } from "./lib/backend-client.js";
import { SessionStore } from "./lib/session-store.js";
import { StaticTokenVerifier } from "./lib/auth-verifier.js";
import { createServerFactory } from "./mcp/build-server.js";

const pool = new pg.Pool({ connectionString: env.DATABASE_URL });
const store = new SessionStore(pool, env.MCP_SESSION_SECRET);
const backend = new BackendClient(env.BACKEND_URL);
const factory = createServerFactory(store, backend);
const verifier = new StaticTokenVerifier(env.MCP_ACCESS_TOKEN);

const app = createMcpExpressApp({
  host: "0.0.0.0",
  allowedHosts: [env.MCP_PUBLIC_HOST],
});

app.use("/mcp", requireBearerAuth({ verifier }));

const handler = createMcpHandler(factory);
app.all("/mcp", toNodeHandler(handler));

app.get("/health", (_req, res) => {
  res.json({ ok: true, profile: env.MCP_TOOL_PROFILE });
});

// Limpeza oportunista de sessões expiradas.
const cleanupTimer = setInterval(() => {
  store.cleanupExpired().catch(() => undefined);
}, 60 * 60 * 1000);
cleanupTimer.unref();

const server = app.listen(env.PORT, () => {
  console.log(`studyhub-mcp listening on port ${env.PORT}`);
});

const shutdown = () => {
  server.close(() => {
    pool.end().finally(() => process.exit(0));
  });
};
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
