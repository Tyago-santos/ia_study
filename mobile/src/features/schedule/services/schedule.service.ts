import type { Ionicons } from '@expo/vector-icons'
import { Tints } from '@/shared/constants/theme'
import { isSystemNotificationAvailable } from '@/shared/services/notifications'
import type { ScheduleEvent } from '@/shared/types'

export const TYPE_LABELS: Record<ScheduleEvent['type'], string> = {
  prova: 'Prova',
  estudo: 'Estudo',
  trabalho: 'Trabalho',
  outro: 'Outro',
}

export const TYPE_COLORS: Record<ScheduleEvent['type'], string> = {
  prova: Tints.red,
  estudo: Tints.green,
  trabalho: Tints.amber,
  outro: Tints.cyan,
}

export const TYPE_ICONS: Record<ScheduleEvent['type'], keyof typeof Ionicons.glyphMap> = {
  prova: 'school',
  estudo: 'book',
  trabalho: 'briefcase',
  outro: 'ellipsis-horizontal',
}

/** Duracoes oferecidas para um evento de estudo. */
export const DURATION_CHOICES = [30, 45, 60, 90, 120]

export function isOverdue(event: ScheduleEvent): boolean {
  return !event.completed && new Date(event.date).getTime() < Date.now()
}

/** Contadores dos tiles do topo. */
export function scheduleSummary(events: ScheduleEvent[]) {
  return {
    pending: events.filter((e) => !e.completed).length,
    exams: events.filter((e) => e.type === 'prova' && !e.completed).length,
    overdue: events.filter(isOverdue).length,
  }
}

/**
 * Explica, em uma linha, o que vai acontecer com o lembrete do evento recem
 * criado. Sem isso o agendamento e invisivel: nada aparece na hora, e o
 * usuario so descobre horas depois que o aviso nunca foi armado.
 */
export function reminderNotice(
  event: ScheduleEvent,
  enabled: boolean,
  leadMinutes: number,
): { message: string; kind: 'success' | 'warning' } {
  if (!enabled) {
    return {
      message: 'Lembretes do cronograma estão desligados em Configurações.',
      kind: 'warning',
    }
  }

  if (!isSystemNotificationAvailable()) {
    return {
      message: 'Aviso do sistema indisponível neste build; só o alerta dentro do app.',
      kind: 'warning',
    }
  }

  const startsIn = new Date(event.date).getTime() - Date.now()

  if (startsIn <= 0) {
    return { message: 'Data já passou — nenhum lembrete foi agendado.', kind: 'warning' }
  }

  if (startsIn <= leadMinutes * 60_000) {
    return { message: 'Falta menos que a antecedência: o aviso vem na hora marcada.', kind: 'success' }
  }

  return {
    message:
      leadMinutes > 0
        ? `Avisos ${leadMinutes} min antes e na hora marcada.`
        : 'Aviso na hora marcada.',
    kind: 'success',
  }
}

/**
 * Junta data e horario num ISO. Sem horario marcado o evento cai ao meio-dia,
 * que mantem a data correta em qualquer fuso ao converter para ISO.
 */
export function toEventISO(date: string, time: string, hasCompleteTime: boolean): string {
  return new Date(`${date}T${hasCompleteTime ? time : '12:00'}:00`).toISOString()
}
