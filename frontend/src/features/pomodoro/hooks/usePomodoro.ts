import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/shared/constants/queryKeys'
import { pomodoroService } from '@/features/pomodoro/services/pomodoro.service'

interface FinishSessionInput {
  subjectId?: string
  /** Duração em minutos, calculada localmente pelo timer. */
  duration: number
}

/**
 * Registra no backend um ciclo de foco que acabou de terminar. Não há mais
 * `start`/`cancel` de rede: o estado do timer é 100% local (ver
 * `pomodoro.store.ts`) e essa mutation é a única chamada feita por ciclo.
 */
export function useFinishSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: FinishSessionInput) => pomodoroService.registerFocusSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stats.all })
      toast.success('Sessão registrada!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao registrar sessão')
    },
  })
}
