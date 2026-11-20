import type { Express, Request, Response } from "express";
import { z } from "zod";

import { env } from "../config/env.js";
import { BackendClient } from "../lib/backend-client.js";
import type { SessionStore } from "../lib/session-store.js";
import { encrypt } from "../lib/crypto.js";
import { clientIdFromToken } from "../lib/auth-verifier.js";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

// Rate limiter in-memory por IP: 5 tentativas / 15 min.
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX = 5;
const buckets = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || b.resetAt <= now) {
    buckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (b.count >= RATE_MAX) return false;
  b.count += 1;
  return true;
}

const LOGIN_HTML = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Login — StudyHub MCP</title>
  <style>
    :root { color-scheme: dark; }
    body { margin:0; font-family:system-ui,sans-serif; background:#0b0f14; color:#e6edf3; display:flex; min-height:100vh; align-items:center; justify-content:center; }
    .card { background:#161b22; border:1px solid #30363d; border-radius:12px; padding:2rem; width:100%; max-width:420px; box-shadow:0 8px 30px rgba(0,0,0,.4); }
    h1 { margin:0 0 .5rem; font-size:1.4rem; }
    p.sub { color:#8b949e; margin:0 0 1.5rem; font-size:.9rem; }
    label { display:block; margin:.75rem 0 .25rem; font-size:.85rem; color:#8b949e; }
    input { width:100%; box-sizing:border-box; padding:.6rem .75rem; border-radius:8px; border:1px solid #30363d; background:#0d1117; color:#e6edf3; font-size:1rem; }
    input:focus { outline:2px solid #2f81f7; border-color:#2f81f7; }
    button { width:100%; margin-top:1.25rem; padding:.7rem; border:none; border-radius:8px; background:#238636; color:#fff; font-size:1rem; font-weight:600; cursor:pointer; }
    button:disabled { opacity:.6; cursor:not-allowed; }
    .err { color:#f85149; font-size:.85rem; margin-top:.5rem; min-height:1.2em; }
    .ok { background:#0d1117; border:1px solid #30363d; border-radius:8px; padding:.75rem; margin-top:1rem; word-break:break-all; font-family:monospace; font-size:.85rem; }
    .ok label { color:#8b949e; font-size:.75rem; margin:0 0 .25rem; }
    .hint { color:#8b949e; font-size:.75rem; margin-top:1rem; }
  </style>
</head>
<body>
  <div class="card">
    <h1>StudyHub MCP</h1>
    <p class="sub">Login para gerar seu token de acesso ao MCP.</p>
    <form id="f">
      <label for="email">Email</label>
      <input id="email" type="email" required autocomplete="username" />
      <label for="password">Senha</label>
      <input id="password" type="password" required minlength="6" autocomplete="current-password" />
      <button id="btn" type="submit">Entrar</button>
      <div class="err" id="err"></div>
    </form>
    <div id="result" style="display:none">
      <div class="ok">
        <label>Seu token MCP (copie para o config do cliente):</label>
        <div id="token"></div>
      </div>
      <p class="hint">Use no OpenCode: <code>"headers": { "Authorization": "Bearer &lt;token&gt;" }</code></p>
    </div>
  </div>
  <script>
    const f = document.getElementById('f');
    const err = document.getElementById('err');
    const btn = document.getElementById('btn');
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      err.textContent = '';
      btn.disabled = true;
      try {
        const res = await fetch('/login', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
          }),
        });
        const data = await res.json();
        if (!res.ok) { err.textContent = data.message || 'Falha no login'; return; }
        document.getElementById('token').textContent = data.token;
        document.getElementById('result').style.display = 'block';
        f.style.display = 'none';
      } catch (e) {
        err.textContent = 'Erro de rede';
      } finally {
        btn.disabled = false;
      }
    });
  </script>
</body>
</html>`;

export function mountLoginRoutes(app: Express, store: SessionStore, backend: BackendClient) {
  app.get(["/", "/login"], (_req: Request, res: Response) => {
    res.type("html").send(LOGIN_HTML);
  });

  app.post("/login", async (req: Request, res: Response) => {
    const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.ip || "unknown";
    if (!rateLimit(ip)) {
      return res.status(429).json({ message: "Muitas tentativas. Tente novamente em 15 minutos." });
    }

    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Dados inválidos", errors: parsed.error.flatten().fieldErrors });
    }

    try {
      const result = await backend.login(parsed.data.email, parsed.data.password);
      const token = (await import("node:crypto")).randomBytes(32).toString("hex");
      const clientId = clientIdFromToken(token);
      const expiresAt = new Date(Date.now() + env.MCP_SESSION_TTL_HOURS * 60 * 60 * 1000);

      await store.save({
        clientId,
        userId: result.user.id,
        email: result.user.email,
        token: result.token,
        password: parsed.data.password,
        expiresAt,
      });

      return res.json({ token, expiresAt: expiresAt.toISOString(), user: result.user });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Falha no login";
      return res.status(401).json({ message });
    }
  });
}
