'use client'
import { PreviewPanelWithPages } from '@/components/preview-panel/with-pages'
import { useConfig } from '@/shared/contexts/configContext'
import { PrintStyle } from '@/shared/styles/print-styles'

import { FloatingPanel } from '@/components/custom-ui/floating-components'
import { ActionToolbar } from '@/components/layout-components/action-toolbar'
import { MarkdownEditor } from '@/components/markdown-editor/editor'
import { cn } from '@/lib/utils'
import { useMDToPdf } from '@/shared/contexts/mdToPdfContext'
import { useRef } from 'react' // Importado useRef

export const MDToPdfViewComponent = () => {
  const { config } = useConfig()
  const { markdown, setMarkdown } = useMDToPdf()

  // Referência para o contêiner de scroll do preview
  const previewContainerRef = useRef<HTMLDivElement>(null)

  // Função que sincroniza o scroll do preview com base na porcentagem do editor
  const handleEditorScroll = (percentage: number) => {
    if (previewContainerRef.current) {
      const element = previewContainerRef.current
      const scrollableHeight = element.scrollHeight - element.clientHeight
      element.scrollTop = percentage * scrollableHeight
    }
  }

  return (
    <div className='flex min-h-0 flex-1'>
      <div id='md-pdf-editor' className={cn('flex h-full w-[50%] flex-col border-r')}>
        <div className='min-h-0 flex-1'>
          <MarkdownEditor
            value={markdown}
            onChange={(value) => setMarkdown(value || '')}
            onScroll={handleEditorScroll} // Passa o handler para o Monaco
            config={config.editor}
          />
        </div>
      </div>
      {/* Importante: A ref deve ser colocada no elemento que possui o 'overflow-y-auto'.
         Se o PreviewPanelWithPages tiver o scroll interno, passamos a ref para ele.
      */}
      <div id='md-pdf-preview' className={cn('flex h-full w-[50%] flex-col')}>
        <div className='min-h-0 flex-1'>
          <PreviewPanelWithPages ref={previewContainerRef} />
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

      <FloatingPanel width='w-auto' height='h-auto' storageKey='md-pdf-floating-bar'>
        <ActionToolbar zoom printExport />
      </FloatingPanel>
    </div>
  )
}
