import type { Suggestion } from '@/features/ai/types/ai.types'

/**
 * Atalhos exibidos antes da primeira pergunta. Todos dependem dos dados do
 * proprio usuario — o agente precisa chamar as ferramentas para responder,
 * entao ja mostram do que ele e capaz.
 */
export const SUGGESTIONS: Suggestion[] = [
  {
    icon: 'library',
    title: 'Minhas matérias',
    prompt:
      'Quais matérias eu tenho na Biblioteca e como está o progresso de cada uma? Aponte a que está mais atrasada.',
  },
  {
    icon: 'list',
    title: 'O que falta estudar',
    prompt:
      'Liste os assuntos que ainda não concluí, agrupados por matéria, e sugira por qual começar.',
  },
  {
    icon: 'calendar',
    title: 'Plano da semana',
    prompt:
      'Monte um plano de estudos para esta semana usando minhas matérias e os assuntos pendentes, em blocos de pomodoro.',
  },
  {
    icon: 'stats-chart',
    title: 'Meu ritmo',
    prompt:
      'Como está meu ritmo de estudo? Mostre o tempo estudado, a sequência de dias e em qual matéria estou investindo mais tempo.',
  },
  {
    icon: 'school',
    title: 'Revisão para prova',
    prompt:
      'Escolha a matéria com mais assuntos pendentes e monte um roteiro de revisão para prova, do essencial ao detalhe.',
  },
  {
    icon: 'bulb',
    title: 'Explicar um assunto',
    prompt:
      'Escolha um assunto que eu ainda não concluí e explique o conceito central dele de forma simples, com um exemplo prático.',
  },
]
