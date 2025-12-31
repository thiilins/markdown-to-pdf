'use client'

import { Button } from '@/components/ui/button' // Assumindo shadcn
import { cn } from '@/lib/utils'
import { useApp } from '@/shared/contexts/appContext'
import { useHeaderFooter } from '@/shared/contexts/headerFooterContext'
import { useMarkdown } from '@/shared/contexts/markdownContext'
import { PrintStyle } from '@/shared/styles/print-styles'
import { Code2, Eye } from 'lucide-react'
import { useRef, useState } from 'react'
import { ActionToolbar } from '../../_components/action-toolbar'
import { EditorComponent } from './editor'
import { PreviewPanelWithPages } from './preview'

export const MDToPdfViewComponent = () => {
  const { onResetMarkdown } = useMarkdown()
  const { config } = useApp()
  // Nota: handleOnResetEditorData e onResetHeaderFooter não estavam sendo usados no JSX original,
  // mas mantive o hook caso precise no futuro.
  const {} = useHeaderFooter()
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor')

  const previewContainerRef = useRef<HTMLDivElement>(null)

  // Função que sincroniza o scroll do preview
  const handleEditorScroll = (percentage: number) => {
    if (previewContainerRef.current) {
      const element = previewContainerRef.current
      const scrollableHeight = element.scrollHeight - element.clientHeight
      element.scrollTop = percentage * scrollableHeight
    }
  }

  return (
    <div className='bg-background flex h-full w-full flex-col overflow-hidden'>
      <div className='flex items-center border-b p-1 md:hidden'>
        <Button
          variant={mobileTab === 'editor' ? 'secondary' : 'ghost'}
          size='sm'
          className='flex-1'
          onClick={() => setMobileTab('editor')}>
          <Code2 className='mr-2 h-4 w-4' /> Editor
        </Button>
        <Button
          variant={mobileTab === 'preview' ? 'secondary' : 'ghost'}
          size='sm'
          className='flex-1'
          onClick={() => setMobileTab('preview')}>
          <Eye className='mr-2 h-4 w-4' /> Preview Paginado
        </Button>
      </div>

      <div className='flex flex-1 overflow-hidden'>
        <div
          id='md-pdf-editor'
          className={cn(
            'flex h-full flex-col border-r transition-all',
            mobileTab === 'editor' ? 'flex w-full' : 'hidden',
            'md:flex md:w-1/2',
          )}>
          <div className='min-h-0 flex-1'>
            <EditorComponent onScroll={handleEditorScroll} onResetMarkdown={onResetMarkdown} />
          </div>
        </div>

        <div
          id='md-pdf-preview'
          className={cn(
            'bg-muted/30 flex h-full flex-col transition-all',

            mobileTab === 'preview' ? 'flex w-full' : 'hidden',
            'md:flex md:w-1/2',
          )}>
          <ActionToolbar headerFooter />

          <div className='relative min-h-0 flex-1'>
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
    </div>
  )
}
