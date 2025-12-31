'use client'

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Code2, Image as ImageIcon } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { SnapshotControls } from './snapshot-controls'
import { SnapshotEditor } from './snapshot-editor'
import { SnapshotPreview } from './snapshot-preview'

// Componente Wrapper para detectar tamanho da tela (simplificado)
export const CodeSnapshotView = () => {
  const [isDesktop, setIsDesktop] = useState(true)
  const previewContainerRef = useRef<HTMLDivElement | null>(null)
  const editorRef = useRef<any | null>(null)

  useEffect(() => {
    const checkSize = () => setIsDesktop(window.innerWidth >= 1024)
    checkSize()
    window.addEventListener('resize', checkSize)
    return () => window.removeEventListener('resize', checkSize)
  }, [])

  const isSyncingFromEditor = useRef(false)
  const isSyncingFromPreview = useRef(false)

  // Função que sincroniza o scroll do preview quando o editor scrolla
  const handleEditorScroll = useCallback((percentage: number) => {
    if (isSyncingFromPreview.current) return // Evita loop
    if (previewContainerRef.current) {
      isSyncingFromEditor.current = true
      const element = previewContainerRef.current
      const scrollableHeight = element.scrollHeight - element.clientHeight
      if (scrollableHeight > 0) {
        element.scrollTop = percentage * scrollableHeight
      }
      // Reset flag após um pequeno delay
      requestAnimationFrame(() => {
        setTimeout(() => {
          isSyncingFromEditor.current = false
        }, 100)
      })
    }
  }, [])

  // Função que sincroniza o scroll do editor quando o preview scrolla
  const handlePreviewScroll = useCallback((percentage: number) => {
    if (isSyncingFromEditor.current) return // Evita loop
    if (editorRef.current) {
      isSyncingFromPreview.current = true
      const editor = editorRef.current
      const scrollHeight = editor.getScrollHeight()
      const clientHeight = editor.getLayoutInfo().height
      const scrollableHeight = scrollHeight - clientHeight
      if (scrollableHeight > 0) {
        editor.setScrollTop(percentage * scrollableHeight)
      }
      // Reset flag após um pequeno delay
      requestAnimationFrame(() => {
        setTimeout(() => {
          isSyncingFromPreview.current = false
        }, 100)
      })
    }
  }, [])

  if (!isDesktop) {
    // LAYOUT MOBILE / TABLET (Baseado em Abas)
    return (
      <div className='bg-background flex h-[calc(100vh-4rem)] flex-col'>
        <Tabs defaultValue='editor' className='flex h-full flex-col'>
          <div className='bg-muted/30 flex items-center justify-between border-b px-4 py-2.5'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='editor' className='flex items-center gap-2 text-xs'>
                <Code2 className='h-3.5 w-3.5' /> Editor
              </TabsTrigger>
              <TabsTrigger value='preview' className='flex items-center gap-2 text-xs'>
                <ImageIcon className='h-3.5 w-3.5' /> Preview
              </TabsTrigger>
            </TabsList>
          </div>

          <div className='relative flex-1 overflow-hidden'>
            <TabsContent
              value='editor'
              className='mt-0 h-full border-none data-[state=active]:flex'>
              <SnapshotEditor onScroll={handleEditorScroll} editorRef={editorRef} />
            </TabsContent>

            <TabsContent
              value='preview'
              className='relative mt-0 h-full flex-col border-none data-[state=active]:flex'>
              <div className='min-h-0 flex-1 overflow-hidden'>
                <SnapshotPreview
                  previewContainerRef={previewContainerRef}
                  onPreviewScroll={handlePreviewScroll}
                  isSyncingFromEditor={isSyncingFromEditor}
                />
              </div>
              <div className='bg-background shrink-0 border-t'>
                <div className='custom-scrollbar h-[320px] max-h-[50vh] overflow-y-auto'>
                  <div className='p-4'>
                    <SnapshotControls compact />
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    )
  }

  // LAYOUT DESKTOP (3 Colunas Redimensionáveis)
  return (
    <div className='bg-background flex h-[calc(100vh-4rem)] w-full flex-col overflow-hidden'>
      <ResizablePanelGroup direction='horizontal' className='flex-1 border-t'>
        <ResizablePanel defaultSize={30} minSize={20} maxSize={45} className='bg-zinc-950/50'>
          <SnapshotEditor onScroll={handleEditorScroll} editorRef={editorRef} />
        </ResizablePanel>

        <ResizableHandle className='bg-border hover:bg-primary/50 w-px transition-colors' />

        <ResizablePanel defaultSize={50} minSize={35} className='relative bg-zinc-900/10'>
          <SnapshotPreview
            previewContainerRef={previewContainerRef}
            onPreviewScroll={handlePreviewScroll}
          />
        </ResizablePanel>

        <ResizableHandle className='bg-border hover:bg-primary/50 w-px transition-colors' />

        <ResizablePanel
          defaultSize={20}
          minSize={18}
          maxSize={30}
          className='bg-background border-l'>
          <SnapshotControls />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
