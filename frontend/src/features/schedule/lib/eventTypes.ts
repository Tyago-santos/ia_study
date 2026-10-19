import { BookOpen, Briefcase, CalendarDays, ClipboardList, GraduationCap } from 'lucide-react'
import type { ScheduleEvent } from '@/shared/types'

export const TYPE_STYLES: Record<
  ScheduleEvent['type'],
  { label: string; icon: typeof ClipboardList; color: string }
> = {
  prova: { label: 'Prova', icon: ClipboardList, color: '#ef4444' },
  estudo: { label: 'Estudo', icon: BookOpen, color: '#4f46e5' },
  trabalho: { label: 'Trabalho', icon: Briefcase, color: '#f59e0b' },
  aula: { label: 'Aula', icon: GraduationCap, color: '#06b6d4' },
  outro: { label: 'Outro', icon: CalendarDays, color: '#8b5cf6' },
}

export type DateTone = 'overdue' | 'today' | 'soon' | 'neutral'

export function getDateInfo(dateStr: string, completed: boolean): { label: string; tone: DateTone } {
  const date = new Date(dateStr)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diffDays = Math.round((target.getTime() - today.getTime()) / 86400000)

  const formatted = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })

  if (completed) return { label: formatted, tone: 'neutral' }
  if (diffDays < 0) return { label: `Atrasado (${formatted})`, tone: 'overdue' }
  if (diffDays === 0) return { label: 'Hoje', tone: 'today' }
  if (diffDays === 1) return { label: 'Amanha', tone: 'soon' }
  if (diffDays <= 7) return { label: `Em ${diffDays} dias`, tone: 'soon' }
  return { label: formatted, tone: 'neutral' }
}

export function summarizeEvents(events: ScheduleEvent[] | undefined) {
  const list = events ?? []
  const now = new Date()
  return {
    pending: list.filter((e) => !e.completed).length,
    overdue: list.filter((e) => !e.completed && new Date(e.date) < now).length,
    exams: list.filter((e) => e.type === 'prova' && !e.completed).length,
  }
}
