import { Ionicons } from '@expo/vector-icons'
import { useEffect, useRef, useState } from 'react'
import { Pressable } from 'react-native'
import {
  KeyboardAwareScrollView,
  KeyboardStickyView,
  type KeyboardAwareScrollViewRef,
} from 'react-native-keyboard-controller'
import { ConfirmModal } from '@/shared/components/ui/ConfirmModal'
import { useTheme } from '@/shared/hooks/useTheme'
import { ChatBanner } from '../components/ChatBanner'
import { ChatBubble, ChatBubbleLoading } from '../components/ChatBubble'
import { ChatComposer } from '../components/ChatComposer'
import { ChatWelcome } from '../components/ChatWelcome'
import { ConversationsSheet } from '../components/ConversationsSheet'
import { useAgentChat } from '../hooks/useAgentChat'
import * as S from './style'

export function AIPage() {
  const { colors } = useTheme()
  const scrollRef = useRef<KeyboardAwareScrollViewRef>(null)

  const {
    conversations,
    activeConversationId,
    messages,
    isEmpty,
    loading,
    error,
    isConfigured,
    submit,
    clearChat,
    cancel,
    switchConversation,
    newChat,
    deleteConversation,
    renameConversation,
  } = useAgentChat()

  const [confirmingClear, setConfirmingClear] = useState(false)
  const [sessionsOpen, setSessionsOpen] = useState(false)

  // Mensagem nova entra no fim da lista; sem isto ela nasceria fora da vista.
  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true })
  }, [messages, loading])

  return (
    <S.Container>
      <S.Header>
        <S.HeaderIcon>
          <Ionicons name="sparkles" size={17} color={colors.onAccent} />
        </S.HeaderIcon>
        <S.HeaderText>
          <S.HeaderTitle>Assistente de Estudos</S.HeaderTitle>
          <S.HeaderSubtitle>Conhece suas matérias e responde sobre elas</S.HeaderSubtitle>
        </S.HeaderText>

        <Pressable onPress={() => setSessionsOpen(true)} hitSlop={8}>
          <Ionicons name="chatbubbles-outline" size={20} color={colors.textSecondary} />
        </Pressable>

        <Pressable onPress={() => setConfirmingClear(true)} hitSlop={8} disabled={isEmpty}>
          <Ionicons
            name="trash-outline"
            size={20}
            color={isEmpty ? colors.textSecondary : colors.danger}
          />
        </Pressable>
      </S.Header>

      {/* KeyboardAwareScrollView em vez de ScrollView: rola o input do composer
          (a base) pra acima do teclado quando ele aparecer. */}
      <KeyboardAwareScrollView
        ref={scrollRef}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 32,
          gap: 8,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {isEmpty ? (
          <ChatWelcome onPick={submit} />
        ) : (
          messages.map((message) => <ChatBubble key={message.id} message={message} />)
        )}

        {loading ? <ChatBubbleLoading /> : null}
      </KeyboardAwareScrollView>

      {/* KeyboardStickyView: mantem o composer colado acima do teclado
          conforme ele abre/fecha, em vez de depender de KeyboardAvoidingView. */}
      <KeyboardStickyView>
        {/* A chave ausente e' o caso mais comum e trava tudo, entao vem antes do
            erro de conexao: avisar do erro sem dizer que falta a chave leva o
            usuario a tentar de novo para sempre. */}
        {!isConfigured ? (
          <ChatBanner
            icon="key-outline"
            tint={colors.warning}
            message="A IA não está configurada no servidor. Avise quem administra o backend."
          />
        ) : error ? (
          <ChatBanner icon="alert-circle-outline" tint={colors.danger} message={error} />
        ) : null}

        <ChatComposer disabled={loading} onSend={submit} onCancel={cancel} />
      </KeyboardStickyView>

      <ConfirmModal
        open={confirmingClear}
        title="Limpar conversa"
        message="Todas as mensagens serão apagadas."
        confirmLabel="Limpar"
        destructive
        onCancel={() => setConfirmingClear(false)}
        onConfirm={() => {
          clearChat()
          setConfirmingClear(false)
        }}
      />

      <ConversationsSheet
        open={sessionsOpen}
        conversations={conversations}
        activeId={activeConversationId}
        onClose={() => setSessionsOpen(false)}
        onSelect={switchConversation}
        onNew={newChat}
        onRename={renameConversation}
        onDelete={deleteConversation}
      />
    </S.Container>
  )
}
