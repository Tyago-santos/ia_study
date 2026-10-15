import { memo } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/shared/lib/utils'

/**
 * Renderiza a resposta da IA em markdown (titulos, negrito, listas, codigo,
 * tabelas GFM) ja estilizado com os tokens do tema escuro. `react-markdown`
 * monta elementos React (sem dangerouslySetInnerHTML), entao nao injeta HTML
 * cru vindo do modelo.
 */
const components: Components = {
  // Blocos --------------------------------------------------------------
  p: ({ children }) => (
    <p className="text-sm leading-relaxed [&:not(:first-child)]:mt-2.5">{children}</p>
  ),
  h1: ({ children }) => (
    <h3 className="text-base font-bold text-[var(--text)] mt-3 mb-1.5 first:mt-0">{children}</h3>
  ),
  h2: ({ children }) => (
    <h4 className="text-sm font-bold text-[var(--text)] mt-3 mb-1.5 first:mt-0">{children}</h4>
  ),
  h3: ({ children }) => (
    <h5 className="text-sm font-semibold text-[var(--text)] mt-2.5 mb-1 first:mt-0">{children}</h5>
  ),
  h4: ({ children }) => (
    <h6 className="text-sm font-semibold text-[var(--text-secondary)] mt-2 mb-1 first:mt-0">
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

  // Destaques inline ----------------------------------------------------
  strong: ({ children }) => (
    <strong className="font-semibold text-[var(--text)]">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,

  // Codigo --------------------------------------------------------------
  code: ({ className, children, ...props }) => {
    const isBlock = /language-|(^|\s)multiline/.test(className ?? '')
    if (isBlock) {
      return (
        <code className={cn('font-[var(--font-mono)] text-[12.5px]', className)} {...props}>
          {children}
        </code>
      )
    }
    // Codigo inline: fundo sutil + cantos arredondados
    return (
      <code
        className="px-1 py-0.5 rounded-md bg-[var(--bg)] border border-[var(--glass-border)] font-[var(--font-mono)] text-[12.5px] text-[var(--accent-text)] break-words"
        {...props}
      >
        {children}
      </code>
    )
  },
  pre: ({ children }) => (
    <pre className="my-2.5 p-3 overflow-x-auto rounded-xl bg-[var(--bg)] border border-[var(--glass-border)] font-[var(--font-mono)] text-[12.5px] leading-relaxed text-[var(--text)]">
      {children}
    </pre>
  ),

  // Citacao / divisor ---------------------------------------------------
  blockquote: ({ children }) => (
    <blockquote className="my-2.5 pl-3 border-l-2 border-[var(--accent-text)]/50 text-[var(--text-secondary)] italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-3 border-t border-[var(--glass-border)]" />,

  // Links (abrem em nova aba) -------------------------------------------
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[var(--accent-text)] underline underline-offset-2 break-words hover:opacity-80"
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
    <thead className="bg-[var(--bg)] text-left">{children}</thead>
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
