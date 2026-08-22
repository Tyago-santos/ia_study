import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { Pressable } from 'react-native'
import { SUBJECT_COLORS } from '@/features/library/services/library.service'
import { FormModal } from '@/shared/components/ui/FormModal'
import { Input } from '@/shared/components/ui/Input'
import { useTheme } from '@/shared/hooks/useTheme'
import type { MindMap } from '@/shared/types'
import { MindMapCanvas } from './MindMapCanvas'
import * as S from './style'

interface MindMapEditorProps {
  mindMap: MindMap
  accent: string
  subjectName: string
  onClose: () => void
  onAddNode: (parentId: string, label: string, note?: string, color?: string) => void
  onUpdateNode: (nodeId: string, label: string, note: string, color: string | null) => void
  onRemoveNode: (nodeId: string) => void
  isAddingNode: boolean
  isUpdatingNode: boolean
}

/** Linha de dots para escolher a cor do no; vazio = herdar a cor da materia. */
function ColorPicker({ value, onChange }: { value: string; onChange: (color: string) => void }) {
  const options = ['', ...SUBJECT_COLORS]

  return (
    <S.ColorRow>
      {options.map((color) =>
        color === '' ? (
          <S.ColorDot key="inherit" $color="none" $selected={value === ''} onPress={() => onChange('')}>
            <S.ColorDotLabel>Auto</S.ColorDotLabel>
          </S.ColorDot>
        ) : (
          <S.ColorDot key={color} $color={color} $selected={value === color} onPress={() => onChange(color)}>
            <S.ColorDotRing $visible={value === color} />
          </S.ColorDot>
        ),
      )}
    </S.ColorRow>
  )
}

/** Canvas do mapa com o painel do topico selecionado embaixo. */
export function MindMapEditor({
  mindMap,
  accent,
  subjectName,
  onClose,
  onAddNode,
  onUpdateNode,
  onRemoveNode,
  isAddingNode,
  isUpdatingNode,
}: MindMapEditorProps) {
  const { colors } = useTheme()

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [addingTo, setAddingTo] = useState<string | null>(null)
  const [newNodeLabel, setNewNodeLabel] = useState('')
  const [newNodeNote, setNewNodeNote] = useState('')
  const [newNodeColor, setNewNodeColor] = useState('')
  const [editingNode, setEditingNode] = useState<string | null>(null)
  const [editLabel, setEditLabel] = useState('')
  const [editNote, setEditNote] = useState('')
  const [editColor, setEditColor] = useState('')

  const selectedNode = mindMap.nodes.find((n) => n.id === selectedId) ?? null

  const closeAdd = () => {
    setAddingTo(null)
    setNewNodeLabel('')
    setNewNodeNote('')
    setNewNodeColor('')
  }

  return (
    <S.Editor>
      <S.EditorHeader>
        <Pressable onPress={onClose} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <S.EditorTitleBlock>
          <S.EditorTitle numberOfLines={1}>{mindMap.title}</S.EditorTitle>
          <S.EditorMeta numberOfLines={1}>
            {mindMap.nodes.length} tópicos · {subjectName}
          </S.EditorMeta>
        </S.EditorTitleBlock>
      </S.EditorHeader>

      <MindMapCanvas
        nodes={mindMap.nodes}
        accent={accent}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      <S.Panel>
        {selectedNode ? (
          <>
            <S.PanelHeader>
              <S.PanelAccent $accent={accent} />
              <S.SelectedLabel numberOfLines={2}>{selectedNode.label}</S.SelectedLabel>
              <Pressable onPress={() => setSelectedId(null)} hitSlop={8}>
                <Ionicons name="close" size={18} color={colors.textSecondary} />
              </Pressable>
            </S.PanelHeader>

            {/* O resumo e o corpo do topico; sem ele o mapa so guarda rotulos. */}
            <S.NoteScroll>
              {selectedNode.note ? (
                <S.Note>{selectedNode.note}</S.Note>
              ) : (
                <S.NotePlaceholder>Sem resumo neste tópico.</S.NotePlaceholder>
              )}
            </S.NoteScroll>

            <S.PanelActions>
              <S.PanelButton onPress={() => setAddingTo(selectedNode.id)} $accent={accent}>
                <Ionicons name="add" size={16} color={colors.onAccent} />
                <S.PanelButtonLabel $onAccent>Subtópico</S.PanelButtonLabel>
              </S.PanelButton>

              <S.PanelButton
                onPress={() => {
                  setEditLabel(selectedNode.label)
                  setEditNote(selectedNode.note ?? '')
                  setEditColor(selectedNode.color ?? '')
                  setEditingNode(selectedNode.id)
                }}
              >
                <Ionicons name="create-outline" size={16} color={colors.text} />
                <S.PanelButtonLabel>Resumo</S.PanelButtonLabel>
              </S.PanelButton>

              {/* A raiz nao pode ser removida: sem ela o mapa fica sem arvore. */}
              {selectedNode.parentId ? (
                <Pressable
                  onPress={() => {
                    onRemoveNode(selectedNode.id)
                    setSelectedId(null)
                  }}
                  hitSlop={8}
                >
                  <Ionicons name="trash-outline" size={19} color={colors.danger} />
                </Pressable>
              ) : null}
            </S.PanelActions>
          </>
        ) : (
          <S.ToolbarHint>
            Toque num tópico para ver o resumo · arraste e pince para navegar
          </S.ToolbarHint>
        )}
      </S.Panel>

      <FormModal
        open={editingNode !== null}
        title="Editar tópico"
        onClose={() => setEditingNode(null)}
        onSubmit={() => {
          if (!editingNode) return
          // '' = sem cor propria (Auto); o servico converte para undefined.
          onUpdateNode(editingNode, editLabel.trim(), editNote.trim(), editColor || null)
          setEditingNode(null)
        }}
        submitLabel="Salvar"
        isSubmitting={isUpdatingNode}
        submitDisabled={!editLabel.trim()}
      >
        <Input label="Título" value={editLabel} onChangeText={setEditLabel} />
        <Input
          label="Resumo"
          value={editNote}
          onChangeText={setEditNote}
          placeholder="O que é importante lembrar sobre este tópico"
          multiline
          style={{ minHeight: 110, textAlignVertical: 'top' }}
        />
        <S.ColorLabel>Cor</S.ColorLabel>
        <ColorPicker value={editColor} onChange={setEditColor} />
      </FormModal>

      <FormModal
        open={addingTo !== null}
        title="Novo subtópico"
        onClose={closeAdd}
        onSubmit={() => {
          if (!addingTo || !newNodeLabel.trim()) return
          onAddNode(addingTo, newNodeLabel.trim(), newNodeNote.trim() || undefined, newNodeColor || undefined)
          closeAdd()
        }}
        submitLabel="Adicionar"
        isSubmitting={isAddingNode}
        submitDisabled={!newNodeLabel.trim()}
      >
        <Input
          label="Tópico"
          value={newNodeLabel}
          onChangeText={setNewNodeLabel}
          placeholder="Ex: Regra da cadeia"
          autoFocus
        />
        <Input
          label="Resumo (opcional)"
          value={newNodeNote}
          onChangeText={setNewNodeNote}
          placeholder="O que é importante lembrar"
          multiline
          style={{ minHeight: 110, textAlignVertical: 'top' }}
        />
        <S.ColorLabel>Cor</S.ColorLabel>
        <ColorPicker value={newNodeColor} onChange={setNewNodeColor} />
      </FormModal>
    </S.Editor>
  )
}
