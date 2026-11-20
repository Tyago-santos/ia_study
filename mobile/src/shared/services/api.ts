import { ApiError, OfflineError } from '@/shared/services/apiErrors'
import { resetLocalData } from '@/shared/services/resetLocalData'
import { useAuthStore } from '@/shared/store/auth'

// EXPO_PUBLIC_* vars are inlined at build time by Expo — see mobile/.env.
// The deployed API is the safe fallback for a device build; local development
// can override it with localhost, 10.0.2.2, or the machine's LAN IP.
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://dev-canil.onrender.com'

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  /** Teto da chamada. Padrão 10s — endpoints mais lentos (IA) passam o seu. */
  timeoutMs?: number
}

/** Combina timeout e cancelamento sem depender do suporte variável a `AbortSignal.timeout` em runtimes nativos. */
function createRequestSignal(timeoutMs: number, externalSignal?: AbortSignal | null) {
  const controller = new AbortController()
  let timedOut = false
  const timeout = setTimeout(() => {
    timedOut = true
    controller.abort()
  }, timeoutMs)
  const abort = () => controller.abort()

  externalSignal?.addEventListener('abort', abort)
  if (externalSignal?.aborted) abort()

  return {
    signal: controller.signal,
    didTimeOut: () => timedOut,
    cleanup: () => {
      clearTimeout(timeout)
      externalSignal?.removeEventListener('abort', abort)
    },
  }
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers: customHeaders, signal, timeoutMs = 10000, ...rest } = options

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(customHeaders as Record<string, string>),
  }

  const token = useAuthStore.getState().token
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const requestSignal = createRequestSignal(timeoutMs, signal)
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...rest,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: requestSignal.signal,
    })
  } catch (error) {
    if (signal?.aborted) throw error
    if (requestSignal.didTimeOut()) {
      throw new OfflineError('O servidor demorou para responder. Tente novamente.')
    }
    throw new OfflineError()
  } finally {
    requestSignal.cleanup()
  }

  if (!response.ok) {
    let data: unknown
    try {
      data = await response.json()
    } catch {
      data = null
    }

    // Token existia e foi recusado (expirado, de outro backend, usuario
    // apagado...): a sessao morreu do lado do servidor. Sem isto o app fica
    // preso numa tela quebrada, tentando de novo com o mesmo token invalido —
    // aqui ele volta sozinho pro login em vez de exigir Perfil > Sair.
    if (response.status === 401 && token) {
      resetLocalData().catch(() => {})
      useAuthStore.getState().logout()
    }

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

// Reexportados para quem ja importava daqui; a definicao vive em apiErrors.ts.
export { ApiError, OfflineError }
