'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { AlertCircle, BarChart3, Copy, Loader2, Maximize2 } from 'lucide-react'
import mermaid from 'mermaid'
import { useEffect, useId, useRef, useState } from 'react'
import { toast } from 'sonner'

interface MermaidDiagramProps {
  chart: string
  className?: string
}

if (typeof window !== 'undefined') {
  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    securityLevel: 'loose',
    fontFamily: 'inherit',
    themeVariables: {
      // Cores principais com alto contraste
      primaryColor: '#e0e7ff', // Indigo 100 (fundo claro)
      primaryTextColor: '#1e1b4b', // Indigo 950 (texto escuro)
      primaryBorderColor: '#6366f1', // Indigo 500 (borda vibrante)

      // Linhas e conectores
      lineColor: '#475569', // Slate 600 (linhas visíveis)

      // Cores secundárias
      secondaryColor: '#f1f5f9', // Slate 100 (fundo claro)
      tertiaryColor: '#ffffff', // Branco puro

      // Texto
      textColor: '#0f172a', // Slate 950 (texto principal)
      fontSize: '14px',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',

      // Melhorias adicionais
      nodeBorder: '#6366f1',
      mainBkg: '#f8fafc', // Slate 50 (fundo muito claro)
      clusterBkg: '#f1f5f9',
      clusterBorder: '#cbd5e1',
      edgeLabelBackground: '#ffffff',
    },
  })
}

export function MermaidDiagram({ chart, className }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [isRendering, setIsRendering] = useState(false)

  const uniqueId = useId().replace(/:/g, '')

  useEffect(() => {
    let isMounted = true

    const renderDiagram = async () => {
      if (!chart.trim()) {
        setSvg('')
        setError('')
        return
      }

      setIsRendering(true)
      try {
        const { svg: renderedSvg } = await mermaid.render(`mermaid-svg-${uniqueId}`, chart)

        if (isMounted) {
          let responsiveSvg = renderedSvg
            .replace(/width=".*?"/, 'width="100%"')
            .replace(/height=".*?"/, '')
            .replace(/style="max-width:.*?"/, 'style="max-width: 100%; height: auto;"')

          responsiveSvg = responsiveSvg.replace(
            /<svg/,
            '<svg style="max-height: 700px; width: 100%; height: auto;"',
          )

          setSvg(responsiveSvg)
          setError('')
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Erro de sintaxe no diagrama')
        }
      } finally {
        if (isMounted) setIsRendering(false)
      }
    }

    renderDiagram()

    return () => {
      isMounted = false
    }
  }, [chart, uniqueId])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(chart)
      toast.success('Código do diagrama copiado!')
    } catch {
      toast.error('Erro ao copiar código')
    }
  }

  const handleFullscreen = () => {
    if (containerRef.current) {
      containerRef.current.requestFullscreen?.()
    }
  }

  if (error) {
    return (
      <div className='my-4 overflow-hidden rounded-lg border border-red-300 bg-white shadow-sm'>
        <div className='border-b border-red-200 bg-red-50 px-3 py-2'>
          <div className='flex items-center gap-2'>
            <div className='flex h-7 w-7 items-center justify-center rounded-lg bg-red-600 shadow-sm'>
              <AlertCircle className='h-4 w-4 text-white' />
            </div>
            <div className='flex flex-col'>
              <span className='text-xs font-bold text-red-950'>Erro no Diagrama</span>
              <span className='text-[10px] font-medium text-red-800'>
                Sintaxe inválida detectada
              </span>
            </div>
          </div>
        </div>
        <div className='p-3'>
          <pre className='overflow-x-auto rounded-lg border border-red-100 bg-red-50/30 p-2 font-mono text-[11px] leading-relaxed text-red-900 shadow-inner'>
            {error}
          </pre>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'group relative my-4 flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-md transition-all hover:shadow-lg',
        className,
      )}>
      {/* Header com Contraste Elevado */}
      <div className='flex items-center justify-between border-b border-indigo-100 bg-slate-50 px-3 py-2'>
        <div className='flex items-center gap-2'>
          <div className='flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 shadow-sm'>
            <BarChart3 className='h-3.5 w-3.5 text-white' />
          </div>
          <span className='text-xs font-bold text-slate-900'>Diagrama Mermaid</span>
        </div>

        <div className='flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
          <Button
            variant='ghost'
            size='icon'
            onClick={handleCopy}
            className='h-7 w-7 text-slate-600 hover:bg-indigo-100 hover:text-indigo-700'
            title='Copiar código'>
            <Copy className='h-3.5 w-3.5' />
          </Button>
          <Button
            variant='ghost'
            size='icon'
            onClick={handleFullscreen}
            className='h-7 w-7 text-slate-600 hover:bg-indigo-100 hover:text-indigo-700'
            title='Tela cheia'>
            <Maximize2 className='h-3.5 w-3.5' />
          </Button>
        </div>
      </div>

      {/* Área do Diagrama */}
      <div className='relative flex min-h-[150px] items-center justify-center p-4 transition-all'>
        {isRendering && (
          <div className='absolute inset-0 z-10 flex items-center justify-center bg-white/90 backdrop-blur-[2px]'>
            <div className='flex items-center gap-2'>
              <Loader2 className='h-5 w-5 animate-spin text-indigo-600' />
              <span className='text-xs font-bold text-slate-900'>Renderizando...</span>
            </div>
          </div>
        )}

        {/* Pattern de fundo mais visível (Slate 200) */}
        <div
          className='pointer-events-none absolute inset-0 opacity-[0.05]'
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #334155 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        {svg ? (
          <div
            ref={containerRef}
            className='animate-in fade-in zoom-in-95 relative z-10 w-full duration-700 [&_svg]:border-0 [&_svg]:outline-0'
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : (
          !isRendering && (
            <div className='flex flex-col items-center gap-2 text-slate-500'>
              <BarChart3 className='h-8 w-8 opacity-20' />
              <span className='text-xs font-bold tracking-wider uppercase'>Vazio</span>
            </div>
          )
        )}
      </div>

      {/* Footer com contraste para leitura de metadados */}
      <div className='flex items-center justify-center border-t border-slate-100 bg-slate-50/80 px-3 py-1.5'>
        <span className='text-[10px] font-bold tracking-tight text-slate-600'>Mermaid Diagram</span>
      </div>
    </div>
  )
}
