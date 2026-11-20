# estudy-ia-mcp — MCP Tutor do StudyHub AI

Servidor MCP remoto (HTTP/SSE) que expõe as funcionalidades do StudyHub AI como
ferramentas para um agente de IA estudar junto com o usuário.

## Arquitetura

- SDK MCP v2 (`@modelcontextprotocol/server` 2.4.0), handler stateless por requisição
  (`createMcpHandler` + `toNodeHandler`), compatível com sleep do Render free.
- Endpoint `/mcp` protegido por bearer token estático (`MCP_ACCESS_TOKEN`).
- Identidade do usuário via tool `login` (email/senha) → `POST /auth/login` do backend.
  JWT + senha ficam cifrados (AES-256-GCM) no Supabase, chaveados por
  `clientId = sha256(MCP_ACCESS_TOKEN)`. Re-login automático em 401.
- Tabela `public.mcp_client_sessions` (ver `migrations/`).

## Desenvolvimento

```bash
cp .env.example .env
# preencha as variáveis
npm install
npm run dev
```

## Testes

```bash
npm run test:run
npm run typecheck
npm run build
```

## Deploy

Serviço `estudy-ia-mcp` no `render.yaml` (Docker). Configure no Render:
`DATABASE_URL`, `MCP_ACCESS_TOKEN`, `MCP_SESSION_SECRET` (sync: false).

## Configuração do cliente (OpenCode global)

```jsonc
{
  "mcp": {
    "studyhub": {
      "type": "http",
      "url": "https://estudy-ia-mcp.onrender.com/mcp",
      "headers": { "Authorization": "Bearer <MCP_ACCESS_TOKEN>" }
    }
  }
}
```
