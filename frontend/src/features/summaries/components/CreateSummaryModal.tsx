import { useState } from 'react'
import { BookMarked, Edit2, Sparkles } from 'lucide-react'
import { Button, Input, Modal, ModeToggle } from '@/shared/components/ui'
import { useSubjects } from '@/features/library/hooks/useSubjects'
import {
  useCreateSummary,
  useGenerateSummaryWithAI,
} from '@/features/summaries/hooks/useSummaries'

interface CreateSummaryModalProps {
  open: boolean
  onClose: () => void
}

export function CreateSummaryModal({ open, onClose }: CreateSummaryModalProps) {
  const { data: subjects } = useSubjects()
  const createSummary = useCreateSummary()
  const generateSummary = useGenerateSummaryWithAI()

  const [mode, setMode] = useState<'manual' | 'ai'>('manual')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [aiSource, setAiSource] = useState('')

  const resetAndClose = () => {
    setMode('manual')
    setTitle('')
    setContent('')
    setSubjectId('')
    setAiSource('')
    onClose()
  }

  const handleCreate = () => {
    if (!title.trim() || !content.trim() || !subjectId) return
    createSummary.mutate(
      { subjectId, title, content, sourceType: 'text' },
      { onSuccess: resetAndClose }
    )
  }

  const handleGenerate = () => {
    if (!aiSource.trim()) return
    generateSummary.mutate(
      { content: aiSource, sourceType: 'text' },
      {
        onSuccess: (data) => {
          setContent(data.summary)
          if (!title.trim()) setTitle('Resumo gerado por IA')
        },
      }
    )
  }

  return (
    <Modal
      open={open}
      onClose={resetAndClose}
      className="max-w-lg"
      title={
        <span className="flex items-center gap-2.5">
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 shadow-md shadow-primary-500/25 shrink-0">
            <BookMarked className="w-4 h-4 text-[var(--on-accent)]" />
          </span>
          <span>
            <span className="block text-base font-semibold text-[var(--text)] leading-tight">Novo Resumo</span>
            <span className="block text-xs font-normal text-[var(--text-secondary)] mt-0.5">
              Reúna o que você estudou em um resumo
            </span>
          </span>
        </span>
      }
    >
      <div className="space-y-4">
        <ModeToggle
          value={mode}
          onChange={setMode}
          options={[
            { value: 'manual', label: 'Escrever', icon: <Edit2 className="w-3.5 h-3.5" /> },
            { value: 'ai', label: 'Gerar com IA', icon: <Sparkles className="w-3.5 h-3.5" /> },
          ]}
        />

        {mode === 'ai' && (
          <div className="space-y-2 rounded-xl border border-primary-500/20 bg-primary-500/5 p-3 animate-fade-in">
            <label className="block text-sm font-medium text-[var(--text)]">Conteúdo de origem</label>
            <textarea
              className="w-full h-24 px-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-[var(--text)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:border-transparent resize-none"
              placeholder="Cole aqui o texto, anotações ou transcrição que a IA deve resumir..."
              value={aiSource}
              onChange={(e) => setAiSource(e.target.value)}
            />
            <Button
              className="w-full"
              onClick={handleGenerate}
              disabled={!aiSource.trim() || generateSummary.isPending}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {generateSummary.isPending ? 'Gerando...' : 'Gerar Resumo com IA'}
            </Button>
            <p className="text-[11px] text-[var(--text-secondary)]">
              O resultado preenche o campo "Conteúdo" abaixo, revise antes de salvar.
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-1">Matéria</label>
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:border-transparent"
          >
            <option value="">Selecione uma matéria</option>
            {subjects?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Título"
          placeholder="Título do resumo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div>
          <label className="block text-sm font-medium text-[var(--text)] mb-1">Conteúdo</label>
          <textarea
            className="w-full h-36 px-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-[var(--text)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:border-transparent resize-none"
            placeholder="Escreva ou cole o conteúdo do resumo..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="flex gap-2 pt-1">
          <Button
            className="flex-1"
            onClick={handleCreate}
            disabled={createSummary.isPending || !subjectId || !title.trim() || !content.trim()}
          >
            {createSummary.isPending ? 'Salvando...' : 'Salvar Resumo'}
          </Button>
          <Button variant="secondary" onClick={resetAndClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
