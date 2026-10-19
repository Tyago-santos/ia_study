import { GitBranch, Layers, Network, Trash2 } from 'lucide-react'
import { Card } from '@/shared/components/ui'
import type { MindMap, Subject } from '@/shared/types'
import { getMindMapStats, getRootNode } from '@/features/mindmaps/lib/mindmapTree'

interface MindMapCardProps {
  mindMap: MindMap
  subject?: Subject
  index: number
  onOpen: () => void
  onDelete: () => void
}

export function MindMapCard({ mindMap, subject, index, onOpen, onDelete }: MindMapCardProps) {
  const color = subject?.color ?? '#4f46e5'
  const stats = getMindMapStats(mindMap.nodes)
  const root = getRootNode(mindMap.nodes)
  const branchLabels = mindMap.nodes.filter((node) => node.parentId === root?.id).slice(0, 3)

  return (
    <Card
      className="group cursor-pointer animate-fade-in p-5"
      style={{ animationDelay: `${index * 60}ms` }}
      onClick={onOpen}
    >
      <div className="flex items-start gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${color}22`, border: `1px solid ${color}55` }}
        >
          <Network className="h-5 w-5" style={{ color }} />
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-[var(--text)]">{mindMap.title}</h3>
          <p className="truncate text-xs text-[var(--text-secondary)]">
            {subject?.name ?? 'Sem materia'}
          </p>
        </div>

        <button
          onClick={(event) => {
            event.stopPropagation()
            onDelete()
          }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--text-secondary)] opacity-100 transition-all hover:bg-error-500/15 hover:text-[var(--danger)] sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
          title="Excluir mapa mental"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {mindMap.description && (
        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-[var(--text-secondary)]">
          {mindMap.description}
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {branchLabels.map((node) => (
          <span
            key={node.id}
            className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
            style={{ backgroundColor: `${color}1f`, color }}
          >
            {node.label}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3 border-t border-[var(--glass-border)] pt-3">
        <span className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)]">
          <Layers className="h-3 w-3 text-[var(--accent-text)]" />
          {stats.total} topicos
        </span>
        <span className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)]">
          <GitBranch className="h-3 w-3 text-[var(--accent-text)]" />
          {stats.branches} ramos
        </span>
        <span className="ml-auto text-[11px] text-[var(--text-secondary)]">
          {new Date(mindMap.updatedAt).toLocaleDateString('pt-BR')}
        </span>
      </div>
    </Card>
  )
}
