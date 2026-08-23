import { Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui'
import { formatDate } from '@/shared/lib/utils'

interface ProfileStatsProps {
  createdAt?: string
}

export function ProfileStats({ createdAt }: ProfileStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estatísticas pessoais</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-secondary)]">
            <Calendar className="w-5 h-5 text-[var(--text-secondary)]" />
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Membro desde</p>
              <p className="font-medium text-[var(--text)]">
                {createdAt ? formatDate(createdAt) : '-'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-secondary)]">
            <Calendar className="w-5 h-5 text-[var(--text-secondary)]" />
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Último acesso</p>
              <p className="font-medium text-[var(--text)]">Hoje</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
