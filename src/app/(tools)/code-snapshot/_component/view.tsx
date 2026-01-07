'use client'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { useCodeSnapshot } from '@/shared/contexts/codeSnapshotContext'
import { ChevronLeft, ChevronRight, Code2, Image as ImageIcon, Settings } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { SnapshotControls } from './snapshot-controls'
import { SnapshotDiffEditor } from './snapshot-diff-editor'
import { SnapshotEditor } from './snapshot-editor'
import { SnapshotPreview } from './snapshot-preview'

// Componente Wrapper para detectar tamanho da tela (simplificado)
export const CodeSnapshotView = () => {
  const { config } = useCodeSnapshot()
  const [isDesktop, setIsDesktop] = useState(true)
  const [showEditor, setShowEditor] = useState(true)
  const [showControls, setShowControls] = useState(true)
  const [mobileViewMode, setMobileViewMode] = useState<'split' | 'preview' | 'config'>('split')
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
              {config.diffMode ? (
                <SnapshotDiffEditor onScroll={handleEditorScroll} editorRef={editorRef} />
              ) : (
                <SnapshotEditor onScroll={handleEditorScroll} editorRef={editorRef} />
              )}
            </TabsContent>

            <TabsContent
              value='preview'
              className='relative mt-0 h-full flex-col border-none data-[state=active]:flex'>
              {/* Seletor de Modo de Visualização (Mobile) */}
              <div className='bg-muted/20 border-b px-4 py-2'>
                <div className='flex items-center justify-between gap-2'>
                  <span className='text-muted-foreground text-xs font-medium'>
                    Modo de Visualização:
                  </span>
                  <Select
                    value={mobileViewMode}
                    onValueChange={(v) => setMobileViewMode(v as typeof mobileViewMode)}>
                    <SelectTrigger className='h-8 w-[140px] text-xs'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='split'>Split</SelectItem>
                      <SelectItem value='preview'>Só Preview</SelectItem>
                      <SelectItem value='config'>Só Config</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Conteúdo baseado no modo selecionado */}
              {mobileViewMode === 'split' && (
                <>
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
                </>
              )}

              {mobileViewMode === 'preview' && (
                <div className='min-h-0 flex-1 overflow-hidden'>
                  <SnapshotPreview
                    previewContainerRef={previewContainerRef}
                    onPreviewScroll={handlePreviewScroll}
                    isSyncingFromEditor={isSyncingFromEditor}
                  />
                </div>
              )}

              {mobileViewMode === 'config' && (
                <div className='custom-scrollbar flex-1 overflow-y-auto'>
                  <div className='p-4'>
                    <SnapshotControls compact />
                  </div>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    )
  }

  // LAYOUT DESKTOP (3 Colunas com controles de visibilidade)
  return (
    <TooltipProvider>
      <div className='bg-background relative flex h-[calc(100vh-4rem)] w-full flex-col overflow-hidden'>
        {/* Barra de Controles Desktop - Só aparece quando ambos estão visíveis */}
        {(showEditor || showControls) && (
          <div className='bg-muted/30 flex items-center justify-between border-b px-4 py-2'>
            <div className='flex items-center gap-2'>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setShowEditor(!showEditor)}
                    className={cn(
                      'h-8 gap-1.5 text-xs transition-all',
                      showEditor && 'bg-muted hover:bg-muted/80',
                    )}>
                    <Code2
                      className={cn(
                        'h-3.5 w-3.5 transition-transform',
                        !showEditor && 'opacity-50',
                      )}
                    />
                    <span className='hidden sm:inline'>
                      {showEditor ? 'Ocultar' : 'Mostrar'} Editor
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{showEditor ? 'Ocultar Editor' : 'Mostrar Editor'}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setShowControls(!showControls)}
                    className={cn(
                      'h-8 gap-1.5 text-xs transition-all',
                      showControls && 'bg-muted hover:bg-muted/80',
                    )}>
                    <Settings
                      className={cn(
                        'h-3.5 w-3.5 transition-transform',
                        !showControls && 'opacity-50',
                      )}
                    />
                    <span className='hidden sm:inline'>
                      {showControls ? 'Ocultar' : 'Mostrar'} Config
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{showControls ? 'Ocultar Configurações' : 'Mostrar Configurações'}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        )}

        <div className='relative flex flex-1 overflow-hidden border-t'>
          {/* Editor com animação */}
          <div
            className={cn(
              'shrink-0 border-r transition-all duration-300 ease-in-out',
              showEditor ? 'max-w-[40vw] opacity-100' : 'max-w-0 overflow-hidden opacity-0',
            )}>
            <div
              className={cn(
                'h-full overflow-hidden transition-opacity duration-300',
                showEditor ? 'opacity-100' : 'opacity-0',
              )}>
              {config.diffMode ? (
                <SnapshotDiffEditor onScroll={handleEditorScroll} editorRef={editorRef} />
              ) : (
                <SnapshotEditor onScroll={handleEditorScroll} editorRef={editorRef} />
              )}
            </div>
          </div>

          {/* Botão flutuante para Editor - sempre visível, próximo ao topo */}
          {showEditor ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setShowEditor(false)}
                  className='bg-primary/90 hover:bg-primary absolute top-2 left-[40vw] z-50 flex h-7 w-6 cursor-pointer items-center justify-center rounded-r-md text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl'>
                  <ChevronRight className='h-3.5 w-3.5' />
                </button>
              </TooltipTrigger>
              <TooltipContent side='right'>
                <p>Ocultar Editor</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setShowEditor(true)}
                  className='bg-primary/90 hover:bg-primary absolute top-2 left-2 z-50 flex h-7 w-6 cursor-pointer items-center justify-center rounded-r-md text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl'>
                  <ChevronRight className='h-3.5 w-3.5' />
                </button>
              </TooltipTrigger>
              <TooltipContent side='right'>
                <p>Mostrar Editor</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Preview - sempre visível */}
          <div className='min-w-0 flex-1 overflow-hidden'>
            <SnapshotPreview
              previewContainerRef={previewContainerRef}
              onPreviewScroll={handlePreviewScroll}
            />
          </div>

          {/* Botão flutuante para Config - sempre visível, próximo ao topo */}
          {showControls ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setShowControls(false)}
                  className='bg-primary/90 hover:bg-primary absolute top-2 right-[390px] z-50 flex h-7 w-6 cursor-pointer items-center justify-center rounded-l-md text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl'>
                  <ChevronLeft className='h-3.5 w-3.5' />
                </button>
              </TooltipTrigger>
              <TooltipContent side='left'>
                <p>Ocultar Configurações</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setShowControls(true)}
                  className='bg-primary/90 hover:bg-primary absolute top-2 right-2 z-50 flex h-7 w-6 cursor-pointer items-center justify-center rounded-l-md text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl'>
                  <ChevronLeft className='h-3.5 w-3.5' />
                </button>
              </TooltipTrigger>
              <TooltipContent side='left'>
                <p>Mostrar Configurações</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Config com animação */}
          <div
            className={cn(
              'shrink-0 border-l transition-all duration-300 ease-in-out',
              showControls
                ? 'w-[390px] max-w-[390px] opacity-100'
                : 'w-0 max-w-0 overflow-hidden opacity-0',
            )}>
            <div
              className={cn(
                'h-full w-full overflow-hidden transition-opacity duration-300',
                showControls ? 'opacity-100' : 'opacity-0',
              )}>
              <SnapshotControls />
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
