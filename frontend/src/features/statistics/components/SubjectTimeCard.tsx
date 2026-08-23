import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui'
import { formatMinutes } from '@/shared/lib/utils'
import type { SubjectStats } from '@/shared/types'

interface SubjectTimeCardProps {
  stats: SubjectStats[] | undefined
  isLoading: boolean
}

export function SubjectTimeCard({ stats, isLoading }: SubjectTimeCardProps) {
  const maxMinutes = Math.max(...(stats?.map((s) => s.totalMinutes) ?? [1]))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tempo por matéria</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-8 bg-[var(--bg-secondary)] rounded animate-pulse" />
            ))}
          </div>
        ) : stats && stats.length > 0 ? (
          <div className="space-y-4">
            {stats.map((stat) => (
              <div key={stat.subjectId} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text)]">{stat.subjectName}</span>
                  <span className="text-sm text-[var(--text-secondary)]">
                    {formatMinutes(stat.totalMinutes)}
                  </span>
                </div>
                <div className="w-full bg-[var(--bg-secondary)] rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full"
                    style={{ width: `${(stat.totalMinutes / maxMinutes) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-[var(--text-secondary)] py-8">Nenhum dado disponível</p>
        )}
      </CardContent>
    </Card>
  )
}
