import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { queryKeys } from '@/shared/constants/queryKeys'
import { pomodoroService, subjectsService } from '@/shared/services/dataStore'
import { alertUser } from '@/shared/services/notifications'
import { useNotificationSettings } from '@/shared/store/notificationSettings'
import { cycleProgress, isStartBlocked } from '../services/pomodoro.service'
import { usePomodoroStore } from '../store/pomodoro'

/**
 * Cronometro do pomodoro ligado ao registro de sessoes.
 *
 * O intervalo de 1s vive aqui e nao no store: o store guarda o estado do
 * ciclo, quem decide quando ele avanca e a tela que esta montada.
 */
export function usePomodoro() {
  const timer = usePomodoroStore()
  const queryClient = useQueryClient()
  const notificationsEnabled = useNotificationSettings((s) => s.pomodoro)

  const { data: subjects } = useQuery({
    queryKey: queryKeys.subjects.list(),
    queryFn: subjectsService.list,
  })

  const finishSession = useMutation({
    mutationFn: pomodoroService.finish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pomodoro.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.stats.all })
    },
  })

  // A sessao so e creditada quando o ciclo de foco chega a zero por conta
  // propria; pausar ou resetar no meio nao gera registro.
  const onCompleteRef = useRef<() => void>(() => {})
  onCompleteRef.current = () => {
    const { mode, selectedSubjectId, totalTime, settings, complete } = timer

    if (mode === 'focus' && selectedSubjectId) {
      finishSession.mutate({
        subjectId: selectedSubjectId,
        minutes: Math.round(totalTime / 60),
        type: 'pomodoro',
      })
    }

    alertUser({
      title: settings.endPhrase,
      message: mode === 'focus' ? 'Ciclo de foco concluído. Hora da pausa.' : 'Pausa encerrada.',
      kind: 'success',
      system: notificationsEnabled && settings.systemNotification,
      speak: settings.soundEnabled ? settings.endPhrase : undefined,
    })

    complete()
  }

  const { isRunning, tick } = timer

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      // Le direto do store: o valor capturado no fecho envelheceria a cada
      // segundo e o ciclo nunca chegaria ao fim.
      if (usePomodoroStore.getState().timeLeft <= 1) {
        onCompleteRef.current()
      } else {
        tick()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, tick])

  return {
    ...timer,
    subjects: subjects ?? [],
    subjectName: subjects?.find((s) => s.id === timer.selectedSubjectId)?.name,
    progress: cycleProgress(timer.timeLeft, timer.totalTime),
    blocked: isStartBlocked(timer.mode, timer.selectedSubjectId),
  }
}
