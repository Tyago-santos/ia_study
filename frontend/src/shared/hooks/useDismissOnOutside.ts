import { useEffect, useRef, type RefObject } from 'react'

/**
 * Fecha um painel flutuante quando o ponteiro cai fora dele ou quando Escape é
 * pressionado.
 *
 * Escuta `pointerdown` em vez de `click`: o clique só resolve no botao solto, e
 * ate la a lista de resultados ja pode ter mudado de tamanho debaixo do cursor.
 *
 * `onDismiss` fica guardado numa ref para que o efeito nao se reinscreva a cada
 * render — quem chama pode passar uma arrow function inline sem penalidade.
 */
export function useDismissOnOutside(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  onDismiss: () => void
) {
  const onDismissRef = useRef(onDismiss)
  onDismissRef.current = onDismiss

  useEffect(() => {
    if (!active) return

    const handlePointerDown = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onDismissRef.current()
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onDismissRef.current()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [ref, active])
}
