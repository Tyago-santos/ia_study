import { CalendarClock, CalendarDays, ClipboardList, Plus } from 'lucide-react'
import { Button } from '@/shared/components/ui'

interface ScheduleHeaderProps {
  pending: number
  exams: number
  overdue: number
  onCreate: () => void
}

export function ScheduleHeader({ pending, exams, overdue, onCreate }: ScheduleHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[var(--card-bg)] p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-cyan-500/5 to-transparent pointer-events-none" />
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 shadow-lg shadow-primary-500/25">
            <CalendarClock className="w-6 h-6 text-[var(--on-accent)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text)]">Cronograma</h1>
            <p className="text-[var(--text-secondary)] text-sm">
              Organize provas, entregas e sessoes de estudo
            </p>
          </div>
        </div>
        <Button onClick={onCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Evento
        </Button>
      </div>

      <div className="relative flex flex-wrap gap-2 mt-5">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
          <CalendarDays className="w-3.5 h-3.5 text-[var(--accent-text)]" />
          <span className="text-xs font-bold text-[var(--text)]">{pending}</span>
          <span className="text-[10px] text-[var(--text-secondary)]">pendentes</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
          <ClipboardList className="w-3.5 h-3.5 text-[var(--accent-text)]" />
          <span className="text-xs font-bold text-[var(--text)]">{exams}</span>
          <span className="text-[10px] text-[var(--text-secondary)]">provas</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
          <ClipboardList className="w-3.5 h-3.5 text-[var(--danger)]" />
          <span className="text-xs font-bold text-[var(--text)]">{overdue}</span>
          <span className="text-[10px] text-[var(--text-secondary)]">atrasados</span>
        </div>
      </div>
    </div>
  )
}
