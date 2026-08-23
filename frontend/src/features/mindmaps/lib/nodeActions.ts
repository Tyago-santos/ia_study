import { createContext, useContext } from 'react'

/**
 * Acoes que o no customizado dispara. Passadas por contexto em vez de por
 * `node.data` para que os dados dos nos permanecam serializaveis.
 */
export interface MindMapNodeActions {
  editingId: string | null
  onStartEditing: (id: string) => void
  onFinishEditing: (id: string, label: string) => void
  onCancelEditing: () => void
  onToggleCollapse: (id: string) => void
  onAddChild: (id: string) => void
  onRemove: (id: string) => void
}

const MindMapNodeActionsContext = createContext<MindMapNodeActions | null>(null)

export const MindMapNodeActionsProvider = MindMapNodeActionsContext.Provider

export function useMindMapNodeActions(): MindMapNodeActions {
  const actions = useContext(MindMapNodeActionsContext)
  if (!actions) {
    throw new Error('useMindMapNodeActions precisa estar dentro de MindMapNodeActionsProvider')
  }
  return actions
}
