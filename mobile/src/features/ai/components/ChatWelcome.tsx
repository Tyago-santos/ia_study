import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@/shared/hooks/useTheme'
import { SUGGESTIONS } from '../services/suggestions'
import * as S from './style'

/** Tela inicial do chat: o que o agente sabe fazer e atalhos para provar. */
export function ChatWelcome({ onPick }: { onPick: (prompt: string) => void }) {
  const { colors } = useTheme()

  return (
    <S.Welcome>
      <S.WelcomeCard>
        <S.WelcomeText>
          Olá! Sou seu assistente de estudos. Eu leio a sua Biblioteca, então posso responder sobre
          as suas matérias, o que ainda falta estudar e o seu ritmo — além de explicar conteúdo e
          montar planos de estudo.
        </S.WelcomeText>
      </S.WelcomeCard>

      <S.PromptGrid>
        {SUGGESTIONS.map((item) => (
          <S.PromptCard key={item.title} onPress={() => onPick(item.prompt)}>
            <Ionicons name={item.icon} size={18} color={colors.accentText} />
            <S.PromptTitle>{item.title}</S.PromptTitle>
          </S.PromptCard>
        ))}
      </S.PromptGrid>
    </S.Welcome>
  )
}
