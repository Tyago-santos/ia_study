import { createHash, timingSafeEqual } from "node:crypto";

import {
  OAuthError,
  OAuthErrorCode,
  type AuthInfo,
  type OAuthTokenVerifier,
} from "@modelcontextprotocol/server";

/** sha256 do token do endpoint — usada como chave estável da sessão no Supabase. */
export function clientIdFromToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

/**
 * Verificador do bearer do endpoint MCP. Não é OAuth de verdade: o token é
 * estático (MCP_ACCESS_TOKEN) e serve só para proteger o endpoint. A identidade
 * do usuário vem da tool `login`; aqui só derivamos um clientId estável.
 */
export class StaticTokenVerifier implements OAuthTokenVerifier {
  constructor(private readonly expectedToken: string) {}

  async verifyAccessToken(token: string): Promise<AuthInfo> {
    const actual = createHash("sha256").update(token, "utf8").digest();
    const expected = createHash("sha256").update(this.expectedToken, "utf8").digest();
    if (!timingSafeEqual(actual, expected)) {
      throw new OAuthError(OAuthErrorCode.InvalidToken, "Token MCP inválido");
    }

    return {
      token,
      clientId: clientIdFromToken(token),
      scopes: ["studyhub:all"],
      // Bearer-auth exige expiresAt. O token é estático; renovamos a janela
      // a cada requisição para não expirar um cliente saudável.
      expiresAt: Math.floor(Date.now() / 1000) + 3600,
    };
  }
}
