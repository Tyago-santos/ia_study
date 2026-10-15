import { CornerDownRight, Palette, X } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import type { MindMapEditor } from '@/features/mindmaps/hooks/useMindMapEditor'
import { BRANCH_COLORS } from '@/features/mindmaps/lib/mindmapTree'

interface MindMapNodePanelProps {
  editor: MindMapEditor
}

/** Painel lateral com os detalhes do no selecionado (rotulo, nota e cor). */
export function MindMapNodePanel({ editor }: MindMapNodePanelProps) {
  const node = editor.selectedNode

  if (!node) {
    return (
      <div className="hidden shrink-0 flex-col gap-2 border-t border-[var(--glass-border)] p-4 md:flex md:w-64 md:border-t-0 md:border-l">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]/70">
          Topico
        </p>
        <p className="text-[13px] leading-relaxed text-[var(--text-secondary)]">
          Clique em um topico para editar o texto, a nota e a cor do ramo.
        </p>
        <div className="mt-3 space-y-1.5 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] p-3">
          <p className="text-[11px] font-semibold text-[var(--text)]">Atalhos</p>
          {[
            ['Tab', 'novo subtopico'],
            ['Enter', 'novo topico irmao'],
            ['F2', 'renomear'],
            ['Espaco', 'recolher ramo'],
            ['Delete', 'excluir topico'],
          ].map(([key, description]) => (
            <p key={key} className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
              <kbd className="rounded border border-[var(--border)] bg-[var(--bg-secondary)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--text)]">
                {key}
              </kbd>
              {description}
            </p>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex max-h-[45dvh] w-full shrink-0 flex-col gap-3 overflow-y-auto border-t border-[var(--glass-border)] p-4 md:max-h-none md:w-64 md:border-t-0 md:border-l">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]/70">
          Topico
        </p>
        <button
          onClick={() => editor.setSelectedId(null)}
          className="flex items-center justify-center w-9 h-9 -my-1.5 -mr-1.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text)]"
          title="Fechar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/*
        Os campos sao nao controlados e confirmam no blur. Registrar cada tecla
        no historico esgotaria o undo em poucos caracteres. A `key` inclui o
        valor atual para que edicoes feitas no canvas resemeiem o campo.
      */}
      <div>
        <label className="mb-1 block text-[11px] font-medium text-[var(--text)]">Texto</label>
        <input
          key={`${node.id}-label-${node.label}`}
          defaultValue={node.label}
          onBlur={(event) => {
            const label = event.target.value.trim()
            if (label && label !== node.label) editor.renameNode(node.id, label)
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') event.currentTarget.blur()
          }}
          className="w-full h-9 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] px-2.5 text-[13px] text-[var(--text)] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
        />
      </div>

      <div>
        <label className="mb-1 block text-[11px] font-medium text-[var(--text)]">Nota</label>
        <textarea
          key={`${node.id}-note-${node.note ?? ''}`}
          defaultValue={node.note ?? ''}
          onBlur={(event) => {
            if (event.target.value !== (node.note ?? '')) editor.setNote(node.id, event.target.value)
          }}
          placeholder="Detalhe, formula ou lembrete deste topico..."
          className="h-24 w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--card-bg)] px-2.5 py-2 text-[13px] text-[var(--text)] placeholder:text-[var(--text-secondary)] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
        />
      </div>

      <div>
        <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium text-[var(--text)]">
          <Palette className="w-3 h-3" />
          Cor do ramo
        </label>
        <div className="flex flex-wrap gap-1.5">
          {BRANCH_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => editor.setColor(node.id, color)}
              style={{ backgroundColor: color }}
              className={cn(
                'h-9 w-9 rounded-lg border-2 transition-transform hover:scale-110',
                node.color === color ? 'border-[var(--text)]' : 'border-transparent'
              )}
              title={`Usar ${color}`}
            />
          ))}
          <button
            onClick={() => editor.setColor(node.id, undefined)}
            className={cn(
              'flex h-6 items-center rounded-lg border border-[var(--border)] px-2 text-[10px] font-medium transition-colors',
              'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text)]',
              !node.color && 'border-[var(--text)] text-[var(--text)]'
            )}
            title="Herdar a cor do ramo pai"
          >
            Herdar
          </button>
        </div>
      </div>

      <button
        onClick={() => editor.addChild(node.id)}
        className="mt-1 flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-[var(--border)] py-2 text-[12px] font-medium text-[var(--text-secondary)] transition-colors hover:border-primary-500 hover:text-[var(--accent-text)]"
      >
        <CornerDownRight className="w-3.5 h-3.5" />
        Adicionar subtopico
      </button>
    </div>
  )
}
