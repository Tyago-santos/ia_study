import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { useFinishSession } from '@/features/pomodoro/hooks/usePomodoro'
import { playPomodoroSound } from '@/features/pomodoro/lib/sound'
import { usePomodoroStore } from '@/features/pomodoro/store/pomodoro.store'

const nextModeAfterFocus = 'shortBreak' as const

export function PomodoroEngine() {
  const isRunning = usePomodoroStore((s) => s.isRunning)
  const timeLeft = usePomodoroStore((s) => s.timeLeft)
  const mode = usePomodoroStore((s) => s.mode)
  const totalTime = usePomodoroStore((s) => s.totalTime)
  const soundEnabled = usePomodoroStore((s) => s.settings.soundEnabled)
  const selectedSubjectId = usePomodoroStore((s) => s.selectedSubjectId)
  const finishSession = useFinishSession()
  const completingRef = useRef(false)

  useEffect(() => {
    if (!isRunning) return
    const interval = window.setInterval(() => {
      usePomodoroStore.getState().tick()
    }, 1000)
    return () => clearInterval(interval)
  }, [isRunning])

  useEffect(() => {
    if (!isRunning || timeLeft > 0 || completingRef.current) return
    completingRef.current = true

    if (soundEnabled) playPomodoroSound()

    if (mode === 'focus') {
      // Ciclo de foco terminou de verdade: registra a sessão uma única vez
      // com a duração calculada localmente (o timer nunca foi ao servidor).
      const duration = Math.max(1, Math.round(totalTime / 60))
      finishSession.mutate({
        subjectId: selectedSubjectId || undefined,
        duration,
      })
    } else {
      toast.success('Pausa concluída!')
    }

    usePomodoroStore.getState().completeTransition(mode === 'focus' ? nextModeAfterFocus : mode)
    completingRef.current = false
  }, [isRunning, timeLeft, mode, totalTime, selectedSubjectId, soundEnabled, finishSession])

  return null
}
