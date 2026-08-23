import { useReactFlow } from '@xyflow/react'
import {
  FileDown,
  Braces,
  Maximize2,
  Plus,
  Redo2,
  Save,
  Trash2,
  Undo2,
  Workflow,
} from 'lucide-react'
import { Button } from '@/shared/components/ui'
import { cn } from '@/shared/lib/utils'
import type { MindMapEditor } from '@/features/mindmaps/hooks/useMindMapEditor'

interface MindMapToolbarProps {
  editor: MindMapEditor
  isSaving: boolean
  onSave: () => void
  onExportMarkdown: () => void
  onExportJson: () => void
}

interface ToolButtonProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
  disabled?: boolean
}

function ToolButton({ icon, label, onClick, disabled }: ToolButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={cn(
        'flex items-center justify-center w-8 h-8 rounded-lg transition-colors',
        'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text)]',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent'
      )}
    >
      {icon}
    </button>
  )
}

export function MindMapToolbar({
  editor,
  isSaving,
  onSave,
  onExportMarkdown,
  onExportJson,
}: MindMapToolbarProps) {
  const { fitView } = useReactFlow()
  const targetId = editor.selectedId ?? editor.rootNode?.id

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-[var(--glass-border)] px-3 py-2">
      <ToolButton
        icon={<Plus className="w-4 h-4" />}
        label="Adicionar subtopico (Tab)"
        onClick={() => targetId && editor.addChild(targetId)}
        disabled={!targetId}
      />
      <ToolButton
        icon={<Trash2 className="w-4 h-4" />}
        label="Excluir topico selecionado (Delete)"
        onClick={() => editor.selectedId && editor.removeNode(editor.selectedId)}
        disabled={!editor.selectedId || editor.selectedNode?.parentId === null}
      />

      <span className="mx-1 h-5 w-px bg-[var(--glass-border)]" />

      <ToolButton
        icon={<Undo2 className="w-4 h-4" />}
        label="Desfazer (Ctrl+Z)"
        onClick={editor.undo}
        disabled={!editor.canUndo}
      />
      <ToolButton
        icon={<Redo2 className="w-4 h-4" />}
        label="Refazer (Ctrl+Shift+Z)"
        onClick={editor.redo}
        disabled={!editor.canRedo}
      />

      <span className="mx-1 h-5 w-px bg-[var(--glass-border)]" />

      <ToolButton
        icon={<Workflow className="w-4 h-4" />}
        label="Reorganizar automaticamente"
        onClick={() => {
          editor.resetLayout()
          requestAnimationFrame(() => fitView({ padding: 0.2, duration: 300 }))
        }}
        disabled={!editor.hasManualPositions}
      />
      <ToolButton
        icon={<Maximize2 className="w-4 h-4" />}
        label="Enquadrar mapa"
        onClick={() => fitView({ padding: 0.2, duration: 300 })}
      />

      <span className="mx-1 h-5 w-px bg-[var(--glass-border)]" />

      <ToolButton
        icon={<FileDown className="w-4 h-4" />}
        label="Exportar como Markdown"
        onClick={onExportMarkdown}
      />
      <ToolButton
        icon={<Braces className="w-4 h-4" />}
        label="Exportar como JSON"
        onClick={onExportJson}
      />

      <div className="ml-auto flex items-center gap-2">
        {editor.isDirty && (
          <span className="text-[11px] font-medium text-[var(--text-secondary)]">
            Alteracoes nao salvas
          </span>
        )}
        <Button size="sm" onClick={onSave} disabled={isSaving || !editor.isDirty}>
          <Save className="w-3.5 h-3.5 mr-1.5" />
          {isSaving ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </div>
  )
}
