import { useState } from 'react'
import { CalendarClock } from 'lucide-react'
import { Card, CardContent, EmptyState, ErrorState, ListSkeleton } from '@/shared/components/ui'
import { useSubjects } from '@/features/library/hooks/useSubjects'
import { useSchedule } from '@/features/schedule/hooks/useSchedule'
import { summarizeEvents } from '@/features/schedule/lib/eventTypes'
import { CreateEventModal } from '../components/CreateEventModal'
import { EventRow } from '../components/EventRow'
import { ScheduleHeader } from '../components/ScheduleHeader'

export function SchedulePage() {
  const [isCreating, setIsCreating] = useState(false)

  const { data: events, isLoading, error, refetch } = useSchedule()
  const { data: subjects } = useSubjects()

  const getSubject = (id?: string) => subjects?.find((s) => s.id === id)
  const { pending, overdue, exams } = summarizeEvents(events)

  if (error) {
    return <ErrorState message="Erro ao carregar cronograma" onRetry={refetch} />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <ScheduleHeader
        pending={pending}
        exams={exams}
        overdue={overdue}
        onCreate={() => setIsCreating(true)}
      />

      <CreateEventModal open={isCreating} onClose={() => setIsCreating(false)} />

      {isLoading ? (
        <ListSkeleton count={5} />
      ) : events && events.length > 0 ? (
        <div className="space-y-3">
          {events.map((event) => {
            const subject = getSubject(event.subjectId)
            return (
              <EventRow
                key={event.id}
                event={event}
                subjectName={subject?.name}
                subjectColor={subject?.color}
              />
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent>
            <EmptyState
              icon={<CalendarClock className="w-12 h-12" />}
              title="Nenhum evento no cronograma"
              description="Clique em 'Novo Evento' para adicionar uma prova, tarefa ou sessao de estudo."
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
