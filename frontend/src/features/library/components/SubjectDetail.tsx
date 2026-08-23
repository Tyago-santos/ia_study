import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/shared/components/ui'
import { getSubjectIcon } from '@/shared/constants/subjectIcons'
import type { Subject, Topic } from '@/shared/types'
import { useCreateTopic } from '@/features/library/hooks/useTopics'
import { getTopicProgress } from '@/features/library/lib/subjectColors'
import { TopicRow } from './TopicRow'

interface SubjectDetailProps {
  subject: Subject
  topics: Topic[]
}

export function SubjectDetail({ subject, topics }: SubjectDetailProps) {
  const [newTopic, setNewTopic] = useState('')
  const createTopic = useCreateTopic(subject.id)
  const Icon = getSubjectIcon(subject.icon)
  const { completed, total } = getTopicProgress(topics)

  const handleAdd = () => {
    if (!newTopic.trim()) return
    createTopic.mutate(newTopic, { onSuccess: () => setNewTopic('') })
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center gap-3">
        <div
          className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0"
          style={{ backgroundColor: subject.color + '18' }}
        >
          <Icon className="w-5 h-5" style={{ color: subject.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <CardTitle>{subject.name}</CardTitle>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {total === 0 ? 'Nenhum assunto ainda' : `${completed}/${total} assuntos estudados`}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-[var(--text-secondary)]">
          Escolha o que estudar dentro de <strong className="text-[var(--text)]">{subject.name}</strong>. Os
          assuntos ficam disponíveis para adicionar no Planejamento Semanal.
        </p>

        <div className="flex gap-2">
          <Input
            placeholder="Novo assunto (ex: Integrais definidas)"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <Button onClick={handleAdd} disabled={createTopic.isPending || !newTopic.trim()}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {topics.length > 0 ? (
          <div className="divide-y divide-[var(--border)]">
            {topics.map((topic) => (
              <TopicRow key={topic.id} topic={topic} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--text-secondary)] text-center py-4">
            Adicione o primeiro assunto para começar a estudar.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
