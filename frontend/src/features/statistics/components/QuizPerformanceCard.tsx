import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui'

interface QuizPerformanceCardProps {
  average: number
  completed: number
  total: number
}

// O mock antigo tinha "melhor sequência", mas o backend não guarda sequência
// de acertos — não existe endpoint pra isso. No lugar, mostramos o total de
// quizzes criados (respondidos ou não), que é um número real.
export function QuizPerformanceCard({ average, completed, total }: QuizPerformanceCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Desempenho nos quizzes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-[var(--accent-text)]">{average}%</p>
            <p className="text-sm text-[var(--text-secondary)]">Média de acerto</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-success-500">{completed}</p>
            <p className="text-sm text-[var(--text-secondary)]">Quizzes realizados</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-warning-500">{total}</p>
            <p className="text-sm text-[var(--text-secondary)]">Quizzes criados</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
