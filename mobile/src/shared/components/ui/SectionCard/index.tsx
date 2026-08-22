import type { PropsWithChildren, ReactNode } from 'react'
import * as S from './style'

interface SectionCardProps extends PropsWithChildren {
  title?: string
  /** Texto ou elemento alinhado a direita do titulo (contagem, acao, badge). */
  action?: ReactNode
}

export function SectionCard({ title, action, children }: SectionCardProps) {
  return (
    <S.Container>
      {title ? (
        <S.Header>
          <S.Title>{title}</S.Title>
          {action}
        </S.Header>
      ) : null}
      <S.Body>{children}</S.Body>
    </S.Container>
  )
}
