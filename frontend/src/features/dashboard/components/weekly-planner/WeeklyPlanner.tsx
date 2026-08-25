import { useCallback, useMemo, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  pointerWithin,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { CalendarDays, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui'
import { useSubjects } from '@/features/library/hooks/useSubjects'
import { useSchedule, useMoveEventToWeekday, usePostponeEvent } from '@/features/schedule/hooks/useSchedule'
import { DAY_LABELS, formatDuration } from '@/features/dashboard/lib/duration'
import { groupEventsByWeekday, unplacedEvents } from '@/features/dashboard/lib/scheduleEvents'
import { useWeeklyPlannerStore } from '@/features/dashboard/store/weeklyPlanner.store'
import type { PlanBlock, ScheduleEvent } from '@/shared/types'
import { DayColumn } from './DayColumn'
import { SubjectPalette } from './SubjectPalette'
import { EventPalette } from './EventPalette'
import { StudyBlockCard } from './StudyBlock'
import { ScheduleEventOverlayCard } from './ScheduleEventBlock'

const TODAY_INDEX = new Date().getDay()

type DraggableData =
  | { type: 'subject'; subjectId: string }
  | { type: 'block'; dayIndex: number; blockId: string }
  | { type: 'event'; eventId: string; date: string }
  | { type: 'day'; dayIndex: number }
  | { type: 'subjects' }

export function WeeklyPlanner() {
  const { days, addBlock, moveBlock } = useWeeklyPlannerStore()
  const { data: subjects } = useSubjects()
  const { data: events } = useSchedule()
  const moveEventToWeekday = useMoveEventToWeekday()
  const postponeEvent = usePostponeEvent()
  const [activeBlock, setActiveBlock] = useState<PlanBlock | null>(null)
  const [activeEvent, setActiveEvent] = useState<ScheduleEvent | null>(null)
  const [overContainer, setOverContainer] = useState<number | 'subjects' | null>(null)

  const eventsByDay = useMemo(() => groupEventsByWeekday(events ?? []), [events])
  const pendingEvents = useMemo(() => unplacedEvents(events ?? []), [events])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const resolveContainer = useCallback(
    (id: string): number | 'subjects' | null => {
      if (id === 'subjects') return 'subjects'
      if (id.startsWith('day-')) return parseInt(id.replace('day-', ''), 10)
      if (id.startsWith('block-')) {
        const blockId = id.replace('block-', '')
        const day = days.find((d) => d.blocks.some((b) => b.id === blockId))
        return day ? day.dayIndex : null
      }
      return null
    },
    [days]
  )

  const handleDragStart = useCallback(
    (dragEvent: DragStartEvent) => {
      const data = dragEvent.active.data.current as DraggableData | undefined
      if (data?.type === 'block') {
        const block = days
          .find((d) => d.dayIndex === data.dayIndex)
          ?.blocks.find((b) => b.id === data.blockId)
        setActiveBlock(block ?? null)
        setActiveEvent(null)
      } else if (data?.type === 'event') {
        const found = (events ?? []).find((e) => e.id === data.eventId)
        setActiveEvent(found ?? null)
        setActiveBlock(null)
      } else {
        setActiveBlock(null)
        setActiveEvent(null)
      }
    },
    [days, events]
  )

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event
      if (!over) {
        setOverContainer(null)
        return
      }

      const overResolved = resolveContainer(over.id as string)
      setOverContainer(overResolved)

      const activeData = active.data.current as DraggableData | undefined
      if (activeData?.type !== 'block') return

      const activeResolved = resolveContainer(active.id as string)
      if (
        activeResolved === null ||
        overResolved === null ||
        activeResolved === 'subjects' ||
        overResolved === 'subjects' ||
        activeResolved === overResolved
      ) {
        return
      }

      const sourceDay = activeResolved
      const destDay = overResolved
      const sourceBlocks = days.find((d) => d.dayIndex === sourceDay)?.blocks ?? []
      const destBlocks = days.find((d) => d.dayIndex === destDay)?.blocks ?? []

      const activeIndex = sourceBlocks.findIndex((b) => `block-${b.id}` === active.id)
      if (activeIndex === -1) return

      let overIndex = destBlocks.findIndex((b) => `block-${b.id}` === over.id)
      if (overIndex === -1) overIndex = destBlocks.length

      moveBlock(sourceDay, destDay, activeIndex, overIndex)
    },
    [days, moveBlock, resolveContainer]
  )

  const handleDragEnd = useCallback(
    (dragEvent: DragEndEvent) => {
      const { active, over } = dragEvent
      setActiveBlock(null)
      setActiveEvent(null)
      setOverContainer(null)
      if (!over) return

      const activeData = active.data.current as DraggableData | undefined

      if (activeData?.type === 'event') {
        const destContainer = resolveContainer(over.id as string)
        if (destContainer === null || destContainer === 'subjects') return
        moveEventToWeekday.mutate({
          id: activeData.eventId,
          weekday: destContainer,
          date: activeData.date,
        })
        return
      }

      if (activeData?.type === 'subject') {
        const destContainer = resolveContainer(over.id as string)
        if (destContainer === null || destContainer === 'subjects') return
        const subject = subjects?.find((s) => s.id === activeData.subjectId)
        if (!subject) return

        addBlock(destContainer, {
          id: `block-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          subjectId: subject.id,
          subjectName: subject.name,
          subjectColor: subject.color,
          duration: 60,
        })
        return
      }

      if (activeData?.type === 'block') {
        const container = resolveContainer(active.id as string)
        if (container === null || container === 'subjects') return
        const overResolved = resolveContainer(over.id as string)
        if (overResolved !== container) return

        const blocks = days.find((d) => d.dayIndex === container)?.blocks ?? []
        const activeIndex = blocks.findIndex((b) => `block-${b.id}` === active.id)
        let overIndex = blocks.findIndex((b) => `block-${b.id}` === over.id)
        if (overIndex === -1) overIndex = blocks.length - 1
        if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
          moveBlock(container, container, activeIndex, overIndex)
        }
      }
    },
    [addBlock, days, moveBlock, moveEventToWeekday, resolveContainer, subjects]
  )

  const handlePostponeEvent = useCallback(
    (event: ScheduleEvent) => {
      postponeEvent.mutate({ id: event.id, date: event.date })
    },
    [postponeEvent]
  )

  const totalWeeklyMinutes = days.reduce(
    (acc, day) => acc + day.blocks.reduce((sum, b) => sum + b.duration, 0),
    0
  )

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-cyan-500/5 to-transparent pointer-events-none" />
      <CardHeader className="relative">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 shadow-lg shadow-primary-500/25">
              <CalendarDays className="w-5 h-5 text-[var(--on-accent)]" />
            </div>
            <div>
              <CardTitle>Planejamento Semanal</CardTitle>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Arraste as matérias para montar sua rotina
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-text)]" />
            <span className="text-xs font-bold bg-gradient-to-r from-primary-500 to-cyan-500 bg-clip-text text-transparent">
              {formatDuration(totalWeeklyMinutes)}
            </span>
            <span className="text-[10px] text-[var(--text-secondary)]">esta semana</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <DndContext
          sensors={sensors}
          collisionDetection={pointerWithin}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
            Matérias
          </p>

          <SubjectPalette subjects={subjects ?? []} isOver={overContainer === 'subjects'} />

          <EventPalette events={pendingEvents} />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {DAY_LABELS.map((name, index) => (
              <DayColumn
                key={name}
                dayName={name}
                dayIndex={index}
                isToday={index === TODAY_INDEX}
                isOver={overContainer === index}
                events={eventsByDay.get(index) ?? []}
                onPostponeEvent={handlePostponeEvent}
              />
            ))}
          </div>

          <DragOverlay dropAnimation={{ duration: 150, easing: 'ease' }}>
            {activeBlock && <StudyBlockCard block={activeBlock} />}
            {activeEvent && <ScheduleEventOverlayCard event={activeEvent} />}
          </DragOverlay>
        </DndContext>
      </CardContent>
    </Card>
  )
}
