import { Ionicons } from '@expo/vector-icons'
import { Pressable } from 'react-native'
import { getSubjectIcon } from '@/shared/constants/subjectIcons'
import { useTheme } from '@/shared/hooks/useTheme'
import { maskTime } from '@/shared/lib/time'
import type { PlanBlock, Topic } from '@/shared/types'
import { DURATION_STEP, endTimeOf, formatDuration } from '../services/planner.service'
import * as S from './style'

interface PlanBlockCardProps {
  block: PlanBlock
  /** Icone da materia; o bloco guarda so cor e nome. */
  subjectIcon?: string
  /** Assuntos da materia deste bloco, ja filtrados. */
  topics: Topic[]
  /** Editor de horario/assunto aberto. */
  expanded: boolean
  onToggle: () => void
  onChangeDuration: (duration: number) => void
  onChangeStartTime: (startTime: string | undefined) => void
  onChangeTopic: (topicId: string | undefined, topicName: string | undefined) => void
  onRemove: () => void
}

export function PlanBlockCard({
  block,
  subjectIcon,
  topics,
  expanded,
  onToggle,
  onChangeDuration,
  onChangeStartTime,
  onChangeTopic,
  onRemove,
}: PlanBlockCardProps) {
  const { colors } = useTheme()

  return (
    <>
      <S.Block onPress={onToggle} $color={block.subjectColor}>
        <S.BlockAccent $color={block.subjectColor} />

        <S.BlockBody>
          <S.BlockTopRow>
            <S.BlockIcon $color={block.subjectColor}>
              <Ionicons
                name={getSubjectIcon(subjectIcon)}
                size={13}
                color={block.subjectColor}
              />
            </S.BlockIcon>

            <S.BlockName numberOfLines={1}>{block.subjectName}</S.BlockName>

            <S.DurationPill $color={block.subjectColor}>
              <S.DurationText $color={block.subjectColor}>
                {block.startTime
                  ? `${block.startTime} · ${formatDuration(block.duration)}`
                  : formatDuration(block.duration)}
              </S.DurationText>
            </S.DurationPill>
          </S.BlockTopRow>

          <S.BlockBottomRow>
            <Ionicons
              name={block.topicName ? 'bookmark' : 'bookmark-outline'}
              size={11}
              color={colors.textSecondary}
            />
            <S.BlockTopic numberOfLines={1}>
              {block.topicName ?? 'Escolher assunto'}
            </S.BlockTopic>

            <S.BlockControls>
              <Pressable onPress={() => onChangeDuration(block.duration - DURATION_STEP)} hitSlop={8}>
                <Ionicons name="remove-circle" size={20} color={colors.textSecondary} />
              </Pressable>
              <Pressable onPress={() => onChangeDuration(block.duration + DURATION_STEP)} hitSlop={8}>
                <Ionicons name="add-circle" size={20} color={colors.textSecondary} />
              </Pressable>
              <Pressable onPress={onRemove} hitSlop={8}>
                <Ionicons name="close-circle" size={20} color={colors.danger} />
              </Pressable>
            </S.BlockControls>
          </S.BlockBottomRow>
        </S.BlockBody>
      </S.Block>

      {expanded ? (
        <S.TopicPicker>
          <S.TopicPickerLabel>Começa às</S.TopicPickerLabel>
          <S.TimeRow>
            <S.TimeInput
              underlineColorAndroid="transparent"
              value={block.startTime ?? ''}
              onChangeText={(value) => onChangeStartTime(maskTime(value) || undefined)}
              placeholder="--:--"
              placeholderTextColor={colors.textSecondary}
              keyboardType="number-pad"
              maxLength={5}
            />
            {block.startTime ? <S.TimeEnd>termina {endTimeOf(block)}</S.TimeEnd> : null}
          </S.TimeRow>

          <S.TopicPickerLabel>O que estudar?</S.TopicPickerLabel>

          <S.TopicOptions>
            <S.TopicOption
              onPress={() => onChangeTopic(undefined, undefined)}
              $color={block.subjectColor}
              $selected={!block.topicId}
            >
              <S.TopicOptionLabel $color={block.subjectColor} $selected={!block.topicId}>
                Geral
              </S.TopicOptionLabel>
            </S.TopicOption>

            {topics.map((topic) => {
              const isSelected = block.topicId === topic.id

              return (
                <S.TopicOption
                  key={topic.id}
                  onPress={() => onChangeTopic(topic.id, topic.name)}
                  $color={block.subjectColor}
                  $selected={isSelected}
                >
                  <S.TopicOptionLabel
                    $color={block.subjectColor}
                    $selected={isSelected}
                    numberOfLines={1}
                  >
                    {topic.completed ? '✓ ' : ''}
                    {topic.name}
                  </S.TopicOptionLabel>
                </S.TopicOption>
              )
            })}
          </S.TopicOptions>
        </S.TopicPicker>
      ) : null}
    </>
  )
}
