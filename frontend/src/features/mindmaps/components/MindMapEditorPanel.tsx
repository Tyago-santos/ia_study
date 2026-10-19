import { ReactFlowProvider } from '@xyflow/react'
import { ChevronRight, GitBranch, Layers, Network } from 'lucide-react'
import { Button } from '@/shared/components/ui'
import type { MindMap, Subject } from '@/shared/types'
import { useMindMapEditor } from '@/features/mindmaps/hooks/useMindMapEditor'
import { useUpdateMindMapNodes } from '@/features/mindmaps/hooks/useMindMaps'
import { exportAsJson, exportAsMarkdown } from '@/features/mindmaps/lib/export'
import { getMindMapStats } from '@/features/mindmaps/lib/mindmapTree'
import { MindMapCanvas } from './MindMapCanvas'
import { MindMapNodePanel } from './MindMapNodePanel'
import { MindMapToolbar } from './MindMapToolbar'

interface MindMapEditorPanelProps {
  mindMap: MindMap
  subject?: Subject
  onBack: () => void
}

/**
 * Editor de um mapa mental. Deve ser montado com `key={mindMap.id}` para que a
 * troca de mapa reinicie o estado de edicao.
 */
export function MindMapEditorPanel({ mindMap, subject, onBack }: MindMapEditorPanelProps) {
  const editor = useMindMapEditor(mindMap.nodes)
  const updateNodes = useUpdateMindMapNodes()

  const rootColor = subject?.color ?? '#4f46e5'
  const stats = getMindMapStats(editor.nodes)
  const currentMap: MindMap = { ...mindMap, nodes: editor.nodes }

  const handleSave = () => {
    updateNodes.mutate(
      { id: mindMap.id, nodes: editor.nodes },
      { onSuccess: () => editor.markSaved() }
    )
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text)]"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Meus mapas
        </button>

        <span className="h-4 w-px bg-[var(--glass-border)]" />

        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${rootColor}22`, border: `1px solid ${rootColor}55` }}
          >
            <Network className="h-4 w-4" style={{ color: rootColor }} />
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold text-[var(--text)]">{mindMap.title}</h1>
            <p className="truncate text-xs text-[var(--text-secondary)]">
              {subject?.name ?? 'Sem materia'}
              {mindMap.description ? ` · ${mindMap.description}` : ''}
            </p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] px-2.5 py-1.5">
            <Layers className="h-3.5 w-3.5 text-[var(--accent-text)]" />
            <span className="text-xs font-bold text-[var(--text)]">{stats.total}</span>
            <span className="text-[10px] text-[var(--text-secondary)]">topicos</span>
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] px-2.5 py-1.5">
            <GitBranch className="h-3.5 w-3.5 text-[var(--accent-text)]" />
            <span className="text-xs font-bold text-[var(--text)]">{stats.branches}</span>
            <span className="text-[10px] text-[var(--text-secondary)]">ramos</span>
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[var(--card-bg)] shadow-[var(--glass-shadow)]">
        <ReactFlowProvider>
          <MindMapToolbar
            editor={editor}
            isSaving={updateNodes.isPending}
            onSave={handleSave}
            onExportMarkdown={() => exportAsMarkdown(currentMap)}
            onExportJson={() => exportAsJson(currentMap)}
          />
          <div className="flex flex-col md:flex-row">
            <div className="h-[60dvh] min-h-[280px] flex-1 text-[var(--text-secondary)] md:h-[calc(100dvh-19rem)] md:min-h-[420px]">
              <MindMapCanvas editor={editor} rootColor={rootColor} />
            </div>
            <MindMapNodePanel editor={editor} />
          </div>
        </ReactFlowProvider>
      </div>

      <p className="text-center text-[11px] text-[var(--text-secondary)] md:hidden">
        Toque duas vezes em um topico para renomear. Use os botoes do topico para adicionar ou
        excluir.
      </p>

      {editor.isDirty && (
        <div className="flex justify-center md:hidden">
          <Button onClick={handleSave} disabled={updateNodes.isPending}>
            {updateNodes.isPending ? 'Salvando...' : 'Salvar alteracoes'}
          </Button>
        </div>
      )}
    </div>
  )
}
