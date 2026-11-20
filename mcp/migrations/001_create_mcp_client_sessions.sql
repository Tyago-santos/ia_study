-- Aplicada no Supabase (projeto estudy_ia) em 2026-11-20 via Supabase MCP.
-- Espelho local para reprodutividade.
CREATE TABLE IF NOT EXISTS public.mcp_client_sessions (
  client_id          TEXT        PRIMARY KEY,
  user_id            TEXT        NOT NULL,
  email              TEXT        NOT NULL,
  encrypted_token    TEXT        NOT NULL,
  encrypted_password TEXT        NOT NULL,
  expires_at         TIMESTAMPTZ NOT NULL,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS mcp_client_sessions_expires_at_idx
  ON public.mcp_client_sessions (expires_at);
