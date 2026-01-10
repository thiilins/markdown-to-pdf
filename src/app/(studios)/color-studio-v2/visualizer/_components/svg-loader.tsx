'use client'

import chroma from 'chroma-js'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export interface SVGTemplate {
  id: string
  name: string
  category: 'interface' | 'branding' | 'typo' | 'pattern' | 'illustration'
  svgContent: string
}

interface SVGRendererProps {
  template: SVGTemplate
  onHover: (color: string | null, x?: number, y?: number) => void
  onCopy: (color: string) => void
}

/**
 * Componente que renderiza SVGs do Coolors com interatividade total.
 * - Lê SVGs da pasta /public/assets/svg/visualizer/
 * - Injeta handlers de mouse em todos os elementos com class="stX"
 * - Captura cor via getComputedStyle (CSS Variables)
 * - ✅ Tooltip APENAS dentro das formas SVG (não em áreas vazias)
 */
export function SVGRenderer({ template, onHover, onCopy }: SVGRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const svgElement = container.querySelector('svg')
    if (!svgElement) return

    // ✅ Aplica estilos de centralização e object-fit no SVG
    svgElement.style.maxWidth = '100%'
    svgElement.style.maxHeight = '100%'
    svgElement.style.width = 'auto'
    svgElement.style.height = 'auto'
    svgElement.style.display = 'block'
    svgElement.style.margin = 'auto'

    // ✅ Listener global para garantir que tooltip desapareça ao sair do SVG
    const handleSVGMouseLeave = () => {
      onHover(null)
    }

    svgElement.addEventListener('mouseleave', handleSVGMouseLeave)

    // Seleciona TODOS os elementos com classes que usam CSS Variables
    const interactiveElements = svgElement.querySelectorAll('[class*="st"]')

    const listeners: Array<{
      element: Element
      handlers: {
        enter: (e: Event) => void
        move: (e: Event) => void
        leave: (e: Event) => void
        click: (e: Event) => void
      }
    }> = []

    interactiveElements.forEach((element) => {
      // Mouse Enter: Mostra tooltip se tiver cor válida
      const handleMouseEnter = (e: Event) => {
        const mouseEvent = e as unknown as MouseEvent
        const computedStyle = window.getComputedStyle(element)
        const fill = computedStyle.fill

        // ✅ Só mostra tooltip e muda cursor se tiver cor válida
        if (fill && fill !== 'none' && !fill.includes('rgba(0, 0, 0, 0)') && chroma.valid(fill)) {
          ;(element as HTMLElement).style.cursor = 'crosshair'
          const hex = chroma(fill).hex().toUpperCase()
          onHover(hex, mouseEvent.clientX, mouseEvent.clientY)
        }
      }

      // Mouse Move: Atualiza posição do tooltip
      const handleMouseMove = (e: Event) => {
        const mouseEvent = e as unknown as MouseEvent
        const computedStyle = window.getComputedStyle(element)
        const fill = computedStyle.fill

        // ✅ Atualiza posição apenas se tiver cor válida
        if (fill && fill !== 'none' && !fill.includes('rgba(0, 0, 0, 0)') && chroma.valid(fill)) {
          const hex = chroma(fill).hex().toUpperCase()
          onHover(hex, mouseEvent.clientX, mouseEvent.clientY)
        }
      }

      // Mouse Leave: Remove tooltip IMEDIATAMENTE
      const handleMouseLeave = () => {
        ;(element as HTMLElement).style.cursor = 'default'
        onHover(null)
      }

      // Click: Copia cor
      const handleClick = (e: Event) => {
        const mouseEvent = e as unknown as MouseEvent
        mouseEvent.stopPropagation()
        const computedStyle = window.getComputedStyle(element)
        const fill = computedStyle.fill

        if (fill && fill !== 'none' && !fill.includes('rgba(0, 0, 0, 0)') && chroma.valid(fill)) {
          const hex = chroma(fill).hex().toUpperCase()
          onCopy(hex)
        }
      }

      // Adiciona listeners
      element.addEventListener('mouseenter', handleMouseEnter)
      element.addEventListener('mousemove', handleMouseMove)
      element.addEventListener('mouseleave', handleMouseLeave)
      element.addEventListener('click', handleClick)

      // Guarda referência para cleanup
      listeners.push({
        element,
        handlers: {
          enter: handleMouseEnter,
          move: handleMouseMove,
          leave: handleMouseLeave,
          click: handleClick,
        },
      })
    })

    // Cleanup: Remove TODOS os listeners
    return () => {
      svgElement.removeEventListener('mouseleave', handleSVGMouseLeave)

      listeners.forEach(({ element, handlers }) => {
        element.removeEventListener('mouseenter', handlers.enter)
        element.removeEventListener('mousemove', handlers.move)
        element.removeEventListener('mouseleave', handlers.leave)
        element.removeEventListener('click', handlers.click)
      })
    }
  }, [template.svgContent, onHover, onCopy])

  return (
    <div
      ref={containerRef}
      className='flex h-full w-full items-center justify-center'
      dangerouslySetInnerHTML={{ __html: template.svgContent }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    />
  )
}

/**
 * Hook para carregar todos os SVGs da pasta /public/assets/svg/visualizer/
 */
export function useSVGTemplates(): { templates: SVGTemplate[]; isLoading: boolean } {
  const [templates, setTemplates] = useState<SVGTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadSVGs() {
      try {
        // Lista de SVGs (pode ser gerado dinamicamente com fs no build time)
        const svgFiles = [
          'ui-ux-1.svg',
          'ui-ux-2.svg',
          'branding-1.svg',
          'branding-2.svg',
          'typo-1.svg',
          'typo-2.svg',
          'pattern-1.svg',
          'illustration.svg',
        ]

        const loadedTemplates: SVGTemplate[] = []

        for (const filename of svgFiles) {
          try {
            const response = await fetch(`/assets/svg/visualizer/${filename}`)
            if (!response.ok) continue

            const svgContent = await response.text()

            // Categoriza automaticamente pelo prefixo do nome do arquivo
            let category: SVGTemplate['category'] = 'interface'
            if (filename.startsWith('branding')) category = 'branding'
            else if (filename.startsWith('typo')) category = 'typo'
            else if (filename.startsWith('pattern')) category = 'pattern'
            else if (filename.startsWith('illustration')) category = 'illustration'

            // Nome bonito: "ui-ux-1.svg" -> "UI/UX Design 1"
            const name = filename
              .replace('.svg', '')
              .split('-')
              .map((word, i) =>
                i === 0 ? word.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1),
              )
              .join(' ')

            loadedTemplates.push({
              id: filename.replace('.svg', ''),
              name,
              category,
              svgContent,
            })
          } catch (err) {
            console.warn(`Erro ao carregar ${filename}:`, err)
          }
        }

        setTemplates(loadedTemplates)
      } catch (error) {
        console.error('Erro ao carregar SVGs:', error)
        toast.error('Erro ao carregar templates')
      } finally {
        setIsLoading(false)
      }
    }

    loadSVGs()
  }, [])

  return { templates, isLoading }
}
