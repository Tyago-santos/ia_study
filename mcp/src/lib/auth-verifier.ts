import { createHash, timingSafeEqual } from "node:crypto";

import {
  OAuthError,
  OAuthErrorCode,
  type AuthInfo,
  type OAuthTokenVerifier,
} from "@modelcontextprotocol/server";

import type { SessionStore } from "./session-store.js";

export function clientIdFromToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

/**
 * Verificador do bearer do endpoint MCP. Aceita:
 *  - o token estático (MCP_ACCESS_TOKEN) — usado pelo admin/CLI;
 *  - qualquer token gerado pela página web de login (lookup no Supabase).
 */
export class StaticTokenVerifier implements OAuthTokenVerifier {
  constructor(
    private readonly staticToken: string,
    private readonly store: SessionStore,
  ) {}

  async verifyAccessToken(token: string): Promise<AuthInfo> {
    // 1) token estático (admin)
    const actual = createHash("sha256").update(token, "utf8").digest();
    const expected = createHash("sha256").update(this.staticToken, "utf8").digest();
    if (timingSafeEqual(actual, expected)) {
      return {
        token,
        clientId: clientIdFromToken(token),
        scopes: ["studyhub:all"],
        expiresAt: Math.floor(Date.now() / 1000) + 3600,
      };
    }

    // 2) token gerado pela página web
    const session = await this.store.get(clientIdFromToken(token));
    if (!session) {
      throw new OAuthError(OAuthErrorCode.InvalidToken, "Token MCP inválido ou expirado");
    }

    return {
      token,
      clientId: clientIdFromToken(token),
      scopes: ["studyhub:all"],
      expiresAt: Math.floor(session.expiresAt.getTime() / 1000),
    };
  }
}
