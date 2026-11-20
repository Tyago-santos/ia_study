import type { Request, Response, NextFunction } from "express";

interface Bucket {
  count: number;
  resetAt: number;
}

interface Options {
  windowMs: number;
  max: number;
  keyFn?: (req: Request) => string;
  message?: string;
}

/**
 * Rate limiter em memória (por instância). Adequado para Render free tier
 * (single instance). Para múltiplas instâncias, trocar por Redis.
 */
export function createRateLimiter(opts: Options) {
  const buckets = new Map<string, Bucket>();
  const keyFn = opts.keyFn ?? ((req) => (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.ip || "unknown");
  const message = opts.message ?? "Muitas requisições. Tente novamente mais tarde.";

  // Limpeza oportunista de buckets expirados.
  setInterval(() => {
    const now = Date.now();
    for (const [k, b] of buckets) {
      if (b.resetAt <= now) buckets.delete(k);
    }
  }, 60_000).unref();

  return (req: Request, res: Response, next: NextFunction) => {
    const key = keyFn(req);
    const now = Date.now();
    let b = buckets.get(key);
    if (!b || b.resetAt <= now) {
      b = { count: 0, resetAt: now + opts.windowMs };
      buckets.set(key, b);
    }
    b.count += 1;
    if (b.count > opts.max) {
      const retryAfter = Math.ceil((b.resetAt - now) / 1000);
      res.setHeader("Retry-After", String(retryAfter));
      return res.status(429).json({ message });
    }
    next();
  };
}
