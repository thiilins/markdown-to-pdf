'use client'

import { Button } from '@/components/ui/button'
import { useCopyToClipboard } from '@/hooks/use-clipboard'
import { cn } from '@/lib/utils'
import { THEME_PRESETS } from '@/shared/constants'
import { mapLanguage } from '@/shared/utils'
import { Copy } from 'lucide-react' // Adicionei Check para feedback visual
import { useCallback, useEffect, useMemo, useState } from 'react' // Adicionado useState e useEffect
import ReactMarkdown, { Components } from 'react-markdown'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import { toast } from 'sonner'
import { MDPreviewStyle } from './style'

interface StaticStylePreviewProps {
  markdown: string
  typographyConfig: TypographyConfig
  themeConfig?: ThemeConfig
  className?: string
  contentRef: React.RefObject<HTMLDivElement | null>
}

export function MdPreview({
  markdown,
  typographyConfig,
  themeConfig,
  className,
  contentRef,
}: StaticStylePreviewProps) {
  const theme = themeConfig || THEME_PRESETS.modern
  const [copiedState, copy] = useCopyToClipboard()

  // SOLUÇÃO DO PROBLEMA DE HIDRATAÇÃO:
  // Só renderizamos o conteúdo "pesado" do markdown após o componente montar no cliente.
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Calcula estilos de tipografia
  const getTypographyStyles = useMemo(() => {
    return {
      '--font-headings': typographyConfig.headings,
      '--font-body': typographyConfig.body,
      '--font-code': typographyConfig.code,
      '--font-quote': typographyConfig.quote,
      '--base-size': `${typographyConfig.baseSize}px`,
      '--h1-size': `${typographyConfig.h1Size}px`,
      '--h2-size': `${typographyConfig.h2Size}px`,
      '--h3-size': `${typographyConfig.h3Size}px`,
      '--line-height': String(typographyConfig.lineHeight),
    } as React.CSSProperties
  }, [typographyConfig])

  // Função helper para extrair a linguagem do className do code
  const extractLanguageFromChildren = useCallback((children: any): string | null => {
    // Se children é um objeto React (componente code)
    if (children?.props?.className) {
      const className = children.props.className
      const match = className.match(/language-(\w+)/)
      if (match) return match[1]
    }

    // Se children é um array, procura o primeiro elemento code
    if (Array.isArray(children)) {
      for (const child of children) {
        if (child?.props?.className) {
          const className = child.props.className
          const match = className.match(/language-(\w+)/)
          if (match) return match[1]
        }
        // Recursão para elementos aninhados
        if (child?.props?.children) {
          const lang = extractLanguageFromChildren(child.props.children)
          if (lang) return lang
        }
      }
    }

    return null
  }, [])

  // Função helper para extrair o texto do código
  const extractCodeText = useCallback((children: any): string => {
    if (typeof children === 'string') {
      return children
    }

    if (Array.isArray(children)) {
      return children
        .map((child: any) => {
          if (typeof child === 'string') return child
          if (child?.props?.children) return extractCodeText(child.props.children)
          return ''
        })
        .join('')
    }

    if (children?.props?.children) {
      return extractCodeText(children.props.children)
    }

    return ''
  }, [])

  const handleCopyCode = useCallback(
    async (children: any) => {
      try {
        const textToCopy = extractCodeText(children)

        if (!textToCopy) {
          console.warn('Estrutura de código complexa, tentando extração forçada.')
          return
        }

        await copy(textToCopy)
        toast.success('Código copiado!')
      } catch (error) {
        console.error('Erro ao copiar', error)
        toast.error('Erro ao copiar código')
      }
    },
    [copy, extractCodeText],
  )

  // Componentes Customizados do Markdown
  const markdownComponents: Components = useMemo(
    () => ({
      // Mapeamos P para div para evitar erros de hidratação (div dentro de p)
      // quando usamos rehype-raw que pode injetar blocos HTML.
      p: ({ node, children, ...props }) => {
        return (
          <div className='mb-4 last:mb-0' {...props}>
            {children}
          </div>
        )
      },
      div: ({ node, className, children, ...props }) => {
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
      // Bloco de código com visual de Terminal
      pre: ({ node, children, ...props }) => {
        // Extrai a linguagem do componente code filho
        const language = extractLanguageFromChildren(children)
        const codeText = extractCodeText(children)

        return (
          <div className='group not-prose relative my-6 overflow-hidden rounded-lg border bg-zinc-950 shadow-sm dark:bg-zinc-900'>
            {/* Header do Código */}
            <div className='flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2'>
              <div className='flex items-center gap-3'>
                <div className='flex gap-1.5'>
                  <div className='h-2.5 w-2.5 rounded-full bg-red-500/80' />
                  <div className='h-2.5 w-2.5 rounded-full bg-yellow-500/80' />
                  <div className='h-2.5 w-2.5 rounded-full bg-green-500/80' />
                </div>
                {language && (
                  <span className='text-muted-foreground font-mono text-[10px] font-medium tracking-wider uppercase opacity-60'>
                    {language}
                  </span>
                )}
              </div>

              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  handleCopyCode(children)
                }}
                className='flex items-center gap-1.5 rounded-md bg-transparent px-2 py-1 text-[10px] font-medium text-zinc-400 transition-colors hover:bg-white/10 hover:text-white'
                title='Copiar código'>
                <Copy className='h-3 w-3' />
                <span>Copiar</span>
              </Button>
            </div>

            <SyntaxHighlighter
              language={mapLanguage(language || 'text')}
              style={darcula}
              showLineNumbers={false}
              wrapLines={true}
              wrapLongLines={true}
              customStyle={{
                margin: 0,
                padding: '2rem',
                width: '100%',
                height: '100%',
                backgroundColor: 'transparent',
                fontSize: '13px',
                lineHeight: '1.6',
                fontFamily: 'var(--font-mono)',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
              }}>
              {codeText}
            </SyntaxHighlighter>
          </div>
        )
      },
      code: ({ node, className, children, ...props }: any) => {
        const isInline = !className && !String(children).includes('\n')

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
        // Se for bloco (dentro do pre), o componente pre acima já cuida do container
        return (
          <code
            className={cn('block font-mono text-sm', className)}
            {...props}
            style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {children}
          </code>
        )
      },
      table: ({ children, ...props }) => (
        <div className='bg-card my-6 w-full overflow-y-auto rounded-lg border'>
          <table className='w-full text-sm' {...props}>
            {children}
          </table>
        </div>
      ),
      thead: ({ children, ...props }) => (
        <thead className='bg-muted/50 font-medium' {...props}>
          {children}
        </thead>
      ),
      th: ({ children, ...props }) => (
        <th className='border-b px-4 py-3 text-left font-semibold' {...props}>
          {children}
        </th>
      ),
      td: ({ children, ...props }) => (
        <td className='border-b px-4 py-2 last:border-0' {...props}>
          {children}
        </td>
      ),
      img: ({ ...props }) => (
        <img
          className='mx-auto my-6 h-auto max-w-full rounded-lg border shadow-sm'
          {...props}
          alt={props.alt || 'Imagem'}
        />
      ),
    }),
    [handleCopyCode, extractLanguageFromChildren, extractCodeText],
  )

  return (
    <div
      className={cn(
        'bg-muted/10 relative flex min-h-full w-full flex-col items-center py-8 md:py-12',
        className,
      )}>
      {/* Padrão de fundo (Dot Pattern) */}
      <div className='pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-50 dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]' />

      {/* Papel / Documento */}
      <div
        ref={contentRef}
        className={cn(
          'print-content relative z-10 mx-auto w-full max-w-full transition-all duration-300',
          'ring-border/50 bg-white text-left shadow-sm ring-1 dark:bg-zinc-950 dark:ring-white/10',
          'md:rounded-xl md:shadow-md',
        )}
        style={{
          maxWidth: 'min(280mm, 100%)', // Largura máxima, mas nunca mais que 100% do container
          minHeight: '297mm',
          padding: '20mm', // Margem interna de documento A4
          backgroundColor: theme.background,
          color: theme.textColor,
        }}>
        <div
          className='prose prose-slate dark:prose-invert max-w-none'
          style={{
            ...getTypographyStyles,
          }}>
          {/* Estilos Globais de Preview */}
          <MDPreviewStyle theme={theme} />
          {/* Renderização Condicional para evitar Hydration Error */}
          {mounted ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={markdownComponents}>
              {markdown}
            </ReactMarkdown>
          ) : (
            <div className='animate-pulse space-y-4'>
              <div className='bg-muted h-8 w-3/4 rounded'></div>
              <div className='bg-muted h-4 w-full rounded'></div>
              <div className='bg-muted h-4 w-5/6 rounded'></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
