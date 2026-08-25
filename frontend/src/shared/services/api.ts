const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002'

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  /** Sobrescreve o timeout padrao de 10s — chamadas de IA demoram mais. */
  timeoutMs?: number
}

class ApiError extends Error {
  status: number
  data: unknown

  constructor(status: number, message: string, data?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

class OfflineError extends Error {
  constructor() {
    super('Servidor indisponível')
    this.name = 'OfflineError'
  }
}

/**
 * O token de sessao vive num cookie httpOnly (setado pelo backend no
 * login/registro) — o JS nunca o ve, entao nao ha nada pra ler/mandar aqui
 * alem de `credentials: 'include'`, que manda o cookie automaticamente.
 *
 * Quem quiser reagir a uma sessao expirada (401) registra um handler aqui em
 * vez deste arquivo importar a store de auth direto — evitaria um ciclo de
 * import (store chama `api` pra checar/logout, `api` chamaria a store de volta).
 */
let onUnauthorized: (() => void) | null = null

export function setUnauthorizedHandler(handler: () => void): void {
  onUnauthorized = handler
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers: customHeaders, timeoutMs = 10000, ...rest } = options

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(customHeaders as Record<string, string>),
  }

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...rest,
      headers,
      credentials: 'include',
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(timeoutMs),
    })
  } catch {
    throw new OfflineError()
  }

  if (!response.ok) {
    let data: unknown
    try {
      data = await response.json()
    } catch {
      data = null
    }
    if (response.status === 401) onUnauthorized?.()
    throw new ApiError(response.status, `Erro ${response.status}`, data)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'PUT', body }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'PATCH', body }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
}

export { ApiError, OfflineError }
