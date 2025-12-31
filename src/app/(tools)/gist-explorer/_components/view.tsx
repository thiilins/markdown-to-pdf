'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useApp } from '@/shared/contexts/appContext'
import { GistPrintStyle } from '@/shared/styles/gist-print-style'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { GistPreview } from './gist-preview'
import { GistSidebar } from './gist-sidebar'

export const GistExplorerViewComponent = () => {
  const { config } = useApp()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className='bg-background relative flex h-full w-full flex-col overflow-hidden md:flex-row'>
      {/* Padrão de fundo */}
      <div className='pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-20 dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]' />

      <div className='z-20 flex w-full items-center border-b bg-white/80 px-4 py-2 backdrop-blur-sm md:hidden dark:bg-zinc-950/80'>
        <Button variant='ghost' size='icon' onClick={() => setIsMobileMenuOpen(true)}>
          <Menu className='h-5 w-5' />
        </Button>
        <span className='ml-2 text-sm font-medium'>Explorer</span>
      </div>

      {/* CONTAINER PRINCIPAL */}
      <div className='relative z-10 flex h-full w-full flex-1 overflow-hidden'>
        {/* SIDEBAR
            - Mobile: Fixed (flutua por cima)
            - Desktop: Relative (ocupa espaço e empurra o conteúdo)
            - shrink-0: Impede a sidebar de ser esmagada
        */}
        <aside
          className={cn(
            'bg-background fixed inset-y-0 left-0 z-50 h-full w-[80%] max-w-[400px] shrink-0 border-r transition-transform duration-300 ease-in-out',
            // Comportamento Desktop:
            'md:relative md:inset-y-auto md:left-auto md:h-auto md:w-[400px] md:max-w-[400px] md:translate-x-0 md:shadow-none',
            // Comportamento Mobile (Estado):
            isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full',
          )}>
          {/* Botão Fechar (Mobile) */}
          <div className='flex justify-end p-2 md:hidden'>
            <Button variant='ghost' size='icon' onClick={() => setIsMobileMenuOpen(false)}>
              <X className='h-5 w-5' />
            </Button>
          </div>

          <GistSidebar />
        </aside>

        {/* OVERLAY MOBILE */}
        {isMobileMenuOpen && (
          <div
            className='fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden'
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* ÁREA DE CONTEÚDO / PREVIEW
            - flex-1: Ocupa o espaço restante
            - min-w-0: CRUCIAL! Impede que o conteúdo force a largura e passe por baixo da sidebar
        */}
        <main className='bg-background/50 flex h-full min-w-0 flex-1 flex-col overflow-hidden'>
          <GistPreview />
        </main>
      </div>

      <GistPrintStyle config={config} />

      {/* Fontes */}
      <link
        rel='stylesheet'
        href={`https://fonts.googleapis.com/css2?${[
          ...new Set([
            config.typography.headings,
            config.typography.body,
            config.typography.code,
            config.typography.quote,
          ]),
        ]
          .map((font) => `family=${font.replace(/\s+/g, '+')}:wght@400;500;600;700`)
          .join('&')}&display=swap`}
      />
    </div>
  )
}
