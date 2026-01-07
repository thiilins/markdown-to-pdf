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
  getThemeBackground,
} from './utils'
import { ValidateFontComponent } from './validate-font-component'
import { isDiffCode, parseDiff, type ParsedDiff, type DiffLine } from './diff-utils'
import { LineCommentPopover } from './line-comment-popover'
import { CodeAnnotationComponent } from './code-annotation'
import type { CodeAnnotation } from './types'

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
  const { code, setCode, config, updateConfig } = useCodeSnapshot()
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
  // Posição agora representa o offset de arrasto (pan)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [calculatedFontSize, setCalculatedFontSize] = useState(config.fontSize)
  const [selectedLineForComment, setSelectedLineForComment] = useState<number | null>(null)

  // Detecção automática de diff
  const parsedDiff = useMemo(() => {
    if (!code) return { isDiff: false, lines: [] }
    return parseDiff(code)
  }, [code])

  // Atualiza diffMode automaticamente quando detecta diff
  useEffect(() => {
    if (parsedDiff.isDiff !== config.diffMode) {
      updateConfig('diffMode', parsedDiff.isDiff)
    }
  }, [parsedDiff.isDiff, config.diffMode, updateConfig])

  // Handlers para line highlights e comentários
  const handleLineCommentChange = useCallback(
    (lineNumber: number, comment: string) => {
      const newHighlights = { ...config.lineHighlights }
      newHighlights[lineNumber] = { ...newHighlights[lineNumber], comment, highlighted: true }
      updateConfig('lineHighlights', newHighlights)
    },
    [config.lineHighlights, updateConfig],
  )

  // Handlers para annotations
  const handleAddAnnotation = useCallback(
    (type: 'arrow' | 'note', x: number, y: number, targetLine?: number) => {
      const newAnnotation: CodeAnnotation = {
        id: `annotation-${Date.now()}`,
        type,
        x: x - (ref.current?.offsetLeft || 0),
        y: y - (ref.current?.offsetTop || 0),
        targetLine,
        color: '#fbbf24',
      }
      updateConfig('annotations', [...(config.annotations || []), newAnnotation])
    },
    [config.annotations, updateConfig],
  )

  const handleUpdateAnnotation = useCallback(
    (id: string, updates: Partial<CodeAnnotation>) => {
      const updatedAnnotations = (config.annotations || []).map((ann: CodeAnnotation) =>
        ann.id === id ? { ...ann, ...updates } : ann,
      )
      updateConfig('annotations', updatedAnnotations)
    },
    [config.annotations, updateConfig],
  )

  const handleDeleteAnnotation = useCallback(
    (id: string) => {
      const filteredAnnotations = (config.annotations || []).filter((ann: CodeAnnotation) => ann.id !== id)
      updateConfig('annotations', filteredAnnotations)
    },
    [config.annotations, updateConfig],
  )

  // Handler para clique no código para adicionar anotação
  const handleCodeClick = useCallback(
    (e: React.MouseEvent) => {
      if (!config.annotationMode) return
      e.stopPropagation()
      const rect = codeContentRef.current?.getBoundingClientRect()
      if (!rect) return

      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Calcular linha aproximada baseado na posição Y
      const lineHeight = calculatedFontSize * 1.6
      const lineNumber = Math.floor(y / lineHeight) + 1

      handleAddAnnotation('note', x, y, lineNumber)
    },
    [config.annotationMode, calculatedFontSize, handleAddAnnotation],
  )

  const handleRemoveComment = useCallback(
    (lineNumber: number) => {
      const newHighlights = { ...config.lineHighlights }
      delete newHighlights[lineNumber]
      updateConfig('lineHighlights', newHighlights)
    },
    [config.lineHighlights, updateConfig],
  )

  // Prepara código para syntax highlighting (remove marcadores de diff se necessário)
  const codeForHighlighting = useMemo(() => {
    if (config.diffMode && parsedDiff.isDiff) {
      // Remove marcadores de diff mas mantém estrutura para mapeamento
      return parsedDiff.lines
        .filter((line) => line.type !== 'header')
        .map((line) => line.content)
        .join('\n')
    }
    return code
  }, [code, config.diffMode, parsedDiff])

  // Mapeamento de linhas do código processado para linhas do diff original
  const lineMapping = useMemo(() => {
    if (!config.diffMode || !parsedDiff.isDiff) return {}
    const mapping: Record<number, DiffLine> = {}
    let processedLineNumber = 0
    parsedDiff.lines.forEach((line) => {
      if (line.type !== 'header') {
        processedLineNumber++
        mapping[processedLineNumber] = line
      }
    })
    return mapping
  }, [config.diffMode, parsedDiff])

  // Prepara lineProps para SyntaxHighlighter (estilos de diff e highlights)
  const getLineProps = useCallback(
    (lineNumber: number) => {
      // Mapeia linha processada para linha original do diff
      const diffLine = config.diffMode && parsedDiff.isDiff
        ? lineMapping[lineNumber]
        : null

      const lineProps: any = {
        style: {
          display: 'block',
          width: '100%',
          cursor: config.diffMode || config.lineHighlights[lineNumber] ? 'pointer' : 'default',
          position: 'relative' as const,
        },
        onClick: (e: React.MouseEvent) => {
          e.stopPropagation()
          setSelectedLineForComment(lineNumber)
        },
        'data-line-number': lineNumber.toString(),
      }

      // Estilos de diff
      if (config.diffMode && parsedDiff.isDiff && diffLine) {
        if (diffLine.type === 'added') {
          lineProps.style.backgroundColor = 'rgba(46, 160, 67, 0.15)'
          lineProps.style.borderLeft = '3px solid rgba(46, 160, 67, 0.8)'
          lineProps.style.paddingLeft = 'calc(1.5rem - 3px)'
        } else if (diffLine.type === 'removed') {
          lineProps.style.backgroundColor = 'rgba(248, 81, 73, 0.15)'
          lineProps.style.borderLeft = '3px solid rgba(248, 81, 73, 0.8)'
          lineProps.style.paddingLeft = 'calc(1.5rem - 3px)'
          lineProps.style.opacity = '0.7'
        } else if (diffLine.type === 'header') {
          lineProps.style.backgroundColor = 'rgba(106, 115, 125, 0.1)'
          lineProps.style.fontWeight = 'bold'
          lineProps.style.color = '#8b949e'
        }
      }

      // Estilos de highlight
      const highlight = config.lineHighlights[lineNumber]
      if (highlight?.highlighted) {
        lineProps.style.backgroundColor = lineProps.style.backgroundColor
          ? lineProps.style.backgroundColor
          : 'rgba(255, 235, 59, 0.2)'
        lineProps.style.borderLeft = lineProps.style.borderLeft || '3px solid rgba(255, 235, 59, 0.8)'
        lineProps.style.paddingLeft = lineProps.style.paddingLeft || 'calc(1.5rem - 3px)'
      }

      // Adiciona indicador visual de comentário
      if (highlight?.comment) {
        lineProps.style.position = 'relative'
        lineProps['data-has-comment'] = 'true'
      }

      return lineProps
    },
    [config.diffMode, config.lineHighlights, parsedDiff, lineMapping],
  )

  const adjustPosition = useCallback(() => {
    if (!containerRef.current || !ref.current) return

    // Se voltamos ao zoom inicial ou muito pequeno, resetamos a posição para o centro
    if (zoom === 1 || zoom <= MIN_ZOOM) {
      setPosition({ x: 0, y: 0 })
    }
  }, [zoom])

  // Atualiza zoom quando a tela redimensiona
  useEffect(() => {
    if (config.scale === 1 || !config.scale) {
      const handleResize = () => {
        const newZoom = calculateInitialZoom()
        setZoom(newZoom)
        setPosition({ x: 0, y: 0 }) // Reseta posição no resize
      }
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [config.scale, calculateInitialZoom])

  // Cálculo de Fonte
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

  // --- Lógica de Drag (Arrastar com clique) ---
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Só inicia drag se for botão esquerdo
      if (e.button !== 0) return

      setIsDragging(true)
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

  // --- Lógica de Scroll e Zoom combinados ---
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      // Verifica se é Zoom (Ctrl/Meta pressionado)
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        // Lógica de Zoom existente
        const delta = e.deltaY > 0 ? -0.05 : 0.05
        updateZoom(Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom + delta)))
      } else {
        // --- NOVA LÓGICA: PAN VIA SCROLL ---
        // Se não estiver apertando Ctrl, o scroll move a imagem (Pan)
        // Isso permite navegar quando está com zoom
        e.preventDefault() // Previne scroll da página pai

        // Multiplicador opcional para acelerar/desacelerar o scroll se necessário
        const scrollSpeed = 1

        // Subtraímos o delta porque scroll down (positivo) deve mover a view down (conteúdo sobe - negativo)
        setPosition((prev) => ({
          x: prev.x - e.deltaX * scrollSpeed,
          y: prev.y - e.deltaY * scrollSpeed,
        }))
      }
    },
    [zoom, updateZoom],
  )

  const cursorStyle = isDragging ? 'cursor-grabbing' : 'cursor-grab'

  // Obtém o background do tema atual
  const themeBackground = useMemo(() => getThemeBackground(config.theme), [config.theme])

  return (
    <div
      className='relative flex h-full w-full min-w-[40dvw] flex-col bg-zinc-50 dark:bg-zinc-950'
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}>
      <ValidateFontComponent />

      {/* Background Pattern */}
      <div className='pointer-events-none absolute inset-0 z-0'>
        <div className='h-full w-full border border-gray-300 bg-[conic-gradient(#e5e7eb_25%,transparent_25%,transparent_50%,#e5e7eb_50%,#e5e7eb_75%,transparent_75%,transparent)] bg-size-[20px_20px]' />
      </div>
      {/* <div className='pointer-events-none absolute inset-0 z-0'>
        <div className='absolute inset-0 h-full w-full bg-linear-to-b from-blue-50 to-transparent dark:from-blue-950/20' />
        <div className='absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]' />
      </div> */}

      {/* Toolbar */}
      <div className='bg-background/95 hover:bg-background border-border/50 absolute top-10 right-3 z-50 flex items-center justify-between gap-2 rounded-lg border px-3 py-2 shadow-lg backdrop-blur-md transition-all'>
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

      {/* Container Principal */}
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
        {/* Wrapper Transform */}
        <div
          style={{
            transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${zoom})`,
            transformOrigin: 'center center',
            willChange: 'transform',
            width: 'fit-content',
            height: 'fit-content',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          }}>
          {/* Conteúdo do Snippet */}
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
            className='relative shadow-2xl'>
            <div
              className='ring-1 ring-white/10'
              style={{
                fontFamily: config.fontFamily,
                backgroundColor: themeBackground,
                borderRadius: `${config.borderRadius - 4}px`,
                boxShadow: `0 ${config.shadowIntensity}px ${config.shadowIntensity * 1.5}px -${config.shadowIntensity / 2}px rgba(0,0,0,${Math.min(0.5, config.shadowIntensity / 200)})`,
                height: availableCodeHeight > 0 ? `${availableCodeHeight}px` : 'auto',
                minHeight: availableCodeHeight > 0 ? `${availableCodeHeight}px` : '0',
                maxHeight: availableCodeHeight > 0 ? `${availableCodeHeight}px` : 'none',
                overflow: availableCodeHeight > 0 ? 'hidden' : 'visible',
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0,
                transition: 'background-color 0.3s ease',
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
                  }}
                  onClick={config.liveEditMode ? undefined : handleCodeClick}>
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
                  {config.liveEditMode ? (
                    <textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className='w-full h-full resize-none border-none outline-none bg-transparent text-inherit font-mono'
                      style={{
                        fontSize: `${calculatedFontSize}px`,
                        fontFamily: `"${config.fontFamily}", 'Courier New', Courier, monospace`,
                        lineHeight: '1.6',
                        padding: '1.5rem',
                        color: 'inherit',
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        overflow: availableCodeHeight > 0 ? 'auto' : 'visible',
                        maxHeight:
                          availableCodeHeight > 0
                            ? `${availableCodeHeight - headerHeight}px`
                            : 'none',
                      }}
                      spellCheck={false}
                    />
                  ) : (
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
                        cursor: config.diffMode || Object.keys(config.lineHighlights).length > 0 ? 'pointer' : 'default',
                      }}
                      lineProps={getLineProps}
                      lineNumberProps={(lineNumber: number) => ({
                        onClick: () => {
                          setSelectedLineForComment(lineNumber)
                        },
                        style: {
                          cursor: config.diffMode || config.lineHighlights[lineNumber] ? 'pointer' : 'default',
                        },
                      })}>
                      {codeForHighlighting || ' '}
                    </SyntaxHighlighter>
                  )}
                  {/* Overlay para comentários */}
                  {selectedLineForComment !== null && (
                    <div
                      className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'
                      onClick={() => setSelectedLineForComment(null)}>
                      <div onClick={(e) => e.stopPropagation()}>
                        <LineCommentPopover
                          lineNumber={selectedLineForComment}
                          comment={config.lineHighlights[selectedLineForComment]?.comment}
                          onCommentChange={(lineNum, comment) => {
                            handleLineCommentChange(lineNum, comment)
                          }}
                          onRemoveComment={(lineNum) => {
                            handleRemoveComment(lineNum)
                          }}
                          onClose={() => setSelectedLineForComment(null)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Anotações flutuantes */}
                  {!config.liveEditMode && (config.annotations || []).map((annotation: CodeAnnotation) => (
                    <CodeAnnotationComponent
                      key={annotation.id}
                      annotation={annotation}
                      onUpdate={handleUpdateAnnotation}
                      onDelete={handleDeleteAnnotation}
                      scale={zoom}
                    />
                  ))}
                </div>
              </PreviewCustomLayout>
            </div>
          </div>
        </div>
      </div>

      {/* Dica de Uso */}
      <div className='bg-primary border-primary absolute bottom-4 left-1/2 z-100 -translate-x-1/2 rounded-2xl p-2 text-[10px] font-medium text-white select-none'>
        Scroll para mover • Ctrl + Scroll para Zoom
      </div>
    </div>
  )
}
