import { memo } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/shared/lib/utils'

/**
 * Renderiza a resposta da IA em markdown (titulos, negrito, listas, codigo,
 * tabelas GFM) ja estilizado com os tokens do Cognitive Flow. `react-markdown`
 * monta elementos React (sem dangerouslySetInnerHTML), entao nao injeta HTML
 * cru vindo do modelo.
 *
 * Titulos viram badges tintados (violeta para h1/h2, cyan para h3), como as
 * pills de "Conceito Chave" da referencia do Stitch.
 */
const components: Components = {
  // Blocos --------------------------------------------------------------
  p: ({ children }) => (
    <p className="text-sm leading-relaxed [&:not(:first-child)]:mt-2.5">{children}</p>
  ),
  h1: ({ children }) => (
    <h3 className="block w-fit max-w-full mt-3 mb-2 first:mt-0 rounded-2xl px-3.5 py-1.5 text-sm font-bold uppercase tracking-wider bg-secondary-500/15 text-[var(--accent-text)]">
      {children}
    </h3>
  ),
  h2: ({ children }) => (
    <h4 className="block w-fit max-w-full mt-3 mb-2 first:mt-0 rounded-2xl px-3 py-1 text-xs font-bold uppercase tracking-wider bg-secondary-500/15 text-[var(--accent-text)]">
      {children}
    </h4>
  ),
  h3: ({ children }) => (
    <h5 className="block w-fit max-w-full mt-2.5 mb-1.5 first:mt-0 rounded-2xl px-3 py-1 text-xs font-bold uppercase tracking-wider bg-tertiary-500/15 text-[var(--tertiary-accent)]">
      {children}
    </h5>
  ),
  h4: ({ children }) => (
    <h6 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)] mt-2 mb-1 first:mt-0">
      {children}
    </h6>
  ),

  // Listas --------------------------------------------------------------
  ul: ({ children }) => (
    <ul className="mt-2 space-y-1 pl-5 list-disc marker:text-[var(--accent-text)] text-sm leading-relaxed [&:not(:first-child)]:mt-2.5">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-2 space-y-1 pl-5 list-decimal marker:text-[var(--accent-text)] marker:font-semibold text-sm leading-relaxed [&:not(:first-child)]:mt-2.5">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-0.5">{children}</li>,

  // Destaques inline: termo importante em violeta de marca, termo em
  // destaque/definicao em cyan (mesma leitura da referencia) -----------
  strong: ({ children }) => (
    <strong className="font-bold text-[var(--accent-text)]">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-[var(--tertiary-accent)]">{children}</em>
  ),

  // Codigo --------------------------------------------------------------
  code: ({ className, children, ...props }) => {
    const isBlock = /language-|(^|\s)multiline/.test(className ?? '')
    if (isBlock) {
      return (
        <code className={cn('font-mono text-[12.5px]', className)} {...props}>
          {children}
        </code>
      )
    }
    // Codigo inline: pill violeta com fundo tintado + cantos arredondados
    return (
      <code
        className="px-1.5 py-0.5 rounded-md bg-secondary-500/15 border border-[var(--glass-border)] font-mono text-[12.5px] text-[var(--accent-text)] break-words"
        {...props}
      >
        {children}
      </code>
    )
  },
  // Bloco de codigo escuro sempre (fundo quase preto do Stitch), independente
  // do tema da pagina; o reset em `code` desfaz a pill do codigo inline.
  pre: ({ children }) => (
    <pre className="my-2.5 p-3 overflow-x-auto rounded-xl bg-primary-950 border border-[var(--glass-border)] font-mono text-[12.5px] leading-relaxed text-gray-100 [&_code]:bg-transparent [&_code]:border-transparent [&_code]:p-0 [&_code]:rounded-none [&_code]:text-inherit">
      {children}
    </pre>
  ),

  // Citacao vira callout com borda violeta / divisor -------------------
  blockquote: ({ children }) => (
    <blockquote className="my-2.5 px-3 py-2.5 rounded-xl border-l-2 border-[var(--secondary-accent)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-3 border-t border-[var(--border)]" />,

  // Links (abrem em nova aba) -------------------------------------------
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-[var(--tertiary-accent)] hover:text-tertiary-300 underline underline-offset-2 break-words"
    >
      {children}
    </a>
  ),

  // Tabelas GFM ---------------------------------------------------------
  table: ({ children }) => (
    <div className="my-2.5 overflow-x-auto rounded-xl border border-[var(--glass-border)]">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-primary-500/10 text-left">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="px-3 py-2 font-semibold text-[var(--text)] border-b border-[var(--glass-border)] whitespace-nowrap">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 border-b border-[var(--glass-border)] last:border-b-0 align-top">
      {children}
    </td>
  ),
}

interface MarkdownContentProps {
  content: string
  className?: string
}

export const MarkdownContent = memo(function MarkdownContent({
  content,
  className,
}: MarkdownContentProps) {
  return (
    <div className={cn('break-words', className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
})
