import { useCallback, useEffect, useMemo } from 'react'
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  type NodeMouseHandler,
  type NodeTypes,
  type OnNodeDrag,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import type { MindMapEditor } from '@/features/mindmaps/hooks/useMindMapEditor'
import { toFlowGraph, type MindMapFlowNode } from '@/features/mindmaps/lib/flowAdapter'
import { MindMapNodeActionsProvider } from '@/features/mindmaps/lib/nodeActions'
import { MindMapNodeCard } from './MindMapNodeCard'

const nodeTypes: NodeTypes = { mindmap: MindMapNodeCard }

interface MindMapCanvasProps {
  editor: MindMapEditor
  rootColor: string
}

export function MindMapCanvas({ editor, rootColor }: MindMapCanvasProps) {
  const { nodes, edges } = useMemo(
    () => toFlowGraph(editor.nodes, rootColor),
    [editor.nodes, rootColor]
  )

  const flowNodes = useMemo<MindMapFlowNode[]>(
    () => nodes.map((node) => ({ ...node, selected: node.id === editor.selectedId })),
    [nodes, editor.selectedId]
  )

  const {
    selectedId,
    editingId,
    setSelectedId,
    setEditingId,
    renameNode,
    addChild,
    addSibling,
    removeNode,
    toggleCollapse,
    setNodePosition,
  } = editor

  const nodeActions = useMemo(
    () => ({
      editingId,
      onStartEditing: setEditingId,
      onFinishEditing: (id: string, label: string) => {
        renameNode(id, label)
        setEditingId(null)
      },
      onCancelEditing: () => setEditingId(null),
      onToggleCollapse: toggleCollapse,
      onAddChild: addChild,
      onRemove: removeNode,
    }),
    [editingId, setEditingId, renameNode, toggleCollapse, addChild, removeNode]
  )

  const handleNodeClick = useCallback<NodeMouseHandler>(
    (_event, node) => setSelectedId(node.id),
    [setSelectedId]
  )

  const handleNodeDragStop = useCallback<OnNodeDrag>(
    (_event, node) => setNodePosition(node.id, node.position),
    [setNodePosition]
  )

  // Atalhos do editor. Ficam desativados durante a renomeacao para nao competir
  // com a digitacao no input do no.
  useEffect(() => {
    if (editingId) return

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return

      const isMod = event.metaKey || event.ctrlKey

      if (isMod && event.key.toLowerCase() === 'z') {
        event.preventDefault()
        if (event.shiftKey) editor.redo()
        else editor.undo()
        return
      }

      if (!selectedId) return

      switch (event.key) {
        case 'Tab':
          event.preventDefault()
          addChild(selectedId)
          break
        case 'Enter':
          event.preventDefault()
          addSibling(selectedId)
          break
        case 'F2':
          event.preventDefault()
          setEditingId(selectedId)
          break
        case 'Delete':
        case 'Backspace':
          event.preventDefault()
          removeNode(selectedId)
          break
        case ' ':
          event.preventDefault()
          toggleCollapse(selectedId)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    editingId,
    selectedId,
    editor,
    addChild,
    addSibling,
    removeNode,
    toggleCollapse,
    setEditingId,
  ])

  return (
    <MindMapNodeActionsProvider value={nodeActions}>
      <ReactFlow
        nodes={flowNodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        onNodeDoubleClick={handleNodeClick}
        onNodeDragStop={handleNodeDragStop}
        onPaneClick={() => {
          setSelectedId(null)
          setEditingId(null)
        }}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={1.75}
        // As arestas espelham a arvore, entao conectar nos a mao esta desativado.
        nodesConnectable={false}
        deleteKeyCode={null}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={22}
          size={1}
          className="opacity-40"
          color="currentColor"
        />
        <Controls
          showInteractive={false}
          className="!border !border-[var(--glass-border)] !bg-[var(--card-bg)] !shadow-sm [&_button]:!border-[var(--glass-border)] [&_button]:!bg-[var(--card-bg)] [&_button]:!text-[var(--text)] [&_button:hover]:!bg-[var(--bg-secondary)]"
        />
        <MiniMap
          pannable
          zoomable
          nodeColor={(node) => (node.data as { color?: string }).color ?? rootColor}
          maskColor="rgba(0, 0, 0, 0.15)"
          className="!border !border-[var(--glass-border)] !bg-[var(--card-bg)]"
        />
      </ReactFlow>
    </MindMapNodeActionsProvider>
  )
}
