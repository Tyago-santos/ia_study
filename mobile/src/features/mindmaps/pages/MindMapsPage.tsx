import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { Pressable } from 'react-native'
import { AiGenerateButton } from '@/features/ai/components/AiGenerateButton'
import { Badge } from '@/shared/components/ui/Badge'
import { EmptyState } from '@/shared/components/ui/EmptyState'
import { FilterChips } from '@/shared/components/ui/FilterChips'
import { FormModal } from '@/shared/components/ui/FormModal'
import { Input } from '@/shared/components/ui/Input'
import { PageHeader } from '@/shared/components/ui/PageHeader'
import { Screen } from '@/shared/components/ui/Screen'
import { SectionCard } from '@/shared/components/ui/SectionCard'
import { SkeletonCard } from '@/shared/components/ui/Skeleton'
import { useTheme } from '@/shared/hooks/useTheme'
import { formatDate } from '@/shared/lib/format'
import * as C from '../components/style'
import { MindMapEditor } from '../components/MindMapEditor'
import { useMindMaps } from '../hooks/useMindMaps'
import * as S from './style'

export function MindMapsPage() {
  const { colors } = useTheme()
  const {
    isLoading,
    subjects,
    mindMaps,
    getSubject,
    findMap,
    nodeCount,
    createMap,
    removeMap,
    addNode,
    removeNode,
    updateNode,
  } = useMindMaps()

  const [openMapId, setOpenMapId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [subjectId, setSubjectId] = useState<string | null>(null)

  const openMap = findMap(openMapId)

  if (isLoading) {
    return (
      <Screen scroll>
        <PageHeader title="Mapas Mentais" subtitle="Carregando..." />
        <SkeletonCard lines={2} style={{ marginBottom: 12 }} />
        <SkeletonCard lines={2} />
      </Screen>
    )
  }

  if (openMap) {
    const subject = getSubject(openMap.subjectId)

    return (
      <MindMapEditor
        mindMap={openMap}
        accent={subject?.color ?? colors.accent}
        subjectName={subject?.name ?? 'Sem matéria'}
        onClose={() => setOpenMapId(null)}
        onAddNode={(parentId, label, note, color) =>
          addNode.mutate({ mapId: openMap.id, parentId, label, note, color })
        }
        onUpdateNode={(nodeId, label, note, color) =>
          updateNode.mutate({ mapId: openMap.id, nodeId, label, note, color })
        }
        onRemoveNode={(nodeId) => removeNode.mutate({ mapId: openMap.id, nodeId })}
        isAddingNode={addNode.isPending}
        isUpdatingNode={updateNode.isPending}
      />
    )
  }

  return (
    <Screen scroll>
      <PageHeader
        title="Mapas Mentais"
        subtitle={`${mindMaps.length} mapas · ${nodeCount} tópicos`}
        actionLabel="Criar"
        onAction={() => {
          setSubjectId(subjects[0]?.id ?? null)
          setIsCreating(true)
        }}
      />

      <AiGenerateButton kind="mindMap" />

      <S.List>
        {mindMaps.length > 0 ? (
          mindMaps.map((mindMap) => {
            const subject = getSubject(mindMap.subjectId)
            const tint = subject?.color ?? colors.accent

            return (
              <C.MapCard key={mindMap.id} onPress={() => setOpenMapId(mindMap.id)}>
                <C.MapIcon $color={tint}>
                  <Ionicons name="git-network" size={20} color={tint} />
                </C.MapIcon>

                <C.MapInfo>
                  <Badge label={subject?.name ?? 'Sem matéria'} color={subject?.color} />
                  <C.MapTitle>{mindMap.title}</C.MapTitle>
                  {mindMap.description ? (
                    <C.MapDescription numberOfLines={2}>{mindMap.description}</C.MapDescription>
                  ) : null}
                  <C.MapMeta>
                    {mindMap.nodes.length} tópicos · {formatDate(mindMap.updatedAt)}
                  </C.MapMeta>
                </C.MapInfo>

                <Pressable onPress={() => removeMap.mutate(mindMap.id)} hitSlop={8}>
                  <Ionicons name="trash-outline" size={18} color={colors.danger} />
                </Pressable>
              </C.MapCard>
            )
          })
        ) : (
          <SectionCard>
            <EmptyState
              icon="git-network-outline"
              title="Nenhum mapa mental criado"
              description="Toque em Criar para estruturar um tema em ramos!"
            />
          </SectionCard>
        )}
      </S.List>

      <FormModal
        open={isCreating}
        title="Novo mapa mental"
        onClose={() => setIsCreating(false)}
        onSubmit={() => {
          if (!subjectId) return

          createMap.mutate(
            {
              subjectId,
              title: title.trim(),
              description: description.trim() || undefined,
            },
            {
              // Abre o mapa recem-criado: ele nasce so com a raiz e o proximo
              // passo e sempre adicionar ramos.
              onSuccess: (map) => {
                setIsCreating(false)
                setTitle('')
                setDescription('')
                setOpenMapId(map.id)
              },
            },
          )
        }}
        submitLabel="Criar mapa"
        isSubmitting={createMap.isPending}
        submitDisabled={!title.trim() || !subjectId}
      >
        <S.FieldLabel>Matéria</S.FieldLabel>
        <FilterChips
          value={subjectId}
          onChange={setSubjectId}
          options={subjects.map((s) => ({ value: s.id, label: s.name, color: s.color }))}
        />

        <Input label="Título" value={title} onChangeText={setTitle} placeholder="Ex: Derivadas" />
        <Input
          label="Descrição (opcional)"
          value={description}
          onChangeText={setDescription}
          placeholder="Sobre o que é esse mapa"
          multiline
        />
      </FormModal>
    </Screen>
  )
}
