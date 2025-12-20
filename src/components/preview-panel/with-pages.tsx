'use client'

import { cn } from '@/lib/utils'
import { THEME_PRESETS } from '@/shared/constants'
import { useConfig } from '@/shared/contexts/configContext'
import { useHeaderFooter } from '@/shared/contexts/headerFooterContext'
import { useMDToPdf } from '@/shared/contexts/mdToPdfContext'
import { useZoom } from '@/shared/contexts/zoomContext'
import { PreviewStyle } from '@/shared/styles/preview-styles'
import { AlignLeft, Layout, Loader2, Ruler } from 'lucide-react'
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import { Button } from '../ui/button'

const mmToPx = (mm: number) => mm * 3.7795275591

interface PreviewPanelProps {
  className?: string
}

export const PreviewPanelWithPages = forwardRef<HTMLDivElement, PreviewPanelProps>(
  ({ className }, ref) => {
    const { contentRef, markdown } = useMDToPdf()
    const { config } = useConfig()
    const { zoom } = useZoom()
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

        // Calcula altura do header e footer se estiverem habilitados
        // Se for imagem completa, usa altura configurada ou padrão maior
        const headerHeight = headerFooter.header.enabled
          ? headerFooter.header.fullImage
            ? getMarginPx(headerFooter.header.height || '30mm') // Imagem completa precisa de mais espaço
            : getMarginPx(headerFooter.header.height || '15mm')
          : 0
        const footerHeight = headerFooter.footer.enabled
          ? headerFooter.footer.fullImage
            ? getMarginPx(headerFooter.footer.height || '30mm') // Imagem completa precisa de mais espaço
            : getMarginPx(headerFooter.footer.height || '15mm')
          : 0

        // Espaço real disponível para conteúdo dentro da folha
        // Considera margens + altura do header + altura do footer
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

          // Lógica de Quebra Natural (Word-like)
          if (
            (currentHeight + elHeight > contentHeightLimit || isForceBreak) &&
            currentHeight > 0
          ) {
            // Se for um bloco ou um parágrafo que cabe inteiro na próxima página, "empurramos"
            if (isBlock || elHeight <= contentHeightLimit) {
              newPages.push(currentPageAccumulator.join(''))
              currentPageAccumulator =
                isForceBreak && el.innerText.trim().length === 0 ? [] : [el.outerHTML]
              currentHeight = isForceBreak && el.innerText.trim().length === 0 ? 0 : elHeight
              continue
            }
          }

          // Caso o elemento seja maior que uma página inteira (Fatiamento técnico inevitável)
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
        width: dimensions.widthPx, // Usamos PX para garantir precisão no cálculo
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

    // Função para renderizar header/footer
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

      // Se tiver imagem completa (timbrado), renderiza ela ocupando 100% da largura e altura configurada
      if (slot.fullImage) {
        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              overflow: 'hidden',
            }}>
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

      // Verifica se é modo avançado (HTML) ou simples (campos separados)
      const isAdvancedMode = slot.left && !slot.center && !slot.right && slot.left.includes('<')

      const padding = slot.padding || { top: '5mm', right: '5mm', bottom: '5mm', left: '5mm' }
      const fontSize = slot.fontSize || 11

      if (isAdvancedMode) {
        // Modo avançado: renderiza HTML completo
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
              __html: parseVariables(
                slot.left || '',
                pageNumber,
                totalPages,
                slot.logo?.url,
                slot.logo?.size,
              ),
            }}
          />
        )
      }

      // Modo simples: campos separados
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
                  width: slot.logo.size.width,
                  height: slot.logo.size.height,
                  objectFit: 'contain',
                }}
              />
            )}
            {slot.left
              ? parseVariables(slot.left, pageNumber, totalPages, slot.logo?.url, slot.logo?.size)
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
                  width: slot.logo.size.width,
                  height: slot.logo.size.height,
                  objectFit: 'contain',
                }}
              />
            )}
            {slot.center
              ? parseVariables(slot.center, pageNumber, totalPages, slot.logo?.url, slot.logo?.size)
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
              ? parseVariables(slot.right, pageNumber, totalPages, slot.logo?.url, slot.logo?.size)
              : ''}
            {slot.logo && slot.logo.position === 'right' && (
              <img
                src={slot.logo.url}
                alt='Logo'
                style={{
                  width: slot.logo.size.width,
                  height: slot.logo.size.height,
                  objectFit: 'contain',
                }}
              />
            )}
          </div>
        </div>
      )
    }

    return (
      <div className={cn('relative h-full w-full bg-slate-200/90 dark:bg-slate-950', className)}>
        {/* Ghost para Medição */}
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
                    },
                  },
                ],
              ]}>
              {markdown}
            </ReactMarkdown>
          </div>
        </div>

        {/* Viewport Principal */}
        <div
          ref={ref}
          className='absolute inset-0 flex flex-col items-center overflow-auto scroll-smooth px-8 py-12 print:p-0'>
          {/* Seletor de Modo (Floating) */}
          <div className='fixed top-30 right-10 z-50 flex flex-col gap-2 rounded-xl border border-white/10 bg-black/40 p-1 backdrop-blur-md print:hidden'>
            <Button
              variant='ghost'
              onClick={() => setViewMode('realistic')}
              className={cn(
                'cursor-pointer rounded-lg p-2 transition-all',
                viewMode === 'realistic'
                  ? 'bg-blue-500 text-white'
                  : 'text-white/60 hover:text-white',
              )}>
              <Layout className='h-4 w-4' />
            </Button>
            <button
              onClick={() => setViewMode('direct')}
              className={cn(
                'rounded-lg p-2 transition-all',
                viewMode === 'direct' ? 'bg-blue-500 text-white' : 'text-white/60 hover:text-white',
              )}>
              <AlignLeft className='h-4 w-4' />
            </button>
          </div>

          <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
            <div
              ref={contentRef}
              className={cn(
                viewMode === 'direct' ? 'flex flex-col gap-0 shadow-2xl' : 'flex flex-col',
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
                      'print-page transition-all duration-500',
                      viewMode === 'realistic'
                        ? 'mb-12 shadow-2xl'
                        : 'mb-0 border-b border-dashed border-white/10',
                    )}
                    style={{
                      ...pageStyle,
                      minHeight: viewMode === 'realistic' ? dimensions.heightPx : 'auto',
                      height: viewMode === 'realistic' ? dimensions.heightPx : 'auto',
                    }}>
                    {headerFooter.header.enabled && (
                      <div
                        className='print-header'
                        style={{
                          position: 'absolute',
                          top: 0, // Começa no topo da página
                          left: 0,
                          right: 0,
                          height: `calc(${pageConfig.margin.top} + ${headerFooter.header.height || '15mm'})`, // Margem + altura do header
                          paddingTop: pageConfig.margin.top, // Padding interno = margem superior
                          paddingLeft: pageConfig.margin.left, // Respeita margem esquerda da página
                          paddingRight: pageConfig.margin.right, // Respeita margem direita da página
                        }}>
                        {renderHeaderFooter(headerFooter.header, 'top', pageNumber, totalPages)}
                      </div>
                    )}

                    {/* Conteúdo */}
                    <div
                      className='prose h-full w-full max-w-none wrap-break-word'
                      style={typographyStyles}>
                      <PreviewStyle theme={theme} />
                      <div dangerouslySetInnerHTML={{ __html: html }} />
                    </div>

                    {/* Footer - posicionado antes da margem inferior */}
                    {headerFooter.footer.enabled && (
                      <div
                        className='print-footer'
                        style={{
                          position: 'absolute',
                          bottom: 0, // Começa no fundo da página
                          left: 0,
                          right: 0,
                          height: `calc(${pageConfig.margin.bottom} + ${headerFooter.footer.height || '15mm'})`, // Margem + altura do footer
                          paddingBottom: pageConfig.margin.bottom, // Padding interno = margem inferior
                          paddingLeft: pageConfig.margin.left, // Respeita margem esquerda da página
                          paddingRight: pageConfig.margin.right, // Respeita margem direita da página
                          display: 'flex',
                          alignItems: 'flex-end', // Alinha o conteúdo do footer no final
                        }}>
                        {renderHeaderFooter(headerFooter.footer, 'bottom', pageNumber, totalPages)}
                      </div>
                    )}

                    {/* Numeração e Margens Visuais apenas no modo Realista */}
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

        {/* Barra de Status */}
        <div className='pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center justify-center gap-4 rounded-full border border-white/20 bg-black/80 px-6 py-2 text-xs font-bold tracking-tighter text-white shadow-2xl backdrop-blur-xl print:hidden'>
          <div className='flex items-center gap-2'>
            <Ruler className='h-3.5 w-3.5 text-blue-400' />
            <span className='uppercase'>
              {pageConfig.size} • {dimensions.widthDisplay}
            </span>
          </div>
          <div className='h-4 w-px bg-white/20' />
          <div className='flex items-center gap-2'>
            {isCalculating ? (
              <span className='flex items-center gap-2 text-blue-400'>
                <Loader2 className='h-3 w-3 animate-spin' /> CALCULANDO...
              </span>
            ) : (
              <span className='text-emerald-400'>{pagesHTML.length} PÁGINAS</span>
            )}
          </div>
          <div className='h-4 w-px bg-white/20' />
          <span className='text-blue-400'>{Math.round(zoom * 100)}%</span>
        </div>
      </div>
    )
  },
)

PreviewPanelWithPages.displayName = 'PreviewPanelWithPages'
