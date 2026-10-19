import { useEffect } from 'react'

/**
 * Impede que o dispositivo durma/hiberne enquanto o app esta aberto, pedindo
 * uma "wake lock" de tela ao navegador.
 *
 * Detalhes praticos:
 * - So funciona em contexto seguro (https ou localhost) e em navegadores que
 *   suportam a API (Chrome/Edge/Safari 16.4+). Fora disso e' no-op.
 * - O navegador libera a wake lock sozinho quando a aba perde a visibilidade,
 *   entao pedimos de novo no `visibilitychange` — senao o bloqueio morria ao
 *   trocar de app e nunca mais voltava.
 * - Em paginas imersivas (Pomodoro/Tutor IA) e' onde mais faz diferenca: o
 *   timer continua sem a tela apagar.
 */
export function useWakeLock() {
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('wakeLock' in navigator)) return

    let sentinel: WakeLockSentinel | null = null
    let disposed = false

    const request = async () => {
      try {
        if (disposed || document.visibilityState !== 'visible') return
        sentinel = await navigator.wakeLock.request('screen')
        sentinel.addEventListener('release', () => {
          sentinel = null
        })
      } catch {
        // Sem permissao ou sem suporte: o app segue funcionando normalmente.
      }
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') void request()
    }

    void request()
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      disposed = true
      document.removeEventListener('visibilitychange', onVisibilityChange)
      void sentinel?.release().catch(() => {})
      sentinel = null
    }
  }, [])
}
