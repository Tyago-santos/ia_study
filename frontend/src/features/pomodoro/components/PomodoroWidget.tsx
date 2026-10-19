import { useEffect, useId, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { BookOpen, Coffee, Moon, Pause, Play, RotateCcw, Settings, Timer, Zap, type LucideIcon } from 'lucide-react'
import { Button } from '@/shared/components/ui'
import { cn } from '@/shared/lib/utils'
import { useSubjects } from '@/features/library/hooks/useSubjects'
import { formatPomodoroTime, MODE_LABELS, type PomodoroMode } from '@/features/pomodoro/lib/timer'
import { usePomodoroStore } from '@/features/pomodoro/store/pomodoro.store'
import { PomodoroConfigModal } from './PomodoroConfigModal'

interface PomodoroWidgetProps {
  compact?: boolean
}

const MODE_ICONS: Record<PomodoroMode, LucideIcon> = {
  focus: Zap,
  shortBreak: Coffee,
  longBreak: Moon,
}

export function PomodoroWidget({ compact }: PomodoroWidgetProps) {
  const [panelOpen, setPanelOpen] = useState(false)
  const [configOpen, setConfigOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const gradientId = useId()

  const mode = usePomodoroStore((s) => s.mode)
  const timeLeft = usePomodoroStore((s) => s.timeLeft)
  const totalTime = usePomodoroStore((s) => s.totalTime)
  const isRunning = usePomodoroStore((s) => s.isRunning)
  const showTime = usePomodoroStore((s) => s.settings.showTime)
  const selectedSubjectId = usePomodoroStore((s) => s.selectedSubjectId)
  const setSelectedSubjectId = usePomodoroStore((s) => s.setSelectedSubjectId)
  const switchMode = usePomodoroStore((s) => s.switchMode)
  const toggleRunning = usePomodoroStore((s) => s.toggleRunning)

  const { data: subjects, isLoading: subjectsLoading } = useSubjects()
  // Uma sessão "em andamento" (timer iniciado mas ainda não concluído) trava
  // a troca de matéria — sem id de sessão vindo do servidor, isso é só o
  // timer ter saído do estado inicial.
  const sessionStarted = timeLeft !== totalTime || isRunning

  useEffect(() => {
    if (!panelOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setPanelOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [panelOpen])

  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0

  const handleToggle = () => {
    if (!isRunning && mode === 'focus' && !selectedSubjectId) return
    toggleRunning()
  }

  const handleReset = () => {
    usePomodoroStore.getState().resetTimer()
  }

  const handleSwitchMode = (newMode: PomodoroMode) => {
    if (isRunning) return
    switchMode(newMode)
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setPanelOpen((v) => !v)}
        className={cn(
          'flex items-center gap-2 h-9 px-2.5 rounded-xl text-sm font-medium transition-all',
          'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text)]',
          isRunning && 'text-[var(--accent-text)]'
        )}
        title="Pomodoro"
      >
        <span className="relative flex items-center justify-center">
          <Timer className="w-[18px] h-[18px]" />
          {isRunning && (
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
          )}
        </span>
        {!compact && showTime && (isRunning || timeLeft !== totalTime) && (
          <span className="tabular-nums">{formatPomodoroTime(timeLeft)}</span>
        )}
      </button>

      {panelOpen && (
        <div className="fixed inset-x-3 top-16 z-50 rounded-2xl border backdrop-blur-xl p-4 bg-[var(--card-bg)] border-[var(--border)] shadow-[var(--glass-shadow)] sm:absolute sm:inset-x-auto sm:top-full sm:right-0 sm:mt-2 sm:w-72">
          <div className="flex gap-1 mb-4 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-1">
            {(Object.keys(MODE_LABELS) as PomodoroMode[]).map((m) => {
              const ModeIcon = MODE_ICONS[m]
              return (
                <button
                  key={m}
                  onClick={() => handleSwitchMode(m)}
                  disabled={isRunning}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all disabled:cursor-not-allowed',
                    mode === m
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-sm shadow-primary-500/30'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
                  )}
                >
                  <ModeIcon className="w-3.5 h-3.5" />
                  {MODE_LABELS[m]}
                </button>
              )
            })}
          </div>

          {mode === 'focus' && subjects && subjects.length > 0 && (
            <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-500/15 text-primary-300">
                <BookOpen className="w-4 h-4" />
              </span>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                disabled={sessionStarted}
                aria-label="Matéria ativa"
                className="w-full bg-transparent text-sm text-[var(--text)] focus:outline-none disabled:opacity-60"
              >
                <option value="">Selecione uma matéria</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {mode === 'focus' && !subjectsLoading && (!subjects || subjects.length === 0) && (
            <p className="mb-4 text-xs text-[var(--text-secondary)] text-center">
              Cadastre uma matéria na{' '}
              <Link
                to="/biblioteca"
                onClick={() => setPanelOpen(false)}
                className="text-[var(--accent-text)] font-medium hover:underline"
              >
                Biblioteca
              </Link>{' '}
              para iniciar o Pomodoro.
            </p>
          )}

          <div className="flex flex-col items-center py-2">
            <div className="relative w-32 h-32 mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <defs>
                  <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--accent)" />
                    <stop offset="100%" stopColor="var(--tertiary-accent)" />
                  </linearGradient>
                </defs>
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-[var(--border)]"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  fill="none"
                  stroke={`url(#${gradientId})`}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 58}`}
                  strokeDashoffset={`${2 * Math.PI * 58 * (1 - progress / 100)}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                {showTime ? (
                  <>
                    <span className="text-3xl font-bold leading-none text-[var(--text)] tabular-nums">
                      {formatPomodoroTime(timeLeft)}
                    </span>
                    <span
                      className={cn(
                        'flex items-center gap-1 text-[11px] font-semibold',
                        mode === 'focus'
                          ? 'text-tertiary-400'
                          : 'text-[var(--text-secondary)]'
                      )}
                    >
                      {(() => {
                        const LabelIcon = MODE_ICONS[mode]
                        return <LabelIcon className="w-3 h-3" />
                      })()}
                      {mode === 'focus' ? 'Hiperfoco Ativo' : MODE_LABELS[mode]}
                    </span>
                  </>
                ) : (
                  <span className="text-xs font-medium text-[var(--text-secondary)] text-center px-2">
                    {isRunning ? 'Em andamento...' : MODE_LABELS[mode]}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleReset}
                title="Reiniciar"
                className="h-11 w-11 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text)]"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                onClick={handleToggle}
                disabled={!isRunning && mode === 'focus' && !selectedSubjectId}
                title={
                  isRunning
                    ? 'Pausar'
                    : mode === 'focus' && !selectedSubjectId
                      ? 'Selecione uma matéria para iniciar'
                      : 'Iniciar'
                }
                className="h-11 gap-2 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 px-6 text-white font-semibold hover:shadow-lg hover:shadow-primary-500/40"
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isRunning ? 'Pausar' : 'Iniciar'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setConfigOpen(true)}
                title="Configurar"
                className="h-11 w-11 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text)]"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <PomodoroConfigModal open={configOpen} onClose={() => setConfigOpen(false)} />
    </div>
  )
}
