import { HelpCircle, ListChecks, Plus, Target, Trophy } from 'lucide-react'
import { Button } from '@/shared/components/ui'

interface QuizHeaderProps {
  total: number
  totalQuestions: number
  completed: number
  averageScore: number | null
  onCreate: () => void
}

export function QuizHeader({
  total,
  totalQuestions,
  completed,
  averageScore,
  onCreate,
}: QuizHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[var(--card-bg)] p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-cyan-500/5 to-transparent pointer-events-none" />
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 shadow-lg shadow-primary-500/25">
            <ListChecks className="w-6 h-6 text-[var(--on-accent)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text)]">Quiz</h1>
            <p className="text-[var(--text-secondary)] text-sm">
              Teste seus conhecimentos com perguntas de múltipla escolha
            </p>
          </div>
        </div>
        <Button className="self-start sm:self-auto" onClick={onCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Criar Quiz
        </Button>
      </div>

      <div className="relative flex flex-wrap gap-2 mt-5">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
          <ListChecks className="w-3.5 h-3.5 text-[var(--accent-text)]" />
          <span className="text-xs font-bold text-[var(--text)]">{total}</span>
          <span className="text-[10px] text-[var(--text-secondary)]">quizzes</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
          <HelpCircle className="w-3.5 h-3.5 text-[var(--accent-text)]" />
          <span className="text-xs font-bold text-[var(--text)]">{totalQuestions}</span>
          <span className="text-[10px] text-[var(--text-secondary)]">questões</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
          <Trophy className="w-3.5 h-3.5 text-[var(--accent-text)]" />
          <span className="text-xs font-bold text-[var(--text)]">{completed}</span>
          <span className="text-[10px] text-[var(--text-secondary)]">concluídos</span>
        </div>
        {averageScore !== null && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
            <Target className="w-3.5 h-3.5 text-[var(--accent-text)]" />
            <span className="text-xs font-bold text-[var(--text)]">{averageScore}%</span>
            <span className="text-[10px] text-[var(--text-secondary)]">média</span>
          </div>
        )}
      </div>
    </div>
  )
}
