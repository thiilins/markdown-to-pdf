'use client'
import { PreviewPanelWithPages } from '@/components/preview-panel/with-pages'
import { useConfig } from '@/shared/contexts/configContext'
import { PrintStyle } from '@/shared/styles/print-styles'

import { MarkdownEditor } from '@/components/markdown-editor/editor'
import { cn } from '@/lib/utils'
import { useHeaderFooter } from '@/shared/contexts/headerFooterContext'
import { useMDToPdf } from '@/shared/contexts/mdToPdfContext'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef } from 'react'
import { ActionToolbar } from './action-toolbar'

/**
 * Componente que carrega conteúdo da URL (integração com Web to Markdown)
 * Precisa estar em um componente separado para usar Suspense
 */
const ContentLoader = () => {
  const { setMarkdown } = useMDToPdf()
  const searchParams = useSearchParams()

  useEffect(() => {
    const contentParam = searchParams.get('content')
    if (contentParam) {
      try {
        const decoded = decodeURIComponent(atob(contentParam))
        setMarkdown(decoded)
        // Remove o parâmetro da URL após carregar
        const url = new URL(window.location.href)
        url.searchParams.delete('content')
        window.history.replaceState({}, '', url.toString())
      } catch (error) {
        console.error('Erro ao decodificar conteúdo da URL:', error)
      }
    }
  }, [searchParams, setMarkdown])

  return null
}

export const MDToPdfViewComponent = () => {
  const { config } = useConfig()
  const { markdown, setMarkdown, onResetMarkdown } = useMDToPdf()
  const { handleOnResetEditorData } = useHeaderFooter()

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
      <Suspense fallback={null}>
        <ContentLoader />
      </Suspense>
      <div id='md-pdf-editor' className={cn('flex h-full w-[50%] flex-col border-r')}>
        <div className='min-h-0 flex-1'>
          <MarkdownEditor
            value={markdown}
            onChange={(value) => setMarkdown(value || '')}
            onScroll={handleEditorScroll} // Passa o handler para o Monaco
            config={config.editor}
            onResetEditorData={handleOnResetEditorData}
            onResetMarkdown={onResetMarkdown}
          />
        </div>
      </div>

      <div id='md-pdf-preview' className={cn('flex h-full w-[50%] flex-col')}>
        <ActionToolbar zoom printExport />
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
    </div>
  )
}
