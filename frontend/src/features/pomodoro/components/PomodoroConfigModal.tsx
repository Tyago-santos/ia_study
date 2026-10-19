import { Clock, Volume2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
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
  icon: LucideIcon
}

function ToggleRow({ label, description, checked, onChange, icon: Icon }: ToggleRowProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-3 text-left transition-colors hover:border-[var(--focus-ring)]/40"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-500/15 text-primary-300">
        <Icon className="w-4 h-4" />
      </span>
      <span className="flex-1">
        <span className="block text-sm font-medium text-[var(--text)]">{label}</span>
        <span className="block text-xs text-[var(--text-secondary)]">{description}</span>
      </span>
      <span
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors',
          checked ? 'bg-gradient-to-r from-primary-500 to-secondary-500' : 'bg-[var(--border)]'
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
          <p className="rounded-xl border border-primary-500/20 bg-primary-500/10 p-3 text-xs text-primary-300">
            As durações só têm efeito na próxima sessão, pois o timer atual já está em andamento.
          </p>
        )}

        <div className="grid grid-cols-3 gap-3">
          <Input
            type="number"
            min={1}
            max={180}
            label="Foco (min)"
            className="rounded-xl bg-[var(--bg-secondary)]"
            value={settings.focusMinutes}
            onChange={(e) => setSettings({ focusMinutes: Math.max(1, Number(e.target.value) || 1) })}
          />
          <Input
            type="number"
            min={1}
            max={60}
            label="Pausa curta"
            className="rounded-xl bg-[var(--bg-secondary)]"
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
            className="rounded-xl bg-[var(--bg-secondary)]"
            value={settings.longBreakMinutes}
            onChange={(e) =>
              setSettings({ longBreakMinutes: Math.max(1, Number(e.target.value) || 1) })
            }
          />
        </div>

        <div className="space-y-2">
          <ToggleRow
            label="Som ao finalizar"
            description="Toca um alerta sonoro quando o tempo acaba"
            checked={settings.soundEnabled}
            onChange={(soundEnabled) => setSettings({ soundEnabled })}
            icon={Volume2}
          />
          <ToggleRow
            label="Mostrar tempo"
            description="Exibe a contagem regressiva no cabeçalho"
            checked={settings.showTime}
            onChange={(showTime) => setSettings({ showTime })}
            icon={Clock}
          />
        </div>
      </div>
    </Modal>
  )
}
