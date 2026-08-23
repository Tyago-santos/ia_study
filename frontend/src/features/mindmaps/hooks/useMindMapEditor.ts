import { useCallback, useMemo, useState } from 'react'
import type { MindMapNode } from '@/shared/types'
import { newNodeId } from '@/features/mindmaps/lib/generator'
import { findNode, getRootNode, removeSubtree } from '@/features/mindmaps/lib/mindmapTree'

const MAX_HISTORY = 50

interface EditorHistory {
  past: MindMapNode[][]
  present: MindMapNode[]
  future: MindMapNode[][]
}

/**
 * Estado de edicao de um mapa mental: arvore, historico de undo/redo, no
 * selecionado e no em renomeacao.
 *
 * `initialNodes` e lido apenas na montagem. Quem consome deve remontar o editor
 * com `key={mapId}` ao trocar de mapa — assim um refetch em segundo plano nunca
 * descarta edicoes ainda nao salvas.
 */
export function useMindMapEditor(initialNodes: MindMapNode[]) {
  const [history, setHistory] = useState<EditorHistory>({
    past: [],
    present: initialNodes,
    future: [],
  })
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isDirty, setIsDirty] = useState(false)

  const nodes = history.present

  /**
   * Aplica uma transformacao na arvore. `trackHistory: false` e usado em
   * alteracoes continuas (arrastar um no) para nao poluir o undo.
   */
  const commit = useCallback(
    (updater: (current: MindMapNode[]) => MindMapNode[], trackHistory = true) => {
      setHistory((state) => {
        const next = updater(state.present)
        if (next === state.present) return state

        return {
          past: trackHistory
            ? [...state.past, state.present].slice(-MAX_HISTORY)
            : state.past,
          present: next,
          future: trackHistory ? [] : state.future,
        }
      })
      setIsDirty(true)
    },
    []
  )

  const undo = useCallback(() => {
    setHistory((state) => {
      if (state.past.length === 0) return state
      const previous = state.past[state.past.length - 1]
      return {
        past: state.past.slice(0, -1),
        present: previous,
        future: [state.present, ...state.future].slice(0, MAX_HISTORY),
      }
    })
    setIsDirty(true)
  }, [])

  const redo = useCallback(() => {
    setHistory((state) => {
      if (state.future.length === 0) return state
      return {
        past: [...state.past, state.present].slice(-MAX_HISTORY),
        present: state.future[0],
        future: state.future.slice(1),
      }
    })
    setIsDirty(true)
  }, [])

  const renameNode = useCallback(
    (id: string, label: string) => {
      commit((current) =>
        current.map((node) => (node.id === id ? { ...node, label } : node))
      )
    },
    [commit]
  )

  const setNote = useCallback(
    (id: string, note: string) => {
      commit((current) =>
        current.map((node) =>
          node.id === id ? { ...node, note: note.trim() || undefined } : node
        )
      )
    },
    [commit]
  )

  const setColor = useCallback(
    (id: string, color: string | undefined) => {
      commit((current) => current.map((node) => (node.id === id ? { ...node, color } : node)))
    },
    [commit]
  )

  /** Cria um filho e ja o coloca em modo de renomeacao. */
  const addChild = useCallback(
    (parentId: string) => {
      const id = newNodeId()
      commit((current) => {
        if (!findNode(current, parentId)) return current
        // Um pai recolhido precisa ser expandido, senao o novo no nasce oculto.
        const expanded = current.map((node) =>
          node.id === parentId ? { ...node, collapsed: false } : node
        )
        return [...expanded, { id, parentId, label: 'Novo topico' }]
      })
      setSelectedId(id)
      setEditingId(id)
      return id
    },
    [commit]
  )

  /** Cria um irmao do no informado. Na raiz, cria um ramo novo. */
  const addSibling = useCallback(
    (id: string) => {
      const target = findNode(nodes, id)
      if (!target) return null
      return addChild(target.parentId ?? id)
    },
    [nodes, addChild]
  )

  const removeNode = useCallback(
    (id: string) => {
      commit((current) => removeSubtree(current, id))
      setSelectedId((current) => (current === id ? null : current))
      setEditingId((current) => (current === id ? null : current))
    },
    [commit]
  )

  const toggleCollapse = useCallback(
    (id: string) => {
      commit((current) =>
        current.map((node) => (node.id === id ? { ...node, collapsed: !node.collapsed } : node))
      )
    },
    [commit]
  )

  const setNodePosition = useCallback(
    (id: string, position: { x: number; y: number }) => {
      commit(
        (current) => current.map((node) => (node.id === id ? { ...node, position } : node)),
        false
      )
    },
    [commit]
  )

  /** Descarta as posicoes manuais e devolve o mapa ao layout automatico. */
  const resetLayout = useCallback(() => {
    commit((current) => {
      if (current.every((node) => !node.position)) return current
      return current.map(({ position: _position, ...node }) => node)
    })
  }, [commit])

  const markSaved = useCallback(() => setIsDirty(false), [])

  const selectedNode = useMemo(() => findNode(nodes, selectedId), [nodes, selectedId])
  const rootNode = useMemo(() => getRootNode(nodes), [nodes])
  const hasManualPositions = useMemo(() => nodes.some((node) => node.position), [nodes])

  return {
    nodes,
    selectedId,
    selectedNode,
    rootNode,
    editingId,
    isDirty,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    hasManualPositions,
    setSelectedId,
    setEditingId,
    renameNode,
    setNote,
    setColor,
    addChild,
    addSibling,
    removeNode,
    toggleCollapse,
    setNodePosition,
    resetLayout,
    undo,
    redo,
    markSaved,
  }
}

export type MindMapEditor = ReturnType<typeof useMindMapEditor>
