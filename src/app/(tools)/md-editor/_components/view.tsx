'use client'

import { MarkdownEditor } from '@/components/markdown-editor/editor'
import { PreviewPanelNoPages } from '@/components/preview-panel/no-pages'
import { cn } from '@/lib/utils'
import { useApp } from '@/shared/contexts/appContext'
import { useMarkdown } from '@/shared/contexts/markdownContext'
import { PrintStyle } from '@/shared/styles/print-styles'
import { useRef } from 'react'
import { ActionToolbar } from '../../_components/action-toolbar'

export const MDEditorViewComponent = () => {
  const previewContainerRef = useRef<HTMLDivElement | null>(null)
  const { markdown, onResetMarkdown, onUpdateMarkdown } = useMarkdown()
  const { config } = useApp()
  const handleEditorScroll = (percentage: number) => {
    if (previewContainerRef.current) {
      const element = previewContainerRef.current
      const scrollableHeight = element.scrollHeight - element.clientHeight
      element.scrollTop = percentage * scrollableHeight
    }
  }

  return (
    <div className='flex min-h-0 flex-1 flex-col'>
      <div className='flex min-h-0 flex-1'>
        <div id='md-pdf-editor' className={cn('flex h-full w-[50%] flex-col border-r')}>
          <div className='min-h-0 flex-1'>
            <MarkdownEditor onScroll={handleEditorScroll} onResetMarkdown={onResetMarkdown} />
          </div>
        </div>
        <div id='md-pdf-preview' className={cn('flex h-full w-[50%] flex-col')}>
          <ActionToolbar />
          <div className='min-h-0 flex-1'>
            <PreviewPanelNoPages
              ref={previewContainerRef}
              customConfig={{
                pageConfig: {
                  size: 'a4',
                  width: '210mm',
                  height: '297mm',
                  orientation: 'portrait',
                  padding: '10mm',
                  margin: {
                    top: '10mm',
                    right: '10mm',
                    bottom: '10mm',
                    left: '10mm',
                  },
                },
              }}
            />
          </div>
        </div>
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
    </div>
  )
}
