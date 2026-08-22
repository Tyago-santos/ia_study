import { Ionicons } from '@expo/vector-icons'
import { useRef, useState } from 'react'
import { Pressable, type View } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import { FilterChips } from '@/shared/components/ui/FilterChips'
import { FormModal } from '@/shared/components/ui/FormModal'
import { ProgressBar } from '@/shared/components/ui/ProgressBar'
import { SectionCard } from '@/shared/components/ui/SectionCard'
import { useTheme } from '@/shared/hooks/useTheme'
import { useWeeklyPlanner } from '../hooks/useWeeklyPlanner'
import type { DropZone } from '../libs/dropZones'
import { EVENT_COLORS, EVENT_ICONS } from '../libs/eventStyles'
import {
  WEEKLY_GOAL_OPTIONS,
  dayTotalMinutes,
  formatDuration,
  sortBlocks,
} from '../services/planner.service'
import { DayZone } from './DayZone'
import { Draggable } from './Draggable'
import { PlanBlockCard } from './PlanBlockCard'
import { PlannerPalette } from './PlannerPalette'
import * as S from './style'

export function WeeklyPlanner() {
  const { colors } = useTheme()
  const planner = useWeeklyPlanner()

  const [editingGoal, setEditingGoal] = useState(false)

  /** Bloco cujo seletor de assunto esta aberto, identificado por dia + id. */
  const [editingBlock, setEditingBlock] = useState<{ dayIndex: number; blockId: string } | null>(
    null,
  )

  const zones = useSharedValue<DropZone[]>([])
  const hovered = useSharedValue(-1)
  const dayRefs = useRef<Map<number, View>>(new Map())

  /**
   * Espelho das zonas no lado JS. As medidas sao acumuladas aqui e so entao
   * copiadas para a shared value — ler `zones.value` fora de um worklet e o que
   * dispara o aviso de "reading during render" do Reanimated.
   */
  const zonesRef = useRef<Map<number, DropZone>>(new Map())

  /** Remede um dia e regrava o retangulo que o worklet de arrasto consulta. */
  const measureDay = (dayIndex: number) => {
    const node = dayRefs.current.get(dayIndex)
    node?.measureInWindow((x, y, width, height) => {
      zonesRef.current.set(dayIndex, { dayIndex, x, y, width, height })
      zones.value = Array.from(zonesRef.current.values())
    })
  }

  /** Atualiza todos os dias de uma vez, chamado ao encostar o dedo num item. */
  const measureAllDays = () => {
    dayRefs.current.forEach((_node, dayIndex) => measureDay(dayIndex))
  }

  return (
    <SectionCard
      title="Planner semanal"
      action={
        <S.GoalAction onPress={() => setEditingGoal(true)} hitSlop={8}>
          <S.TotalText>
            {formatDuration(planner.totalMinutes)} de {formatDuration(planner.weeklyGoalMinutes)}
          </S.TotalText>
          <Ionicons name="create-outline" size={14} color={colors.textSecondary} />
        </S.GoalAction>
      }
    >
      {/* Progresso do que ja foi planejado contra a meta da semana. */}
      <S.GoalBlock>
        <ProgressBar value={planner.goalProgress} height={6} />
        <S.GoalCaption>
          {planner.goalProgress >= 100
            ? 'Meta da semana alcançada'
            : `Faltam ${formatDuration(planner.weeklyGoalMinutes - planner.totalMinutes)} para a meta`}
        </S.GoalCaption>
      </S.GoalBlock>

      <S.Hint>Segure uma matéria ou compromisso e arraste até o dia desejado</S.Hint>

      <PlannerPalette
        subjects={planner.subjects}
        pendingEvents={planner.pendingEvents}
        zones={zones}
        hovered={hovered}
        onMeasure={measureAllDays}
        onDropSubject={planner.dropSubject}
        onDropEvent={(event, weekday) => planner.moveEvent.mutate({ id: event.id, weekday })}
      />

      {planner.days.map((day) => {
        const dayEvents = planner.eventsByDay.get(day.dayIndex) ?? []

        return (
          <DayZone
            key={day.dayIndex}
            dayIndex={day.dayIndex}
            dayName={day.dayName}
            totalMinutes={dayTotalMinutes(day, dayEvents)}
            hovered={hovered}
            registerRef={(node) => {
              if (node) dayRefs.current.set(day.dayIndex, node)
            }}
            onLayout={() => measureDay(day.dayIndex)}
          >
            {/* Eventos do cronograma entram como itens fixos do dia: sao
                compromissos ja marcados, nao blocos que o planner move. */}
            {dayEvents.map((event) => (
              <Draggable
                key={event.id}
                zones={zones}
                hovered={hovered}
                onMeasure={measureAllDays}
                onDrop={(weekday) => planner.moveEvent.mutate({ id: event.id, weekday })}
              >
                <S.EventItem $color={EVENT_COLORS[event.type]}>
                  <Ionicons
                    name={EVENT_ICONS[event.type]}
                    size={13}
                    color={EVENT_COLORS[event.type]}
                  />
                  <S.EventTitle numberOfLines={1}>{event.title}</S.EventTitle>
                  <S.EventTime>
                    {new Date(event.date).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {event.durationMinutes ? ` · ${formatDuration(event.durationMinutes)}` : ''}
                  </S.EventTime>

                  <Pressable onPress={() => planner.postponeEvent.mutate(event.id)} hitSlop={8}>
                    <Ionicons name="close-circle" size={17} color={colors.textSecondary} />
                  </Pressable>
                </S.EventItem>
              </Draggable>
            ))}

            {day.blocks.length === 0 && dayEvents.length === 0 ? (
              <S.DayEmpty>Solte uma matéria aqui</S.DayEmpty>
            ) : (
              sortBlocks(day.blocks).map((block) => (
                <Draggable
                  key={block.id}
                  zones={zones}
                  hovered={hovered}
                  onMeasure={measureAllDays}
                  onDrop={(target) => planner.moveBlock(day.dayIndex, target, block.id)}
                >
                  <PlanBlockCard
                    block={block}
                    subjectIcon={planner.subjectIcons.get(block.subjectId)}
                    topics={planner.topics.filter((topic) => topic.subjectId === block.subjectId)}
                    expanded={editingBlock?.blockId === block.id}
                    onToggle={() =>
                      setEditingBlock(
                        editingBlock?.blockId === block.id
                          ? null
                          : { dayIndex: day.dayIndex, blockId: block.id },
                      )
                    }
                    onChangeDuration={(duration) =>
                      planner.updateDuration(day.dayIndex, block.id, duration)
                    }
                    onChangeStartTime={(startTime) =>
                      planner.updateStartTime(day.dayIndex, block.id, startTime)
                    }
                    onChangeTopic={(topicId, topicName) => {
                      planner.updateTopic(day.dayIndex, block.id, topicId, topicName)
                      setEditingBlock(null)
                    }}
                    onRemove={() => planner.removeBlock(day.dayIndex, block.id)}
                  />
                </Draggable>
              ))
            )}
          </DayZone>
        )
      })}

      <FormModal open={editingGoal} title="Meta da semana" onClose={() => setEditingGoal(false)}>
        <S.GoalModalLabel>Quanto você quer estudar nesta semana</S.GoalModalLabel>
        <FilterChips
          value={String(planner.weeklyGoalMinutes)}
          onChange={(value) => {
            planner.setWeeklyGoal(Number(value))
            setEditingGoal(false)
          }}
          options={WEEKLY_GOAL_OPTIONS.map((minutes) => ({
            value: String(minutes),
            label: formatDuration(minutes),
          }))}
        />
      </FormModal>
    </SectionCard>
  )
}
