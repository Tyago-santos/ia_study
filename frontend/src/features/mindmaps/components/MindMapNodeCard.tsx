import { useEffect, useRef, useState } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { ChevronDown, ChevronRight, Plus, StickyNote, Trash2 } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import type { MindMapFlowNode } from '@/features/mindmaps/lib/flowAdapter'
import { useMindMapNodeActions } from '@/features/mindmaps/lib/nodeActions'

/** Handles ficam invisiveis: as conexoes sao derivadas da arvore, nao criadas a mao. */
const HANDLE_STYLE = { opacity: 0, width: 1, height: 1, border: 'none', minWidth: 1, minHeight: 1 }

export function MindMapNodeCard({ id, data, selected }: NodeProps<MindMapFlowNode>) {
  const actions = useMindMapNodeActions()
  const isEditing = actions.editingId === id
  const isRoot = data.depth === 0

  const [draft, setDraft] = useState(data.label)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing) {
      setDraft(data.label)
      // O foco precisa esperar o input existir no DOM.
      requestAnimationFrame(() => inputRef.current?.select())
    }
  }, [isEditing, data.label])

  const commitDraft = () => {
    const label = draft.trim()
    if (label) {
      actions.onFinishEditing(id, label)
    } else {
      actions.onCancelEditing()
    }
  }

  return (
    <div
      className={cn(
        'group relative rounded-xl border-2 px-3 py-2.5 transition-all duration-200',
        'bg-[var(--card-bg)] backdrop-blur-sm',
        isRoot ? 'shadow-lg' : 'shadow-sm',
        selected ? 'ring-2 ring-offset-2 ring-offset-transparent' : 'hover:shadow-md'
      )}
      style={{
        width: data.width,
        borderColor: data.color,
        // A raiz recebe um fundo tingido para se destacar como centro do mapa.
        backgroundColor: isRoot ? `${data.color}22` : undefined,
        boxShadow: selected ? `0 0 0 2px ${data.color}` : undefined,
      }}
      onDoubleClick={(event) => {
        event.stopPropagation()
        actions.onStartEditing(id)
      }}
    >
      <Handle type="target" position={Position.Left} id="target-left" style={HANDLE_STYLE} />
      <Handle type="target" position={Position.Right} id="target-right" style={HANDLE_STYLE} />
      <Handle type="source" position={Position.Left} id="source-left" style={HANDLE_STYLE} />
      <Handle type="source" position={Position.Right} id="source-right" style={HANDLE_STYLE} />

      {isEditing ? (
        <input
          ref={inputRef}
          value={draft}
          autoFocus
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commitDraft}
          onKeyDown={(event) => {
            // O canvas escuta as mesmas teclas; parar a propagacao evita que
            // digitar "Delete" ou "Tab" dispare atalhos do editor.
            event.stopPropagation()
            if (event.key === 'Enter') commitDraft()
            if (event.key === 'Escape') actions.onCancelEditing()
          }}
          className={cn(
            'w-full bg-transparent text-[var(--text)] outline-none',
            isRoot ? 'text-sm font-bold' : 'text-[13px] font-medium'
          )}
        />
      ) : (
        <div className="flex items-start gap-1.5">
          <p
            className={cn(
              'flex-1 break-words text-[var(--text)] leading-snug',
              isRoot ? 'text-sm font-bold' : 'text-[13px] font-medium'
            )}
          >
            {data.label}
          </p>
          {data.note && (
            <span className="shrink-0 mt-0.5 text-[var(--text-secondary)]" title={data.note}>
              <StickyNote className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      )}

      {data.collapsed && data.hiddenCount > 0 && (
        <button
          onClick={(event) => {
            event.stopPropagation()
            actions.onToggleCollapse(id)
          }}
          className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold"
          style={{ color: data.color }}
          title="Expandir ramo"
        >
          <ChevronRight className="w-3 h-3" />
          {data.hiddenCount} {data.hiddenCount === 1 ? 'topico oculto' : 'topicos ocultos'}
        </button>
      )}

      {/* Acoes rapidas: aparecem no hover ou quando o no esta selecionado. */}
      <div
        className={cn(
          'absolute -top-3 right-1.5 flex items-center gap-0.5 rounded-lg border px-1 py-0.5',
          'border-[var(--glass-border)] bg-[var(--card-bg)] shadow-sm',
          'opacity-0 transition-opacity duration-150 group-hover:opacity-100',
          selected && 'opacity-100'
        )}
      >
        {data.childCount > 0 && (
          <button
            onClick={(event) => {
              event.stopPropagation()
              actions.onToggleCollapse(id)
            }}
            className="flex items-center justify-center w-5 h-5 rounded text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text)]"
            title={data.collapsed ? 'Expandir ramo' : 'Recolher ramo'}
          >
            {data.collapsed ? (
              <ChevronRight className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
        )}
        <button
          onClick={(event) => {
            event.stopPropagation()
            actions.onAddChild(id)
          }}
          className="flex items-center justify-center w-5 h-5 rounded text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--accent-text)]"
          title="Adicionar subtopico"
        >
          <Plus className="w-3 h-3" />
        </button>
        {!isRoot && (
          <button
            onClick={(event) => {
              event.stopPropagation()
              actions.onRemove(id)
            }}
            className="flex items-center justify-center w-5 h-5 rounded text-[var(--text-secondary)] hover:bg-error-50 hover:text-[var(--danger)]"
            title="Excluir topico e subtopicos"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  )
}
