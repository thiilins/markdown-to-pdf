'use client'

import { Copy, Download, Expand, Loader2, ZoomIn, ZoomOut } from 'lucide-react'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import * as themes from 'react-syntax-highlighter/dist/esm/styles/prism'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useCodeSnapshot } from '@/shared/contexts/codeSnapshotContext'
import { Change, diffLines } from 'diff'
import { CodeAnnotationComponent } from './code-annotation'
import { PreviewCustomLayout } from './custom-layout'
import { CustomLineNumbers } from './custom-line-numbers'
import {
  MAX_ZOOM,
  MIN_ZOOM,
  calculateDimensions,
  calculateFontSize,
  calculateInitialZoom as calculateInitialZoomUtil,
  generateContentConfig,
  getThemeBackground,
  getThemeTextColor,
  onCopyImage,
  onDownload,
} from './utils'
import { ValidateFontComponent } from './validate-font-component'

// Helper para converter hex para rgba
const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

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

  // Obtém a cor do texto do tema atual
  const themeTextColor = useMemo(() => getThemeTextColor(config.theme), [config.theme])
  const themeBackground = useMemo(() => getThemeBackground(config.theme), [config.theme])

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

  // Calcula diff entre original e modificado quando diffMode está ativo
  const calculatedDiff = useMemo(() => {
    if (!config.diffMode) return null

    const original = config.diffOriginalCode || ''
    const modified = code || ''

    // Calcula as diferenças linha a linha
    const changes = diffLines(original, modified)

    // Gera linhas com tipos para colorização
    const lines: Array<{ content: string; type: 'added' | 'removed' | 'unchanged' }> = []

    changes.forEach((change: Change) => {
      const changeLines = change.value.split('\n')
      // Remove linha vazia no final se existir
      if (changeLines[changeLines.length - 1] === '') {
        changeLines.pop()
      }

      changeLines.forEach((line) => {
        if (change.added) {
          lines.push({ content: line, type: 'added' })
        } else if (change.removed) {
          lines.push({ content: line, type: 'removed' })
        } else {
          lines.push({ content: line, type: 'unchanged' })
        }
      })
    })

    return lines
  }, [config.diffMode, config.diffOriginalCode, code])

  // Cor e opacidade do highlight
  const highlightColor = config.highlightColor || '#facc15'
  const highlightOpacity = config.highlightOpacity || 0.25

  // Handler para toggle de linha destacada
  const handleToggleLineHighlight = useCallback(
    (lineNumber: number) => {
      const currentHighlights = config.highlightedLines || []
      const isHighlighted = currentHighlights.includes(lineNumber)

      if (isHighlighted) {
        // Remove o destaque
        updateConfig(
          'highlightedLines',
          currentHighlights.filter((l) => l !== lineNumber),
        )
      } else {
        // Adiciona o destaque
        updateConfig('highlightedLines', [...currentHighlights, lineNumber])
      }
    },
    [config.highlightedLines, updateConfig],
  )

  // Handlers para annotations
  const handleAddAnnotation = useCallback(
    (type: 'arrow' | 'note', x: number, y: number, targetLine?: number) => {
      // x e y já vêm como coordenadas relativas ao container principal (ref.current)
      // já considerando zoom e padding do handleCodeClick
      const newAnnotation: CodeAnnotation = {
        id: `annotation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        x,
        y,
        targetLine,
        color: '#fbbf24',
        text: type === 'note' ? '' : undefined,
        fontSize: 14,
        opacity: 1,
        style: 'card',
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
      const filteredAnnotations = (config.annotations || []).filter(
        (ann: CodeAnnotation) => ann.id !== id,
      )
      updateConfig('annotations', filteredAnnotations)
    },
    [config.annotations, updateConfig],
  )

  // Handler para clique no código para adicionar anotação
  const handleCodeClick = useCallback(
    (e: React.MouseEvent) => {
      // Só funciona se o modo de anotação estiver ativo
      if (!config.annotationMode) return

      e.stopPropagation()
      e.preventDefault()

      const containerRect = ref.current?.getBoundingClientRect()
      const codeRect = codeContentRef.current?.getBoundingClientRect()

      if (!containerRect || !codeRect) return

      // Posição do clique relativa ao viewport
      const clickX = e.clientX
      const clickY = e.clientY

      // Posição relativa ao container principal (ref), considerando o zoom
      // As anotações são renderizadas dentro do container principal com position: relative
      // Então precisamos coordenadas relativas a ele, já considerando o zoom
      const relativeX = (clickX - containerRect.left) / zoom
      const relativeY = (clickY - containerRect.top) / zoom

      // Calcular linha aproximada baseado na posição Y dentro do código
      const codeRelativeY = clickY - codeRect.top
      const paddingTop = 24 // padding do código (1.5rem)
      const lineHeight = calculatedFontSize * 1.6
      const lineNumber = Math.max(1, Math.floor((codeRelativeY - paddingTop) / lineHeight) + 1)

      // Adiciona anotação na posição clicada (usando coordenadas relativas ao container principal)
      handleAddAnnotation('note', relativeX, relativeY, lineNumber)
    },
    [config.annotationMode, calculatedFontSize, handleAddAnnotation, zoom],
  )

  // Prepara código para syntax highlighting
  const codeForHighlighting = useMemo(() => {
    if (config.diffMode && calculatedDiff) {
      // Junta todas as linhas do diff para exibição
      return calculatedDiff.map((line) => line.content).join('\n')
    }
    return code
  }, [code, config.diffMode, calculatedDiff])

  // Conta o número de linhas do código
  const totalLines = useMemo(() => {
    return (codeForHighlighting || '').split('\n').length
  }, [codeForHighlighting])

  // Handler para clique no número da linha (toggle highlight)
  const handleLineNumberClick = useCallback(
    (lineNumber: number) => {
      if (config.annotationMode) return
      handleToggleLineHighlight(lineNumber)
    },
    [config.annotationMode, handleToggleLineHighlight],
  )

  // Mapeamento de linhas para diff
  const diffLineMapping = useMemo(() => {
    if (!config.diffMode || !calculatedDiff) return {}
    const mapping: Record<number, { type: 'added' | 'removed' | 'unchanged' }> = {}
    calculatedDiff.forEach((line, index) => {
      mapping[index + 1] = { type: line.type }
    })
    return mapping
  }, [config.diffMode, calculatedDiff])

  // Prepara lineProps para SyntaxHighlighter (estilos de diff e highlights)
  // A função recebe um objeto com lineNumber e deve retornar props para o span da linha
  const getLineProps = useCallback(
    (lineNumberObj: number | { lineNumber: number }) => {
      // react-syntax-highlighter pode passar número direto ou objeto
      const lineNumber =
        typeof lineNumberObj === 'number' ? lineNumberObj : lineNumberObj.lineNumber

      // Pega o tipo da linha do diff calculado
      const diffLine = config.diffMode ? diffLineMapping[lineNumber] : null
      const isHighlighted = (config.highlightedLines || []).includes(lineNumber)

      const style: React.CSSProperties = {
        display: 'block',
        width: '100%',
        position: 'relative',
      }

      // Estilos de diff baseado no calculatedDiff
      if (config.diffMode && diffLine) {
        if (diffLine.type === 'added') {
          style.backgroundColor = 'rgba(46, 160, 67, 0.25)'
          style.borderLeft = '4px solid #2ea043'
          style.paddingLeft = 'calc(1.5rem - 4px)'
          style.marginLeft = '-1.5rem'
          style.marginRight = '-1.5rem'
          style.paddingRight = '1.5rem'
        } else if (diffLine.type === 'removed') {
          style.backgroundColor = 'rgba(248, 81, 73, 0.25)'
          style.borderLeft = '4px solid #f85149'
          style.paddingLeft = 'calc(1.5rem - 4px)'
          style.marginLeft = '-1.5rem'
          style.marginRight = '-1.5rem'
          style.paddingRight = '1.5rem'
          style.textDecoration = 'line-through'
          style.opacity = 0.7
        }
        // unchanged não precisa de estilo especial
      }

      // Estilos de highlight (linha destacada) - destaca a linha TODA
      // Só aplica se não estiver em diff mode ou se a linha for unchanged
      if (isHighlighted && (!config.diffMode || !diffLine || diffLine.type === 'unchanged')) {
        style.backgroundColor = hexToRgba(highlightColor, highlightOpacity)
        style.borderLeft = `4px solid ${highlightColor}`
        style.paddingLeft = 'calc(1.5rem - 4px)'
        style.marginLeft = '-1.5rem'
        style.marginRight = '-1.5rem'
        style.paddingRight = '1.5rem'
        style.boxShadow = `inset 0 1px 0 ${hexToRgba(highlightColor, highlightOpacity * 0.6)}, inset 0 -1px 0 ${hexToRgba(highlightColor, highlightOpacity * 0.6)}`
      }

      return {
        style,
        'data-line-number': lineNumber?.toString(),
      }
    },
    [config.diffMode, config.highlightedLines, diffLineMapping, highlightColor, highlightOpacity],
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
              position: 'relative',
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
                  className='code-snapshot-syntax-wrapper relative flex h-full w-full flex-col'
                  style={{
                    fontSize: `${calculatedFontSize}px`,
                    fontFamily: `"${config.fontFamily}", 'Courier New', Courier, monospace`,
                    overflow: availableCodeHeight > 0 ? 'hidden' : 'visible',
                    maxHeight:
                      availableCodeHeight > 0 ? `${availableCodeHeight - headerHeight}px` : 'none',
                    flex: availableCodeHeight > 0 ? '1 1 0' : '0 0 auto',
                    minHeight: 0,
                    width: '100%',
                    height: '100%',
                    cursor: config.annotationMode ? 'crosshair' : 'default',
                  }}
                  onClick={handleCodeClick}
                  onMouseDown={(e) => {
                    // Previne seleção de texto quando em modo de anotação
                    if (config.annotationMode) {
                      e.preventDefault()
                    }
                  }}>
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
                  {/* Wrapper com números de linha customizados */}
                  <div className='relative flex'>
                    {/* Números de linha customizados */}
                    {config.showLineNumbers && (
                      <CustomLineNumbers
                        totalLines={totalLines}
                        fontSize={calculatedFontSize}
                        fontFamily={config.fontFamily}
                        highlightedLines={config.highlightedLines || []}
                        highlightColor={highlightColor}
                        highlightOpacity={highlightOpacity}
                        onLineClick={handleLineNumberClick}
                        disabled={config.annotationMode}
                      />
                    )}

                    {/* Código com syntax highlighting */}
                    <div className='min-w-0 flex-1'>
                      {config.diffMode && calculatedDiff ? (
                        // Modo Diff: renderiza linha por linha com estilos
                        <div
                          style={{
                            margin: 0,
                            padding: '1.5rem',
                            background: 'transparent',
                            fontSize: `${calculatedFontSize}px`,
                            fontFamily: `"${config.fontFamily}", 'Courier New', Courier, monospace`,
                            lineHeight: '1.6',
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                            overflow: availableCodeHeight > 0 ? 'hidden' : 'visible',
                            maxHeight:
                              availableCodeHeight > 0
                                ? `${availableCodeHeight - headerHeight}px`
                                : 'none',
                          }}>
                          {calculatedDiff.map((line, index) => {
                            const lineNumber = index + 1
                            const isHighlighted = (config.highlightedLines || []).includes(
                              lineNumber,
                            )

                            let lineStyle: React.CSSProperties = {
                              display: 'block',
                              width: '100%',
                              position: 'relative',
                            }

                            // Estilos de diff
                            if (line.type === 'added') {
                              lineStyle.backgroundColor = 'rgba(46, 160, 67, 0.25)'
                              lineStyle.borderLeft = '4px solid #2ea043'
                              lineStyle.paddingLeft = 'calc(1.5rem - 4px)'
                              lineStyle.marginLeft = '-1.5rem'
                              lineStyle.marginRight = '-1.5rem'
                              lineStyle.paddingRight = '1.5rem'
                            } else if (line.type === 'removed') {
                              lineStyle.backgroundColor = 'rgba(248, 81, 73, 0.25)'
                              lineStyle.borderLeft = '4px solid #f85149'
                              lineStyle.paddingLeft = 'calc(1.5rem - 4px)'
                              lineStyle.marginLeft = '-1.5rem'
                              lineStyle.marginRight = '-1.5rem'
                              lineStyle.paddingRight = '1.5rem'
                              lineStyle.textDecoration = 'line-through'
                              lineStyle.opacity = 0.7
                            }

                            // Highlight sobrepõe apenas linhas unchanged
                            if (isHighlighted && line.type === 'unchanged') {
                              lineStyle.backgroundColor = hexToRgba(
                                highlightColor,
                                highlightOpacity,
                              )
                              lineStyle.borderLeft = `4px solid ${highlightColor}`
                              lineStyle.paddingLeft = 'calc(1.5rem - 4px)'
                              lineStyle.marginLeft = '-1.5rem'
                              lineStyle.marginRight = '-1.5rem'
                              lineStyle.paddingRight = '1.5rem'
                            }

                            return (
                              <SyntaxHighlighter
                                key={index}
                                language={config.language}
                                style={(themes as any)[config.theme] || themes.vscDarkPlus}
                                customStyle={{
                                  margin: 0,
                                  padding: 0,
                                  background: 'transparent',
                                  fontSize: `${calculatedFontSize}px`,
                                  fontFamily: `"${config.fontFamily}", 'Courier New', Courier, monospace`,
                                  lineHeight: '1.6',
                                  ...lineStyle,
                                }}
                                PreTag='span'
                                CodeTag='span'>
                                {line.content || ' '}
                              </SyntaxHighlighter>
                            )
                          })}
                        </div>
                      ) : (
                        // Modo Normal: renderiza linha por linha para suportar highlights
                        <div
                          style={{
                            margin: 0,
                            padding: '1.5rem',
                            background: 'transparent',
                            fontSize: `${calculatedFontSize}px`,
                            fontFamily: `"${config.fontFamily}", 'Courier New', Courier, monospace`,
                            lineHeight: '1.6',
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                            overflow: availableCodeHeight > 0 ? 'hidden' : 'visible',
                            maxHeight:
                              availableCodeHeight > 0
                                ? `${availableCodeHeight - headerHeight}px`
                                : 'none',
                            pointerEvents: config.annotationMode ? 'none' : 'auto',
                          }}>
                          {(codeForHighlighting || ' ').split('\n').map((line, index) => {
                            const lineNumber = index + 1
                            const isHighlighted = (config.highlightedLines || []).includes(
                              lineNumber,
                            )

                            let lineStyle: React.CSSProperties = {
                              display: 'block',
                              width: '100%',
                              position: 'relative',
                            }

                            // Estilos de highlight (linha destacada) - destaca a linha TODA
                            if (isHighlighted) {
                              lineStyle.backgroundColor = hexToRgba(
                                highlightColor,
                                highlightOpacity,
                              )
                              lineStyle.borderLeft = `4px solid ${highlightColor}`
                              lineStyle.paddingLeft = 'calc(1.5rem - 4px)'
                              lineStyle.marginLeft = '-1.5rem'
                              lineStyle.marginRight = '-1.5rem'
                              lineStyle.paddingRight = '1.5rem'
                              lineStyle.boxShadow = `inset 0 1px 0 ${hexToRgba(highlightColor, highlightOpacity * 0.6)}, inset 0 -1px 0 ${hexToRgba(highlightColor, highlightOpacity * 0.6)}`
                            }

                            return (
                              <SyntaxHighlighter
                                key={index}
                                language={config.language}
                                style={(themes as any)[config.theme] || themes.vscDarkPlus}
                                customStyle={{
                                  margin: 0,
                                  padding: 0,
                                  background: 'transparent',
                                  fontSize: `${calculatedFontSize}px`,
                                  fontFamily: `"${config.fontFamily}", 'Courier New', Courier, monospace`,
                                  lineHeight: '1.6',
                                  ...lineStyle,
                                }}
                                PreTag='span'
                                CodeTag='span'>
                                {line || ' '}
                              </SyntaxHighlighter>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </PreviewCustomLayout>
            </div>

            {/* Anotações flutuantes - renderizadas no container principal para posicionamento correto */}
            {(config.annotations || []).map((annotation: CodeAnnotation) => (
              <CodeAnnotationComponent
                key={annotation.id}
                annotation={annotation}
                onUpdate={handleUpdateAnnotation}
                onDelete={handleDeleteAnnotation}
                scale={zoom}
              />
            ))}
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
