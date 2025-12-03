'use client'

import { cn } from '@/lib/utils'
import type { PageConfig, ThemeConfig, TypographyConfig } from '@/types/config'
import { THEME_PRESETS } from '@/types/config'
import { Ruler } from 'lucide-react'
import { useMemo } from 'react'
import ReactMarkdown, { Components } from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import { PreviewStyle } from './preview-style'

interface PreviewPanelProps {
  markdown: string
  pageConfig: PageConfig
  typographyConfig: TypographyConfig
  themeConfig?: ThemeConfig
  zoom?: number
  contentRef: React.RefObject<HTMLDivElement | null>
  className?: string
}

export function PreviewPanel({
  markdown,
  pageConfig,
  typographyConfig,
  themeConfig,
  zoom = 1,
  contentRef,
  className,
}: PreviewPanelProps) {
  // Usa tema padrão se não houver tema configurado
  const theme = themeConfig || THEME_PRESETS.modern

  // Calcula dimensões da página baseado na orientação
  const pageDimensions = useMemo(() => {
    const { width, height, orientation } = pageConfig

    // Extrai valores numéricos das dimensões
    const widthValue = parseFloat(width)
    const heightValue = parseFloat(height)
    const widthUnit = width.replace(/[\d.]/g, '')
    const heightUnit = height.replace(/[\d.]/g, '')

    // Aplica orientação corretamente
    if (orientation === 'landscape') {
      const maxDim = Math.max(widthValue, heightValue)
      const minDim = Math.min(widthValue, heightValue)
      return {
        width: `${maxDim}${widthUnit}`,
        height: `${minDim}${heightUnit}`,
        isLandscape: true,
      }
    } else {
      const maxDim = Math.max(widthValue, heightValue)
      const minDim = Math.min(widthValue, heightValue)
      return {
        width: `${minDim}${widthUnit}`,
        height: `${maxDim}${heightUnit}`,
        isLandscape: false,
      }
    }
  }, [pageConfig])

  const getPageStyle = useMemo(() => {
    const { padding } = pageConfig

    return {
      width: pageDimensions.width,
      minHeight: pageDimensions.height,
      padding,
      boxSizing: 'border-box' as const,
    }
  }, [pageConfig, pageDimensions])

  const getContentStyle = useMemo(() => {
    const { margin } = pageConfig
    return {
      marginTop: margin.top,
      marginRight: margin.right,
      marginBottom: margin.bottom,
      marginLeft: margin.left,
    }
  }, [pageConfig])

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

  // Componentes customizados para ReactMarkdown
  const markdownComponents: Components = useMemo(
    () => ({
      div: ({ node, className, children, ...props }) => {
        if (className === 'page-break') {
          return <div className='page-break' {...props} />
        }
        return (
          <div className={className} {...props}>
            {children}
          </div>
        )
      },
      pre: ({ node, children, ...props }) => {
        return (
          <pre {...props} style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {children}
          </pre>
        )
      },
      code: ({ node, className, children, ...props }: any) => {
        const isInline = !className || !className.includes('language-')
        if (isInline) {
          return (
            <code className={className} {...props}>
              {children}
            </code>
          )
        }
        return (
          <code
            className={className}
            {...props}
            style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {children}
          </code>
        )
      },
    }),
    [],
  )

  return (
    <div className={cn('relative h-full w-full bg-black/10', className)}>
      {/* Container com scroll */}
      <div
        className='bg-muted/30 absolute inset-0 overflow-auto print:hidden'
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '2rem',
        }}>
        {/* Wrapper do zoom */}
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            flexShrink: 0,
          }}>
          {/* Página do documento */}
          <div
            ref={contentRef}
            data-pdf-content
            className='print-content rounded-md bg-white text-left shadow-2xl print:scale-100 print:transform-none print:shadow-none'
            style={{
              ...getPageStyle,
              backgroundColor: theme.background,
              boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25), 0 0 0 1px rgb(0 0 0 / 0.05)',
            }}>
            <div
              className='prose prose-slate max-w-none'
              style={{
                ...getTypographyStyles,
                ...getContentStyle,
              }}>
              <PreviewStyle theme={theme} />
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={markdownComponents}>
                {markdown}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>

      {/* Indicador de orientação e tamanho */}
      <div className='pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center justify-center gap-2 rounded-full bg-blue-500/20 px-4 py-1.5 text-xs font-medium text-blue-500 shadow-sm backdrop-blur-xl print:hidden'>
        <Ruler className='h-3.5 w-3.5' />
        <span>
          {pageConfig.size.toUpperCase()} • {pageDimensions.width} × {pageDimensions.height}
          {pageDimensions.isLandscape ? ' • Paisagem' : ' • Retrato'}
          {zoom !== 1 && ` • ${Math.round(zoom * 100)}%`}
        </span>
      </div>
    </div>
  )
}
