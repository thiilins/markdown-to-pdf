'use client'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { ChevronRight, Hash, ListTree, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

interface TOCItem {
  level: number
  title: string
  anchor: string
  line: number
}

interface InteractiveTOCProps {
  markdown: string
  position?: 'left' | 'right'
  onNavigate?: (anchor: string) => void
  className?: string
}

export function InteractiveTOC({
  markdown,
  position = 'left',
  onNavigate,
  className,
}: InteractiveTOCProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [activeAnchor, setActiveAnchor] = useState<string>('')

  const tocItems = useMemo<TOCItem[]>(() => {
    if (!markdown) return []
    const lines = markdown.split('\n')
    const items: TOCItem[] = []

    lines.forEach((line, index) => {
      const match = line.match(/^(#{1,6})\s+(.+)/)
      if (match) {
        const level = match[1].length
        const title = match[2].trim()
        const anchor = title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
        items.push({ level, title, anchor, line: index + 1 })
      }
    })
    return items
  }, [markdown])

  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll(
        '[data-pdf-content] h1, [data-pdf-content] h2, [data-pdf-content] h3, [data-pdf-content] h4, [data-pdf-content] h5, [data-pdf-content] h6',
      )

      let currentAnchor = ''
      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect()
        if (rect.top <= 140) currentAnchor = heading.id
      })
      setActiveAnchor(currentAnchor)
    }

    const scrollContainer = document.querySelector('[data-pdf-content]')?.parentElement
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true })
      handleScroll()
      return () => scrollContainer.removeEventListener('scroll', handleScroll)
    }
  }, [tocItems])

  const handleClick = (anchor: string) => {
    const element = document.getElementById(anchor)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveAnchor(anchor)
      onNavigate?.(anchor)
    }
  }

  if (tocItems.length === 0) return null

  return (
    <div
      className={cn(
        'absolute top-6 z-40 transition-all duration-500 ease-in-out',
        position === 'right' ? 'right-6' : 'left-6',
        isOpen ? 'w-80' : 'w-[48px]', // Largura fixa no estado fechado para evitar o oval
        className,
      )}>
      <div
        className={cn(
          'flex flex-col overflow-hidden border border-slate-200/60 bg-white/80 shadow-xl backdrop-blur-xl transition-all duration-500',
          // Usamos um raio de borda grande constante para evitar a transição deformada
          'rounded-[24px]',
          isOpen ? 'max-h-[calc(100vh-12rem)]' : 'max-h-[48px]',
          position === 'right' ? 'items-end' : 'items-start',
        )}>
        {/* Header Control - Altura fixa para garantir o círculo perfeito quando fechado */}
        <div
          className={cn(
            'flex h-[48px] w-full shrink-0 items-center transition-colors duration-300',
            isOpen
              ? 'justify-between border-b border-slate-100 bg-slate-50/50 px-4'
              : 'justify-center px-0',
          )}>
          {isOpen && (
            <div className='animate-in fade-in flex items-center gap-3 whitespace-nowrap duration-500'>
              <div className='bg-primary flex h-6 w-6 items-center justify-center rounded-lg text-white shadow-sm'>
                <ListTree className='h-3.5 w-3.5' />
              </div>
              <span className='text-[13px] font-bold tracking-tight text-slate-800'>Sumário</span>
            </div>
          )}

          <Button
            variant='ghost'
            size='icon'
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              'h-8 w-8 shrink-0 rounded-full transition-all duration-300',
              !isOpen && 'hover:bg-primary/10 text-primary',
            )}>
            {isOpen ? <X className='h-4 w-4' /> : <ListTree className='h-5 w-5' />}
          </Button>
        </div>

        {/* Content List */}
        <div
          className={cn(
            'w-full flex-1 transition-opacity duration-300',
            isOpen ? 'visible opacity-100' : 'invisible h-0 opacity-0',
          )}>
          <ScrollArea className='h-[500px] max-h-[60vh] px-4 py-4'>
            <nav className='relative space-y-1 pr-2'>
              <div className='absolute top-0 bottom-0 left-[18px] w-px bg-slate-100' />

              {tocItems.map((item, index) => {
                const isActive = activeAnchor === item.anchor
                return (
                  <button
                    key={`${item.anchor}-${index}`}
                    onClick={() => handleClick(item.anchor)}
                    className={cn(
                      'group relative flex w-full cursor-pointer items-start gap-3 rounded-xl px-3 py-2 text-left whitespace-nowrap transition-all',
                      isActive ? 'bg-primary/5 text-primary' : 'text-slate-500 hover:bg-slate-50',
                    )}
                    style={{ paddingLeft: `${(item.level - 1) * 16 + 12}px` }}>
                    {isActive && (
                      <div className='bg-primary animate-in fade-in absolute top-2 bottom-2 left-0 w-0.5 rounded-full duration-500' />
                    )}
                    <div className='mt-1 flex h-4 w-4 shrink-0 items-center justify-center'>
                      {item.level === 1 ? (
                        <Hash className={cn('h-3 w-3 opacity-30', isActive && 'opacity-100')} />
                      ) : (
                        <ChevronRight
                          className={cn(
                            'h-3 w-3 transition-transform',
                            isActive ? 'rotate-90' : 'opacity-0',
                          )}
                        />
                      )}
                    </div>
                    <span
                      className={cn(
                        'truncate text-[12.5px] transition-colors',
                        isActive ? 'font-bold' : 'font-medium',
                      )}>
                      {item.title}
                    </span>
                  </button>
                )
              })}
            </nav>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
