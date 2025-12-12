'use client'

import { cn } from '@/lib/utils'
import type { PageConfig, ThemeConfig, TypographyConfig } from '@/types/config'
import { THEME_PRESETS } from '@/types/config'
import { Loader2, Ruler } from 'lucide-react'
import { useMemo, useState, useEffect, useRef } from 'react'
import ReactMarkdown, { Components } from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import { PreviewStyle } from './preview-style'

// Conversão precisa: 1mm = 3.7795px (96 DPI standard)
const mmToPx = (mm: number) => mm * 3.7795275591

interface PreviewPanelProps {
  markdown: string
  pageConfig: PageConfig
  typographyConfig: TypographyConfig
  themeConfig?: ThemeConfig
  zoom?: number
  contentRef: React.RefObject<HTMLDivElement | null> // Mantido para compatibilidade, mas o controle agora é interno
  className?: string
}

export function PreviewPanel({
  markdown,
  pageConfig,
  typographyConfig,
  themeConfig,
  zoom = 1,
  className,
}: PreviewPanelProps) {
  const theme = themeConfig || THEME_PRESETS.modern

  // Ref para o container "Fantasma" (onde medimos o conteúdo)
  const ghostRef = useRef<HTMLDivElement>(null)

  // Estado que armazena as páginas já fatiadas (Array de strings HTML)
  const [pagesHTML, setPagesHTML] = useState<string[]>([''])
  const [isCalculating, setIsCalculating] = useState(false)

  // 1. Cálculos de Geometria da Página
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
      // Convertemos tudo para PX para a matemática de corte funcionar
      widthPx: unit === 'mm' ? mmToPx(finalW) : finalW,
      heightPx: unit === 'mm' ? mmToPx(finalH) : finalH,
      isLandscape: orientation === 'landscape',
    }
  }, [pageConfig])

  // 2. Estilos CSS (Tipografia e Cores)
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

  // 3. ENGINE DE PAGINAÇÃO (O Coração da Solução)
  useEffect(() => {
    const ghost = ghostRef.current
    if (!ghost) return

    setIsCalculating(true)

    // Pequeno delay para garantir que o React renderizou o Markdown no Ghost
    const timer = setTimeout(() => {
      // Pega todos os blocos de conteúdo (p, h1, div, pre, etc)
      const elements = Array.from(ghost.children) as HTMLElement[]

      // Converte margens configuradas para PX
      const getMarginPx = (val: string) => {
        const num = parseFloat(val)
        return val.includes('mm') ? mmToPx(num) : num
      }

      const marginTop = getMarginPx(pageConfig.margin.top)
      const marginBottom = getMarginPx(pageConfig.margin.bottom)

      // Altura ÚTIL da página (onde o texto pode entrar)
      const contentHeightLimit = dimensions.heightPx - marginTop - marginBottom

      const newPages: string[] = []
      let currentPageAccumulator: string[] = []
      let currentHeight = 0

      for (let i = 0; i < elements.length; i++) {
        const el = elements[i]

        // Medimos a altura total do elemento incluindo margens do CSS (h1 margin, p margin)
        const style = window.getComputedStyle(el)
        const elHeight =
          el.offsetHeight + parseFloat(style.marginTop) + parseFloat(style.marginBottom)

        // Verifica quebra de página forçada
        const forceBreak = el.classList.contains('page-break') || el.querySelector('.page-break')

        // LÓGICA DE CORTE:
        // Se (AlturaAtual + Elemento > Limite) OU (Quebra Forçada)
        if ((currentHeight + elHeight > contentHeightLimit && currentHeight > 0) || forceBreak) {
          // 1. Fecha a página atual
          newPages.push(currentPageAccumulator.join(''))

          // 2. Inicia nova página com o elemento atual
          // Se for apenas uma quebra forçada vazia (<div class="page-break"></div>), ignoramos no inicio da proxima
          if (!forceBreak || el.innerText.trim().length > 0) {
            currentPageAccumulator = [el.outerHTML]
            currentHeight = elHeight
          } else {
            currentPageAccumulator = []
            currentHeight = 0
          }
        } else {
          // Cabe na página, adiciona
          currentPageAccumulator.push(el.outerHTML)
          currentHeight += elHeight
        }
      }

      // Adiciona o que sobrou na última página
      if (currentPageAccumulator.length > 0) {
        newPages.push(currentPageAccumulator.join(''))
      }

      // Garante pelo menos uma folha em branco se não tiver nada
      if (newPages.length === 0) newPages.push('')

      setPagesHTML(newPages)
      setIsCalculating(false)
    }, 50) // 50ms é suficiente para o DOM renderizar

    return () => clearTimeout(timer)
  }, [markdown, dimensions, pageConfig.margin, typographyConfig])

  // Estilo Real de CADA Página
  const getPageStyle = useMemo(
    () => ({
      width: dimensions.widthDisplay,
      height: dimensions.heightDisplay,
      // Margens INTERNAS do papel
      paddingTop: pageConfig.margin.top,
      paddingRight: pageConfig.margin.right,
      paddingBottom: pageConfig.margin.bottom,
      paddingLeft: pageConfig.margin.left,
      // Cores Reais do Usuário
      backgroundColor: theme.background,
      color: theme.textColor,
      // Visual
      marginBottom: '2rem', // Espaço físico entre papéis
      position: 'relative' as const,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      overflow: 'hidden', // Segurança para nada vazar borda afora
    }),
    [dimensions, pageConfig.margin, theme],
  )

  const markdownComponents: Components = useMemo(
    () => ({
      img: ({ node, ...props }) => (
        <img {...props} style={{ maxWidth: '100%', height: 'auto' }} alt={props.alt || ''} />
      ),
      div: ({ node, className, ...props }) => {
        // Preserva a classe page-break para o nosso calculador detectar
        if (className === 'page-break')
          return <div className='page-break my-2 h-px w-full' {...props} />
        return <div className={className} {...props} />
      },
    }),
    [],
  )

  return (
    <div className={cn('relative h-full w-full bg-slate-200/90 dark:bg-slate-950', className)}>
      {/* ----------------------------------------------------------- */}
      {/* GHOST RENDER (INVISÍVEL) - AQUI ONDE A MÁGICA ACONTECE */}
      {/* Renderizamos tudo aqui primeiro para medir os tamanhos */}
      {/* ----------------------------------------------------------- */}
      <div
        aria-hidden='true'
        className='prose max-w-none'
        style={{
          position: 'absolute',
          top: -9999,
          left: -9999,
          visibility: 'hidden',
          // CRÍTICO: Largura tem que ser idêntica à real para quebra de linha bater
          width: dimensions.widthDisplay,
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

      {/* ----------------------------------------------------------- */}
      {/* VIEWPORT REAL (SCROLLABLE) */}
      {/* ----------------------------------------------------------- */}
      <div className='absolute inset-0 flex flex-col items-center overflow-auto scroll-smooth px-8 py-12 print:overflow-visible'>
        {/* Container de Zoom */}
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            display: 'flex',
            flexDirection: 'column',
          }}>
          {isCalculating && pagesHTML.length <= 1 && (
            <div className='absolute top-0 left-full ml-4 flex items-center gap-2 whitespace-nowrap text-slate-500'>
              <Loader2 className='h-4 w-4 animate-spin' /> Diagramando...
            </div>
          )}

          {/* RENDERIZAÇÃO DAS PÁGINAS FÍSICAS */}
          {pagesHTML.map((htmlContent, index) => (
            <div
              key={index}
              className='print-page bg-white transition-colors duration-300'
              style={getPageStyle}
              data-page-number={index + 1}>
              {/* Wrapper do Conteúdo com Tipografia */}
              <div className='prose max-w-none break-words' style={typographyStyles}>
                <PreviewStyle theme={theme} />
                {/* Injeta o HTML pré-fatiado desta página */}
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
              </div>

              {/* Rodapé da Página (Número) - Opcional, remove se não quiser */}
              <div
                className='pointer-events-none absolute right-4 bottom-2 font-sans text-[10px] opacity-40'
                style={{ color: theme.textColor }}>
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BARRA DE STATUS */}
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
          {pagesHTML.length} {pagesHTML.length === 1 ? 'Página' : 'Páginas'}
        </span>
        <div className='h-3 w-px bg-slate-300 dark:bg-slate-700' />
        <span>{Math.round(zoom * 100)}%</span>
      </div>
    </div>
  )
}
