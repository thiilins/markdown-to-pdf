'use client'

import { cn } from '@/lib/utils'
import { THEME_PRESETS } from '@/shared/constants'
import { useConfig } from '@/shared/contexts/configContext'
import { useMDToPdf } from '@/shared/contexts/mdToPdfContext'
import { useZoom } from '@/shared/contexts/zoomContext'
import { PreviewStyle } from '@/shared/styles/preview-styles'
import { Loader2, Ruler } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import ReactMarkdown, { Components } from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

// Conversão precisa: 1mm = 3.7795px (96 DPI standard)
const mmToPx = (mm: number) => mm * 3.7795275591

interface PreviewPanelProps {
  className?: string
}

export function PreviewPanelWithPages({ className }: PreviewPanelProps) {
  const { contentRef, markdown } = useMDToPdf()
  const { config } = useConfig()
  const { zoom } = useZoom()
  const pageConfig = config.page
  const typographyConfig = config.typography
  const theme = config.theme || THEME_PRESETS.modern
  const ghostRef = useRef<HTMLDivElement>(null)

  // Começamos com um array vazio para não renderizar páginas fantasmas no início
  const [pagesHTML, setPagesHTML] = useState<string[]>([])
  const [isCalculating, setIsCalculating] = useState(true)

  const dimensions = useMemo(() => {
    const { width, height, orientation } = pageConfig
    const widthRaw = parseFloat(width)
    const heightRaw = parseFloat(height)
    const unit = width.replace(/[\d.]/g, '') || 'mm'

    let finalW =
      orientation === 'landscape' ? Math.max(widthRaw, heightRaw) : Math.min(widthRaw, heightRaw)
    let finalH =
      orientation === 'landscape' ? Math.min(widthRaw, heightRaw) : Math.max(widthRaw, heightRaw)

    return {
      widthDisplay: `${finalW}${unit}`,
      heightDisplay: `${finalH}${unit}`,
      widthPx: unit === 'mm' ? mmToPx(finalW) : finalW,
      heightPx: unit === 'mm' ? mmToPx(finalH) : finalH,
      isLandscape: orientation === 'landscape',
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

    // O timer garante que o DOM invisível foi pintado e o Syntax Highlighting aplicado
    const timer = setTimeout(() => {
      const elements = Array.from(ghost.children) as HTMLElement[]

      const getMarginPx = (val: string) => {
        const num = parseFloat(val)
        return val.includes('mm') ? mmToPx(num) : num
      }

      const marginTop = getMarginPx(pageConfig.margin.top)
      const marginBottom = getMarginPx(pageConfig.margin.bottom)

      // Math.floor evita sub-pixels que causam transbordos acidentais
      const contentHeightLimit = Math.floor(dimensions.heightPx - marginTop - marginBottom)

      const newPages: string[] = []
      let currentPageAccumulator: string[] = []
      let currentHeight = 0

      for (let i = 0; i < elements.length; i++) {
        const el = elements[i]

        // Ignora apenas elementos verdadeiramente vazios (sem conteúdo e sem altura)
        // Verifica se tem conteúdo de texto OU elementos filhos (para elementos como <pre> com código)
        const hasContent =
          el.innerText.trim() !== '' || el.children.length > 0 || el.innerHTML.trim() !== ''

        const style = window.getComputedStyle(el)
        const marginTop = parseFloat(style.marginTop) || 0
        const marginBottom = parseFloat(style.marginBottom) || 0
        const elHeight = el.offsetHeight + marginTop + marginBottom
        const isForceBreak =
          el.classList.contains('page-break') || !!el.querySelector('.page-break')

        // LÓGICA DE FATIAMENTO PARA ELEMENTOS GIGANTES (ex: Código 500 linhas)
        if (elHeight > contentHeightLimit) {
          // Fatiamento: divide o elemento em múltiplas páginas
          // IMPORTANTE: A primeira fatia DEVE sempre mostrar o topo do elemento
          let remainingHeight = elHeight
          let scrollPosition = 0
          let isFirstSlice = true
          let sliceCount = 0

          while (remainingHeight > 0) {
            const sliceHeight = Math.min(contentHeightLimit, remainingHeight)

            // Para a primeira fatia, não aplicamos nenhum deslocamento
            // O elemento deve aparecer normalmente desde o topo
            // Para fatias seguintes, deslocamos o elemento para cima
            let sliceContent = ''
            if (isFirstSlice) {
              // Primeira fatia: elemento completo sem deslocamento e sem wrapper de overflow
              // Isso garante que o elemento seja renderizado corretamente
              sliceContent = el.outerHTML

              // Se já temos conteúdo na página atual, adiciona a primeira fatia na mesma página
              if (currentPageAccumulator.length > 0) {
                // Tenta adicionar na página atual se couber
                const availableSpace = contentHeightLimit - currentHeight
                if (availableSpace > sliceHeight * 0.5) {
                  // Se há espaço suficiente (pelo menos 50% da fatia), adiciona na mesma página
                  const firstSliceHTML = `
                    <div class="overflow-slice" style="height: ${sliceHeight}px; overflow: hidden; width: 100%; position: relative;">
                      ${sliceContent}
                    </div>
                  `
                  currentPageAccumulator.push(firstSliceHTML)
                  newPages.push(currentPageAccumulator.join(''))
                  currentPageAccumulator = []
                  currentHeight = 0
                } else {
                  // Não há espaço, fecha a página atual e cria nova para a primeira fatia
                  newPages.push(currentPageAccumulator.join(''))
                  currentPageAccumulator = []
                  currentHeight = 0
                  const firstSliceHTML = `
                    <div class="overflow-slice" style="height: ${sliceHeight}px; overflow: hidden; width: 100%; position: relative;">
                      ${sliceContent}
                    </div>
                  `
                  newPages.push(firstSliceHTML)
                }
              } else {
                // Não há conteúdo anterior, cria a primeira página diretamente
                const firstSliceHTML = `
                  <div class="overflow-slice" style="height: ${sliceHeight}px; overflow: hidden; width: 100%; position: relative;">
                    ${sliceContent}
                  </div>
                `
                newPages.push(firstSliceHTML)
              }
            } else {
              // Fatias seguintes: deslocamos usando position absolute
              sliceContent = `
                <div style="position: absolute; top: -${scrollPosition}px; left: 0; width: 100%;">
                  ${el.outerHTML}
                </div>
              `

              const sliceHTML = `
                <div class="overflow-slice" style="height: ${sliceHeight}px; overflow: hidden; width: 100%; position: relative;">
                  ${sliceContent}
                </div>
              `
              newPages.push(sliceHTML)
            }

            scrollPosition += contentHeightLimit
            remainingHeight -= contentHeightLimit
            isFirstSlice = false
            sliceCount++
          }

          continue
        }

        // LÓGICA DE QUEBRA DE PÁGINA NORMAL
        const wouldOverflow = currentHeight + elHeight > contentHeightLimit

        if ((wouldOverflow || isForceBreak) && currentHeight > 0) {
          newPages.push(currentPageAccumulator.join(''))

          // Se for quebra forçada manual, limpamos o acumulador
          if (isForceBreak && el.innerText.trim().length === 0) {
            currentPageAccumulator = []
            currentHeight = 0
          } else {
            currentPageAccumulator = [el.outerHTML]
            currentHeight = elHeight
          }
        } else {
          currentPageAccumulator.push(el.outerHTML)
          currentHeight += elHeight
        }
      }

      // Adiciona a última página se houver conteúdo residual
      if (currentPageAccumulator.length > 0) {
        newPages.push(currentPageAccumulator.join(''))
      }

      // Fallback para conteúdo vazio
      if (newPages.length === 0) {
        newPages.push('<p>&nbsp;</p>')
      }

      setPagesHTML(newPages)
      setIsCalculating(false)
    }, 300) // Aumentado para 300ms para garantir renderização de códigos pesados

    return () => clearTimeout(timer)
  }, [markdown, dimensions, pageConfig.margin, typographyConfig, theme])

  const getPageStyle = useMemo(() => {
    return {
      width: dimensions.widthDisplay,
      height: dimensions.heightDisplay,
      paddingTop: pageConfig.margin.top,
      paddingRight: pageConfig.margin.right,
      paddingBottom: pageConfig.margin.bottom,
      paddingLeft: pageConfig.margin.left,
      backgroundColor: theme.background,
      color: theme.textColor,
      marginBottom: '3rem',
      position: 'relative' as const,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      overflow: 'hidden',
      flexShrink: 0,
      boxSizing: 'border-box' as const,
    }
  }, [dimensions, pageConfig.margin, theme])

  const markdownComponents: Components = useMemo(
    () => ({
      img: ({ node, ...props }) => (
        <img {...props} style={{ maxWidth: '100%', height: 'auto' }} alt={props.alt || ''} />
      ),
      div: ({ node, className, ...props }) => {
        if (className === 'page-break')
          return <div className='page-break invisible h-0 w-full' {...props} />
        return <div className={className} {...props} />
      },
    }),
    [],
  )

  return (
    <div className={cn('relative h-full w-full bg-slate-200/90 dark:bg-slate-950', className)}>
      {/* Ghost Element para Medição Precisa */}
      <div
        id='measurement-ghost'
        aria-hidden='true'
        className='prose max-w-none'
        style={{
          position: 'absolute',
          top: -99999,
          left: -99999,
          visibility: 'hidden',
          width: dimensions.widthPx, // Medição em PX para evitar erros de arredondamento
          paddingLeft: pageConfig.margin.left,
          paddingRight: pageConfig.margin.right,
          ...typographyStyles,
        }}>
        <div ref={ghostRef}>
          <PreviewStyle theme={theme} />
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={markdownComponents}>
            {markdown}
          </ReactMarkdown>
        </div>
      </div>

      {/* Viewport de Renderização das Páginas */}
      <div className='absolute inset-0 flex flex-col items-center overflow-auto scroll-smooth px-8 py-12 print:overflow-visible print:p-0'>
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            display: 'flex',
            flexDirection: 'column',
          }}>
          <div ref={contentRef} className='print:block'>
            {pagesHTML.map((htmlContent, index) => (
              <div
                key={index}
                className='print-page bg-white transition-opacity duration-500'
                style={getPageStyle}
                data-page-number={index + 1}>
                <div
                  className='prose h-full w-full max-w-none wrap-break-word'
                  style={typographyStyles}>
                  <PreviewStyle theme={theme} />
                  <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                </div>

                {/* Marcador de Página (Invisível no Print) */}
                <div
                  className='pointer-events-none absolute right-8 bottom-6 font-mono text-[10px] tracking-widest uppercase opacity-20 print:hidden'
                  style={{ color: theme.textColor }}>
                  Página {index + 1} / {pagesHTML.length}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Barra de Status Inferior */}
      <div className='pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center justify-center gap-4 rounded-full border border-white/20 bg-black/80 px-6 py-2 text-xs font-bold tracking-tighter text-white shadow-2xl backdrop-blur-xl print:hidden'>
        <div className='flex items-center gap-2'>
          <Ruler className='h-3.5 w-3.5 text-blue-400' />
          <span className='uppercase'>
            {pageConfig.size} • {dimensions.widthDisplay} × {dimensions.heightDisplay}
          </span>
        </div>
        <div className='h-4 w-px bg-white/20' />
        <div className='flex items-center gap-2'>
          {isCalculating ? (
            <span className='flex items-center gap-2 text-blue-400'>
              <Loader2 className='h-3 w-3 animate-spin' /> PROCESSANDO PÁGINAS...
            </span>
          ) : (
            <span className='text-emerald-400'>{pagesHTML.length} PÁGINAS GERADAS</span>
          )}
        </div>
        <div className='h-4 w-px bg-white/20' />
        <span className='text-blue-400'>{Math.round(zoom * 100)}%</span>
      </div>
    </div>
  )
}
