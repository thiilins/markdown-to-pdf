'use client'
import { useConfig } from '@/shared/contexts/configContext'
import { PrintStyle } from '@/shared/styles/print-styles'
import { MDToPdfEditor } from './editor'
import { MDToPdfPreview } from './preview'

export const MDToPdfViewComponent = () => {
  const { config } = useConfig()
  return (
    <div className='flex min-h-0 flex-1'>
      <MDToPdfEditor /> {/* Editor */}
      <MDToPdfPreview /> {/* Preview */}
      <PrintStyle config={config} />
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
