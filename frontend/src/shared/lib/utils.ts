import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}min`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}min`
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('pt-BR')
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMin = Math.floor((now.getTime() - date.getTime()) / 60000)
  const diffHours = Math.floor(diffMin / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMin < 1) return 'agora'
  if (diffMin < 60) return `há ${diffMin} min`
  if (diffHours < 24) return `há ${diffHours}h`
  if (diffDays === 1)
    return `ontem ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
  if (diffDays < 7) return `há ${diffDays} dias`
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}
