import { useState } from 'react'
import { Check, MessageSquarePlus, Pencil, Trash2, X } from 'lucide-react'
import { Button, ConfirmDialog, Input, Modal } from '@/shared/components/ui'
import { cn } from '@/shared/lib/utils'
import type { Conversation } from '@/shared/types'

interface ConversationsPanelProps {
  open: boolean
  onClose: () => void
  conversations: Conversation[]
  activeId: string | null
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
export function ConversationsPanel({
  open,
  onClose,
  conversations,
  activeId,
  onSelect,
  onNew,
  onRename,
  onDelete,
}: ConversationsPanelProps) {
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameDraft, setRenameDraft] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const startRenaming = (conversation: Conversation) => {
    setRenamingId(conversation.id)
    setRenameDraft(conversation.title)
  }

  const commitRename = () => {
    if (renamingId && renameDraft.trim()) {
      onRename({ id: renamingId, title: renameDraft.trim() })
    }
    setRenamingId(null)
  }

  return (
    <>
      <Modal open={open} onClose={onClose} title="Conversas">
        <div className="space-y-3">
          <Button
            variant="secondary"
            className="w-full justify-start gap-2"
            onClick={() => {
              onNew()
              onClose()
            }}
          >
            <MessageSquarePlus className="w-4 h-4" />
            Nova conversa
          </Button>

          {conversations.length === 0 ? (
            <p className="text-sm text-[var(--text-secondary)] text-center py-4">
              Nenhuma conversa ainda.
            </p>
          ) : (
            <div className="max-h-96 overflow-y-auto space-y-1.5 -mx-1 px-1">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={cn(
                    'flex items-center gap-2 rounded-xl border px-3 py-2.5 transition-colors',
                    conversation.id === activeId
                      ? 'bg-primary-500/10 border-primary-500/40'
                      : 'border-[var(--border)] hover:bg-[var(--bg-secondary)]'
                  )}
                >
                  {renamingId === conversation.id ? (
                    <>
                      <Input
                        autoFocus
                        value={renameDraft}
                        onChange={(e) => setRenameDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') commitRename()
                          if (e.key === 'Escape') setRenamingId(null)
                        }}
                        className="h-8 flex-1"
                      />
                      <button
                        onClick={commitRename}
                        className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg text-[var(--accent-text)] hover:bg-[var(--bg-secondary)]"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setRenamingId(null)}
                        className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          onSelect(conversation.id)
                          onClose()
                        }}
                        className="flex-1 min-w-0 text-left"
                      >
                        <p className="text-sm font-medium text-[var(--text)] truncate">
                          {conversation.title}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">
                          {relativeLabel(conversation.updatedAt)}
                        </p>
                      </button>
                      <button
                        onClick={() => startRenaming(conversation)}
                        className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text)]"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingId(conversation.id)}
                        className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-[var(--danger)]/10 hover:text-[var(--danger)]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      <ConfirmDialog
        open={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId) onDelete(deletingId)
          setDeletingId(null)
        }}
        title="Apagar conversa"
        description="Essa conversa e todas as mensagens dela serão apagadas."
        confirmLabel="Apagar"
      />
    </>
  )
}
