import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { Pressable } from 'react-native'
import { ProgressBar } from '@/shared/components/ui/ProgressBar'
import { SectionCard } from '@/shared/components/ui/SectionCard'
import { getSubjectIcon } from '@/shared/constants/subjectIcons'
import { useTheme } from '@/shared/hooks/useTheme'
import { formatDuration } from '@/features/dashboard/services/planner.service'
import type { Subject, Topic } from '@/shared/types'
import { completionPercent } from '../services/library.service'
import * as S from './style'

interface SubjectCardProps {
  subject: Subject
  topics: Topic[]
  /** Minutos que o planner reservou para cada assunto, por id. */
  plannedByTopic: Map<string, number>
  expanded: boolean
  /** A criacao esta em voo: trava o formulario para nao duplicar assunto. */
  creatingTopic?: boolean
  onToggle: () => void
  onRemove: () => void
  onToggleTopic: (topicId: string) => void
  onCreateTopic: (name: string) => void
}

/** Materia com barra de progresso e, quando aberta, a lista de assuntos. */
export function SubjectCard({
  subject,
  topics,
  plannedByTopic,
  expanded,
  creatingTopic,
  onToggle,
  onRemove,
  onToggleTopic,
  onCreateTopic,
}: SubjectCardProps) {
  const { colors } = useTheme()
  const [newTopic, setNewTopic] = useState('')

  const done = topics.filter((t) => t.completed).length
  const plannedTotal = topics.reduce((sum, topic) => sum + (plannedByTopic.get(topic.id) ?? 0), 0)

  const submitTopic = () => {
    const name = newTopic.trim()
    if (!name || creatingTopic) return

    onCreateTopic(name)
    setNewTopic('')
  }

  return (
    <S.SubjectWrapper>
      <S.SubjectCard onPress={onToggle} $color={subject.color} $expanded={expanded}>
        <S.SubjectIcon $color={subject.color}>
          <Ionicons name={getSubjectIcon(subject.icon)} size={20} color={subject.color} />
        </S.SubjectIcon>

        <S.SubjectInfo>
          <S.SubjectName>{subject.name}</S.SubjectName>
          <S.SubjectMeta>
            {done}/{topics.length} assuntos
          </S.SubjectMeta>
          <ProgressBar value={completionPercent(topics)} color={subject.color} height={5} />
        </S.SubjectInfo>

        <Pressable onPress={onRemove} hitSlop={8}>
          <Ionicons name="trash-outline" size={18} color={colors.danger} />
        </Pressable>
      </S.SubjectCard>

      {expanded ? (
        <S.TopicsPanel>
          <SectionCard
            title="Assuntos"
            action={
              plannedTotal > 0 ? (
                <S.PlannedTotal $color={subject.color}>
                  {formatDuration(plannedTotal)} planejados
                </S.PlannedTotal>
              ) : null
            }
          >
            {topics.length > 0 ? (
              topics.map((topic) => {
                const planned = plannedByTopic.get(topic.id)

                return (
                  <S.TopicRow key={topic.id} onPress={() => onToggleTopic(topic.id)}>
                    <Ionicons
                      name={topic.completed ? 'checkbox' : 'square-outline'}
                      size={19}
                      color={topic.completed ? subject.color : colors.textSecondary}
                    />
                    <S.TopicName $completed={topic.completed}>{topic.name}</S.TopicName>

                    {planned !== undefined ? (
                      <S.TopicTime $color={subject.color}>
                        <Ionicons name="time-outline" size={11} color={subject.color} />
                        <S.TopicTimeText $color={subject.color}>
                          {formatDuration(planned)}
                        </S.TopicTimeText>
                      </S.TopicTime>
                    ) : null}
                  </S.TopicRow>
                )
              })
            ) : (
              <S.EmptyTopics>Nenhum assunto cadastrado.</S.EmptyTopics>
            )}

            <S.AddTopicRow>
              <S.AddTopicInput
                underlineColorAndroid="transparent"
                value={newTopic}
                onChangeText={setNewTopic}
                placeholder="Novo assunto"
                placeholderTextColor={colors.textSecondary}
                onSubmitEditing={submitTopic}
                returnKeyType="done"
                submitBehavior="submit"
              />
              <S.AddTopicButton
                onPress={submitTopic}
                $color={subject.color}
                disabled={!newTopic.trim() || creatingTopic}
                accessibilityLabel="Adicionar assunto"
              >
                {creatingTopic ? (
                  <S.TopicSpinner color={colors.onAccent} />
                ) : (
                  <Ionicons name="add" size={18} color={colors.onAccent} />
                )}
              </S.AddTopicButton>
            </S.AddTopicRow>

          </SectionCard>
        </S.TopicsPanel>
      ) : null}
    </S.SubjectWrapper>
  )
}
