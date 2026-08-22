import type { Ionicons } from '@expo/vector-icons'
import type { GenerationKind } from '@/features/ai/schemas/generation.schema'

/** Os textos e o icone de cada tipo, usados pelo botao e pelo aviso final. */
export const GENERATION_LABELS: Record<
  GenerationKind,
  { noun: string; action: string; hint: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  summary: {
    noun: 'Resumo',
    action: 'Gerar resumo com IA',
    hint: 'A IA escreve a partir dos assuntos da matéria',
    icon: 'document-text',
  },
  flashcards: {
    noun: 'Flashcards',
    action: 'Gerar flashcards com IA',
    hint: 'Um lote de cartões de pergunta e resposta',
    icon: 'layers',
  },
  mindMap: {
    noun: 'Mapa mental',
    action: 'Gerar mapa mental com IA',
    hint: 'Ramos e sub-ramos montados a partir do conteúdo',
    icon: 'git-network',
  },
  quiz: {
    noun: 'Quiz',
    action: 'Gerar quiz com IA',
    hint: 'Questões de múltipla escolha com gabarito',
    icon: 'help-circle',
  },
}
