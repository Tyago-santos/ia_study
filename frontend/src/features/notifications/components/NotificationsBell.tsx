import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Bell, BellRing } from 'lucide-react'
import { getDateInfo, TYPE_STYLES } from '@/features/schedule/lib/eventTypes'
import { useNotificationsCenter } from '../hooks/useNotificationsCenter'
import type { Reminder } from '../lib/reminders'

function reminderLabel(reminder: Reminder): string {
  const { label } = getDateInfo(reminder.at.toISOString(), false)
  const time = reminder.at.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  return `${label} · ${time}`
}

export function NotificationsBell() {
  const { upcoming } = useNotificationsCenter()
  const [open, setOpen] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(
    typeof Notification === 'undefined' ? 'unsupported' : Notification.permission
  )
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const hasUpcoming = upcoming.length > 0

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex items-center justify-center w-9 h-9 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--glass-bg)] hover:text-[var(--text)]"
        title="Notificações"
      >
        {hasUpcoming ? <BellRing className="w-[18px] h-[18px]" /> : <Bell className="w-[18px] h-[18px]" />}
        {hasUpcoming && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
        )}
      </button>

      {open && (
        <div className="fixed inset-x-3 top-16 z-50 rounded-2xl border backdrop-blur-xl bg-[var(--card-bg)] border-[var(--glass-border)] shadow-2xl sm:absolute sm:inset-x-auto sm:top-full sm:right-0 sm:mt-2 sm:w-80">
          <div className="px-4 py-3 border-b border-[var(--border)]">
            <p className="text-sm font-semibold text-[var(--text)]">Próximos compromissos</p>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {!hasUpcoming ? (
              <p className="px-4 py-6 text-sm text-[var(--text-secondary)] text-center">
                Nenhum compromisso próximo.
              </p>
            ) : (
              upcoming.map((reminder) => {
                const { icon: Icon, color } = TYPE_STYLES[reminder.event.type]
                return (
                  <div
                    key={reminder.id}
                    className="flex items-start gap-3 px-4 py-2.5 hover:bg-[var(--bg-secondary)]"
                  >
                    <span
                      className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                      style={{ backgroundColor: `${color}18`, color }}
                    >
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-[var(--text)] truncate">
                        {reminder.event.title}
                      </span>
                      <span className="block text-xs text-[var(--text-secondary)]">
                        {reminderLabel(reminder)}
                      </span>
                    </span>
                  </div>
                )
              })
            )}
          </div>

          {permission === 'default' && (
            <button
              onClick={() => Notification.requestPermission().then(setPermission)}
              className="w-full px-4 py-2.5 text-xs font-medium text-center text-[var(--accent-text)] border-t border-[var(--border)] hover:bg-[var(--bg-secondary)]"
            >
              Ativar avisos do navegador
            </button>
          )}

          <Link
            to="/cronograma"
            onClick={() => setOpen(false)}
            className="block w-full px-4 py-2.5 text-xs font-medium text-center text-[var(--text-secondary)] hover:text-[var(--text)] border-t border-[var(--border)] hover:bg-[var(--bg-secondary)] rounded-b-2xl"
          >
            Ver cronograma completo
          </Link>
        </div>
      )}
    </div>
  )
}
