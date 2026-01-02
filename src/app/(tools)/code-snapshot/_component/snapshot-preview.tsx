'use client'

import { Copy, Download, Expand, Loader2, ZoomIn, ZoomOut } from 'lucide-react'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import * as themes from 'react-syntax-highlighter/dist/esm/styles/prism'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useCodeSnapshot } from '@/shared/contexts/codeSnapshotContext'
import { PreviewCustomLayout } from './custom-layout'
import {
  MAX_ZOOM,
  MIN_ZOOM,
  calculateDimensions,
  calculateFontSize,
  calculateInitialZoom as calculateInitialZoomUtil,
  generateContentConfig,
  onCopyImage,
  onDownload,
} from './utils'
import { ValidateFontComponent } from './validate-font-component'

interface SnapshotPreviewProps {
  previewContainerRef?: React.RefObject<HTMLDivElement | null>
  onPreviewScroll?: (percentage: number) => void
  isSyncingFromEditor?: React.RefObject<boolean>
}

export function SnapshotPreview({
  previewContainerRef,
  onPreviewScroll,
  isSyncingFromEditor,
}: SnapshotPreviewProps) {
  const { code, config, updateConfig } = useCodeSnapshot()
  const ref = useRef<HTMLDivElement>(null)
  const codeContentRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const rafIdRef = useRef<number | null>(null)
  const onPreviewScrollRef = useRef(onPreviewScroll)

  const [loading, setLoading] = useState({
    export: false,
    copy: false,
  })

  const { finalWidth, finalHeight } = useMemo(() => calculateDimensions(config), [config])
  const { availableCodeHeight, headerHeight, footerHeight } = useMemo(
    () => generateContentConfig(config),
    [config],
  )

  const calculateInitialZoom = useCallback(
    (forceReset = false) => {
      if (typeof window === 'undefined') return 1

      return calculateInitialZoomUtil({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        finalWidth,
        finalHeight,
        currentScale: config.scale,
        forceReset,
      })
    },
    [config.scale, finalWidth, finalHeight],
  )

  const [zoom, setZoom] = useState(() => calculateInitialZoom())
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  // Posição agora representa APENAS o offset de arrasto (pan), não a centralização
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [calculatedFontSize, setCalculatedFontSize] = useState(config.fontSize)

  // -- CORREÇÃO 1: Simplificação do Ajuste de Posição --
  // Removemos a tentativa de calcular o centro manualmente.
  // Deixamos o Flexbox centralizar e zeramos o offset de arrasto quando apropriado.
  const adjustPosition = useCallback(() => {
    if (!containerRef.current || !ref.current) return

    // Se voltamos ao zoom inicial ou 100%, resetamos o arrasto para o centro perfeito
    if (zoom === 1 || zoom <= MIN_ZOOM) {
      setPosition({ x: 0, y: 0 })
    }

    // Nota: Removemos a lógica de scrollLeft/scrollTop manual.
    // O arrasto agora é puramente via transform translate.
  }, [zoom])

  // Atualiza zoom quando a tela redimensiona
  useEffect(() => {
    // Apenas recalcula se o usuário não definiu um scale manual fixo ou se é reset
    if (config.scale === 1 || !config.scale) {
      const handleResize = () => {
        const newZoom = calculateInitialZoom()
        setZoom(newZoom)
        // Não atualizamos o config global aqui para não travar loops, apenas local
        // updateConfig('scale', newZoom)
        setPosition({ x: 0, y: 0 }) // Reseta posição no resize
      }
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [config.scale, calculateInitialZoom])

  // Cálculo de Fonte (Mantido igual)
  useEffect(() => {
    if (finalHeight === 0 || availableCodeHeight <= 0) {
      setCalculatedFontSize(config.fontSize)
      return
    }

    const timeoutId = setTimeout(() => {
      if (!codeContentRef.current) {
        setCalculatedFontSize(config.fontSize)
        return
      }
      const contentElement = codeContentRef.current
      const actualHeight = contentElement.scrollHeight
      const maxHeight = availableCodeHeight
      const newFontSize = calculateFontSize({
        actualHeight,
        maxHeight,
        baseFontSize: config.fontSize,
      })
      setCalculatedFontSize(newFontSize)
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [
    code,
    config.fontSize,
    finalHeight,
    availableCodeHeight,
    config.padding,
    headerHeight,
    footerHeight,
  ])

  useEffect(() => {
    if (finalHeight === 0 || availableCodeHeight <= 0) {
      setCalculatedFontSize(config.fontSize)
    }
  }, [config.fontSize, finalHeight, availableCodeHeight])

  useEffect(() => {
    onPreviewScrollRef.current = onPreviewScroll
  }, [onPreviewScroll])

  useEffect(() => {
    if (previewContainerRef && containerRef.current) {
      ;(previewContainerRef as React.MutableRefObject<HTMLDivElement | null>).current =
        containerRef.current
    }
  }, [previewContainerRef])

  const handleExport = useCallback(
    async (type: 'download' | 'copy') => {
      if (type === 'download') {
        setLoading((prev) => ({ ...prev, export: true }))
        await onDownload(ref)
        setLoading((prev) => ({ ...prev, export: false }))
      } else {
        setLoading((prev) => ({ ...prev, copy: true }))
        await onCopyImage(ref)
        setLoading((prev) => ({ ...prev, copy: false }))
      }
    },
    [ref],
  )

  const updateZoom = useCallback(
    (newZoom: number) => {
      setZoom(newZoom)
      updateConfig('scale', newZoom)
      // Não forçamos reset de posição aqui para permitir zoom no lugar (opcional),
      // mas para corrigir o drift, resetar o position ajuda a manter no centro visual.
      // Se quiser zoom na direção do mouse, a lógica é bem mais complexa.
      // Manter simples:
      // setPosition({ x: 0, y: 0 })
    },
    [updateConfig],
  )

  const handleZoomIn = useCallback(() => {
    updateZoom(Math.min(zoom + 0.1, MAX_ZOOM))
  }, [zoom, updateZoom])

  const handleZoomOut = useCallback(() => {
    updateZoom(Math.max(zoom - 0.1, MIN_ZOOM))
  }, [zoom, updateZoom])

  const handleZoomReset = useCallback(() => {
    const resetZoom = calculateInitialZoom(true)
    setZoom(resetZoom)
    setPosition({ x: 0, y: 0 }) // Força centralização no reset
    updateConfig('scale', resetZoom)
  }, [updateConfig, calculateInitialZoom])

  useEffect(() => {
    if (config.scale && config.scale !== zoom) {
      setZoom(config.scale)
      if (config.scale === 1) setPosition({ x: 0, y: 0 })
    }
  }, [config.scale, zoom])

  // -- CORREÇÃO 2: Drag Logic Simplificada --
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Permite arrastar sempre que não estiver no zoom padrão ou se quiser mover livremente
      // Removemos a restrição de "zoom !== 1" se quiser permitir pan livre
      setIsDragging(true)
      // Registra onde o mouse estava RELATIVO à posição atual do elemento
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    },
    [position],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        e.preventDefault()
        const newX = e.clientX - dragStart.x
        const newY = e.clientY - dragStart.y
        setPosition({ x: newX, y: newY })
      }
    },
    [isDragging, dragStart],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const delta = e.deltaY > 0 ? -0.05 : 0.05 // Zoom mais suave
        updateZoom(Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom + delta)))
      }
    },
    [zoom, updateZoom],
  )

  // Define o cursor baseado no estado
  const cursorStyle = isDragging ? 'cursor-grabbing' : 'cursor-grab'

  return (
    <div
      className='relative flex h-full w-full flex-col bg-zinc-50 dark:bg-zinc-950'
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}>
      <ValidateFontComponent />

      {/* Background Pattern */}
      <div className='pointer-events-none absolute inset-0 z-0'>
        <div className='absolute inset-0 h-full w-full bg-linear-to-b from-blue-50 to-transparent dark:from-blue-950/20' />
        <div className='absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]' />
      </div>

      {/* Toolbar */}
      <div className='bg-background/95 hover:bg-background border-border/50 absolute top-3 right-3 z-50 flex items-center justify-between gap-2 rounded-lg border px-3 py-2 shadow-lg backdrop-blur-md transition-all'>
        <div className='flex items-center gap-1.5'>
          <Button
            variant='ghost'
            size='sm'
            className='hover:bg-muted h-7 rounded-md px-2.5 text-xs font-medium'
            onClick={() => handleExport('copy')}
            disabled={loading.copy || loading.export}>
            {loading.copy ? (
              <Loader2 className='mr-1.5 h-3 w-3 animate-spin' />
            ) : (
              <Copy className='mr-1.5 h-3 w-3' />
            )}
          </Button>
          <Button
            size='sm'
            className='h-7 rounded-md px-3 text-xs font-medium shadow-sm'
            onClick={() => handleExport('download')}
            disabled={loading.copy || loading.export}>
            {loading.export ? (
              <Loader2 className='h-3 w-3 animate-spin' />
            ) : (
              <Download className='h-3 w-3' />
            )}
          </Button>
        </div>

        <div className='flex items-center gap-1.5'>
          <Button
            variant='ghost'
            size='sm'
            className='hover:bg-muted h-7 w-7 rounded-md p-0'
            onClick={handleZoomOut}
            disabled={zoom <= MIN_ZOOM}
            title='Diminuir zoom'>
            <ZoomOut className='h-3.5 w-3.5' />
          </Button>
          <div className='bg-muted/80 text-muted-foreground flex min-w-16 items-center justify-center rounded-md border px-2 py-1 font-mono text-[10px] font-semibold'>
            {Math.round(zoom * 100)}%
          </div>
          <Button
            variant='ghost'
            size='sm'
            className='hover:bg-muted h-7 w-7 rounded-md p-0'
            onClick={handleZoomIn}
            disabled={zoom >= MAX_ZOOM}
            title='Aumentar zoom'>
            <ZoomIn className='h-3.5 w-3.5' />
          </Button>

          <Button
            variant='ghost'
            size='sm'
            className='hover:bg-muted h-7 rounded-md px-2 text-xs'
            onClick={handleZoomReset}
            title='Resetar zoom'>
            <Expand className='h-3.5 w-3.5' />
          </Button>
        </div>
      </div>

      {/* -- CORREÇÃO 3: Container Principal --
         Usamos Flexbox para centralizar.
         Overflow hidden pois usaremos "transform" para mover (pan), não scroll nativo.
      */}
      <div
        ref={containerRef}
        className={cn(
          'relative z-10 flex h-full w-full flex-1 items-center justify-center overflow-hidden',
          cursorStyle,
        )}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        id='preview-container'>
        {/* Wrapper que recebe o Transform.
           Origin: 'center center' garante que o zoom expanda para todos os lados igualmente.
           Translate: aplica o arrasto do usuário.
           Scale: aplica o zoom.
        */}
        <div
          style={{
            transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${zoom})`,
            // Mobile geralmente prefere "top center" para não esconder o cabeçalho,
            // mas "center center" é mais matematicamente correto para zoom in/out sem drift lateral.
            // Vamos usar center center e confiar no drag (position) para ajustes finos.
            transformOrigin: 'center center',
            willChange: 'transform',
            // Importante: fit-content garante que o wrapper tenha o tamanho exato do conteúdo
            width: 'fit-content',
            height: 'fit-content',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out', // Transição suave exceto quando arrasta
          }}>
          {/* Conteúdo do Snippet (Mantido igual) */}
          <div
            ref={ref}
            style={{
              background: config.background,
              padding: `${config.padding}px`,
              borderRadius: `${config.borderRadius}px`,
              width: `${finalWidth}px`,
              minWidth: `${finalWidth}px`,
              maxWidth: `${finalWidth}px`,
              height: finalHeight > 0 ? `${finalHeight}px` : 'auto',
              minHeight: finalHeight > 0 ? `${finalHeight}px` : 'auto',
              maxHeight: finalHeight > 0 ? `${finalHeight}px` : 'none',
              overflow: finalHeight > 0 ? 'hidden' : 'visible',
              display: 'flex',
              flexDirection: 'column',
              justifyContent:
                finalHeight > 0
                  ? config.contentVerticalAlign === 'top'
                    ? 'flex-start'
                    : config.contentVerticalAlign === 'bottom'
                      ? 'flex-end'
                      : 'center'
                  : 'flex-start',
            }}
            className='relative shadow-2xl' // Adicionei shadow aqui para destaque
          >
            <div
              className='bg-[#0d0d0d] ring-1 ring-white/10'
              style={{
                fontFamily: config.fontFamily,
                borderRadius: `${config.borderRadius - 4}px`,
                boxShadow: `0 ${config.shadowIntensity}px ${config.shadowIntensity * 1.5}px -${config.shadowIntensity / 2}px rgba(0,0,0,${Math.min(0.5, config.shadowIntensity / 200)})`,
                height: availableCodeHeight > 0 ? `${availableCodeHeight}px` : 'auto',
                minHeight: availableCodeHeight > 0 ? `${availableCodeHeight}px` : '0',
                maxHeight: availableCodeHeight > 0 ? `${availableCodeHeight}px` : 'none',
                overflow: availableCodeHeight > 0 ? 'hidden' : 'visible',
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0,
              }}>
              <PreviewCustomLayout>
                <div
                  ref={codeContentRef}
                  className='code-snapshot-syntax-wrapper relative'
                  style={{
                    fontSize: `${calculatedFontSize}px`,
                    fontFamily: `"${config.fontFamily}", 'Courier New', Courier, monospace`,
                    overflow: availableCodeHeight > 0 ? 'hidden' : 'visible',
                    maxHeight:
                      availableCodeHeight > 0 ? `${availableCodeHeight - headerHeight}px` : 'none',
                    flex: availableCodeHeight > 0 ? '1 1 0' : '0 0 auto',
                    minHeight: 0,
                  }}>
                  {/* Styles Injection (Mantido) */}
                  <style>{`
                  .code-snapshot-syntax-wrapper pre,
                  .code-snapshot-syntax-wrapper code,
                  .code-snapshot-syntax-wrapper pre *,
                  .code-snapshot-syntax-wrapper code *,
                  .code-snapshot-syntax-wrapper .token,
                  .code-snapshot-syntax-wrapper span {
                    font-family: "${config.fontFamily}", 'Courier New', Courier, monospace !important;
                    font-size: ${calculatedFontSize}px !important;
                  }
                `}</style>
                  <SyntaxHighlighter
                    language={config.language}
                    style={(themes as any)[config.theme] || themes.vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      padding: '1.5rem',
                      background: 'transparent',
                      fontSize: `${calculatedFontSize}px`,
                      fontFamily: `"${config.fontFamily}", 'Courier New', Courier, monospace`,
                      lineHeight: '1.6',
                      whiteSpace: 'pre-wrap',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      wordBreak: 'break-word',
                      overflow: availableCodeHeight > 0 ? 'hidden' : 'visible',
                      maxWidth: '100%',
                      width: '100%',
                      maxHeight:
                        availableCodeHeight > 0
                          ? `${availableCodeHeight - headerHeight}px`
                          : 'none',
                    }}
                    wrapLines={true}
                    wrapLongLines={true}
                    PreTag={({ children, ...props }: any) => (
                      <pre
                        {...props}
                        style={{
                          ...props.style,
                          fontSize: `${calculatedFontSize}px !important`,
                          fontFamily: `"${config.fontFamily}", 'Courier New', Courier, monospace !important`,
                          overflow: availableCodeHeight > 0 ? 'hidden' : 'visible',
                          maxHeight:
                            availableCodeHeight > 0
                              ? `${availableCodeHeight - headerHeight}px`
                              : 'none',
                        }}>
                        {children}
                      </pre>
                    )}
                    CodeTag={({ children, ...props }: any) => (
                      <code
                        {...props}
                        style={{
                          ...props.style,
                          fontSize: `${calculatedFontSize}px !important`,
                          fontFamily: `"${config.fontFamily}", 'Courier New', Courier, monospace !important`,
                        }}>
                        {children}
                      </code>
                    )}
                    showLineNumbers={config.showLineNumbers}
                    lineNumberStyle={{
                      minWidth: '2.5em',
                      paddingRight: '1em',
                      color: '#6e7681',
                      textAlign: 'right',
                      fontSize: `${calculatedFontSize}px`,
                      fontFamily: `"${config.fontFamily}", 'Courier New', Courier, monospace`,
                    }}>
                    {code || ' '}
                  </SyntaxHighlighter>
                </div>
              </PreviewCustomLayout>
            </div>
          </div>
        </div>
      </div>

      {/* Dica de Zoom */}
      <div className='text-muted-foreground absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-medium opacity-40 mix-blend-difference select-none'>
        Scroll para zoom • Arraste para mover
      </div>
    </div>
  )
}
