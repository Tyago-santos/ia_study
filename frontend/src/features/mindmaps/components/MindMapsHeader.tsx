import { GitBranch, Layers, Network, Plus } from 'lucide-react'
import { Button } from '@/shared/components/ui'

interface MindMapsHeaderProps {
  total: number
  topicCount: number
  onCreate: () => void
}

export function MindMapsHeader({ total, topicCount, onCreate }: MindMapsHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[var(--card-bg)] p-6">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-500/10 via-cyan-500/5 to-transparent" />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 shadow-lg shadow-primary-500/25">
            <Network className="h-6 w-6 text-[var(--on-accent)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text)]">Mapas Mentais</h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Organize o conteudo em ramos e visualize as conexoes
            </p>
          </div>
        </div>
        <Button onClick={onCreate} className="sm:flex-none">
          <Plus className="mr-2 h-4 w-4" />
          Criar Mapa Mental
        </Button>
      </div>

      <div className="relative mt-5 flex flex-wrap gap-2">
        <div className="flex items-center gap-2 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-1.5">
          <GitBranch className="h-3.5 w-3.5 text-[var(--accent-text)]" />
          <span className="text-xs font-bold text-[var(--text)]">{total}</span>
          <span className="text-[10px] text-[var(--text-secondary)]">mapas criados</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-1.5">
          <Layers className="h-3.5 w-3.5 text-[var(--accent-text)]" />
          <span className="text-xs font-bold text-[var(--text)]">{topicCount}</span>
          <span className="text-[10px] text-[var(--text-secondary)]">topicos mapeados</span>
        </div>
      </div>
    </div>
  )
}
