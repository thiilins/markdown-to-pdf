'use client'

import { useSidebar } from '@/components/custom-ui/sidebar'
import { useApp } from '@/shared/contexts/appContext'
import { HeaderTools } from '@/shared/layouts/tools/header'
import { GistPrintStyle } from '@/shared/styles/gist-print-style'
import { useCallback } from 'react'
import { GistPreview } from './gist-preview'
import {} from './gist-sidebar'

export const GistExplorerViewComponent = () => {
  const { config } = useApp()
  const { open, setOpen, openMobile, setOpenMobile } = useSidebar()
  const handleOpenSidebar = useCallback(
    (open: boolean) => {
      setOpen(open)
      setOpenMobile(open)
    },
    [setOpen, setOpenMobile],
  )

  return (
    <div className='bg-background relative flex h-full w-full flex-col overflow-hidden'>
      <div className='pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-20 dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]' />
      <HeaderTools
        openMobileMenu={open}
        setIsMobileMenuOpen={handleOpenSidebar}
        title='Gist Explorer'
      />
      <div className='relative z-10 flex h-full w-full flex-1 overflow-hidden'>
        <main className='bg-background/50 flex h-full min-w-0 flex-1 flex-col overflow-hidden'>
          <GistPreview />
        </main>
      </div>
      <GistPrintStyle config={config} />
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
