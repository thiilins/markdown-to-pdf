'use client'

import { useConfig } from '@/shared/contexts/configContext'
import { GistPrintStyle } from '@/shared/styles/gist-print-style'
import { GistPreview } from './gist-preview'
import { GistSidebar } from './gist-sidebar'

export const GistExplorerViewComponent = () => {
  const { config } = useConfig()
  return (
    <div className='flex min-h-full w-full flex-1 overflow-hidden'>
      <GistSidebar />
      <GistPreview />
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
