import { useState } from 'react'
import { Eraser, Send } from 'lucide-react'
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

  return (
    <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex justify-center px-4 sm:px-6 pb-6">
      <div className="pointer-events-auto w-full max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] backdrop-blur-xl shadow-2xl shadow-black/10 focus-within:ring-2 focus-within:ring-primary-500/50 focus-within:border-primary-500/60 transition-all">
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
          className="w-full resize-none bg-transparent px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-secondary)] focus:outline-none disabled:opacity-50"
        />
        <div className="flex items-center justify-between px-3 pb-2.5">
          <span className="text-[11px] text-[var(--text-secondary)]">
            Enter envia · Shift+Enter quebra linha
          </span>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="sm" onClick={() => setValue('')} disabled={!value}>
              <Eraser className="w-3.5 h-3.5 mr-1.5" />
              Limpar
            </Button>
            <Button
              size="sm"
              onClick={handleSend}
              disabled={!value.trim() || disabled}
              className="shadow-md shadow-primary-500/25"
            >
              <Send className="w-3.5 h-3.5 mr-1.5" />
              Enviar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
