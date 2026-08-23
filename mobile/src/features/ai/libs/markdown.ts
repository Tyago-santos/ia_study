/**
 * Parser minimo de markdown para as respostas do agente.
 *
 * O modelo responde em markdown e no React Native `Text` nao interpreta nada:
 * sem isto a tela mostraria os asteriscos crus. Cobre o que o prompt de sistema
 * pede — titulo, lista, negrito e codigo curto — e trata o resto como texto.
 *
 * So o reconhecimento mora aqui; quem desenha e o `MarkdownText`.
 */

export type InlineToken =
  | { kind: 'text'; value: string }
  | { kind: 'bold'; value: string }
  | { kind: 'code'; value: string }

export type TableAlign = 'left' | 'center' | 'right'

export type MarkdownLine =
  | { kind: 'blank' }
  | { kind: 'rule' }
  | { kind: 'heading'; tokens: InlineToken[] }
  | { kind: 'listItem'; marker: string; tokens: InlineToken[] }
  | { kind: 'paragraph'; tokens: InlineToken[] }
  | { kind: 'table'; header: InlineToken[][]; align: TableAlign[]; rows: InlineToken[][][] }

/** Quebra a linha em trechos, alternando texto normal, negrito e codigo curto. */
export function parseInline(line: string): InlineToken[] {
  return line
    .split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
    .filter(Boolean)
    .map((piece): InlineToken => {
      if (piece.startsWith('**') && piece.endsWith('**')) {
        return { kind: 'bold', value: piece.slice(2, -2) }
      }

      if (piece.startsWith('`') && piece.endsWith('`')) {
        return { kind: 'code', value: piece.slice(1, -1) }
      }

      return { kind: 'text', value: piece }
    })
}

/** Linha "| :-- | :-: | --: |" que separa cabecalho do corpo da tabela. */
const TABLE_SEPARATOR = /^\s*\|?\s*:?-{1,}:?\s*(\|\s*:?-{1,}:?\s*)*\|?\s*$/

function isTableRow(line: string): boolean {
  return line.includes('|') && line.trim().length > 0
}

/** "| a | b |" -> ["a", "b"], tirando as barras das pontas. */
function splitTableRow(line: string): string[] {
  let trimmed = line.trim()
  if (trimmed.startsWith('|')) trimmed = trimmed.slice(1)
  if (trimmed.endsWith('|')) trimmed = trimmed.slice(0, -1)
  return trimmed.split('|').map((cell) => cell.trim())
}

function parseTableRow(line: string): InlineToken[][] {
  return splitTableRow(line).map(parseInline)
}

function parseTableAlign(line: string): TableAlign[] {
  return splitTableRow(line).map((cell) => {
    if (cell.startsWith(':') && cell.endsWith(':')) return 'center'
    if (cell.endsWith(':')) return 'right'
    return 'left'
  })
}

export function parseMarkdown(content: string): MarkdownLine[] {
  const rawLines = content.split('\n')
  const result: MarkdownLine[] = []
  let i = 0

  while (i < rawLines.length) {
    const line = rawLines[i].trimEnd()

    // Tabela: uma linha de cabecalho com "|" seguida da linha separadora.
    if (isTableRow(line) && i + 1 < rawLines.length && TABLE_SEPARATOR.test(rawLines[i + 1].trim())) {
      const header = parseTableRow(line)
      const align = parseTableAlign(rawLines[i + 1])

      let j = i + 2
      const rows: InlineToken[][][] = []
      while (j < rawLines.length && isTableRow(rawLines[j])) {
        rows.push(parseTableRow(rawLines[j]))
        j++
      }

      result.push({ kind: 'table', header, align, rows })
      i = j
      continue
    }

    if (!line.trim()) {
      result.push({ kind: 'blank' })
      i++
      continue
    }

    const heading = /^(#{1,6})\s+(.*)$/.exec(line)
    if (heading) {
      result.push({ kind: 'heading', tokens: parseInline(heading[2]) })
      i++
      continue
    }

    const bullet = /^\s*[-*]\s+(.*)$/.exec(line)
    if (bullet) {
      result.push({ kind: 'listItem', marker: '•', tokens: parseInline(bullet[1]) })
      i++
      continue
    }

    const numbered = /^\s*(\d+)[.)]\s+(.*)$/.exec(line)
    if (numbered) {
      result.push({ kind: 'listItem', marker: `${numbered[1]}.`, tokens: parseInline(numbered[2]) })
      i++
      continue
    }

    // Linha separadora de tabela sem cabecalho valido antes dela: mantem o
    // comportamento antigo de virar um filete.
    if (TABLE_SEPARATOR.test(line)) {
      result.push({ kind: 'rule' })
      i++
      continue
    }

    result.push({ kind: 'paragraph', tokens: parseInline(line) })
    i++
  }

  return result
}
