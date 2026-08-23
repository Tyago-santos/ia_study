import { useState } from 'react'
import { CheckCircle2, Edit2, HelpCircle, Layers, Plus, Sparkles } from 'lucide-react'
import { Button, Modal, ModeToggle } from '@/shared/components/ui'
import { useCreateFlashcard } from '@/features/flashcards/hooks/useFlashcards'
import { useSubjects } from '@/features/library/hooks/useSubjects'
import {
  useGenerateFlashcardsFromSummary,
  useSummaries,
} from '@/features/summaries/hooks/useSummaries'

interface CreateFlashcardModalProps {
  open: boolean
  onClose: () => void
}

export function CreateFlashcardModal({ open, onClose }: CreateFlashcardModalProps) {
  const { data: subjects } = useSubjects()
  const { data: summaries } = useSummaries()
  const createFlashcard = useCreateFlashcard()
  const generateFlashcards = useGenerateFlashcardsFromSummary()

  const [mode, setMode] = useState<'manual' | 'ai'>('manual')
  const [front, setFront] = useState('')
  const [back, setBack] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [aiSummaryId, setAiSummaryId] = useState('')
  const [aiDrafts, setAiDrafts] = useState<{ front: string; back: string }[]>([])

  const selectedSummary = summaries?.find((r) => r.id === aiSummaryId)

  const resetAndClose = () => {
    setMode('manual')
    setFront('')
    setBack('')
    setSubjectId('')
    setAiSummaryId('')
    setAiDrafts([])
    onClose()
  }

  const handleCreate = () => {
    if (!front.trim() || !back.trim() || !subjectId) return
    createFlashcard.mutate({ subjectId, front, back }, { onSuccess: resetAndClose })
  }

  const handleGenerate = () => {
    if (!aiSummaryId) return
    generateFlashcards.mutate(aiSummaryId, {
      onSuccess: (data) => setAiDrafts(data.flashcards),
    })
  }

  const handleAddDraft = (index: number) => {
    if (!selectedSummary) return
    const draft = aiDrafts[index]
    createFlashcard.mutate(
      { subjectId: selectedSummary.subjectId, front: draft.front, back: draft.back },
      { onSuccess: () => setAiDrafts((prev) => prev.filter((_, i) => i !== index)) }
    )
  }

  const handleAddAllDrafts = () => {
    if (!selectedSummary) return
    aiDrafts.forEach((draft) => {
      createFlashcard.mutate({
        subjectId: selectedSummary.subjectId,
        front: draft.front,
        back: draft.back,
      })
    })
    setAiDrafts([])
  }

  return (
    <Modal
      open={open}
      onClose={resetAndClose}
      className="max-w-lg"
      title={
        <span className="flex items-center gap-2.5">
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary-500/10 border border-primary-500/20 text-[var(--accent-text)] shrink-0">
            <Layers className="w-4 h-4" />
          </span>
          <span>
            <span className="block text-base font-semibold text-[var(--text)] leading-tight">
              Novo Flashcard
            </span>
            <span className="block text-xs font-normal text-[var(--text-secondary)] mt-0.5">
              Crie uma pergunta e sua resposta
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

        {mode === 'manual' ? (
          <>
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
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1">Frente</label>
              <div className="relative">
                <HelpCircle className="absolute left-3 top-3 w-4 h-4 text-[var(--text-secondary)]" />
                <textarea
                  className="w-full h-20 pl-9 pr-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-[var(--text)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:border-transparent resize-none"
                  placeholder="Pergunta ou conceito"
                  value={front}
                  onChange={(e) => setFront(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1">Verso</label>
              <div className="relative">
                <CheckCircle2 className="absolute left-3 top-3 w-4 h-4 text-[var(--text-secondary)]" />
                <textarea
                  className="w-full h-20 pl-9 pr-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-[var(--text)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:border-transparent resize-none"
                  placeholder="Resposta ou definição"
                  value={back}
                  onChange={(e) => setBack(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <Button
                className="flex-1"
                onClick={handleCreate}
                disabled={createFlashcard.isPending || !subjectId || !front.trim() || !back.trim()}
              >
                {createFlashcard.isPending ? 'Salvando...' : 'Salvar Flashcard'}
              </Button>
              <Button variant="secondary" onClick={resetAndClose}>
                Cancelar
              </Button>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-[var(--text)] mb-1">
                Resumo de origem
              </label>
              <select
                value={aiSummaryId}
                onChange={(e) => {
                  setAiSummaryId(e.target.value)
                  setAiDrafts([])
                }}
                className="w-full h-10 px-3 rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:border-transparent"
              >
                <option value="">Selecione um resumo</option>
                {summaries?.map((r) => {
                  const subject = subjects?.find((s) => s.id === r.subjectId)
                  return (
                    <option key={r.id} value={r.id}>
                      {r.title}
                      {subject ? ` · ${subject.name}` : ''}
                    </option>
                  )
                })}
              </select>
              {summaries && summaries.length === 0 && (
                <p className="mt-1.5 text-xs text-[var(--text-secondary)]">
                  Crie um resumo primeiro para a IA gerar flashcards a partir dele.
                </p>
              )}
            </div>

            <Button
              className="w-full"
              onClick={handleGenerate}
              disabled={!aiSummaryId || generateFlashcards.isPending}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {generateFlashcards.isPending ? 'Gerando...' : 'Gerar Flashcards com IA'}
            </Button>

            {aiDrafts.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[var(--text-secondary)]">
                    {aiDrafts.length} sugestões geradas
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleAddAllDrafts}
                    disabled={createFlashcard.isPending}
                  >
                    Adicionar todos
                  </Button>
                </div>
                {aiDrafts.map((draft, i) => (
                  <div
                    key={i}
                    className="flex items-start justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-3 animate-fade-in"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--text)] truncate">{draft.front}</p>
                      <p className="text-xs text-[var(--text-secondary)] truncate">{draft.back}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddDraft(i)}
                      disabled={createFlashcard.isPending}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-1">
              <Button variant="secondary" className="w-full" onClick={resetAndClose}>
                Fechar
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
