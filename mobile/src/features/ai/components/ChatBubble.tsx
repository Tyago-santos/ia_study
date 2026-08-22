import { ActivityIndicator } from 'react-native'
import { useTheme } from '@/shared/hooks/useTheme'
import type { ChatMessage } from '@/shared/types'
import { MarkdownText } from './MarkdownText'
import * as S from './style'

function formatMessageTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

/**
 * A pergunta do usuario e texto puro; a resposta vem em markdown e passa pelo
 * `MarkdownText`, senao apareceriam os asteriscos crus.
 */
export function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'

  return (
    <S.BubbleRow $mine={isUser}>
      <S.Bubble $mine={isUser}>
        {isUser ? (
          <S.BubbleText>{message.content}</S.BubbleText>
        ) : (
          <MarkdownText content={message.content} />
        )}
        <S.BubbleTime $mine={isUser}>{formatMessageTime(message.createdAt)}</S.BubbleTime>
      </S.Bubble>
    </S.BubbleRow>
  )
}

/** Balao vazio enquanto o agente pensa — ocupa o lugar da resposta que vem. */
export function ChatBubbleLoading() {
  const { colors } = useTheme()

  return (
    <S.BubbleRow $mine={false}>
      <S.Bubble $mine={false}>
        <ActivityIndicator color={colors.accent} size="small" />
      </S.Bubble>
    </S.BubbleRow>
  )
}
