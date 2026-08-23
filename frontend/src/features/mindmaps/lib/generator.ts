import type { MindMapNode } from '@/shared/types'

/**
 * Ramos padrao de um mapa de estudo. Usados quando a geracao parte apenas de um
 * tema, sem conteudo de origem.
 */
const STUDY_BRANCHES: { label: string; children: string[] }[] = [
  { label: 'Conceitos-chave', children: ['Definicao', 'Terminologia', 'Pre-requisitos'] },
  { label: 'Formulas e regras', children: ['Enunciado', 'Quando aplicar'] },
  { label: 'Exemplos', children: ['Caso simples', 'Caso completo'] },
  { label: 'Aplicacoes', children: ['Exercicios tipicos', 'Provas anteriores'] },
  { label: 'Erros comuns', children: ['Pegadinhas', 'Checklist de revisao'] },
]

let generatedCounter = 0

/**
 * Id local de no. Baseado em contador em vez de `crypto.randomUUID` porque o
 * dev server roda em http na rede local, onde a Web Crypto nao esta disponivel.
 */
export function newNodeId(): string {
  return `n_${Date.now().toString(36)}_${++generatedCounter}`
}

const newId = newNodeId

/** Primeira letra maiuscula, sem alterar o resto do texto. */
function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/** Corta um texto em um rotulo curto o suficiente para caber em um no. */
function toLabel(text: string, maxLength = 46): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= maxLength) return capitalize(clean)
  const cut = clean.slice(0, maxLength)
  const lastSpace = cut.lastIndexOf(' ')
  return capitalize((lastSpace > 20 ? cut.slice(0, lastSpace) : cut).trim())
}

/**
 * Quebra o texto de origem em frases utilizaveis como ramos. Aceita tanto texto
 * corrido (separado por pontuacao) quanto listas em linhas separadas.
 */
function splitIntoSentences(text: string): string[] {
  return text
    .split(/\r?\n|(?<=[.!?;:])\s+/)
    .map((part) => part.replace(/^[\s\-*•\d.)]+/, '').trim())
    .filter((part) => part.length > 3)
}

export interface GenerateOptions {
  topic: string
  /** Conteudo opcional (resumo, anotacoes) que orienta a estrutura do mapa. */
  content?: string
}

/**
 * Monta a arvore de um mapa mental. Quando ha conteudo de origem, os ramos saem
 * das frases do texto; caso contrario cai na estrutura de estudo padrao.
 *
 * Este e o ponto de substituicao para a IA real: a assinatura ja recebe tema e
 * conteudo e devolve a arvore pronta.
 */
export function generateMindMapNodes({ topic, content }: GenerateOptions): MindMapNode[] {
  const rootId = newId()
  const nodes: MindMapNode[] = [{ id: rootId, parentId: null, label: toLabel(topic, 40) }]

  const sentences = content ? splitIntoSentences(content) : []

  if (sentences.length >= 3) {
    // Cada frase relevante vira um ramo; frases seguintes viram detalhes dele.
    const branchCount = Math.min(6, Math.ceil(sentences.length / 2))
    const perBranch = Math.ceil(sentences.length / branchCount)

    for (let i = 0; i < branchCount; i++) {
      const chunk = sentences.slice(i * perBranch, (i + 1) * perBranch)
      if (chunk.length === 0) continue

      const branchId = newId()
      nodes.push({
        id: branchId,
        parentId: rootId,
        label: toLabel(chunk[0], 38),
        note: chunk[0].length > 38 ? chunk[0] : undefined,
      })

      for (const detail of chunk.slice(1)) {
        nodes.push({
          id: newId(),
          parentId: branchId,
          label: toLabel(detail, 40),
          note: detail.length > 40 ? detail : undefined,
        })
      }
    }

    return nodes
  }

  for (const branch of STUDY_BRANCHES) {
    const branchId = newId()
    nodes.push({ id: branchId, parentId: rootId, label: branch.label })
    for (const child of branch.children) {
      nodes.push({ id: newId(), parentId: branchId, label: child })
    }
  }

  return nodes
}

/** Arvore inicial de um mapa criado manualmente: raiz + tres ramos vazios. */
export function createStarterNodes(title: string): MindMapNode[] {
  const rootId = newId()
  return [
    { id: rootId, parentId: null, label: toLabel(title, 40) },
    { id: newId(), parentId: rootId, label: 'Primeiro ramo' },
    { id: newId(), parentId: rootId, label: 'Segundo ramo' },
    { id: newId(), parentId: rootId, label: 'Terceiro ramo' },
  ]
}
