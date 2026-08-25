import { useState } from 'react'
import { CheckCircle2, Circle, Edit2, ListChecks, Plus, Sparkles, Trash2 } from 'lucide-react'
import { Button, Input, Modal, ModeToggle } from '@/shared/components/ui'
import { cn } from '@/shared/lib/utils'
import { useSubjects } from '@/features/library/hooks/useSubjects'
import { useTopics } from '@/features/library/hooks/useTopics'
import { useCreateQuiz, useGenerateQuizWithAI } from '@/features/quiz/hooks/useQuiz'

interface CreateQuizModalProps {
  open: boolean
  onClose: () => void
}

interface DraftQuestion {
  question: string
  options: string[]
  correctAnswer: number
}

function emptyQuestion(): DraftQuestion {
  return { question: '', options: ['', '', '', ''], correctAnswer: -1 }
}

export function CreateQuizModal({ open, onClose }: CreateQuizModalProps) {
  const { data: subjects } = useSubjects()
  const { data: topics } = useTopics()
  const createQuiz = useCreateQuiz()
  const generateQuiz = useGenerateQuizWithAI()

  const [mode, setMode] = useState<'manual' | 'ai'>('manual')
  const [title, setTitle] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [aiTopic, setAiTopic] = useState('')
  const [questions, setQuestions] = useState<DraftQuestion[]>([emptyQuestion()])

  const resetAndClose = () => {
    setMode('manual')
    setTitle('')
    setSubjectId('')
    setAiTopic('')
    setQuestions([emptyQuestion()])
    onClose()
  }

  const handleGenerate = () => {
    const subject = subjects?.find((s) => s.id === subjectId)
    if (!subject) return
    generateQuiz.mutate(
      {
        subject,
        topics: topics?.filter((t) => t.subjectId === subjectId) ?? [],
        focus: aiTopic.trim() || undefined,
      },
      { onSuccess: resetAndClose }
    )
  }

  const updateQuestion = (index: number, question: string) => {
    setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, question } : q)))
  }

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex ? { ...q, options: q.options.map((o, oi) => (oi === optIndex ? value : o)) } : q
      )
    )
  }

  const setCorrectAnswer = (qIndex: number, optIndex: number) => {
    setQuestions((prev) => prev.map((q, i) => (i === qIndex ? { ...q, correctAnswer: optIndex } : q)))
  }

  const isValid =
    title.trim() !== '' &&
    subjectId !== '' &&
    questions.length > 0 &&
    questions.every(
      (q) =>
        q.question.trim() !== '' && q.options.every((o) => o.trim() !== '') && q.correctAnswer >= 0
    )

  const handleCreate = () => {
    if (!isValid) return
    createQuiz.mutate(
      {
        subjectId,
        title,
        questions: questions.map((q) => ({
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
        })),
      },
      { onSuccess: resetAndClose }
    )
  }

  return (
    <Modal
      open={open}
      onClose={resetAndClose}
      className="max-w-2xl max-h-[88vh] overflow-y-auto"
      title={
        <span className="flex items-center gap-2.5">
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 shadow-md shadow-primary-500/25 shrink-0">
            <ListChecks className="w-4 h-4 text-[var(--on-accent)]" />
          </span>
          <span>
            <span className="block text-base font-semibold text-[var(--text)] leading-tight">Novo Quiz</span>
            <span className="block text-xs font-normal text-[var(--text-secondary)] mt-0.5">
              Monte perguntas de múltipla escolha
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
            { value: 'manual', label: 'Montar', icon: <Edit2 className="w-3.5 h-3.5" /> },
            { value: 'ai', label: 'Gerar com IA', icon: <Sparkles className="w-3.5 h-3.5" /> },
          ]}
        />

        {mode === 'manual' ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Título"
                placeholder="Título do quiz"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
            </div>

            <div className="space-y-3">
              {questions.map((q, qIndex) => (
                <div
                  key={qIndex}
                  className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 space-y-3 animate-fade-in"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-500/10 text-[var(--accent-text)] text-xs font-semibold shrink-0">
                      {qIndex + 1}
                    </span>
                    <Input
                      className="flex-1"
                      placeholder="Digite a pergunta"
                      value={q.question}
                      onChange={(e) => updateQuestion(qIndex, e.target.value)}
                    />
                    {questions.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setQuestions((prev) => prev.filter((_, i) => i !== qIndex))}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-8">
                    {q.options.map((option, optIndex) => {
                      const isCorrect = q.correctAnswer === optIndex
                      return (
                        <div key={optIndex} className="flex items-center gap-2">
                          <button
                            type="button"
                            title="Marcar como resposta correta"
                            onClick={() => setCorrectAnswer(qIndex, optIndex)}
                            className="shrink-0"
                          >
                            {isCorrect ? (
                              <CheckCircle2 className="w-5 h-5 text-success-500" />
                            ) : (
                              <Circle className="w-5 h-5 text-[var(--text-secondary)]" />
                            )}
                          </button>
                          <input
                            value={option}
                            onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                            placeholder={`Opção ${optIndex + 1}`}
                            className={cn(
                              'w-full h-9 px-3 rounded-lg border bg-[var(--card-bg)] text-sm text-[var(--text)]',
                              'placeholder:text-[var(--text-secondary)]',
                              'focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:border-transparent',
                              isCorrect ? 'border-success-500/50' : 'border-[var(--border)]'
                            )}
                          />
                        </div>
                      )
                    })}
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] pl-8">
                    Clique no círculo para marcar a alternativa correta
                  </p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setQuestions((prev) => [...prev, emptyQuestion()])}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-[var(--border)] text-sm font-medium text-[var(--text-secondary)] hover:border-primary-500 hover:text-[var(--accent-text)] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Adicionar pergunta
            </button>

            <div className="flex gap-2 pt-1">
              <Button
                className="flex-1"
                onClick={handleCreate}
                disabled={createQuiz.isPending || !isValid}
              >
                {createQuiz.isPending ? 'Salvando...' : 'Salvar Quiz'}
              </Button>
              <Button variant="secondary" onClick={resetAndClose}>
                Cancelar
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                label="Tópico (opcional)"
                placeholder="Ex: Revolução Francesa"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
              />
            </div>

            <p className="text-xs text-[var(--text-secondary)]">
              A IA gera um quiz de múltipla escolha para a matéria selecionada, focado no tópico
              informado.
            </p>

            <div className="flex gap-2 pt-1">
              <Button
                className="flex-1"
                onClick={handleGenerate}
                disabled={!subjectId || generateQuiz.isPending}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {generateQuiz.isPending ? 'Gerando...' : 'Gerar Quiz com IA'}
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
