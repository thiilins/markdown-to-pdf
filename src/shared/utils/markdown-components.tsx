import { MarkdownHr } from '@/components/markdown-editor/markdown-hr'
import { MarkdownImage } from '@/components/markdown-editor/markdown-image'
import { MarkdownInlineCode } from '@/components/markdown-editor/markdown-inline-code'
import { MarkdownKbd } from '@/components/markdown-editor/markdown-kbd'
import { MarkdownLink } from '@/components/markdown-editor/markdown-link'
import {
  MarkdownListItem,
  MarkdownOrderedList,
  MarkdownUnorderedList,
} from '@/components/markdown-editor/markdown-lists'
import {
  MarkdownTable,
  MarkdownTableBody,
  MarkdownTableCell,
  MarkdownTableHead,
  MarkdownTableHeaderCell,
  MarkdownTableRow,
} from '@/components/markdown-editor/markdown-table'
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
      return <MarkdownInlineCode {...props}>{children}</MarkdownInlineCode>
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
  // Tabelas estilizadas e responsivas
  table: ({ children, ...props }: any) => <MarkdownTable {...props}>{children}</MarkdownTable>,

  thead: ({ children, ...props }: any) => (
    <MarkdownTableHead {...props}>{children}</MarkdownTableHead>
  ),

  tbody: ({ children, ...props }: any) => (
    <MarkdownTableBody {...props}>{children}</MarkdownTableBody>
  ),

  tr: ({ children, ...props }: any) => <MarkdownTableRow {...props}>{children}</MarkdownTableRow>,

  th: ({ children, style, ...props }: any) => {
    // Detecta alinhamento do markdown (style.textAlign)
    const align = style?.textAlign || 'left'
    return (
      <MarkdownTableHeaderCell align={align} {...props}>
        {children}
      </MarkdownTableHeaderCell>
    )
  },

  td: ({ children, style, ...props }: any) => {
    // Detecta alinhamento do markdown (style.textAlign)
    const align = style?.textAlign || 'left'
    return (
      <MarkdownTableCell align={align} {...props}>
        {children}
      </MarkdownTableCell>
    )
  },

  // Imagens responsivas e estilizadas
  img: ({ src, alt, title, ...props }: any) => (
    <MarkdownImage src={src} alt={alt} title={title} {...props} />
  ),

  // Listas não ordenadas
  ul: ({ children, ...props }: any) => (
    <MarkdownUnorderedList {...props}>{children}</MarkdownUnorderedList>
  ),

  // Listas ordenadas
  ol: ({ children, start, ...props }: any) => (
    <MarkdownOrderedList start={start} {...props}>
      {children}
    </MarkdownOrderedList>
  ),

  // Itens de lista
  li: ({ children, className, ...props }: any) => {
    // Detecta task list (checkbox)
    const isTaskList = className?.includes('task-list-item')

    // Detecta se é lista ordenada ou não ordenada pelo contexto
    return (
      <MarkdownListItem className={className} {...props}>
        {children}
      </MarkdownListItem>
    )
  },

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

  // Links estilizados
  a: ({ href, children, title, ...props }: any) => (
    <MarkdownLink href={href} title={title} {...props}>
      {children}
    </MarkdownLink>
  ),

  // Separador horizontal
  hr: ({ ...props }: any) => <MarkdownHr {...props} />,

  // Kbd para atalhos de teclado
  kbd: ({ children, ...props }: any) => <MarkdownKbd {...props}>{children}</MarkdownKbd>,
})
