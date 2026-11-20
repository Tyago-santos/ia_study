export interface BackendUser {
  id: string;
  name: string;
  email: string;
}

export interface LoginResult {
  user: BackendUser;
  token: string;
}

export class BackendError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: unknown,
    message: string,
  ) {
    super(message);
    this.name = "BackendError";
  }
}

export interface BackendRequestOpts {
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  path: string;
  token?: string;
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
}

export class BackendClient {
  constructor(private readonly baseUrl: string) {}

  async login(email: string, password: string): Promise<LoginResult> {
    const res = await fetch(`${this.baseUrl}/auth/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
      signal: AbortSignal.timeout(30_000),
    });

    const text = await res.text();
    let data: unknown = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!res.ok) {
      throw new BackendError(res.status, data, (data as any)?.message ?? "Falha no login");
    }
    return data as LoginResult;
  }

  async request<T = unknown>(opts: BackendRequestOpts, token: string): Promise<T> {
    const url = new URL(this.baseUrl + opts.path);
    if (opts.query) {
      for (const [k, v] of Object.entries(opts.query)) {
        if (v !== undefined) url.searchParams.set(k, String(v));
      }
    }

    const res = await fetch(url.toString(), {
      method: opts.method,
      headers: {
        authorization: `Bearer ${token}`,
        ...(opts.body !== undefined ? { "content-type": "application/json" } : {}),
      },
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
      signal: AbortSignal.timeout(60_000),
    });

    const text = await res.text();
    let data: unknown = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!res.ok) {
      throw new BackendError(res.status, data, (data as any)?.message ?? `HTTP ${res.status}`);
    }
    return data as T;
  }
}
