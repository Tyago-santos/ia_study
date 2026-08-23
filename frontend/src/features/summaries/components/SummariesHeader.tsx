import { BookMarked, FileText, Image, Plus, Upload } from 'lucide-react'
import { Button } from '@/shared/components/ui'
import { PENDING_BACKEND_HINT } from '@/shared/constants/pendingFeature'

interface SummariesHeaderProps {
  total: number
  pdfCount: number
  imageCount: number
  onCreate: () => void
}

export function SummariesHeader({ total, pdfCount, imageCount, onCreate }: SummariesHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[var(--card-bg)] p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-cyan-500/5 to-transparent pointer-events-none" />
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 shadow-lg shadow-primary-500/25">
            <BookMarked className="w-6 h-6 text-[var(--on-accent)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text)]">Resumos</h1>
            <p className="text-[var(--text-secondary)] text-sm">Reúna e organize o que você estudou</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="flex-1 sm:flex-none"
            disabled
            title={`Enviar PDF ou imagem: ${PENDING_BACKEND_HINT.toLowerCase()}`}
          >
            <Upload className="w-4 h-4 mr-2" />
            Enviar arquivo
          </Button>
          <Button onClick={onCreate} className="flex-1 sm:flex-none">
            <Plus className="w-4 h-4 mr-2" />
            Criar Resumo
          </Button>
        </div>
      </div>

      <div className="relative flex flex-wrap gap-2 mt-5">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
          <FileText className="w-3.5 h-3.5 text-[var(--accent-text)]" />
          <span className="text-xs font-bold text-[var(--text)]">{total}</span>
          <span className="text-[10px] text-[var(--text-secondary)]">resumos criados</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
          <Upload className="w-3.5 h-3.5 text-[var(--accent-text)]" />
          <span className="text-xs font-bold text-[var(--text)]">{pdfCount}</span>
          <span className="text-[10px] text-[var(--text-secondary)]">de PDF</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)]">
          <Image className="w-3.5 h-3.5 text-[var(--accent-text)]" />
          <span className="text-xs font-bold text-[var(--text)]">{imageCount}</span>
          <span className="text-[10px] text-[var(--text-secondary)]">de imagem</span>
        </div>
      </div>
    </div>
  )
}
