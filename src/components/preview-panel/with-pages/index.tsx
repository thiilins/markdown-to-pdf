'use client'

import { PreviewStyle } from '@/shared/styles/preview-styles'
import { cn } from '@/lib/utils'
import { THEME_PRESETS } from '@/shared/constants'
import { Loader2, Ruler } from 'lucide-react'
import { useMemo, useState, useEffect, useRef } from 'react'
import ReactMarkdown, { Components } from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

// Conversão precisa: 1mm = 3.7795px (96 DPI standard)
const mmToPx = (mm: number) => mm * 3.7795275591

interface PreviewPanelProps {
  markdown: string
  pageConfig: PageConfig
  typographyConfig: TypographyConfig
  themeConfig?: ThemeConfig
  zoom?: number
  contentRef: React.RefObject<HTMLDivElement | null>
  className?: string
}

export function PreviewPanelWithPages({
  markdown,
  pageConfig,
  typographyConfig,
  themeConfig,
  zoom = 1,
  contentRef,
  className,
}: PreviewPanelProps) {
  const theme = themeConfig || THEME_PRESETS.modern
  const ghostRef = useRef<HTMLDivElement>(null)

  const [pagesHTML, setPagesHTML] = useState<string[]>([''])
  const [isCalculating, setIsCalculating] = useState(false)

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

    const timer = setTimeout(() => {
      const elements = Array.from(ghost.children) as HTMLElement[]

      const getMarginPx = (val: string) => {
        const num = parseFloat(val)
        return val.includes('mm') ? mmToPx(num) : num
      }

      const marginTop = getMarginPx(pageConfig.margin.top)
      const marginBottom = getMarginPx(pageConfig.margin.bottom)

      const contentHeightLimit = dimensions.heightPx - marginTop - marginBottom

      const newPages: string[] = []
      let currentPageAccumulator: string[] = []
      let currentHeight = 0

      for (let i = 0; i < elements.length; i++) {
        const el = elements[i]
        const style = window.getComputedStyle(el)
        const elHeight =
          el.offsetHeight + parseFloat(style.marginTop) + parseFloat(style.marginBottom)
        const forceBreak = el.classList.contains('page-break') || !!el.querySelector('.page-break')

        if ((currentHeight + elHeight > contentHeightLimit && currentHeight > 0) || forceBreak) {
          newPages.push(currentPageAccumulator.join(''))

          if (!forceBreak || el.innerText.trim().length > 0) {
            currentPageAccumulator = [el.outerHTML]
            currentHeight = elHeight
          } else {
            currentPageAccumulator = []
            currentHeight = 0
          }
        } else {
          currentPageAccumulator.push(el.outerHTML)
          currentHeight += elHeight
        }
      }

      if (currentPageAccumulator.length > 0) {
        newPages.push(currentPageAccumulator.join(''))
      }

      if (newPages.length === 0) newPages.push('')

      setPagesHTML(newPages)
      setIsCalculating(false)
    }, 50)

    return () => clearTimeout(timer)
  }, [markdown, dimensions, pageConfig.margin, typographyConfig])

  const getPageStyle = useMemo(
    () => ({
      width: dimensions.widthDisplay,
      height: dimensions.heightDisplay,
      paddingTop: pageConfig.margin.top,
      paddingRight: pageConfig.margin.right,
      paddingBottom: pageConfig.margin.bottom,
      paddingLeft: pageConfig.margin.left,
      backgroundColor: theme.background,
      color: theme.textColor,
      marginBottom: '2rem',
      position: 'relative' as const,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      overflow: 'hidden',
    }),
    [dimensions, pageConfig.margin, theme],
  )

  const markdownComponents: Components = useMemo(
    () => ({
      img: ({ node, ...props }) => (
        <img {...props} style={{ maxWidth: '100%', height: 'auto' }} alt={props.alt || ''} />
      ),
      div: ({ node, className, ...props }) => {
        if (className === 'page-break')
          return <div className='page-break my-2 h-px w-full' {...props} />
        return <div className={className} {...props} />
      },
    }),
    [],
  )

  return (
    <div className={cn('relative h-full w-full bg-slate-200/90 dark:bg-slate-950', className)}>
      <div
        id='source-html-for-pdf'
        aria-hidden='true'
        className='prose max-w-none'
        style={{
          position: 'absolute',
          top: -9999,
          left: -9999,
          visibility: 'hidden',
          width: dimensions.widthDisplay,
          paddingLeft: pageConfig.margin.left, // Padding afeta a quebra de linha do texto no ghost
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

      <div className='absolute inset-0 flex flex-col items-center overflow-auto scroll-smooth px-8 py-12 print:overflow-visible'>
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            display: 'flex',
            flexDirection: 'column',
          }}>
          <div ref={contentRef}>
            {pagesHTML.map((htmlContent, index) => (
              <div
                key={index}
                className='print-page bg-white transition-colors duration-300'
                style={getPageStyle}
                data-page-number={index + 1}>
                <div className='prose max-w-none wrap-break-word' style={typographyStyles}>
                  <PreviewStyle theme={theme} />
                  <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                </div>

                <div
                  className='pointer-events-none absolute right-4 bottom-2 font-sans text-[10px] opacity-40 print:hidden'
                  style={{ color: theme.textColor }}>
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Barra de Status */}
      <div className='pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center justify-center gap-3 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-xs font-medium text-slate-600 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-300 print:hidden'>
        <div className='flex items-center gap-1.5'>
          <Ruler className='h-3.5 w-3.5 opacity-70' />
          <span>
            {pageConfig.size === 'custom' ? 'Custom' : pageConfig.size.toUpperCase()}
            <span className='mx-1 opacity-50'>•</span>
            {dimensions.widthDisplay} × {dimensions.heightDisplay}
          </span>
        </div>
        <div className='h-3 w-px bg-slate-300 dark:bg-slate-700' />
        <span>
          {isCalculating ? (
            <span className='flex items-center gap-1'>
              <Loader2 className='h-3 w-3 animate-spin' /> Calc...
            </span>
          ) : (
            `${pagesHTML.length} ${pagesHTML.length === 1 ? 'Página' : 'Páginas'}`
          )}
        </span>
        <div className='h-3 w-px bg-slate-300 dark:bg-slate-700' />
        <span>{Math.round(zoom * 100)}%</span>
      </div>
    </div>
  )
}
