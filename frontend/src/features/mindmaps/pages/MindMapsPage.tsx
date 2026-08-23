import { useState } from 'react'
import { Network } from 'lucide-react'
import {
  Card,
  CardContent,
  CardSkeleton,
  ConfirmDialog,
  EmptyState,
  ErrorState,
} from '@/shared/components/ui'
import { useSubjects } from '@/features/library/hooks/useSubjects'
import { CreateMindMapModal } from '../components/CreateMindMapModal'
import { MindMapCard } from '../components/MindMapCard'
import { MindMapEditorPanel } from '../components/MindMapEditorPanel'
import { MindMapsHeader } from '../components/MindMapsHeader'
import { useDeleteMindMap, useMindMaps } from '../hooks/useMindMaps'

export function MindMapsPage() {
  const [isCreating, setIsCreating] = useState(false)
  const [openMapId, setOpenMapId] = useState<string | null>(null)
  const [pendingDeletionId, setPendingDeletionId] = useState<string | null>(null)

  const { data: mindMaps, isLoading, error, refetch } = useMindMaps()
  const { data: subjects } = useSubjects()
  const deleteMindMap = useDeleteMindMap()

  const getSubject = (subjectId: string) => subjects?.find((s) => s.id === subjectId)
  const openMap = mindMaps?.find((m) => m.id === openMapId)

  // Um mapa leva todos os seus topicos, entao a acao passa por confirmacao.
  const mapPendingDeletion = mindMaps?.find((m) => m.id === pendingDeletionId) ?? null

  const confirmDelete = () => {
    if (!pendingDeletionId) return
    deleteMindMap.mutate(pendingDeletionId)
    if (openMapId === pendingDeletionId) setOpenMapId(null)
    setPendingDeletionId(null)
  }

  if (error) {
    return <ErrorState message="Erro ao carregar mapas mentais" onRetry={refetch} />
  }

  // O editor recebe `key` para reiniciar o estado de edicao ao trocar de mapa.
  if (openMap) {
    return (
      <MindMapEditorPanel
        key={openMap.id}
        mindMap={openMap}
        subject={getSubject(openMap.subjectId)}
        onBack={() => setOpenMapId(null)}
      />
    )
  }

  const topicCount = mindMaps?.reduce((sum, map) => sum + map.nodes.length, 0) ?? 0

  return (
    <div className="space-y-6 animate-fade-in">
      <MindMapsHeader
        total={mindMaps?.length ?? 0}
        topicCount={topicCount}
        onCreate={() => setIsCreating(true)}
      />

      <CreateMindMapModal
        open={isCreating}
        onClose={() => setIsCreating(false)}
        onCreated={(mindMap) => setOpenMapId(mindMap.id)}
      />

      <ConfirmDialog
        open={mapPendingDeletion !== null}
        onClose={() => setPendingDeletionId(null)}
        onConfirm={confirmDelete}
        title="Excluir mapa mental"
        confirmLabel="Excluir mapa"
        isPending={deleteMindMap.isPending}
        description={
          <>
            <strong className="text-[var(--text)]">{mapPendingDeletion?.title}</strong> e seus{' '}
            {mapPendingDeletion?.nodes.length ?? 0} tópicos serão removidos. Não é possível
            desfazer.
          </>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : mindMaps && mindMaps.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mindMaps.map((mindMap, i) => (
            <MindMapCard
              key={mindMap.id}
              mindMap={mindMap}
              subject={getSubject(mindMap.subjectId)}
              index={i}
              onOpen={() => setOpenMapId(mindMap.id)}
              onDelete={() => setPendingDeletionId(mindMap.id)}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent>
            <EmptyState
              icon={<Network className="h-12 w-12" />}
              title="Nenhum mapa mental criado"
              description="Clique em 'Criar Mapa Mental' para estruturar um tema em ramos!"
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
