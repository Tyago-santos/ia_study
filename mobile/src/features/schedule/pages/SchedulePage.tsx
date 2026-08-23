import { useState } from 'react'
import { CalendarPicker } from '@/shared/components/ui/CalendarPicker'
import { EmptyState } from '@/shared/components/ui/EmptyState'
import { FilterChips } from '@/shared/components/ui/FilterChips'
import { FormModal } from '@/shared/components/ui/FormModal'
import { Input } from '@/shared/components/ui/Input'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { Screen } from '@/shared/components/ui/Screen'
import { SectionCard } from '@/shared/components/ui/SectionCard'
import { SkeletonBlock, SkeletonCard } from '@/shared/components/ui/Skeleton'
import { StatTile } from '@/shared/components/ui/StatTile'
import { Tints } from '@/shared/constants/theme'
import { useTheme } from '@/shared/hooks/useTheme'
import { addMinutes, isCompleteTime, maskTime, todayISODate } from '@/shared/lib/time'
import type { ScheduleEvent } from '@/shared/types'
import { EventCard } from '../components/EventCard'
import { useSchedule } from '../hooks/useSchedule'
import {
  DURATION_CHOICES,
  TYPE_COLORS,
  TYPE_LABELS,
  toEventISO,
} from '../services/schedule.service'
import * as S from './style'

export function SchedulePage() {
  const { colors } = useTheme()
  const {
    isLoading,
    subjects,
    events,
    getSubject,
    summary,
    createEvent,
    toggleEvent,
    removeEvent,
  } = useSchedule()

  const [isCreating, setIsCreating] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<ScheduleEvent['type']>('estudo')
  const [subjectId, setSubjectId] = useState<string | null>(null)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [duration, setDuration] = useState<string | null>(null)

  const submit = () =>
    createEvent.mutate(
      {
        title: title.trim(),
        type,
        date: toEventISO(date, time, isCompleteTime(time)),
        durationMinutes: duration ? Number(duration) : undefined,
        subjectId: subjectId ?? undefined,
        description: description.trim() || undefined,
      },
      {
        onSuccess: () => {
          setIsCreating(false)
          setTitle('')
          setDescription('')
          setDate('')
          setTime('')
          setDuration(null)
        },
      },
    )

  if (isLoading) {
    return (
      <Screen scroll>
        <PageHeader title="Cronograma" subtitle="Carregando..." />
        <S.Tiles>
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonBlock key={index} width="46%" height={78} radius={16} />
          ))}
        </S.Tiles>
        <SkeletonCard lines={2} style={{ marginTop: 16, marginBottom: 12 }} />
        <SkeletonCard lines={2} />
      </Screen>
    )
  }

  return (
    <Screen scroll>
      <PageHeader
        title="Cronograma"
        subtitle="Provas, trabalhos e sessões de estudo"
        actionLabel="Novo"
        onAction={() => {
          setSubjectId(subjects[0]?.id ?? null)
          setDate(todayISODate())
          setIsCreating(true)
        }}
      />

      <S.Tiles>
        <StatTile label="Pendentes" value={`${summary.pending}`} icon="time" tint={Tints.cyan} />
        <StatTile label="Provas" value={`${summary.exams}`} icon="school" tint={Tints.red} />
        <StatTile
          label="Atrasados"
          value={`${summary.overdue}`}
          icon="alert-circle"
          tint={Tints.amber}
        />
      </S.Tiles>

      <S.List>
        {events.length > 0 ? (
          events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              subject={getSubject(event.subjectId)}
              onToggle={() => toggleEvent.mutate(event.id)}
              onRemove={() => removeEvent.mutate(event.id)}
            />
          ))
        ) : (
          <SectionCard>
            <EmptyState
              icon="calendar-outline"
              title="Nenhum evento no cronograma"
              description="Toque em Novo para adicionar uma prova, tarefa ou sessão de estudo."
            />
          </SectionCard>
        )}
      </S.List>

      <FormModal
        open={isCreating}
        title="Novo evento"
        onClose={() => setIsCreating(false)}
        onSubmit={submit}
        submitLabel="Criar evento"
        isSubmitting={createEvent.isPending}
        submitDisabled={!title.trim() || !date}
      >
        <Input
          label="Título"
          value={title}
          onChangeText={setTitle}
          placeholder="Ex: Prova de Física"
        />

        <S.FieldLabel>Tipo</S.FieldLabel>
        <FilterChips
          value={type}
          onChange={(value) => setType((value as ScheduleEvent['type']) ?? 'estudo')}
          options={(Object.keys(TYPE_LABELS) as ScheduleEvent['type'][]).map((t) => ({
            value: t,
            label: TYPE_LABELS[t],
            color: TYPE_COLORS[t],
          }))}
        />

        <S.FieldLabel>Matéria</S.FieldLabel>
        <FilterChips
          value={subjectId}
          onChange={setSubjectId}
          options={subjects.map((s) => ({ value: s.id, label: s.name, color: s.color }))}
        />

        <S.FieldLabel>Data</S.FieldLabel>
        <CalendarPicker value={date} onChange={setDate} />

        <S.TimeFields>
          <S.TimeField>
            <S.FieldLabel>Horário</S.FieldLabel>
            <S.TimeInput
              underlineColorAndroid="transparent"
              value={time}
              onChangeText={(value) => setTime(maskTime(value))}
              placeholder="--:--"
              placeholderTextColor={colors.textSecondary}
              keyboardType="number-pad"
              maxLength={5}
            />
          </S.TimeField>

          <S.TimeField>
            <S.FieldLabel>
              Duração
              {time && isCompleteTime(time) && duration
                ? ` · termina ${addMinutes(time, Number(duration))}`
                : ''}
            </S.FieldLabel>
            <FilterChips
              value={duration}
              onChange={(value) => setDuration(value)}
              options={DURATION_CHOICES.map((minutes) => ({
                value: String(minutes),
                label: `${minutes}min`,
              }))}
            />
          </S.TimeField>
        </S.TimeFields>

        <Input
          label="Descrição (opcional)"
          value={description}
          onChangeText={setDescription}
          placeholder="Detalhes do evento"
          multiline
        />
      </FormModal>
    </Screen>
  )
}
