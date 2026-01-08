'use client'

import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

interface MermaidDiagramProps {
  chart: string
  className?: string
}

// Inicializa o Mermaid apenas uma vez
let mermaidInitialized = false

export function MermaidDiagram({ chart, className }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (!mermaidInitialized) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
        fontFamily: 'var(--font-sans)',
      })
      mermaidInitialized = true
    }
  }, [])

  useEffect(() => {
    const renderDiagram = async () => {
      if (!chart.trim()) {
        setSvg('')
        setError('')
        return
      }

      try {
        // Gera um ID único para cada diagrama
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`

        // Renderiza o diagrama
        const { svg: renderedSvg } = await mermaid.render(id, chart)

        setSvg(renderedSvg)
        setError('')
      } catch (err: any) {
        console.error('Erro ao renderizar Mermaid:', err)
        setError(err.message || 'Erro ao renderizar diagrama')
        setSvg('')
      }
    }

    renderDiagram()
  }, [chart])

  if (error) {
    return (
      <div className='my-4 rounded-lg border border-red-200 bg-red-50 p-4'>
        <div className='flex items-start gap-2'>
          <svg
            className='h-5 w-5 shrink-0 text-red-500'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <div className='flex-1'>
            <h4 className='text-sm font-semibold text-red-800'>Erro no diagrama Mermaid</h4>
            <p className='mt-1 text-xs text-red-600'>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!svg) {
    return (
      <div className='my-4 flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-8'>
        <div className='flex items-center gap-2 text-slate-500'>
          <svg className='h-5 w-5 animate-spin' viewBox='0 0 24 24'>
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
              fill='none'
            />
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
            />
          </svg>
          <span className='text-sm'>Renderizando diagrama...</span>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={className}
      dangerouslySetInnerHTML={{ __html: svg }}
      style={{
        display: 'flex',
        justifyContent: 'center',
        margin: '1rem 0',
      }}
    />
  )
}
