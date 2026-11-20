import { McpServer } from "@modelcontextprotocol/server";

import { env } from "../config/env.js";
import type { BackendClient } from "../lib/backend-client.js";
import type { SessionStore } from "../lib/session-store.js";
import { allTools } from "../tools/index.js";
import { registerTools } from "../tools/types.js";
import type { ToolContext } from "../tools/types.js";

export function createServerFactory(store: SessionStore, backend: BackendClient) {
  return (mcpCtx: { authInfo?: { clientId: string } }) => {
    const server = new McpServer(
      { name: "studyhub-mcp", version: "1.0.0" },
      { capabilities: { tools: {} } },
    );

    const clientId = mcpCtx.authInfo?.clientId ?? "anonymous";
    const toolCtx: ToolContext = { clientId, store, backend, session: null };
    registerTools(server, allTools, toolCtx, env.MCP_TOOL_PROFILE);
    return server;
  };
}
