import { Ionicons } from '@expo/vector-icons'
import { Pressable } from 'react-native'
import { Badge } from '@/shared/components/ui/Badge'
import { useTheme } from '@/shared/hooks/useTheme'
import { formatDateTime } from '@/shared/lib/format'
import type { ScheduleEvent, Subject } from '@/shared/types'
import { TYPE_COLORS, TYPE_ICONS, TYPE_LABELS, isOverdue } from '../services/schedule.service'
import * as S from './style'

interface EventCardProps {
  event: ScheduleEvent
  subject?: Subject
  onToggle: () => void
  onRemove: () => void
}

export function EventCard({ event, subject, onToggle, onRemove }: EventCardProps) {
  const { colors } = useTheme()
  const overdue = isOverdue(event)

  return (
    <S.EventCard $overdue={overdue} $completed={event.completed}>
      <Pressable onPress={onToggle} hitSlop={6}>
        <Ionicons
          name={event.completed ? 'checkmark-circle' : 'ellipse-outline'}
          size={22}
          color={event.completed ? colors.accent : colors.textSecondary}
        />
      </Pressable>

      <S.EventInfo>
        <S.EventBadges>
          <Badge label={TYPE_LABELS[event.type]} color={TYPE_COLORS[event.type]} />
          {subject ? <Badge label={subject.name} color={subject.color} /> : null}
        </S.EventBadges>

        <S.EventTitle $completed={event.completed}>{event.title}</S.EventTitle>

        {event.description ? (
          <S.EventDescription numberOfLines={2}>{event.description}</S.EventDescription>
        ) : null}

        <S.EventDateRow>
          <Ionicons
            name={TYPE_ICONS[event.type]}
            size={12}
            color={overdue ? colors.danger : colors.textSecondary}
          />
          <S.EventDate $overdue={overdue}>
            {formatDateTime(event.date)}
            {event.durationMinutes ? ` · ${event.durationMinutes}min` : ''}
            {overdue ? ' · atrasado' : ''}
          </S.EventDate>
        </S.EventDateRow>
      </S.EventInfo>

      <Pressable onPress={onRemove} hitSlop={8}>
        <Ionicons name="trash-outline" size={18} color={colors.danger} />
      </Pressable>
    </S.EventCard>
  )
}
