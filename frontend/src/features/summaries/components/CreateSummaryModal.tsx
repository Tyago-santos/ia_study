import { useState } from 'react'
import { BookMarked, Edit2, Sparkles } from 'lucide-react'
import { Button, Input, Modal, ModeToggle } from '@/shared/components/ui'
import { useSubjects } from '@/features/library/hooks/useSubjects'
import { useTopics } from '@/features/library/hooks/useTopics'
import { useCreateSummary, useGenerateSummaryWithAI } from '@/features/summaries/hooks/useSummaries'

interface CreateSummaryModalProps {
  open: boolean
  onClose: () => void
}

export function CreateSummaryModal({ open, onClose }: CreateSummaryModalProps) {
  const { data: subjects } = useSubjects()
  const { data: topics } = useTopics()
  const createSummary = useCreateSummary()
  const generateSummary = useGenerateSummaryWithAI()

  const [mode, setMode] = useState<'manual' | 'ai'>('manual')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [aiFocus, setAiFocus] = useState('')

  const resetAndClose = () => {
    setMode('manual')
    setTitle('')
    setContent('')
    setSubjectId('')
    setAiFocus('')
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
    const subject = subjects?.find((s) => s.id === subjectId)
    if (!subject) return
    generateSummary.mutate(
      {
        subject,
        topics: topics?.filter((t) => t.subjectId === subjectId) ?? [],
        focus: aiFocus.trim() || undefined,
      },
      { onSuccess: resetAndClose }
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

        {mode === 'manual' ? (
          <>
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
          </>
        ) : (
          <>
            <Input
              label="Tópico (opcional)"
              placeholder="Ex: Revolução Francesa"
              value={aiFocus}
              onChange={(e) => setAiFocus(e.target.value)}
            />

            <p className="text-xs text-[var(--text-secondary)]">
              A IA escreve um resumo da matéria selecionada, focado no tópico informado.
            </p>

            <div className="flex gap-2 pt-1">
              <Button
                className="flex-1"
                onClick={handleGenerate}
                disabled={!subjectId || generateSummary.isPending}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {generateSummary.isPending ? 'Gerando...' : 'Gerar Resumo com IA'}
              </Button>
              <Button variant="secondary" onClick={resetAndClose}>
                Cancelar
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
