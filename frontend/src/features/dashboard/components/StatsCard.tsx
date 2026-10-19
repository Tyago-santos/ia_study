import type { LucideIcon } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import type { MetricTrend } from '@/features/dashboard/hooks/useDashboardData'

interface StatsCardProps {
  label: string
  value: string
  icon: LucideIcon
  /** Classes do icone em fundo tintado (ex: `bg-primary-500/15 text-[var(--accent-text)]`). */
  gradient: string
  /** Omita quando nao houver base real de comparacao. */
  trend?: MetricTrend
  /** Omita quando nao houver serie real; nunca preencha com valores de exemplo. */
  sparkline?: number[]
  /** Percentual 0-100 de uma meta; barra em gradiente quando informado. */
  progress?: number
}

export function StatsCard({ label, value, icon: Icon, gradient, trend, sparkline, progress }: StatsCardProps) {
  const max = sparkline && sparkline.length > 0 ? Math.max(...sparkline) : 0

  return (
    <div className="relative rounded-2xl border backdrop-blur-sm bg-[var(--card-bg)] border-[var(--border)] shadow-[var(--glass-shadow)] p-5 overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 group">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]">
            {label}
          </p>
          <p className="text-2xl font-bold text-[var(--text)] tracking-tight">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 text-xs">
              <span
                className={cn(
                  'font-medium',
                  // Zero nao é ganho: sem variacao fica neutro, nao verde.
                  trend.value === 0
                    ? 'text-[var(--text-secondary)]'
                    : trend.isPositive
                      ? 'text-[var(--accent-text)]'
                      : 'text-[var(--negative)]'
                )}
              >
                {trend.value > 0 ? '+' : ''}
                {trend.value}%
              </span>
              <span className="text-[var(--text-secondary)]">{trend.label}</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            'flex items-center justify-center p-2.5 rounded-full transition-transform group-hover:scale-110',
            gradient
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {typeof progress === 'number' && (
        <div className="mt-3 h-1.5 rounded-full bg-[var(--bg-secondary)] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary-500 via-primary-400 to-tertiary-400 transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}

      {sparkline && sparkline.length > 0 && (
        <div className="mt-3 flex items-end gap-[3px] h-8">
          {sparkline.map((val, i) => {
            const height = max > 0 ? (val / max) * 100 : 0
            return (
              <div
                key={i}
                className={cn(
                  'flex-1 rounded-sm transition-all duration-300',
                  i === sparkline.length - 1
                    ? 'bg-gradient-to-t from-primary-500 to-tertiary-400'
                    : 'bg-primary-500/25'
                )}
                style={{ height: `${Math.max(height, 8)}%` }}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
