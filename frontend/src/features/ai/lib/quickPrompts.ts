import { BookOpen, FileText, GraduationCap, ListChecks } from 'lucide-react'

export const QUICK_PROMPTS = [
  {
    icon: BookOpen,
    title: 'Explicar conceito',
    description: 'Entenda um tema de forma simples',
    prompt: 'Explique um conceito de forma simples',
  },
  {
    icon: FileText,
    title: 'Criar resumo',
    description: 'Resuma um assunto que você está estudando',
    prompt: 'Crie um resumo sobre um tema',
  },
  {
    icon: ListChecks,
    title: 'Plano de estudos',
    description: 'Organize sua semana de estudos',
    prompt: 'Monte um plano de estudos para a semana',
  },
  {
    icon: GraduationCap,
    title: 'Revisão para prova',
    description: 'Revise os pontos principais antes da prova',
    prompt: 'Me ajude a revisar para a prova',
  },
]

export function formatMessageTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}
