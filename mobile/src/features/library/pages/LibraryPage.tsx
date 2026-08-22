import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { Alert } from 'react-native'
import { EmptyState } from '@/shared/components/ui/EmptyState'
import { FormModal } from '@/shared/components/ui/FormModal'
import { Input } from '@/shared/components/ui/Input'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { Screen } from '@/shared/components/ui/Screen'
import { SectionCard } from '@/shared/components/ui/SectionCard'
import { SkeletonCard } from '@/shared/components/ui/Skeleton'
import { useTheme } from '@/shared/hooks/useTheme'
import { SubjectCard } from '../components/SubjectCard'
import { useLibrary } from '../hooks/useLibrary'
import { SUBJECT_COLORS, searchSubjects } from '../services/library.service'
import * as S from './style'

export function LibraryPage() {
  const { colors } = useTheme()
  const {
    isLoading,
    subjects,
    topics,
    topicsBySubject,
    plannedByTopic,
    completedTopics,
    createSubject,
    removeSubject,
    createTopic,
    toggleTopic,
  } = useLibrary()

  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(SUBJECT_COLORS[0])

  const filtered = searchSubjects(subjects, search)

  if (isLoading) {
    return (
      <Screen scroll>
        <PageHeader title="Biblioteca" subtitle="Carregando..." />
        <SkeletonCard lines={2} style={{ marginTop: 16, marginBottom: 12 }} />
        <SkeletonCard lines={2} style={{ marginBottom: 12 }} />
        <SkeletonCard lines={2} />
      </Screen>
    )
  }

  return (
    <Screen scroll>
      <PageHeader
        title="Biblioteca"
        subtitle={`${subjects.length} matérias · ${completedTopics}/${topics.length} assuntos concluídos`}
        actionLabel="Criar"
        onAction={() => setIsCreating(true)}
      />

      <S.SearchBox>
        <Ionicons name="search" size={18} color={colors.textSecondary} />
        <S.SearchInput
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar matérias..."
          placeholderTextColor={colors.textSecondary}
        />
      </S.SearchBox>

      {filtered.length > 0 ? (
        filtered.map((subject) => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            topics={topicsBySubject.get(subject.id) ?? []}
            plannedByTopic={plannedByTopic}
            expanded={expandedId === subject.id}
            creatingTopic={createTopic.isPending}
            onToggle={() => setExpandedId(expandedId === subject.id ? null : subject.id)}
            onRemove={() => removeSubject.mutate(subject.id)}
            onToggleTopic={(topicId) => toggleTopic.mutate(topicId)}
            onCreateTopic={(name) =>
              createTopic.mutate(
                { subjectId: subject.id, name },
                {
                  onError: () =>
                    Alert.alert('Erro', 'Nao foi possivel adicionar o assunto. Tente de novo.'),
                },
              )
            }
          />
        ))
      ) : (
        <SectionCard>
          <EmptyState
            icon="library-outline"
            title={search ? 'Nenhuma matéria encontrada' : 'Nenhuma matéria criada'}
            description={search ? 'Tente outro termo de busca' : 'Toque em Criar para começar!'}
          />
        </SectionCard>
      )}

      <FormModal
        open={isCreating}
        title="Nova matéria"
        onClose={() => setIsCreating(false)}
        onSubmit={() =>
          createSubject.mutate(
            { name: newName.trim(), color: newColor, icon: 'BookOpen' },
            {
              onSuccess: () => {
                setIsCreating(false)
                setNewName('')
              },
            },
          )
        }
        submitLabel="Criar matéria"
        isSubmitting={createSubject.isPending}
        submitDisabled={!newName.trim()}
      >
        <Input label="Nome" value={newName} onChangeText={setNewName} placeholder="Ex: Cálculo I" />

        <S.ColorLabel>Cor</S.ColorLabel>
        <S.ColorRow>
          {SUBJECT_COLORS.map((color) => (
            <S.ColorDot
              key={color}
              onPress={() => setNewColor(color)}
              $color={color}
              $selected={newColor === color}
            />
          ))}
        </S.ColorRow>
      </FormModal>
    </Screen>
  )
}
