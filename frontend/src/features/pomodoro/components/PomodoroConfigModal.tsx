import { Input, Modal } from '@/shared/components/ui'
import { cn } from '@/shared/lib/utils'
import { usePomodoroStore } from '@/features/pomodoro/store/pomodoro.store'

interface PomodoroConfigModalProps {
  open: boolean
  onClose: () => void
}

interface ToggleRowProps {
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between w-full gap-3 py-2 text-left"
    >
      <span>
        <span className="block text-sm font-medium text-[var(--text)]">{label}</span>
        <span className="block text-xs text-[var(--text-secondary)]">{description}</span>
      </span>
      <span
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors',
          checked ? 'bg-primary-500' : 'bg-[var(--border)]'
        )}
      >
        <span
          className={cn(
            'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </span>
    </button>
  )
}

export function PomodoroConfigModal({ open, onClose }: PomodoroConfigModalProps) {
  const settings = usePomodoroStore((s) => s.settings)
  const setSettings = usePomodoroStore((s) => s.setSettings)
  const isRunning = usePomodoroStore((s) => s.isRunning)

  return (
    <Modal open={open} onClose={onClose} title="Configurar Pomodoro">
      <div className="space-y-4">
        {isRunning && (
          <p className="text-xs text-[var(--text-secondary)]">
            As durações só têm efeito na próxima sessão, pois o timer atual já está em andamento.
          </p>
        )}

        <div className="grid grid-cols-3 gap-3">
          <Input
            type="number"
            min={1}
            max={180}
            label="Foco (min)"
            value={settings.focusMinutes}
            onChange={(e) => setSettings({ focusMinutes: Math.max(1, Number(e.target.value) || 1) })}
          />
          <Input
            type="number"
            min={1}
            max={60}
            label="Pausa curta"
            value={settings.shortBreakMinutes}
            onChange={(e) =>
              setSettings({ shortBreakMinutes: Math.max(1, Number(e.target.value) || 1) })
            }
          />
          <Input
            type="number"
            min={1}
            max={90}
            label="Pausa longa"
            value={settings.longBreakMinutes}
            onChange={(e) =>
              setSettings({ longBreakMinutes: Math.max(1, Number(e.target.value) || 1) })
            }
          />
        </div>

        <div className="border-t border-[var(--border)] pt-2 divide-y divide-[var(--border)]">
          <ToggleRow
            label="Som ao finalizar"
            description="Toca um alerta sonoro quando o tempo acaba"
            checked={settings.soundEnabled}
            onChange={(soundEnabled) => setSettings({ soundEnabled })}
          />
          <ToggleRow
            label="Mostrar tempo"
            description="Exibe a contagem regressiva no cabeçalho"
            checked={settings.showTime}
            onChange={(showTime) => setSettings({ showTime })}
          />
        </div>
      </div>
    </Modal>
  )
}
