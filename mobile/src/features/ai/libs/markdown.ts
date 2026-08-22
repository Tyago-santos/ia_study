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

export type MarkdownLine =
  | { kind: 'blank' }
  | { kind: 'rule' }
  | { kind: 'heading'; tokens: InlineToken[] }
  | { kind: 'listItem'; marker: string; tokens: InlineToken[] }
  | { kind: 'paragraph'; tokens: InlineToken[] }

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

/** Linha de separacao de tabela — o conteudo em si cai como texto comum. */
const TABLE_SEPARATOR = /^\s*\|?[\s|:-]+\|[\s|:-]*$/

export function parseMarkdown(content: string): MarkdownLine[] {
  return content.split('\n').map((raw): MarkdownLine => {
    const line = raw.trimEnd()

    if (!line.trim()) return { kind: 'blank' }

    const heading = /^(#{1,6})\s+(.*)$/.exec(line)
    if (heading) return { kind: 'heading', tokens: parseInline(heading[2]) }

    const bullet = /^\s*[-*]\s+(.*)$/.exec(line)
    if (bullet) return { kind: 'listItem', marker: '•', tokens: parseInline(bullet[1]) }

    const numbered = /^\s*(\d+)[.)]\s+(.*)$/.exec(line)
    if (numbered) {
      return { kind: 'listItem', marker: `${numbered[1]}.`, tokens: parseInline(numbered[2]) }
    }

    if (TABLE_SEPARATOR.test(line)) return { kind: 'rule' }

    return { kind: 'paragraph', tokens: parseInline(line) }
  })
}
