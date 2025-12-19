'use client'
import { PreviewPanelWithPages } from '@/components/preview-panel/with-pages'
import { useConfig } from '@/shared/contexts/configContext'
import { PrintStyle } from '@/shared/styles/print-styles'

import { FloatingPanel } from '@/components/custom-ui/floating-components'
import { ActionToolbar } from '@/components/layout-components/action-toolbar'
import { MarkdownEditor } from '@/components/markdown-editor/editor'
import { cn } from '@/lib/utils'
import { useMDToPdf } from '@/shared/contexts/mdToPdfContext'
export const MDToPdfViewComponent = () => {
  const { config } = useConfig()
  const { markdown, setMarkdown } = useMDToPdf()

  return (
    <div className='flex min-h-0 flex-1'>
      {/* Editor */}
      <div id='md-pdf-editor' className={cn('flex h-full w-[50%] flex-col border-r')}>
        <div className='min-h-0 flex-1'>
          <MarkdownEditor
            value={markdown}
            onChange={(value) => setMarkdown(value || '')}
            config={config.editor}
          />
        </div>
      </div>
      {/* Preview */}
      <div id='md-pdf-preview' className={cn('flex h-full w-[50%] flex-col')}>
        <div className='min-h-0 flex-1'>
          <PreviewPanelWithPages />
        </div>
      </div>
      {/* Print Style */}
      <PrintStyle config={config} />
      {/* Fonts */}
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
      <FloatingPanel width='w-auto' height='h-auto' storageKey='md-pdf-floating-bar'>
        <ActionToolbar zoom printExport />
      </FloatingPanel>
    </div>
  )
}
