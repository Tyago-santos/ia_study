import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { ActivityIndicator, Alert } from 'react-native'
import { useReferenceFiles } from '@/features/ai/hooks/useReferenceFiles'
import { useVoiceRecorder } from '@/features/ai/hooks/useVoiceRecorder'
import { GeminiError, transcribeAudio } from '@/features/ai/libs/gemini/gemini.client'
import { FormModal } from '@/shared/components/ui/FormModal'
import { useTheme } from '@/shared/hooks/useTheme'
import { ChatBanner } from './ChatBanner'
import * as S from './style'

const AUDIO_FALLBACK_ERROR = 'Não consegui entender o áudio. Tente novamente.'

interface ChatComposerProps {
  /** Bloqueia o envio e vira o botao de enviar num botao de cancelar. */
  disabled: boolean
  onSend: (content: string, webSearch: boolean) => void
  onCancel: () => void
}

export function ChatComposer({ disabled, onSend, onCancel }: ChatComposerProps) {
  const { colors } = useTheme()
  const { addFile } = useReferenceFiles()
  const voice = useVoiceRecorder()
  const [draft, setDraft] = useState('')
  const [webSearch, setWebSearch] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [transcribing, setTranscribing] = useState(false)
  const [composerError, setComposerError] = useState<string | null>(null)

  const busy = disabled || voice.isRecording || transcribing
  const canSend = Boolean(draft.trim()) && !busy

  const send = () => {
    if (!canSend) return

    setComposerError(null)
    onSend(draft, webSearch)
    setDraft('')
  }

  const toggleRecording = async () => {
    if (transcribing) return
    setComposerError(null)

    if (!voice.isRecording) {
      const started = await voice.start()
      if (!started) {
        Alert.alert('Permissão negada', 'Ative o microfone nas configurações para gravar áudio.')
      }
      return
    }

    setTranscribing(true)
    try {
      const audio = await voice.stop()
      if (!audio) throw new Error('Gravação vazia')

      const text = await transcribeAudio(audio)
      setDraft((current) => (current.trim() ? `${current.trim()} ${text}` : text))
    } catch (cause) {
      // Mensagem real do Gemini (ex.: limite de uso) em vez do erro generico
      // de audio — senao um 429 aparece como "nao entendi o audio".
      setComposerError(cause instanceof GeminiError ? cause.message : AUDIO_FALLBACK_ERROR)
    } finally {
      setTranscribing(false)
    }
  }

  const toggleWebSearch = () => {
    setWebSearch((current) => !current)
    setMenuOpen(false)
  }

  const pickFile = () => {
    setMenuOpen(false)
    addFile(undefined, {
      onSuccess: (file) => {
        if (file) Alert.alert('Arquivo adicionado', `"${file.name}" já pode ser consultado no chat.`)
      },
      onError: () => Alert.alert('Erro', 'Não foi possível importar o arquivo.'),
    })
  }

  return (
    <>
      {composerError ? (
        <ChatBanner icon="alert-circle-outline" tint={colors.danger} message={composerError} />
      ) : null}

      <S.Composer>
        <S.ComposerMenuButton
          onPress={() => setMenuOpen(true)}
          disabled={busy}
          $active={webSearch}
          accessibilityLabel="Pesquisar na internet ou adicionar arquivo"
          hitSlop={4}
        >
          <Ionicons
            name={webSearch ? 'globe' : 'add'}
            size={20}
            color={webSearch ? colors.accentText : colors.textSecondary}
          />
        </S.ComposerMenuButton>

        <S.ComposerInput
          underlineColorAndroid="transparent"
          value={draft}
          onChangeText={setDraft}
          placeholder="Pergunte alguma coisa..."
          placeholderTextColor={colors.textSecondary}
          multiline
          onSubmitEditing={send}
        />

        <S.MicButton
          onPress={toggleRecording}
          disabled={disabled || transcribing}
          $recording={voice.isRecording}
          accessibilityLabel={voice.isRecording ? 'Parar gravação' : 'Gravar áudio'}
          hitSlop={4}
        >
          {transcribing ? (
            <ActivityIndicator size="small" color={colors.textSecondary} />
          ) : (
            <Ionicons
              name={voice.isRecording ? 'stop' : 'mic-outline'}
              size={18}
              color={voice.isRecording ? colors.onAccent : colors.textSecondary}
            />
          )}
        </S.MicButton>

        {disabled ? (
          <S.SendButton onPress={onCancel} $enabled accessibilityLabel="Cancelar pergunta">
            <Ionicons name="stop" size={16} color={colors.onAccent} />
          </S.SendButton>
        ) : (
          <S.SendButton onPress={send} disabled={!canSend} $enabled={canSend}>
            <Ionicons name="send" size={16} color={colors.onAccent} />
          </S.SendButton>
        )}
      </S.Composer>

      <FormModal open={menuOpen} title="Adicionar à pergunta" onClose={() => setMenuOpen(false)}>
        <S.MenuOption onPress={toggleWebSearch} $active={webSearch}>
          <S.MenuOptionIcon $active={webSearch}>
            <Ionicons
              name="globe-outline"
              size={20}
              color={webSearch ? colors.onAccent : colors.accentText}
            />
          </S.MenuOptionIcon>
          <S.MenuOptionText>
            <S.MenuOptionTitle>Pesquisar na internet</S.MenuOptionTitle>
            <S.MenuOptionDescription>
              {webSearch
                ? 'Ativado para a próxima pergunta'
                : 'O assistente busca na web antes de responder'}
            </S.MenuOptionDescription>
          </S.MenuOptionText>
          {webSearch ? <Ionicons name="checkmark-circle" size={20} color={colors.accent} /> : null}
        </S.MenuOption>

        <S.MenuOption onPress={pickFile}>
          <S.MenuOptionIcon>
            <Ionicons name="document-attach-outline" size={20} color={colors.accentText} />
          </S.MenuOptionIcon>
          <S.MenuOptionText>
            <S.MenuOptionTitle>Adicionar arquivo</S.MenuOptionTitle>
            <S.MenuOptionDescription>
              PDF, imagem, .txt ou .md para o assistente consultar
            </S.MenuOptionDescription>
          </S.MenuOptionText>
        </S.MenuOption>
      </FormModal>
    </>
  )
}
