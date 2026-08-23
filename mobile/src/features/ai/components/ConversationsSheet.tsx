import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { Modal } from 'react-native'
import { ConfirmModal } from '@/shared/components/ui/ConfirmModal'
import { FormModal } from '@/shared/components/ui/FormModal'
import { Input } from '@/shared/components/ui/Input'
import { useTheme } from '@/shared/hooks/useTheme'
import type { Conversation } from '@/shared/types'
import * as S from './style'

interface ConversationsSheetProps {
  open: boolean
  conversations: Conversation[]
  activeId: string | null
  onClose: () => void
  onSelect: (id: string) => void
  onNew: () => void
  onRename: (input: { id: string; title: string }) => void
  onDelete: (id: string) => void
}

/** "há 2 h", "há 3 d"; menos de 1 min vira "agora". */
function relativeLabel(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diffMs / 60_000)
  if (minutes < 1) return 'agora'
  if (minutes < 60) return `há ${minutes} min`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `há ${hours} h`

  const days = Math.floor(hours / 24)
  return `há ${days} d`
}

/** Lista de sessoes do chat — trocar, criar, renomear e apagar. */
export function ConversationsSheet({
  open,
  conversations,
  activeId,
  onClose,
  onSelect,
  onNew,
  onRename,
  onDelete,
}: ConversationsSheetProps) {
  const { colors } = useTheme()
  const [renaming, setRenaming] = useState<Conversation | null>(null)
  const [renameDraft, setRenameDraft] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const startRenaming = (conversation: Conversation) => {
    setRenaming(conversation)
    setRenameDraft(conversation.title)
  }

  return (
    <>
      <Modal visible={open} transparent animationType="slide" onRequestClose={onClose}>
        <S.SessionsBackdrop>
          <S.SessionsBackdropFill onPress={onClose} />

          <S.SessionsSheet>
            <S.SessionsHeader>
              <S.SessionsTitle>Conversas</S.SessionsTitle>
              <S.SessionRowIconButton onPress={onClose} hitSlop={8}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </S.SessionRowIconButton>
            </S.SessionsHeader>

            <S.NewSessionButton
              onPress={() => {
                onNew()
                onClose()
              }}
            >
              <Ionicons name="add" size={18} color={colors.accentText} />
              <S.NewSessionText>Nova conversa</S.NewSessionText>
            </S.NewSessionButton>

            {conversations.length === 0 ? (
              <S.SessionsEmpty>Nenhuma conversa ainda.</S.SessionsEmpty>
            ) : (
              <S.SessionsList>
                {conversations.map((conversation) => (
                  <S.SessionRow
                    key={conversation.id}
                    $active={conversation.id === activeId}
                    onPress={() => {
                      onSelect(conversation.id)
                      onClose()
                    }}
                  >
                    <S.SessionRowText>
                      <S.SessionRowTitle numberOfLines={1}>{conversation.title}</S.SessionRowTitle>
                      <S.SessionRowSubtitle>
                        {relativeLabel(conversation.updatedAt)}
                      </S.SessionRowSubtitle>
                    </S.SessionRowText>

                    <S.SessionRowActions>
                      <S.SessionRowIconButton onPress={() => startRenaming(conversation)} hitSlop={8}>
                        <Ionicons name="pencil-outline" size={16} color={colors.textSecondary} />
                      </S.SessionRowIconButton>
                      <S.SessionRowIconButton
                        onPress={() => setDeletingId(conversation.id)}
                        hitSlop={8}
                      >
                        <Ionicons name="trash-outline" size={16} color={colors.danger} />
                      </S.SessionRowIconButton>
                    </S.SessionRowActions>
                  </S.SessionRow>
                ))}
              </S.SessionsList>
            )}
          </S.SessionsSheet>
        </S.SessionsBackdrop>
      </Modal>

      <FormModal
        open={renaming !== null}
        title="Renomear conversa"
        onClose={() => setRenaming(null)}
        submitLabel="Salvar"
        submitDisabled={!renameDraft.trim()}
        onSubmit={() => {
          if (!renaming || !renameDraft.trim()) return
          onRename({ id: renaming.id, title: renameDraft.trim() })
          setRenaming(null)
        }}
      >
        <Input label="Título" value={renameDraft} onChangeText={setRenameDraft} autoFocus />
      </FormModal>

      <ConfirmModal
        open={deletingId !== null}
        title="Apagar conversa"
        message="Essa conversa e todas as mensagens dela serão apagadas."
        confirmLabel="Apagar"
        destructive
        onCancel={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId) onDelete(deletingId)
          setDeletingId(null)
        }}
      />
    </>
  )
}
