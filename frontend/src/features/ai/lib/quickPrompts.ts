import { BookOpen, FileText, GraduationCap, ListChecks } from 'lucide-react'

export const QUICK_PROMPTS = [
  {
    icon: BookOpen,
    title: 'Explicar conceito',
    description: 'Veja uma explicação com exemplo',
    prompt:
      'Explique a diferença entre mitose e meiose de forma simples, usando uma analogia e um exemplo.',
  },
  {
    icon: FileText,
    title: 'Criar resumo',
    description: 'Confira um resumo organizado',
    prompt:
      'Faça um resumo claro e organizado sobre a Revolução Industrial, destacando causas, mudanças e consequências.',
  },
  {
    icon: ListChecks,
    title: 'Plano de estudos',
    description: 'Monte uma rotina semanal de exemplo',
    prompt:
      'Monte um plano de estudos de exemplo para 5 dias, com 1 hora por dia, incluindo pausas e revisão. Indique que posso personalizar se eu informar minhas matérias e horários.',
  },
  {
    icon: GraduationCap,
    title: 'Revisão para prova',
    description: 'Pratique com perguntas e respostas',
    prompt:
      'Crie 5 perguntas de revisão sobre o ciclo da água, começando pelas mais simples. Mostre o gabarito separado no final.',
  },
]

export function formatMessageTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}
