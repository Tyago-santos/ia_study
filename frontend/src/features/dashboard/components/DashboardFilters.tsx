import { Filter, X } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

export type DateRange = 'today' | '7d' | '30d' | 'custom'

export interface CustomRange {
  start: string
  end: string
}

interface DashboardFiltersProps {
  dateRange: DateRange
  onDateRangeChange: (range: DateRange) => void
  customRange: CustomRange
  onCustomRangeChange: (range: CustomRange) => void
  selectedSubjects: string[]
  onSubjectsChange: (subjects: string[]) => void
  selectedTypes: string[]
  onTypesChange: (types: string[]) => void
  subjects: { id: string; name: string; color: string }[]
}

const dateRanges: { value: DateRange; label: string }[] = [
  { value: 'today', label: 'Hoje' },
  { value: '7d', label: '7 dias' },
  { value: '30d', label: '30 dias' },
  { value: 'custom', label: 'Personalizado' },
]

const activityTypes = [
  { value: 'pomodoro', label: 'Pomodoro', color: 'bg-primary-500' },
  { value: 'quiz', label: 'Quiz', color: 'bg-emerald-500' },
  { value: 'flashcard', label: 'Flashcards', color: 'bg-amber-500' },
  { value: 'summary', label: 'Resumos', color: 'bg-primary-500' },
]

export function DashboardFilters({
  dateRange,
  onDateRangeChange,
  customRange,
  onCustomRangeChange,
  selectedSubjects,
  onSubjectsChange,
  selectedTypes,
  onTypesChange,
  subjects,
}: DashboardFiltersProps) {
  const activeFilterCount =
    (dateRange !== '7d' ? 1 : 0) + selectedSubjects.length + selectedTypes.length
  const hasActiveFilters = activeFilterCount > 0

  const clearFilters = () => {
    onDateRangeChange('7d')
    onCustomRangeChange({ start: '', end: '' })
    onSubjectsChange([])
    onTypesChange([])
  }

  const toggleSubject = (id: string) => {
    onSubjectsChange(
      selectedSubjects.includes(id)
        ? selectedSubjects.filter((s) => s !== id)
        : [...selectedSubjects, id]
    )
  }

  const toggleType = (type: string) => {
    onTypesChange(
      selectedTypes.includes(type)
        ? selectedTypes.filter((t) => t !== type)
        : [...selectedTypes, type]
    )
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] backdrop-blur-sm p-4 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary-500/15 shrink-0">
            <Filter className="w-3.5 h-3.5 text-[var(--accent-text)]" />
          </div>
          <span className="text-sm font-semibold text-[var(--text)]">Filtros</span>
          {hasActiveFilters && (
            <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-primary-500 text-[var(--on-accent)] text-[10px] font-bold">
              {activeFilterCount}
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-[var(--negative)] hover:bg-rose-500/10 transition-colors shrink-0"
          >
            <X className="w-3 h-3" />
            Limpar filtros
          </button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            Periodo
          </span>
          <div className="flex items-center rounded-xl border border-[var(--border)] bg-[var(--glass-bg)] overflow-hidden w-fit">
            {dateRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => onDateRangeChange(range.value)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap',
                  dateRange === range.value
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-[var(--on-accent)] shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--card-bg)]'
                )}
              >
                {range.label}
              </button>
            ))}
          </div>

          {dateRange === 'custom' && (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="date"
                value={customRange.start}
                max={customRange.end || undefined}
                onChange={(e) => onCustomRangeChange({ ...customRange, start: e.target.value })}
                className="px-2 py-1 rounded-lg border border-[var(--border)] bg-[var(--glass-bg)] text-xs text-[var(--text)] min-w-0"
              />
              <span className="text-xs text-[var(--text-secondary)] shrink-0">ate</span>
              <input
                type="date"
                value={customRange.end}
                min={customRange.start || undefined}
                onChange={(e) => onCustomRangeChange({ ...customRange, end: e.target.value })}
                className="px-2 py-1 rounded-lg border border-[var(--border)] bg-[var(--glass-bg)] text-xs text-[var(--text)] min-w-0"
              />
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            Materias
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {subjects.map((subject) => {
              const active = selectedSubjects.includes(subject.id)
              return (
                <button
                  key={subject.id}
                  onClick={() => toggleSubject(subject.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all',
                    active
                      ? 'border-current shadow-sm'
                      : 'border-transparent bg-[var(--glass-bg)] text-[var(--text-secondary)] hover:text-[var(--text)]'
                  )}
                  style={
                    active
                      ? {
                          color: subject.color,
                          backgroundColor: `${subject.color}15`,
                          borderColor: `${subject.color}40`,
                        }
                      : undefined
                  }
                >
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: subject.color }}
                  />
                  {subject.name}
                </button>
              )
            })}
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            Tipo de atividade
          </span>
          <div className="flex items-center gap-1 flex-wrap">
            {activityTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => toggleType(type.value)}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all',
                  selectedTypes.includes(type.value)
                    ? 'bg-[var(--glass-bg)] border-[var(--border)] text-[var(--text)]'
                    : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text)]'
                )}
              >
                <div className={cn('w-2 h-2 rounded-full shrink-0', type.color)} />
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
