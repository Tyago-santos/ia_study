import { useState } from 'react'
import { ArrowUp, Eraser } from 'lucide-react'
import { Button } from '@/shared/components/ui'

interface ChatComposerProps {
  disabled: boolean
  onSend: (content: string) => void
}

export function ChatComposer({ disabled, onSend }: ChatComposerProps) {
  const [value, setValue] = useState('')

  const handleSend = () => {
    if (!value.trim() || disabled) return
    onSend(value)
    setValue('')
  }

  /*
   * Gradiente de fundo dissolvendo o campo na pagina (mesma leitura do
   * Stitch: barra flutuante sobre o stream de chat). pointer-events-none
   * mantem o scroll do historico por tras funcionando.
   */
  return (
    <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex justify-center px-4 sm:px-6 pt-10 pb-6 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/90 to-transparent">
      <div className="pointer-events-auto w-full max-w-3xl flex flex-col gap-1.5">
        <div className="flex items-end gap-1.5 p-1.5 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] backdrop-blur-xl shadow-[var(--glass-shadow)] focus-within:ring-2 focus-within:ring-[var(--focus-ring)] focus-within:border-primary-500/60 transition-all">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Pergunte sobre um conceito, peça um resumo, um plano de estudos..."
            disabled={disabled}
            rows={1}
            className="flex-1 min-w-0 resize-none bg-transparent px-3 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-secondary)] focus:outline-none disabled:opacity-50"
          />
          <div className="flex items-center gap-1.5 shrink-0 pb-0.5">
            <Button variant="ghost" size="sm" onClick={() => setValue('')} disabled={!value}>
              <Eraser className="w-3.5 h-3.5 mr-1.5" />
              Limpar
            </Button>
            <Button
              size="sm"
              onClick={handleSend}
              disabled={!value.trim() || disabled}
              aria-label="Enviar mensagem"
              title="Enviar mensagem"
              className="h-9 w-9 p-0 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 shadow-md shadow-primary-500/40 hover:shadow-lg hover:shadow-primary-500/40"
            >
              <ArrowUp className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Dicas sob o campo, em texto secundario (padrao do spec) */}
        <div className="flex items-center justify-end px-2 text-[11px] text-[var(--text-secondary)]">
          <span className="min-w-0 truncate">Enter envia · Shift+Enter quebra linha</span>
        </div>
      </div>
    </div>
  )
}
