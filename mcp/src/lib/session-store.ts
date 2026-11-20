import pg from "pg";

import { decrypt, encrypt } from "./crypto.js";

const { Pool } = pg;

export interface Queryable {
  query(text: string, values?: readonly unknown[]): Promise<{ rows: Array<Record<string, unknown>>; rowCount?: number | null }>;
}

export interface SessionInput {
  clientId: string;
  userId: string;
  email: string;
  token: string;
  password: string;
  expiresAt: Date;
}

export interface StoredSession extends SessionInput {}

interface SessionRow {
  client_id: string;
  user_id: string;
  email: string;
  encrypted_token: string;
  encrypted_password: string;
  expires_at: Date | string;
}

/**
 * Sessão de login persistida no Supabase, chaveada pelo clientId do token
 * MCP (sha256 do bearer). Stateless no transporte: sobrevive a cold starts
 * do Render free. Token e senha ficam cifrados em repouso (AES-256-GCM).
 */
export class SessionStore {
  constructor(
    private readonly pool: Queryable,
    private readonly secret: string,
  ) {}

  async save(session: SessionInput): Promise<void> {
    await this.pool.query(
      `INSERT INTO public.mcp_client_sessions
         (client_id, user_id, email, encrypted_token, encrypted_password, expires_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, now())
       ON CONFLICT (client_id) DO UPDATE SET
         user_id = EXCLUDED.user_id,
         email = EXCLUDED.email,
         encrypted_token = EXCLUDED.encrypted_token,
         encrypted_password = EXCLUDED.encrypted_password,
         expires_at = EXCLUDED.expires_at,
         updated_at = now()`,
      [
        session.clientId,
        session.userId,
        session.email,
        encrypt(this.secret, session.token),
        encrypt(this.secret, session.password),
        session.expiresAt,
      ],
    );
  }

  /** Retorna a sessão válida ou null (e apaga a linha expirada). */
  async get(clientId: string): Promise<StoredSession | null> {
    const result = await this.pool.query(
      `SELECT client_id, user_id, email, encrypted_token, encrypted_password, expires_at
         FROM public.mcp_client_sessions
        WHERE client_id = $1`,
      [clientId],
    );

    const row = result.rows[0] as unknown as SessionRow | undefined;
    if (!row) return null;

    if (new Date(row.expires_at).getTime() <= Date.now()) {
      await this.delete(clientId);
      return null;
    }

    return {
      clientId: row.client_id,
      userId: row.user_id,
      email: row.email,
      token: decrypt(this.secret, row.encrypted_token),
      password: decrypt(this.secret, row.encrypted_password),
      expiresAt: new Date(row.expires_at),
    };
  }

  async delete(clientId: string): Promise<void> {
    await this.pool.query(
      "DELETE FROM public.mcp_client_sessions WHERE client_id = $1",
      [clientId],
    );
  }

  /** Limpeza oportunista de linhas expiradas. */
  async cleanupExpired(): Promise<number> {
    const result = await this.pool.query(
      "DELETE FROM public.mcp_client_sessions WHERE expires_at <= now()",
    );
    return result.rowCount ?? 0;
  }

  async close(): Promise<void> {
    if (this.pool instanceof Pool) await this.pool.end();
  }
}
