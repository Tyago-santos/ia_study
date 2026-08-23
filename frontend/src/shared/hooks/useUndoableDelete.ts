import { useCallback, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

/** Tempo que o usuario tem para desfazer antes da exclusao ser efetivada. */
const UNDO_WINDOW_MS = 6000

export interface DeletableItem {
  id: string
  label: string
}

interface UndoableDeleteOptions<TData> {
  /** Raiz das queries que listam o item (ex.: queryKeys.flashcards.all). */
  rootKey: readonly unknown[]
  /** Exclusao real no servico, adiada ate a janela de undo fechar. */
  remove: (id: string) => Promise<unknown>
  /** Texto do toast; recebe o rotulo do item removido. */
  message: (label: string) => string
  errorMessage: string
  /**
   * Remove o item dos dados em cache. O default trata a query como um array de
   * itens; passe uma funcao quando a query guardar outro formato — por exemplo
   * uma lista paginada dentro de um objeto.
   */
  dropFromCache?: (data: TData, id: string) => TData
}

function dropFromArray<TData>(data: TData, id: string): TData {
  if (!Array.isArray(data)) return data
  return data.filter((entry) => (entry as DeletableItem | null)?.id !== id) as TData
}

/**
 * Exclusao reversivel. O item desaparece da lista imediatamente, mas a chamada
 * de exclusao no servico só acontece quando a janela de undo fecha.
 *
 * Como o servico ainda tem o item durante essa janela, desfazer é apenas
 * invalidar a query: a lista volta da fonte, na posicao original, sem precisar
 * guardar snapshot de cache nem recriar o registro com outro id.
 */
export function useUndoableDelete<TData>({
  rootKey,
  remove,
  message,
  errorMessage,
  dropFromCache = dropFromArray,
}: UndoableDeleteOptions<TData>) {
  const queryClient = useQueryClient()
  const pendingTimers = useRef(new Map<string, ReturnType<typeof setTimeout>>())

  const refetchList = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: rootKey })
  }, [queryClient, rootKey])

  return useCallback(
    ({ id, label }: DeletableItem) => {
      // Some da lista na hora, sem tocar no servico.
      queryClient.setQueriesData<TData>({ queryKey: rootKey }, (current) =>
        current == null ? current : dropFromCache(current, id)
      )

      const commit = async () => {
        pendingTimers.current.delete(id)
        try {
          await remove(id)
        } catch (error) {
          toast.error(error instanceof Error ? error.message : errorMessage)
        } finally {
          refetchList()
        }
      }

      pendingTimers.current.set(id, setTimeout(commit, UNDO_WINDOW_MS))

      toast.success(message(label), {
        duration: UNDO_WINDOW_MS,
        action: {
          label: 'Desfazer',
          onClick: () => {
            const timer = pendingTimers.current.get(id)
            if (!timer) return
            clearTimeout(timer)
            pendingTimers.current.delete(id)
            refetchList()
          },
        },
      })
    },
    [queryClient, rootKey, remove, message, errorMessage, dropFromCache, refetchList]
  )
}
