import { BookOpen, Clock, HelpCircle, Layers } from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui'
import { formatMinutes } from '@/shared/lib/utils'

interface StatsOverviewProps {
  totalMinutes: number
  totalPomodoros: number
  totalFlashcards: number
  quizAverage: number
}

const CARDS = [
  { key: 'time', label: 'Tempo total', icon: Clock, bg: 'bg-primary-100 dark:bg-primary-900/30', color: 'text-[var(--accent-text)]' },
  { key: 'pomodoros', label: 'Pomodoros', icon: BookOpen, bg: 'bg-success-100 dark:bg-success-900/30', color: 'text-success-500' },
  { key: 'flashcards', label: 'Flashcards', icon: Layers, bg: 'bg-warning-100 dark:bg-warning-900/30', color: 'text-warning-500' },
  { key: 'quizzes', label: 'Quizzes', icon: HelpCircle, bg: 'bg-error-100 dark:bg-error-900/30', color: 'text-[var(--danger)]' },
] as const

export function StatsOverview({
  totalMinutes,
  totalPomodoros,
  totalFlashcards,
  quizAverage,
}: StatsOverviewProps) {
  const values: Record<(typeof CARDS)[number]['key'], string> = {
    time: formatMinutes(totalMinutes),
    pomodoros: String(totalPomodoros),
    flashcards: String(totalFlashcards),
    quizzes: `${quizAverage}%`,
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {CARDS.map(({ key, label, icon: Icon, bg, color }) => (
        <Card key={key}>
          <CardContent className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${bg}`}>
              <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">{label}</p>
              <p className="text-2xl font-bold text-[var(--text)]">{values[key]}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
