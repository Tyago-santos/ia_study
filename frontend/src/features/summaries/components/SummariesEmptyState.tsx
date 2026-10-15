import { FileText, FileUp, GraduationCap, Plus, Sparkles } from 'lucide-react'
import { Button } from '@/shared/components/ui'

interface SummariesEmptyStateProps {
  onCreate: () => void
}

const HINTS = [
  { icon: GraduationCap, label: 'Organize por matéria' },
  { icon: FileUp, label: 'Importe de PDF e imagem' },
  { icon: Sparkles, label: 'Gere com IA' },
]

/**
 * Estado vazio da pagina de Resumos. Em vez de um card cinza com um texto
 * solto, oferece um convite com CTA direto e um resumo do que da' pra fazer —
 * quem chega sem nenhum resumo precisa saber por onde comecar.
 */
export function SummariesEmptyState({ onCreate }: SummariesEmptyStateProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[var(--card-bg)] shadow-[var(--glass-shadow)]">
      {/* brilho suave de fundo, igual ao cabecalho */}
      <div className="pointer-events-none absolute -top-28 left-1/2 h-72 w-[28rem] -translate-x-1/2 rounded-full bg-primary-500/10 blur-3xl" />

      <div className="relative flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="relative mb-6">
          <div className="flex h-20 w-20 animate-logo-float items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-cyan-500 shadow-xl shadow-primary-500/30">
            <FileText className="h-10 w-10 text-[var(--on-accent)]" />
          </div>
          <span className="absolute -bottom-2 -right-2 flex h-7 w-7 animate-pulse-glow items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--card-bg)]">
            <Plus className="h-4 w-4 text-[var(--accent-text)]" />
          </span>
        </div>

        <h3 className="mb-2 text-xl font-bold">
          <span className="animate-shimmer bg-gradient-to-r from-primary-400 via-primary-500 to-cyan-500 bg-clip-text text-transparent">
            Comece seu primeiro resumo
          </span>
        </h3>
        <p className="mb-7 max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
          Reúna suas anotações, resuma PDFs e organize o que você estudou por matéria — tudo em um
          só lugar.
        </p>

        <Button onClick={onCreate} size="lg" className="shadow-lg shadow-primary-500/25">
          <Plus className="mr-2 h-4 w-4" />
          Criar primeiro resumo
        </Button>

        <div className="mt-9 flex flex-wrap justify-center gap-2">
          {HINTS.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-1.5 text-xs text-[var(--text-secondary)]"
            >
              <Icon className="h-3.5 w-3.5 text-[var(--accent-text)]" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
