import { useState } from 'react'
import { Edit2, Network, Sparkles } from 'lucide-react'
import { Button, Input, Modal, ModeToggle } from '@/shared/components/ui'
import type { MindMap, MindMapNode } from '@/shared/types'
import { useSubjects } from '@/features/library/hooks/useSubjects'
import { useTopics } from '@/features/library/hooks/useTopics'
import {
  useCreateMindMap,
  useGenerateMindMapWithAI,
} from '@/features/mindmaps/hooks/useMindMaps'
import { getMindMapStats } from '@/features/mindmaps/lib/mindmapTree'

interface CreateMindMapModalProps {
  open: boolean
  onClose: () => void
  onCreated: (mindMap: MindMap) => void
}

export function CreateMindMapModal({ open, onClose, onCreated }: CreateMindMapModalProps) {
  const { data: subjects } = useSubjects()
  const { data: topics } = useTopics()
  const createMindMap = useCreateMindMap()
  const generateMindMap = useGenerateMindMapWithAI()

  const [mode, setMode] = useState<'manual' | 'ai'>('manual')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [generatedNodes, setGeneratedNodes] = useState<MindMapNode[] | null>(null)

  const resetAndClose = () => {
    setMode('manual')
    setTitle('')
    setDescription('')
    setSubjectId('')
    setGeneratedNodes(null)
    onClose()
  }

  const handleGenerate = () => {
    const subject = subjects?.find((s) => s.id === subjectId)
    if (!subject || !title.trim()) return
    generateMindMap.mutate(
      {
        subject,
        topics: topics?.filter((t) => t.subjectId === subjectId) ?? [],
        focus: title,
      },
      { onSuccess: (data) => setGeneratedNodes(data.nodes) }
    )
  }

  const handleCreate = () => {
    if (!title.trim() || !subjectId) return
    createMindMap.mutate(
      {
        subjectId,
        title: title.trim(),
        description: description.trim() || undefined,
        // No modo IA a arvore gerada substitui a estrutura inicial padrao.
        nodes: mode === 'ai' && generatedNodes ? generatedNodes : undefined,
      },
      { onSuccess: (mindMap) => { onCreated(mindMap); resetAndClose() } }
    )
  }

  const preview = generatedNodes ? getMindMapStats(generatedNodes) : null

  return (
    <Modal
      open={open}
      onClose={resetAndClose}
      className="max-w-lg"
      title={
        <span className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 shadow-md shadow-primary-500/25">
            <Network className="h-4 w-4 text-[var(--on-accent)]" />
          </span>
          <span>
            <span className="block text-base font-semibold leading-tight text-[var(--text)]">
              Novo Mapa Mental
            </span>
            <span className="mt-0.5 block text-xs font-normal text-[var(--text-secondary)]">
              Estruture um tema em ramos e subtopicos
            </span>
          </span>
        </span>
      }
    >
      <div className="space-y-4">
        <ModeToggle
          value={mode}
          onChange={(value) => {
            setMode(value)
            setGeneratedNodes(null)
          }}
          options={[
            { value: 'manual', label: 'Comecar do zero', icon: <Edit2 className="h-3.5 w-3.5" /> },
            { value: 'ai', label: 'Gerar com IA', icon: <Sparkles className="h-3.5 w-3.5" /> },
          ]}
        />

        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--text)]">Materia</label>
          <select
            value={subjectId}
            onChange={(event) => setSubjectId(event.target.value)}
            className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--card-bg)] px-3 text-[var(--text)] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
          >
            <option value="">Selecione uma materia</option>
            {subjects?.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Tema central"
          placeholder="Ex.: Derivadas, Revolucao Industrial..."
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <Input
          label="Descricao (opcional)"
          placeholder="Para que serve este mapa"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        {mode === 'ai' && (
          <div className="animate-fade-in space-y-2 rounded-xl border border-primary-500/20 bg-primary-500/5 p-3">
            <p className="text-xs text-[var(--text-secondary)]">
              A IA monta os ramos e subtopicos a partir da materia e do tema central informados
              acima.
            </p>
            <Button
              className="w-full"
              onClick={handleGenerate}
              disabled={!title.trim() || generateMindMap.isPending}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {generateMindMap.isPending ? 'Gerando...' : 'Gerar Estrutura com IA'}
            </Button>
            {preview && (
              <p className="text-[11px] text-[var(--text-secondary)]">
                Estrutura pronta: {preview.total} topicos em {preview.branches} ramos. Salve para
                abrir no editor.
              </p>
            )}
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <Button
            className="flex-1"
            onClick={handleCreate}
            disabled={createMindMap.isPending || !subjectId || !title.trim()}
          >
            {createMindMap.isPending ? 'Criando...' : 'Criar e Abrir'}
          </Button>
          <Button variant="secondary" onClick={resetAndClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
