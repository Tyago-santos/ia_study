import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Pause, Play, RotateCcw, Settings, Timer } from 'lucide-react'
import { Button } from '@/shared/components/ui'
import { cn } from '@/shared/lib/utils'
import { useSubjects } from '@/features/library/hooks/useSubjects'
import { formatPomodoroTime, MODE_LABELS, type PomodoroMode } from '@/features/pomodoro/lib/timer'
import { usePomodoroStore } from '@/features/pomodoro/store/pomodoro.store'
import { PomodoroConfigModal } from './PomodoroConfigModal'

interface PomodoroWidgetProps {
  compact?: boolean
}

export function PomodoroWidget({ compact }: PomodoroWidgetProps) {
  const [panelOpen, setPanelOpen] = useState(false)
  const [configOpen, setConfigOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

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
        <div className="fixed inset-x-3 top-16 z-50 rounded-2xl border backdrop-blur-xl p-4 bg-[var(--card-bg)] border-[var(--glass-border)] shadow-2xl sm:absolute sm:inset-x-auto sm:top-full sm:right-0 sm:mt-2 sm:w-72">
          <div className="flex gap-1.5 mb-4">
            {(Object.keys(MODE_LABELS) as PomodoroMode[]).map((m) => (
              <button
                key={m}
                onClick={() => handleSwitchMode(m)}
                disabled={isRunning}
                className={cn(
                  'flex-1 rounded-lg py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed',
                  mode === m
                    ? 'bg-primary-500 text-[var(--on-accent)]'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text)]'
                )}
              >
                {MODE_LABELS[m]}
              </button>
            ))}
          </div>

          {mode === 'focus' && subjects && subjects.length > 0 && (
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              disabled={sessionStarted}
              className="w-full mb-4 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-sm text-[var(--text)] disabled:opacity-60"
            >
              <option value="">Selecione uma matéria</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
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
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 58}`}
                  strokeDashoffset={`${2 * Math.PI * 58 * (1 - progress / 100)}`}
                  className="text-[var(--accent-text)] transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                {showTime ? (
                  <span className="text-2xl font-bold text-[var(--text)] tabular-nums">
                    {formatPomodoroTime(timeLeft)}
                  </span>
                ) : (
                  <span className="text-xs font-medium text-[var(--text-secondary)] text-center px-2">
                    {isRunning ? 'Em andamento...' : MODE_LABELS[mode]}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" size="sm" onClick={handleReset} title="Reiniciar">
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
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setConfigOpen(true)}
                title="Configurar"
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
