import { ApiError, OfflineError } from '@/shared/services/apiErrors'

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof OfflineError) return error.message
  if (error instanceof ApiError) {
    const data = error.data as { message?: string } | null
    return data?.message ?? fallback
  }
  return fallback
}
