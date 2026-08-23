import { useState } from 'react'
import { Layers } from 'lucide-react'
import { Button, Input, Modal } from '@/shared/components/ui'
import { getSubjectIcon, SUBJECT_ICON_OPTIONS } from '@/shared/constants/subjectIcons'
import { cn } from '@/shared/lib/utils'
import { useCreateSubject } from '@/features/library/hooks/useSubjects'
import { SUBJECT_COLORS } from '@/features/library/lib/subjectColors'

interface CreateSubjectModalProps {
  open: boolean
  onClose: () => void
}

export function CreateSubjectModal({ open, onClose }: CreateSubjectModalProps) {
  const createSubject = useCreateSubject()
  const [name, setName] = useState('')
  const [color, setColor] = useState(SUBJECT_COLORS[0])
  const [icon, setIcon] = useState(SUBJECT_ICON_OPTIONS[0])

  const resetAndClose = () => {
    setName('')
    setColor(SUBJECT_COLORS[0])
    setIcon(SUBJECT_ICON_OPTIONS[0])
    onClose()
  }

  const handleCreate = () => {
    if (!name.trim()) return
    createSubject.mutate({ name, color, icon }, { onSuccess: resetAndClose })
  }

  const PreviewIcon = getSubjectIcon(icon)

  return (
    <Modal
      open={open}
      onClose={resetAndClose}
      className="max-w-lg"
      title={
        <span className="flex items-center gap-2.5">
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 shadow-md shadow-primary-500/25 shrink-0">
            <Layers className="w-4 h-4 text-[var(--on-accent)]" />
          </span>
          <span>
            <span className="block text-base font-semibold text-[var(--text)] leading-tight">Nova Matéria</span>
            <span className="block text-xs font-normal text-[var(--text-secondary)] mt-0.5">
              Organize seus estudos por matéria
            </span>
          </span>
        </span>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center gap-4 p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
          <div
            className="flex items-center justify-center w-14 h-14 rounded-2xl shrink-0 shadow-sm transition-colors duration-200"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
          >
            <PreviewIcon className="w-7 h-7 text-[var(--on-accent)]" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-[var(--text-secondary)]">Pré-visualização</p>
            <p className="text-sm font-semibold text-[var(--text)] truncate">
              {name.trim() || 'Nome da matéria'}
            </p>
          </div>
        </div>

        <Input
          label="Nome"
          placeholder="Nome da matéria"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-2">Ícone</label>
          <div className="flex flex-wrap gap-2">
            {SUBJECT_ICON_OPTIONS.map((iconName) => {
              const Icon = getSubjectIcon(iconName)
              const active = icon === iconName
              return (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => setIcon(iconName)}
                  className={cn(
                    'flex items-center justify-center w-9 h-9 rounded-lg border transition-all',
                    active
                      ? 'border-transparent text-white scale-105 shadow-sm'
                      : 'border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                  )}
                  style={active ? { backgroundColor: color } : undefined}
                >
                  <Icon className="w-4 h-4" />
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-2">Cor</label>
          <div className="flex flex-wrap items-center gap-2">
            {SUBJECT_COLORS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setColor(option)}
                className={cn(
                  'w-8 h-8 rounded-full border-2 transition-transform',
                  color === option ? 'border-[var(--text)] scale-110' : 'border-transparent'
                )}
                style={{ backgroundColor: option }}
              />
            ))}
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-8 h-8 rounded-full border border-[var(--border)] cursor-pointer bg-transparent"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <Button className="flex-1" onClick={handleCreate} disabled={createSubject.isPending || !name.trim()}>
            {createSubject.isPending ? 'Salvando...' : 'Salvar Matéria'}
          </Button>
          <Button variant="secondary" onClick={resetAndClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
