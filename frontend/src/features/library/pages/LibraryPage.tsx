import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import {
  Card,
  CardContent,
  CardSkeleton,
  ConfirmDialog,
  EmptyState,
  ErrorState,
  Input,
} from '@/shared/components/ui'
import { useDeleteSubject, useSubjects } from '@/features/library/hooks/useSubjects'
import { useTopics } from '@/features/library/hooks/useTopics'
import { groupTopicsBySubject } from '@/features/library/lib/subjectColors'
import { CreateSubjectModal } from '../components/CreateSubjectModal'
import { LibraryHeader } from '../components/LibraryHeader'
import { SubjectCard } from '../components/SubjectCard'
import { SubjectDetail } from '../components/SubjectDetail'

export function LibraryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null)
  const [pendingDeletionId, setPendingDeletionId] = useState<string | null>(null)

  const { data: subjects, isLoading, error, refetch } = useSubjects()
  const { data: allTopics } = useTopics()
  const deleteSubject = useDeleteSubject()

  const filteredSubjects =
    subjects?.filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase())) ?? []

  const topicsBySubject = useMemo(() => groupTopicsBySubject(allTopics), [allTopics])

  const totalTopics = allTopics?.length ?? 0
  const completedTopics = allTopics?.filter((t) => t.completed).length ?? 0
  const selectedSubject = subjects?.find((s) => s.id === selectedSubjectId) ?? null

  // Excluir uma materia leva os assuntos dela, entao a acao passa por
  // confirmacao em vez de undo: o toast nao daria conta do que foi perdido.
  const subjectPendingDeletion = subjects?.find((s) => s.id === pendingDeletionId) ?? null
  const pendingTopicCount = pendingDeletionId
    ? (topicsBySubject.get(pendingDeletionId)?.length ?? 0)
    : 0

  const confirmDelete = () => {
    if (!pendingDeletionId) return
    deleteSubject.mutate(pendingDeletionId)
    if (selectedSubjectId === pendingDeletionId) setSelectedSubjectId(null)
    setPendingDeletionId(null)
  }

  if (error) {
    return <ErrorState message="Erro ao carregar matérias" onRetry={refetch} />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <LibraryHeader
        subjectCount={subjects?.length ?? 0}
        totalTopics={totalTopics}
        completedTopics={completedTopics}
        onCreate={() => setIsCreating(true)}
      />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
        <Input
          placeholder="Buscar matérias..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <CreateSubjectModal open={isCreating} onClose={() => setIsCreating(false)} />

      <ConfirmDialog
        open={subjectPendingDeletion !== null}
        onClose={() => setPendingDeletionId(null)}
        onConfirm={confirmDelete}
        title="Excluir matéria"
        confirmLabel="Excluir matéria"
        isPending={deleteSubject.isPending}
        description={
          <>
            <strong className="text-[var(--text)]">{subjectPendingDeletion?.name}</strong>{' '}
            {pendingTopicCount > 0
              ? `e ${pendingTopicCount === 1 ? 'o assunto dela' : `os ${pendingTopicCount} assuntos dela`} serão removidos.`
              : 'será removida.'}{' '}
            Não é possível desfazer.
          </>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : filteredSubjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              topics={topicsBySubject.get(subject.id) ?? []}
              isSelected={selectedSubjectId === subject.id}
              onSelect={() => setSelectedSubjectId((id) => (id === subject.id ? null : subject.id))}
              onDelete={() => setPendingDeletionId(subject.id)}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent>
            <EmptyState
              title={searchTerm ? 'Nenhuma matéria encontrada' : 'Nenhuma matéria criada'}
              description={
                searchTerm ? 'Tente outro termo de busca' : 'Clique em "Criar Matéria" para começar!'
              }
            />
          </CardContent>
        </Card>
      )}

      {selectedSubject && (
        <SubjectDetail
          subject={selectedSubject}
          topics={topicsBySubject.get(selectedSubject.id) ?? []}
        />
      )}
    </div>
  )
}
