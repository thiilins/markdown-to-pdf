'use client'

import { InteractiveTOC } from '@/components/markdown-editor/interactive-toc'
import { LinkValidatorPanel } from '@/components/markdown-editor/link-validator-panel'
import { cn } from '@/lib/utils'
import { THEME_PRESETS } from '@/shared/constants'
import { getMarkdownComponents } from '@/shared/utils/markdown-components'
import { useEffect, useMemo, useRef, useState } from 'react' // Adicionado useState e useEffect
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import { MDPreviewStyle } from './style'
import { useApp } from '@/shared/contexts/appContext'

interface StaticStylePreviewProps {
  markdown: string
  typographyConfig: TypographyConfig
  themeConfig?: ThemeConfig
  className?: string
  contentRef: React.RefObject<HTMLDivElement | null>
  showTOC?: boolean
  tocPosition?: 'left' | 'right'
}

function MdPreview({
  markdown,
  typographyConfig,
  themeConfig,
  className,
  contentRef,
  showTOC = false,
  tocPosition = 'left',
}: StaticStylePreviewProps) {
  const theme = themeConfig || THEME_PRESETS.modern

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

  // Componentes Markdown centralizados (agora com TODAS as melhorias!)
  const markdownComponents = useMemo(() => getMarkdownComponents(), [])

  return (
    <div
      className={cn(
        'bg-muted/10 relative flex min-h-full w-full flex-col items-center py-8 md:py-12',
        className,
      )}>
      {/* Interactive TOC */}
      {showTOC && <InteractiveTOC markdown={markdown} position={tocPosition} />}

      {/* Link Validator Panel */}
      <LinkValidatorPanel markdown={markdown} />

      {/* Padrão de fundo (Dot Pattern) */}
      <div className='pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-50 dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]' />

      {/* Papel / Documento */}
      <div
        ref={contentRef}
        data-pdf-content
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

export const OpenApiMdPreview = ({ content }: { content: string }) => {
  const { config } = useApp()
  const contentRef = useRef<HTMLDivElement>(null)
  return (
    <div className='h-full w-full'>
      <MdPreview
        markdown={content}
        typographyConfig={config.typography}
        themeConfig={config.theme}
        contentRef={contentRef}
      />
    </div>
  )
}