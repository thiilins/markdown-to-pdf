'use client'

import { InteractiveTOC } from '@/components/markdown-editor/interactive-toc'
import { LinkValidatorPanel } from '@/components/markdown-editor/link-validator-panel'
import { cn } from '@/lib/utils'
import { THEME_PRESETS } from '@/shared/constants'
import { useApp } from '@/shared/contexts/appContext'
import { useMarkdown } from '@/shared/contexts/markdownContext'
import '@/shared/utils/clear-toc-cache'

import { PreviewStyle } from '@/shared/styles/preview-styles'
import { Ruler } from 'lucide-react'
import { forwardRef, useMemo } from 'react'
import ReactMarkdown, { Components } from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

interface PreviewPanelProps {
  className?: string
  customConfig?: {
    pageConfig?: AppConfig['page']
    typographyConfig?: AppConfig['typography']
    theme?: AppConfig['theme']
  }
}

export const PreviewComponent = forwardRef<HTMLDivElement, PreviewPanelProps>(
  ({ className, customConfig }, ref) => {
    const { contentRef, markdown } = useMarkdown()
    const { config, zoom } = useApp()

    // ... (Lógica de configurações de página/tipografia mantida igual) ...
    const typographyConfig = customConfig?.typographyConfig ?? config.typography
    const theme = (customConfig?.theme ?? config.theme) || THEME_PRESETS.modern
    const pageConfig = customConfig?.pageConfig ?? config.page

    const pageDimensions = useMemo(() => {
      const { width, height, orientation } = pageConfig
      const widthValue = parseFloat(width)
      const heightValue = parseFloat(height)
      const widthUnit = width.replace(/[\d.]/g, '')
      const heightUnit = height.replace(/[\d.]/g, '')

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

    // Markdown Components com IDs automáticos nos headers para bookmarks
    const markdownComponents: Components = useMemo(
      () => ({
        div: ({ node, className, children, ...props }) => {
          if (className === 'page-break') return <div className='page-break' {...props} />
          return (
            <div className={className} {...props}>
              {children}
            </div>
          )
        },
        pre: ({ node, children, ...props }) => (
          <pre {...props} style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {children}
          </pre>
        ),
        code: ({ node, className, children, ...props }: any) => {
          const isInline = !className || !className.includes('language-')
          if (isInline)
            return (
              <code className={className} {...props}>
                {children}
              </code>
            )
          return (
            <code
              className={className}
              {...props}
              style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
              {children}
            </code>
          )
        },
        // Adiciona IDs automáticos nos headers para navegação e bookmarks
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
      }),
      [],
    )

    const previewConfig = config.preview || { showTOC: false, tocPosition: 'left' }
    const tocPosition = previewConfig.tocPosition || 'left'

    return (
      <div className={cn('bg-muted/30 relative h-full w-full', className)}>
        {/* Interactive TOC */}
        {previewConfig.showTOC && (
          <InteractiveTOC markdown={markdown?.content || ''} position={tocPosition} />
        )}

        {/* Link Validator Panel */}
        <LinkValidatorPanel markdown={markdown?.content || ''} />

        {/* Container de Scroll */}
        <div
          ref={ref}
          className='absolute inset-0 overflow-x-hidden overflow-y-auto scroll-smooth print:hidden'
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: '2rem',
            paddingBottom: '5rem', // Espaço extra para o footer flutuante não cobrir o texto
          }}>
          {/* Wrapper do zoom */}
          <div
            className='transition-transform duration-200 ease-out will-change-transform'
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'top center',
              flexShrink: 0,
            }}>
            {/* A "Página" em si */}
            <div
              ref={contentRef}
              data-pdf-content
              className='print-content rounded bg-white text-left shadow-lg ring-1 ring-black/5 dark:ring-white/10 print:scale-100 print:transform-none print:shadow-none'
              style={{
                ...getPageStyle,
                backgroundColor: theme.background,
              }}>
              <div
                className='prose prose-slate dark:prose-invert max-w-none'
                style={{
                  ...getTypographyStyles,
                  ...getContentStyle,
                }}>
                <PreviewStyle theme={theme} />
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={markdownComponents}>
                  {markdown?.content || ''}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Info Pill */}
        <div className='bg-background/80 text-muted-foreground hover:bg-background pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center justify-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-medium shadow-sm backdrop-blur-md transition-all print:hidden'>
          <Ruler className='text-primary h-3.5 w-3.5' />
          <span>{pageConfig.size.toUpperCase()}</span>
          <span className='text-muted-foreground/40'>•</span>
          <span>
            {pageDimensions.width} × {pageDimensions.height}
          </span>
          <span className='text-muted-foreground/40'>•</span>
          <span>{pageDimensions.isLandscape ? 'Paisagem' : 'Retrato'}</span>
          {zoom !== 1 && (
            <>
              <span className='text-muted-foreground/40'>•</span>
              <span className='text-primary font-bold'>{Math.round(zoom * 100)}%</span>
            </>
          )}
        </div>
      </div>
    )
  },
)

PreviewComponent.displayName = 'PreviewComponent'
