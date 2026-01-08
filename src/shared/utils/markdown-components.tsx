import { MermaidDiagram } from '@/components/markdown-editor/mermaid-diagram'
import { PreComponent } from '@/components/markdown-editor/pre-component'
import { cn } from '@/lib/utils'
import { Components } from 'react-markdown'
import { BlockquoteWithAdmonition } from './admonition-parser'

/**
 * Componentes customizados do ReactMarkdown com TODAS as melhorias:
 * - Mermaid.js (diagramas interativos)
 * - Admonitions (callouts coloridos: NOTE, TIP, IMPORTANT, WARNING, CAUTION)
 * - PreComponent (blocos de código estilizados com syntax highlighting)
 * - IDs automáticos nos headers (para TOC e navegação)
 * - Page breaks
 * - Tabelas estilizadas
 * - Imagens responsivas
 * - Parágrafos como div (evita erros de hidratação)
 * - Code inline estilizado
 */
export const getMarkdownComponents = (): Components => ({
  // Parágrafos como div para evitar erros de hidratação (div dentro de p)
  // quando usamos rehype-raw que pode injetar blocos HTML
  p: ({ node, children, ...props }: any) => {
    return (
      <div className='mb-4 last:mb-0' {...props}>
        {children}
      </div>
    )
  },

  // Page breaks
  div: ({ node, className, children, ...props }: any) => {
    if (className === 'page-break') {
      return (
        <div
          className='page-break border-muted my-8 border-b border-dashed print:break-after-page'
          {...props}
        />
      )
    }
    return (
      <div className={className} {...props}>
        {children}
      </div>
    )
  },

  // Blocos de código com PreComponent (estilizado com terminal look)
  pre: PreComponent,

  // Code inline e Mermaid
  code: ({ node, className, children, ...props }: any) => {
    const isInline = !className && !String(children).includes('\n')

    // Detecta blocos de código Mermaid
    if (className === 'language-mermaid' && !isInline) {
      const code = String(children).replace(/\n$/, '')
      return <MermaidDiagram chart={code} />
    }

    // Code inline estilizado
    if (isInline) {
      return (
        <code
          className={cn(
            'bg-muted/80 text-foreground rounded-md px-1.5 py-0.5 font-mono text-[0.9em]',
            className,
          )}
          {...props}>
          {children}
        </code>
      )
    }

    // Code block (dentro do pre)
    return (
      <code
        className={cn('block font-mono text-sm', className)}
        {...props}
        style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
        {children}
      </code>
    )
  },

  // Admonitions (Callouts)
  blockquote: BlockquoteWithAdmonition,

  // Tabelas estilizadas
  table: ({ children, ...props }: any) => (
    <div className='bg-card my-6 w-full overflow-y-auto rounded-lg border'>
      <table className='w-full text-sm' {...props}>
        {children}
      </table>
    </div>
  ),

  thead: ({ children, ...props }: any) => (
    <thead className='bg-muted/50 font-medium' {...props}>
      {children}
    </thead>
  ),

  th: ({ children, ...props }: any) => (
    <th className='border-b px-4 py-3 text-left font-semibold' {...props}>
      {children}
    </th>
  ),

  td: ({ children, ...props }: any) => (
    <td className='border-b px-4 py-2 last:border-0' {...props}>
      {children}
    </td>
  ),

  // Imagens responsivas
  img: ({ ...props }: any) => (
    <img
      className='mx-auto my-6 h-auto max-w-full rounded-lg border shadow-sm'
      {...props}
      alt={props.alt || 'Imagem'}
    />
  ),

  // Headers com IDs automáticos para navegação e TOC
  h1: ({ children, ...props }) => {
    const text = String(children)
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
    return (
      <h1 id={id} {...props}>
        {children}
      </h1>
    )
  },

  h2: ({ children, ...props }) => {
    const text = String(children)
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
    return (
      <h2 id={id} {...props}>
        {children}
      </h2>
    )
  },

  h3: ({ children, ...props }) => {
    const text = String(children)
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
    return (
      <h3 id={id} {...props}>
        {children}
      </h3>
    )
  },

  h4: ({ children, ...props }) => {
    const text = String(children)
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
    return (
      <h4 id={id} {...props}>
        {children}
      </h4>
    )
  },

  h5: ({ children, ...props }) => {
    const text = String(children)
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
    return (
      <h5 id={id} {...props}>
        {children}
      </h5>
    )
  },

  h6: ({ children, ...props }) => {
    const text = String(children)
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
    return (
      <h6 id={id} {...props}>
        {children}
      </h6>
    )
  },
})
