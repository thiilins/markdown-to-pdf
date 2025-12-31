'use client'

import { Button } from '@/components/ui/button' // Assumindo shadcn/ui
import { cn } from '@/lib/utils'
import { useApp } from '@/shared/contexts/appContext'
import { useMarkdown } from '@/shared/contexts/markdownContext'
import { PrintStyle } from '@/shared/styles/print-styles'
import { Code2, Eye } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { ActionToolbar } from '../../_components/action-toolbar'
import { EditorComponent } from './editor'
import { GistSaveModal } from './gist-save-modal'
import { PreviewComponent } from './preview'

export const MDEditorViewComponent = () => {
  const previewContainerRef = useRef<HTMLDivElement | null>(null)
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor')

  const {
    markdown,
    onResetMarkdown,
    list,
    isGistMode,
    currentGistId,
    gistMetadataMap,
    canSaveGist,
    openGistSaveModal,
    setOpenGistSaveModal,
    handleSaveGist,
    handleUpdateGist,
  } = useMarkdown()

  const { config } = useApp()

  const handleEditorScroll = (percentage: number) => {
    if (previewContainerRef.current) {
      const element = previewContainerRef.current
      const scrollableHeight = element.scrollHeight - element.clientHeight
      element.scrollTop = percentage * scrollableHeight
    }
  }

  // Prepara dados para o GistSaveModal (Mantido igual)
  const gistModalData = useMemo(() => {
    if (!isGistMode || !currentGistId) {
      const allFiles: Record<string, string> = {}
      list.forEach((item) => {
        allFiles[item.name] = item.content
      })
      return {
        existingGist: null,
        gistFiles: allFiles,
        currentFileName: markdown?.name || 'document.md',
      }
    }

    const gistMetadata = Object.values(gistMetadataMap).find(
      (meta) => meta.gistId === currentGistId,
    )
    if (!gistMetadata) {
      return {
        existingGist: null,
        gistFiles: {},
        currentFileName: markdown?.name || 'document.md',
      }
    }

    const gistFiles: Record<string, string> = {}
    list.forEach((item) => {
      if (gistMetadataMap[item.id]?.gistId === currentGistId) {
        gistFiles[item.name] = item.content
      }
    })

    const existingGistData = canSaveGist
      ? ({
          id: currentGistId,
          description: gistMetadata.description,
          public: gistMetadata.isPublic,
          owner: { login: gistMetadata.owner },
          files: list
            .filter((item) => gistMetadataMap[item.id]?.gistId === currentGistId)
            .map((item) => ({
              filename: item.name,
              language: null,
              raw_url: '',
              size: item.content.length,
            })),
        } as any)
      : null

    return {
      existingGist: existingGistData,
      gistFiles,
      currentFileName: markdown?.name || 'document.md',
    }
  }, [isGistMode, currentGistId, gistMetadataMap, list, markdown, canSaveGist])

  return (
    <div className='bg-background flex h-full w-full flex-col overflow-hidden'>
      {/* Mobile Tabs Switcher */}
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
          <Eye className='mr-2 h-4 w-4' /> Visualização
        </Button>
      </div>

      <div className='flex flex-1 overflow-hidden'>
        {/* Painel do Editor */}
        <div
          id='md-pdf-editor'
          className={cn(
            'flex h-full flex-col border-r transition-all',
            // Mobile: Mostra apenas se tab for editor. Desktop: Sempre mostra (50%)
            mobileTab === 'editor' ? 'flex w-full' : 'hidden',
            'md:flex md:w-1/2',
          )}>
          <div className='min-h-0 flex-1'>
            <EditorComponent onScroll={handleEditorScroll} onResetMarkdown={onResetMarkdown} />
          </div>
        </div>

        {/* Painel do Preview */}
        <div
          id='md-pdf-preview'
          className={cn(
            'bg-muted/30 flex h-full flex-col transition-all',
            // Mobile: Mostra apenas se tab for preview. Desktop: Sempre mostra (50%)
            mobileTab === 'preview' ? 'flex w-full' : 'hidden',
            'md:flex md:w-1/2',
          )}>
          {/* ActionToolbar agora fica sticky no topo do painel de preview */}
          <ActionToolbar />

          <div className='relative min-h-0 flex-1'>
            <PreviewComponent
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
        <GistSaveModal
          open={openGistSaveModal}
          onOpenChange={setOpenGistSaveModal}
          markdown={markdown?.content || ''}
          existingGist={gistModalData.existingGist}
          gistFiles={gistModalData.gistFiles}
          currentFileName={gistModalData.currentFileName}
          markdownList={list}
          gistMetadataMap={gistMetadataMap}
          currentGistId={currentGistId}
          canSaveGist={canSaveGist}
          onSave={handleSaveGist}
          onUpdate={handleUpdateGist}
        />
      </div>
    </div>
  )
}
