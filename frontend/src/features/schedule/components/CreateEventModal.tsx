import { useState } from 'react'
import { CalendarClock } from 'lucide-react'
import { Button, Input, Modal } from '@/shared/components/ui'
import { cn } from '@/shared/lib/utils'
import type { ScheduleEvent } from '@/shared/types'
import { useSubjects } from '@/features/library/hooks/useSubjects'
import { useCreateEvent } from '@/features/schedule/hooks/useSchedule'
import { TYPE_STYLES } from '@/features/schedule/lib/eventTypes'

interface CreateEventModalProps {
  open: boolean
  onClose: () => void
}

export function CreateEventModal({ open, onClose }: CreateEventModalProps) {
  const { data: subjects } = useSubjects()
  const createEvent = useCreateEvent()

  const [title, setTitle] = useState('')
  const [type, setType] = useState<ScheduleEvent['type']>('estudo')
  const [subjectId, setSubjectId] = useState('')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')

  const resetAndClose = () => {
    setTitle('')
    setType('estudo')
    setSubjectId('')
    setDate('')
    setDescription('')
    onClose()
  }

  const handleCreate = () => {
    if (!title.trim() || !date) return
    createEvent.mutate(
      {
        title,
        type,
        date: new Date(date).toISOString(),
        subjectId: subjectId || undefined,
        description: description.trim() || undefined,
      },
      { onSuccess: resetAndClose }
    )
  }

  return (
    <Modal
      open={open}
      onClose={resetAndClose}
      className="max-w-lg"
      title={
        <span className="flex items-center gap-2.5">
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 shadow-md shadow-primary-500/25 shrink-0">
            <CalendarClock className="w-4 h-4 text-[var(--on-accent)]" />
          </span>
          <span>
            <span className="block text-base font-semibold text-[var(--text)] leading-tight">Novo Evento</span>
            <span className="block text-xs font-normal text-[var(--text-secondary)] mt-0.5">
              Adicione uma prova, tarefa ou sessao de estudo
            </span>
          </span>
        </span>
      }
    >
      <div className="space-y-4">
        <Input
          label="Titulo"
          placeholder="Ex: Prova de Calculo I"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-1">Tipo</label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(TYPE_STYLES) as ScheduleEvent['type'][]).map((key) => {
              const style = TYPE_STYLES[key]
              const Icon = style.icon
              const active = type === key
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setType(key)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors',
                    active
                      ? 'text-white border-transparent'
                      : 'border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text)]'
                  )}
                  style={active ? { backgroundColor: style.color } : undefined}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {style.label}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-1">Materia (opcional)</label>
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:border-transparent"
          >
            <option value="">Nenhuma</option>
            {subjects?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Data"
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-1">
            Descricao (opcional)
          </label>
          <textarea
            className="w-full h-24 px-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-[var(--text)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:border-transparent resize-none"
            placeholder="Detalhes do evento..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex gap-2 pt-1">
          <Button
            className="flex-1"
            onClick={handleCreate}
            disabled={createEvent.isPending || !title.trim() || !date}
          >
            {createEvent.isPending ? 'Salvando...' : 'Salvar Evento'}
          </Button>
          <Button variant="secondary" onClick={resetAndClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
