import { type ReactNode, useEffect, useRef } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from './Button'
import { Modal } from './Modal'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  /** Deve nomear exatamente o que sera perdido. */
  description: ReactNode
  /** Nomeia a acao, nao "OK" (ex.: "Excluir materia"). */
  confirmLabel: string
  cancelLabel?: string
  isPending?: boolean
}

/**
 * Confirmacao para acoes irreversiveis. Usada quando a exclusao cascateia e um
 * undo simples nao daria conta do que foi perdido.
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancelar',
  isPending,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  // O foco inicial vai para a acao segura: quem confirma por engano perde dados.
  useEffect(() => {
    if (open) cancelRef.current?.focus()
  }, [open])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        <span className="flex items-center gap-2.5">
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-error-500/10 shrink-0">
            <AlertTriangle className="w-4 h-4 text-[var(--danger)]" />
          </span>
          <span className="text-base font-semibold text-[var(--text)] leading-tight">{title}</span>
        </span>
      }
    >
      <div className="space-y-4">
        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{description}</p>
        <div className="flex gap-2">
          <Button ref={cancelRef} variant="secondary" className="flex-1" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button variant="danger" className="flex-1" onClick={onConfirm} disabled={isPending}>
            {isPending ? 'Excluindo...' : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
