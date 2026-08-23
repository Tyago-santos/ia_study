import { BookOpen, CheckCircle2, Layers, ListChecks, Plus } from 'lucide-react'
import { Button } from '@/shared/components/ui'

interface LibraryHeaderProps {
  subjectCount: number
  totalTopics: number
  completedTopics: number
  onCreate: () => void
}

export function LibraryHeader({
  subjectCount,
  totalTopics,
  completedTopics,
  onCreate,
}: LibraryHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[var(--card-bg)] p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-cyan-500/5 to-transparent pointer-events-none" />
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 shadow-lg shadow-primary-500/25">
            <Layers className="w-6 h-6 text-[var(--on-accent)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text)]">Biblioteca</h1>
            <p className="text-[var(--text-secondary)] text-sm">
              Organize suas matérias e escolha o que estudar
            </p>
          </div>
        </div>
        <Button onClick={onCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Criar Matéria
        </Button>
      </div>

      <div className="relative flex flex-wrap gap-2 mt-5">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
          <BookOpen className="w-3.5 h-3.5 text-[var(--accent-text)]" />
          <span className="text-xs font-bold text-[var(--text)]">{subjectCount}</span>
          <span className="text-[10px] text-[var(--text-secondary)]">matérias</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
          <ListChecks className="w-3.5 h-3.5 text-[var(--accent-text)]" />
          <span className="text-xs font-bold text-[var(--text)]">{totalTopics}</span>
          <span className="text-[10px] text-[var(--text-secondary)]">assuntos cadastrados</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
          <CheckCircle2 className="w-3.5 h-3.5 text-[var(--accent-text)]" />
          <span className="text-xs font-bold text-[var(--text)]">{completedTopics}</span>
          <span className="text-[10px] text-[var(--text-secondary)]">estudados</span>
        </div>
      </div>
    </div>
  )
}
