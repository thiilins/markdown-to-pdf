'use client'

import { InteractiveTOC } from '@/components/markdown-editor/interactive-toc'
import { LinkValidatorPanel } from '@/components/markdown-editor/link-validator-panel'
import { Button } from '@/components/ui/button'
import { sanitizeHtml } from '@/lib/security-utils'
import { cn } from '@/lib/utils'
import { THEME_PRESETS } from '@/shared/constants'
import { useApp } from '@/shared/contexts/appContext'
import { useHeaderFooter } from '@/shared/contexts/headerFooterContext'
import { useMarkdown } from '@/shared/contexts/markdownContext'
import { PreviewStyle } from '@/shared/styles/preview-styles'
import '@/shared/utils/clear-toc-cache'
import { AlignLeft, Layout, Loader2, Ruler } from 'lucide-react'
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import ReactMarkdown, { Components } from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'

const mmToPx = (mm: number) => mm * 3.7795275591

interface PreviewPanelProps {
  className?: string
}

export const PreviewPanelWithPages = forwardRef<HTMLDivElement, PreviewPanelProps>(
  ({ className }, ref) => {
    const { contentRef, markdown } = useMarkdown()
    const { config, zoom } = useApp()
    const { headerFooter, parseVariables } = useHeaderFooter()

    // Estado para alternar o modo de visualização
    const [viewMode, setViewMode] = useState<'realistic' | 'direct'>('realistic')

    const pageConfig = config.page
    const typographyConfig = config.typography
    const theme = config.theme || THEME_PRESETS.modern
    const ghostRef = useRef<HTMLDivElement>(null)

    const [pagesHTML, setPagesHTML] = useState<string[]>([])
    const [isCalculating, setIsCalculating] = useState(true)

    const dimensions = useMemo(() => {
      const { width, height, orientation } = pageConfig
      const widthRaw = parseFloat(width)
      const heightRaw = parseFloat(height)
      const unit = width.replace(/[\d.]/g, '') || 'mm'

      const finalW =
        orientation === 'landscape' ? Math.max(widthRaw, heightRaw) : Math.min(widthRaw, heightRaw)
      const finalH =
        orientation === 'landscape' ? Math.min(widthRaw, heightRaw) : Math.max(widthRaw, heightRaw)

      return {
        widthDisplay: `${finalW}${unit}`,
        heightDisplay: `${finalH}${unit}`,
        widthPx: unit === 'mm' ? mmToPx(finalW) : finalW,
        heightPx: unit === 'mm' ? mmToPx(finalH) : finalH,
      }
    }, [pageConfig])

    const typographyStyles = useMemo(
      () =>
        ({
          '--font-headings': typographyConfig.headings,
          '--font-body': typographyConfig.body,
          '--font-code': typographyConfig.code,
          '--font-quote': typographyConfig.quote,
          '--base-size': `${typographyConfig.baseSize}px`,
          '--h1-size': `${typographyConfig.h1Size}px`,
          '--h2-size': `${typographyConfig.h2Size}px`,
          '--h3-size': `${typographyConfig.h3Size}px`,
          '--line-height': String(typographyConfig.lineHeight),
        }) as React.CSSProperties,
      [typographyConfig],
    )

    useEffect(() => {
      const ghost = ghostRef.current
      if (!ghost) return

      setIsCalculating(true)

      const timer = setTimeout(() => {
        const elements = Array.from(ghost.children) as HTMLElement[]
        const getMarginPx = (val: string) => {
          const num = parseFloat(val)
          return val.includes('mm') ? mmToPx(num) : num
        }

        const marginTop = getMarginPx(pageConfig.margin.top)
        const marginBottom = getMarginPx(pageConfig.margin.bottom)

        const headerHeight = headerFooter.header.enabled
          ? headerFooter.header.fullImage
            ? getMarginPx(headerFooter.header.height || '30mm')
            : getMarginPx(headerFooter.header.height || '15mm')
          : 0
        const footerHeight = headerFooter.footer.enabled
          ? headerFooter.footer.fullImage
            ? getMarginPx(headerFooter.footer.height || '30mm')
            : getMarginPx(headerFooter.footer.height || '15mm')
          : 0

        const contentHeightLimit = Math.floor(
          dimensions.heightPx - marginTop - marginBottom - headerHeight - footerHeight,
        )

        const newPages: string[] = []
        let currentPageAccumulator: string[] = []
        let currentHeight = 0

        for (let i = 0; i < elements.length; i++) {
          const el = elements[i]
          const style = window.getComputedStyle(el)
          const marginTopEl = parseFloat(style.marginTop) || 0
          const marginBottomEl = parseFloat(style.marginBottom) || 0
          const elHeight = el.offsetHeight + marginTopEl + marginBottomEl

          const isForceBreak =
            el.classList.contains('page-break') || !!el.querySelector('.page-break')
          const isBlock =
            ['PRE', 'BLOCKQUOTE', 'TABLE', 'IMG'].includes(el.tagName) || el.tagName.startsWith('H')

          if (
            (currentHeight + elHeight > contentHeightLimit || isForceBreak) &&
            currentHeight > 0
          ) {
            if (isBlock || elHeight <= contentHeightLimit) {
              newPages.push(currentPageAccumulator.join(''))
              currentPageAccumulator =
                isForceBreak && el.innerText.trim().length === 0 ? [] : [el.outerHTML]
              currentHeight = isForceBreak && el.innerText.trim().length === 0 ? 0 : elHeight
              continue
            }
          }

          if (elHeight > contentHeightLimit) {
            let remaining = elHeight
            let offset = 0
            while (remaining > 0) {
              const sliceH = Math.min(contentHeightLimit, remaining)
              const slice = `<div class="overflow-slice" style="height: ${sliceH}px; overflow: hidden; position: relative; width: 100%;">
                                <div style="position: absolute; top: -${offset}px; left: 0; width: 100%;">${el.outerHTML}</div>
                             </div>`

              if (currentHeight + sliceH > contentHeightLimit) {
                newPages.push(currentPageAccumulator.join(''))
                currentPageAccumulator = [slice]
                currentHeight = sliceH
              } else {
                currentPageAccumulator.push(slice)
                currentHeight += sliceH
              }
              offset += sliceH
              remaining -= sliceH
            }
          } else {
            currentPageAccumulator.push(el.outerHTML)
            currentHeight += elHeight
          }
        }

        if (currentPageAccumulator.length > 0) newPages.push(currentPageAccumulator.join(''))
        setPagesHTML(newPages.length > 0 ? newPages : ['<p>&nbsp;</p>'])
        setIsCalculating(false)
      }, 400)

      return () => clearTimeout(timer)
    }, [
      markdown,
      dimensions,
      pageConfig.margin,
      typographyConfig,
      theme,
      headerFooter.header.enabled,
      headerFooter.header.height,
      headerFooter.footer.enabled,
      headerFooter.footer.height,
      headerFooter.header.fullImage,
      headerFooter.footer.fullImage,
    ])

    const commonPageStyle = useMemo(
      () => ({
        width: dimensions.widthPx,
        paddingTop: pageConfig.margin.top,
        paddingRight: pageConfig.margin.right,
        paddingBottom: pageConfig.margin.bottom,
        paddingLeft: pageConfig.margin.left,
        backgroundColor: theme.background,
        color: theme.textColor,
        boxSizing: 'border-box' as const,
        position: 'relative' as const,
      }),
      [dimensions, pageConfig.margin, theme],
    )

    const renderHeaderFooter = (
      slot: typeof headerFooter.header,
      position: 'top' | 'bottom',
      pageNumber: number,
      totalPages: number,
    ) => {
      if (!slot.enabled) return null

      const borderStyle = slot.border
        ? position === 'top'
          ? { borderBottom: `1px solid ${theme.borderColor || '#e5e7eb'}` }
          : { borderTop: `1px solid ${theme.borderColor || '#e5e7eb'}` }
        : {}

      const height = slot.height || '15mm'

      if (slot.fullImage) {
        return (
          <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
            <img
              src={slot.fullImage}
              alt={position === 'top' ? 'Cabeçalho timbrado' : 'Rodapé timbrado'}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: position === 'top' ? 'top' : 'bottom',
              }}
            />
          </div>
        )
      }

      const isAdvancedMode = slot.left && !slot.center && !slot.right && slot.left.includes('<')
      const padding = slot.padding || { top: '5mm', right: '5mm', bottom: '5mm', left: '5mm' }
      const fontSize = slot.fontSize || 11

      if (isAdvancedMode) {
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              paddingTop: padding.top,
              paddingRight: padding.right,
              paddingBottom: padding.bottom,
              paddingLeft: padding.left,
              fontSize: `${fontSize}px`,
              color: theme.textColor,
              opacity: 0.8,
              ...borderStyle,
            }}
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(
                parseVariables(
                  slot.left || '',
                  pageNumber,
                  totalPages,
                  slot.logo?.url,
                  slot?.logo?.size || undefined,
                ),
                { allowScripts: false },
              ),
            }}
          />
        )
      }

      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: padding.top,
            paddingRight: padding.right,
            paddingBottom: padding.bottom,
            paddingLeft: padding.left,
            fontSize: `${fontSize}px`,
            color: theme.textColor,
            opacity: 0.8,
            ...borderStyle,
          }}>
          {/* Lógica original de renderização simples mantida... */}
          <div
            style={{
              flex: 1,
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
            {slot.logo && slot.logo.position === 'left' && (
              <img
                src={slot.logo.url}
                alt='Logo'
                style={{
                  width: slot?.logo?.size?.width,
                  height: slot?.logo?.size?.height,
                  objectFit: 'contain',
                }}
              />
            )}
            {slot.left
              ? parseVariables(slot.left, pageNumber, totalPages, slot.logo?.url, slot?.logo?.size)
              : ''}
          </div>
          <div
            style={{
              flex: 1,
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}>
            {slot.logo && slot.logo.position === 'center' && (
              <img
                src={slot.logo.url}
                alt='Logo'
                style={{
                  width: slot?.logo?.size?.width,
                  height: slot?.logo?.size?.height,
                  objectFit: 'contain',
                }}
              />
            )}
            {slot.center
              ? parseVariables(
                  slot.center,
                  pageNumber,
                  totalPages,
                  slot.logo?.url,
                  slot?.logo?.size,
                )
              : ''}
          </div>
          <div
            style={{
              flex: 1,
              textAlign: 'right',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '8px',
            }}>
            {slot.right
              ? parseVariables(slot.right, pageNumber, totalPages, slot.logo?.url, slot?.logo?.size)
              : ''}
            {slot.logo && slot.logo.position === 'right' && (
              <img
                src={slot.logo.url}
                alt='Logo'
                style={{
                  width: slot?.logo?.size?.width,
                  height: slot?.logo?.size?.height,
                  objectFit: 'contain',
                }}
              />
            )}
          </div>
        </div>
      )
    }

    const previewConfig = config.preview || { showTOC: false, tocPosition: 'left' }
    const tocPosition = previewConfig.tocPosition || 'left'

    // Markdown Components com IDs automáticos nos headers para bookmarks
    const markdownComponents: Components = useMemo(
      () => ({
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

    return (
      <div className={cn('bg-muted/30 relative h-full w-full', className)}>
        {/* Interactive TOC */}
        {previewConfig.showTOC && (
          <InteractiveTOC markdown={markdown?.content || ''} position={tocPosition} />
        )}

        {/* Link Validator Panel */}
        <LinkValidatorPanel markdown={markdown?.content || ''} />

        {/* Elemento Ghost (Invisível) para Cálculos */}
        <div
          id='measurement-ghost'
          aria-hidden='true'
          className='prose max-w-none'
          style={{
            position: 'absolute',
            top: -99999,
            left: -99999,
            visibility: 'hidden',
            width: dimensions.widthPx,
            paddingLeft: pageConfig.margin.left,
            paddingRight: pageConfig.margin.right,
            ...typographyStyles,
          }}>
          <div ref={ghostRef}>
            <PreviewStyle theme={theme} />
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[
                rehypeRaw,
                [
                  rehypeSanitize,
                  {
                    ...defaultSchema,
                    attributes: {
                      ...defaultSchema.attributes,
                      div: [...(defaultSchema.attributes?.div || []), ['className']],
                      h1: [...(defaultSchema.attributes?.h1 || []), 'id'],
                      h2: [...(defaultSchema.attributes?.h2 || []), 'id'],
                      h3: [...(defaultSchema.attributes?.h3 || []), 'id'],
                      h4: [...(defaultSchema.attributes?.h4 || []), 'id'],
                      h5: [...(defaultSchema.attributes?.h5 || []), 'id'],
                      h6: [...(defaultSchema.attributes?.h6 || []), 'id'],
                    },
                  },
                ],
              ]}
              components={markdownComponents}>
              {markdown?.content || ''}
            </ReactMarkdown>
          </div>
        </div>

        {/* Viewport Principal com Scroll */}
        <div
          ref={ref}
          className='absolute inset-0 flex flex-col items-center overflow-auto scroll-smooth px-8 py-12 print:p-0'
          style={{ paddingBottom: '6rem' }} // Espaço extra para o footer flutuante
        >
          {/* Botão de Modos de Visualização (Floating, posicionado relativo ao conteúdo) */}
          <div className='bg-background/80 sticky top-0 z-50 mb-4 ml-auto flex gap-1 rounded-md border p-1 backdrop-blur-md print:hidden'>
            <Button
              variant={viewMode === 'realistic' ? 'secondary' : 'ghost'}
              size='sm'
              onClick={() => setViewMode('realistic')}
              className='h-8 w-8 p-0'
              title='Modo Páginas Reais'>
              <Layout className='h-4 w-4' />
            </Button>
            <Button
              variant={viewMode === 'direct' ? 'secondary' : 'ghost'}
              size='sm'
              onClick={() => setViewMode('direct')}
              className='h-8 w-8 p-0'
              title='Modo Contínuo'>
              <AlignLeft className='h-4 w-4' />
            </Button>
          </div>

          <div
            className='transition-transform duration-200 ease-out will-change-transform'
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
            <div
              ref={contentRef}
              className={cn(
                viewMode === 'direct' ? 'flex flex-col gap-0 shadow-lg' : 'flex flex-col',
              )}>
              {pagesHTML.map((html, idx) => {
                const pageNumber = idx + 1
                const totalPages = pagesHTML.length
                const headerHeight = headerFooter.header.enabled
                  ? headerFooter.header.height || '15mm'
                  : '0'
                const footerHeight = headerFooter.footer.enabled
                  ? headerFooter.footer.height || '15mm'
                  : '0'

                const pageStyle = {
                  ...commonPageStyle,
                  paddingTop: headerFooter.header.enabled
                    ? `calc(${pageConfig.margin.top} + ${headerHeight})`
                    : pageConfig.margin.top,
                  paddingBottom: headerFooter.footer.enabled
                    ? `calc(${pageConfig.margin.bottom} + ${footerHeight})`
                    : pageConfig.margin.bottom,
                }

                return (
                  <div
                    key={idx}
                    className={cn(
                      'print-page transition-all duration-300',
                      viewMode === 'realistic'
                        ? 'mb-12 rounded-sm shadow-lg ring-1 ring-black/5 dark:ring-white/10'
                        : 'border-muted-foreground/20 mb-0 border-b border-dashed',
                    )}
                    style={{
                      ...pageStyle,
                      minHeight: viewMode === 'realistic' ? dimensions.heightPx : 'auto',
                      height: viewMode === 'realistic' ? dimensions.heightPx : 'auto',
                    }}>
                    {/* Header */}
                    {headerFooter.header.enabled && (
                      <div
                        className='print-header'
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: `calc(${pageConfig.margin.top} + ${headerFooter.header.height || '15mm'})`,
                          paddingTop: pageConfig.margin.top,
                          paddingLeft: pageConfig.margin.left,
                          paddingRight: pageConfig.margin.right,
                        }}>
                        {renderHeaderFooter(headerFooter.header, 'top', pageNumber, totalPages)}
                      </div>
                    )}

                    {/* Conteúdo da Página */}
                    <div
                      className='prose dark:prose-invert h-full w-full max-w-none wrap-break-word'
                      style={typographyStyles}>
                      <PreviewStyle theme={theme} />
                      <div
                        dangerouslySetInnerHTML={{
                          __html: sanitizeHtml(html, { allowScripts: false }),
                        }}
                      />
                    </div>

                    {/* Footer */}
                    {headerFooter.footer.enabled && (
                      <div
                        className='print-footer'
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: `calc(${pageConfig.margin.bottom} + ${headerFooter.footer.height || '15mm'})`,
                          paddingBottom: pageConfig.margin.bottom,
                          paddingLeft: pageConfig.margin.left,
                          paddingRight: pageConfig.margin.right,
                          display: 'flex',
                          alignItems: 'flex-end',
                        }}>
                        {renderHeaderFooter(headerFooter.footer, 'bottom', pageNumber, totalPages)}
                      </div>
                    )}

                    {/* Número da página (Apenas visualização em tela) */}
                    {viewMode === 'realistic' && (
                      <div
                        className='pointer-events-none absolute right-8 bottom-6 font-mono text-[10px] tracking-widest uppercase opacity-20 print:hidden'
                        style={{ color: theme.textColor }}>
                        {pageNumber} / {totalPages}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Floating Status Pill (Estilo novo) */}
        <div className='bg-background/80 text-muted-foreground hover:bg-background pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center justify-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium shadow-sm backdrop-blur-md transition-all print:hidden'>
          <Ruler className='text-primary h-3.5 w-3.5' />
          <span>{pageConfig.size.toUpperCase()}</span>
          <span className='text-muted-foreground/40'>•</span>
          {isCalculating ? (
            <span className='text-primary flex items-center gap-1.5'>
              <Loader2 className='h-3 w-3 animate-spin' /> Calculando...
            </span>
          ) : (
            <span className='text-foreground font-semibold'>{pagesHTML.length} Páginas</span>
          )}
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

PreviewPanelWithPages.displayName = 'PreviewPanelWithPages'
