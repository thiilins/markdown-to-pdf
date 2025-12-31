'use client'

import { toBlob, toPng } from 'html-to-image'
import { Copy, Download, Expand, Loader2, Minus, Square, X, ZoomIn, ZoomOut } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import * as themes from 'react-syntax-highlighter/dist/esm/styles/prism'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PRESET_SIZES, useCodeSnapshot } from '@/shared/contexts/codeSnapshotContext'

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
  const containerRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [isCopying, setIsCopying] = useState(false)

  // Calcula zoom inicial responsivo baseado na largura da tela
  const calculateInitialZoom = useCallback(() => {
    if (typeof window === 'undefined') return config.scale || 1

    const screenWidth = window.innerWidth
    const baseWidth = 1920 // Largura de referência para zoom 100%
    const minWidth = 400 // Largura mínima (mobile)
    const maxZoom = 1
    const minZoom = 0.3

    // Se já tem um zoom configurado manualmente, usa ele
    if (config.scale && config.scale !== 1) {
      return config.scale
    }

    // Calcula zoom proporcional
    if (screenWidth >= baseWidth) {
      return maxZoom
    } else if (screenWidth <= minWidth) {
      return minZoom
    } else {
      // Interpolação linear entre minZoom e maxZoom
      const ratio = (screenWidth - minWidth) / (baseWidth - minWidth)
      return minZoom + (maxZoom - minZoom) * ratio
    }
  }, [config.scale])

  const [zoom, setZoom] = useState(() => calculateInitialZoom())
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState({ x: 0, y: 0 })

  // Atualiza zoom quando a tela redimensiona (apenas se não foi alterado manualmente)
  useEffect(() => {
    if (config.scale === 1 || !config.scale) {
      const handleResize = () => {
        const newZoom = calculateInitialZoom()
        setZoom(newZoom)
        updateConfig('scale', newZoom)
        setPosition({ x: 0, y: 0 })
      }

      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [config.scale, calculateInitialZoom, updateConfig])

  // Calcula dimensões baseado no preset selecionado
  // O tamanho definido é para o resultado FINAL (com background, padding, etc.)
  const selectedPreset = PRESET_SIZES.find((p) => p.id === config.presetSize) || PRESET_SIZES[0]
  const isCustom = config.presetSize === 'custom'
  const finalWidth = isCustom ? 1024 + config.widthOffset : selectedPreset.width
  const finalHeight = isCustom ? 0 : selectedPreset.height // 0 = auto para custom

  // Calcula o espaço disponível para o código (descontando padding, header e footer)
  const headerHeight = config.windowTheme !== 'none' ? 60 : 0
  // Footer aparece se showFooter estiver ativo OU se languagePosition for 'footer' OU se houver texto customizado
  const showLanguageInFooter = config.languagePosition === 'footer'
  const hasCustomText = config.footerCustomText.trim().length > 0
  const hasFooterContent =
    config.showFooter || showLanguageInFooter || hasCustomText || config.footerOptions.length > 0
  const footerHeight = hasFooterContent ? 40 : 0
  const availableCodeHeight =
    finalHeight > 0 ? finalHeight - config.padding * 2 - headerHeight - footerHeight : 0 // 0 = sem limite, estende conforme necessário
  const rafIdRef = useRef<number | null>(null)
  const onPreviewScrollRef = useRef(onPreviewScroll)

  useEffect(() => {
    onPreviewScrollRef.current = onPreviewScroll
  }, [onPreviewScroll])

  // Sincronizar ref externa com ref interna
  useEffect(() => {
    if (previewContainerRef && containerRef.current) {
      ;(previewContainerRef as React.MutableRefObject<HTMLDivElement | null>).current =
        containerRef.current
    }
  }, [previewContainerRef])

  // Atualizar ref quando zoom mudar
  useEffect(() => {
    if (previewContainerRef && containerRef.current) {
      ;(previewContainerRef as React.MutableRefObject<HTMLDivElement | null>).current =
        containerRef.current
    }
  }, [zoom, previewContainerRef])

  // Sincronizar scroll do preview com o editor
  useEffect(() => {
    const container = containerRef.current
    if (!container || !onPreviewScroll) return

    const handleScroll = () => {
      // Evita loop infinito quando scroll é programático (vindo do editor)
      if (isSyncingFromEditor?.current) return

      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
      }

      rafIdRef.current = requestAnimationFrame(() => {
        if (onPreviewScrollRef.current && !isSyncingFromEditor?.current) {
          const scrollableHeight = container.scrollHeight - container.clientHeight
          if (scrollableHeight > 0) {
            const percentage = container.scrollTop / scrollableHeight
            onPreviewScrollRef.current(percentage)
          }
        }
        rafIdRef.current = null
      })
    }

    container.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      container.removeEventListener('scroll', handleScroll)
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [onPreviewScroll, isSyncingFromEditor])

  // Carregar fonte do Google Fonts dinamicamente
  useEffect(() => {
    // Fontes do sistema que não precisam ser carregadas
    const systemFonts = ['Consolas', 'Monaco', 'Courier New', 'Menlo', 'SF Mono']

    if (systemFonts.includes(config.fontFamily)) {
      return // Fontes do sistema não precisam ser carregadas
    }

    const getGoogleFontName = (fontName: string) => {
      const fontMap: Record<string, string> = {
        'Fira Code': 'Fira+Code',
        'JetBrains Mono': 'JetBrains+Mono',
        'Source Code Pro': 'Source+Code+Pro',
        'Roboto Mono': 'Roboto+Mono',
        'Cascadia Code': 'Cascadia+Code',
        'IBM Plex Mono': 'IBM+Plex+Mono',
        'Space Mono': 'Space+Mono',
        'Ubuntu Mono': 'Ubuntu+Mono',
        'Droid Sans Mono': 'Droid+Sans+Mono',
        Hack: 'Hack',
        Inconsolata: 'Inconsolata',
      }
      return fontMap[fontName] || fontName.replace(/\s+/g, '+')
    }

    const googleFontName = getGoogleFontName(config.fontFamily)
    const fontId = 'code-snapshot-font-loader'

    // Remover link anterior se existir
    const existingLink = document.getElementById(fontId) as HTMLLinkElement
    if (existingLink) {
      existingLink.remove()
    }

    // Criar novo link para a fonte
    const linkElement = document.createElement('link')
    linkElement.id = fontId
    linkElement.rel = 'stylesheet'
    linkElement.href = `https://fonts.googleapis.com/css2?family=${googleFontName}:wght@300;400;500;600;700&display=swap`
    document.head.appendChild(linkElement)

    // Aguardar a fonte carregar antes de aplicar
    if (document.fonts) {
      const checkFont = async () => {
        try {
          await document.fonts.ready
          // Força re-render após carregar a fonte
          const fontFace = new FontFace(
            config.fontFamily,
            `url(https://fonts.gstatic.com/s/${googleFontName.toLowerCase().replace(/\+/g, '')}/v*/)`,
          )
          await fontFace.load()
          document.fonts.add(fontFace)
        } catch (error) {
          // Ignora erros de carregamento, usa fallback
          console.warn(`Fonte ${config.fontFamily} não pôde ser carregada, usando fallback`)
        }
      }
      checkFont()
    }
  }, [config.fontFamily])

  // Função auxiliar para lidar com promessas de imagem
  const processImage = async (action: 'blob' | 'png') => {
    if (!ref.current) return null

    // Pequeno hack para garantir que fontes customizadas carreguem no canvas
    await document.fonts.ready
    await new Promise((resolve) => setTimeout(resolve, 150))

    const options = {
      cacheBust: true,
      pixelRatio: 3, // Alta qualidade
      style: { margin: '0' },
    }

    return action === 'blob' ? toBlob(ref.current, options) : toPng(ref.current, options)
  }

  const handleDownload = async () => {
    setIsExporting(true)
    try {
      const dataUrl = (await processImage('png')) as string
      const link = document.createElement('a')
      link.download = `snippet-${new Date().toISOString().slice(0, 10)}.png`
      link.href = dataUrl
      link.click()
      toast.success('Snippet salvo com sucesso!')
    } catch (err) {
      console.error(err)
      toast.error('Falha ao exportar imagem.')
    } finally {
      setIsExporting(false)
    }
  }

  const handleCopyImage = async () => {
    setIsCopying(true)
    try {
      const blob = (await processImage('blob')) as Blob
      if (blob) {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        toast.success('Copiado para a área de transferência!')
      }
    } catch (err) {
      console.error(err)
      toast.error('Falha ao copiar imagem.')
    } finally {
      setIsCopying(false)
    }
  }

  // Centraliza o preview quando o zoom muda
  const centerPreview = useCallback(
    (currentZoom?: number) => {
      const zoomToUse = currentZoom ?? zoom

      if (!containerRef.current || !ref.current || zoomToUse === 1) {
        setPosition({ x: 0, y: 0 })
        if (containerRef.current) {
          containerRef.current.scrollLeft = 0
          containerRef.current.scrollTop = 0
        }
        return
      }

      requestAnimationFrame(() => {
        if (!containerRef.current || !ref.current) return

        const container = containerRef.current
        const content = ref.current

        // Calcula a posição central
        const containerWidth = container.clientWidth
        const containerHeight = container.clientHeight
        const contentWidth = content.offsetWidth * zoomToUse
        const contentHeight = content.offsetHeight * zoomToUse

        // Centraliza horizontalmente e verticalmente
        const centerX = (containerWidth - contentWidth) / 2
        const centerY = (containerHeight - contentHeight) / 2

        setPosition({
          x: centerX,
          y: centerY,
        })

        // Centraliza o scroll também
        if (contentWidth > containerWidth) {
          container.scrollLeft = (contentWidth - containerWidth) / 2
        } else {
          container.scrollLeft = 0
        }
        if (contentHeight > containerHeight) {
          container.scrollTop = (contentHeight - containerHeight) / 2
        } else {
          container.scrollTop = 0
        }
      })
    },
    [zoom],
  )

  // Controles de Zoom
  const handleZoomIn = useCallback(() => {
    const newZoom = Math.min(zoom + 0.1, 3)
    setZoom(newZoom)
    updateConfig('scale', newZoom)
    // Centraliza após mudar zoom (aguarda renderização)
    setTimeout(() => {
      centerPreview(newZoom)
    }, 50)
  }, [zoom, updateConfig, centerPreview])

  const handleZoomOut = useCallback(() => {
    const newZoom = Math.max(zoom - 0.1, 0.5)
    setZoom(newZoom)
    updateConfig('scale', newZoom)
    // Centraliza após mudar zoom (aguarda renderização)
    setTimeout(() => {
      centerPreview(newZoom)
    }, 50)
  }, [zoom, updateConfig, centerPreview])

  const handleZoomReset = useCallback(() => {
    const resetZoom = calculateInitialZoom()
    setZoom(resetZoom)
    setPosition({ x: 0, y: 0 })
    updateConfig('scale', resetZoom)
    // Garante que o scroll volte ao topo
    if (containerRef.current) {
      containerRef.current.scrollTop = 0
      containerRef.current.scrollLeft = 0
    }
  }, [updateConfig, calculateInitialZoom])

  // Atualiza zoom quando config.scale mudar externamente
  useEffect(() => {
    if (config.scale !== zoom) {
      setZoom(config.scale)
      if (config.scale === 1) {
        setPosition({ x: 0, y: 0 })
      }
    }
  }, [config.scale, zoom])

  // Drag para mover quando zoom !== 1
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (zoom !== 1) {
        setIsDragging(true)
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
      }
    },
    [zoom, position],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging && zoom !== 1) {
        // Limita position.y para não ultrapassar o topo (não pode ser negativo)
        const newX = e.clientX - dragStart.x
        const newY = Math.max(0, e.clientY - dragStart.y) // Não permite valores negativos

        setPosition({
          x: newX,
          y: newY,
        })
      }
    },
    [isDragging, zoom, dragStart],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Wheel zoom
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const delta = e.deltaY > 0 ? -0.1 : 0.1
        const newZoom = Math.max(0.5, Math.min(3, zoom + delta))
        setZoom(newZoom)
        updateConfig('scale', newZoom)
        // Centraliza após mudar zoom (aguarda renderização)
        setTimeout(() => {
          centerPreview(newZoom)
        }, 50)
      }
    },
    [zoom, updateConfig, centerPreview],
  )

  // Centraliza quando zoom muda externamente
  useEffect(() => {
    if (config.scale !== zoom) {
      setZoom(config.scale)
      if (config.scale !== 1) {
        setTimeout(() => {
          centerPreview(config.scale)
        }, 100)
      } else {
        setPosition({ x: 0, y: 0 })
        if (containerRef.current) {
          containerRef.current.scrollLeft = 0
          containerRef.current.scrollTop = 0
        }
      }
    }
  }, [config.scale, zoom, centerPreview])

  const WindowHeader = () => {
    if (config.windowTheme === 'none') return null

    const languageDisplay = config.language.charAt(0).toUpperCase() + config.language.slice(1)
    const showLanguageInHeader = config.languagePosition === 'header'
    const hasContent = config.showHeaderTitle || showLanguageInHeader
    const borderRadius = config.borderRadius - 4

    if (config.windowTheme === 'mac') {
      return (
        <div
          className='flex items-center justify-between px-4 py-3 select-none'
          style={{
            borderTopLeftRadius: `${borderRadius}px`,
            borderTopRightRadius: `${borderRadius}px`,
          }}>
          <div className='flex items-center gap-3'>
            <div className='flex gap-1.5'>
              <div className='h-3 w-3 rounded-full bg-[#ff5f56] shadow-inner' />
              <div className='h-3 w-3 rounded-full bg-[#ffbd2e] shadow-inner' />
              <div className='h-3 w-3 rounded-full bg-[#27c93f] shadow-inner' />
            </div>
            {hasContent && (
              <div className='flex items-center gap-2 text-xs text-zinc-400'>
                {config.showHeaderTitle && (
                  <span className='font-medium text-zinc-300'>
                    {config.headerTitle || 'code.ts'}
                  </span>
                )}
                {config.showHeaderTitle && showLanguageInHeader && (
                  <span className='text-zinc-500'>•</span>
                )}
                {showLanguageInHeader && (
                  <span className='tracking-wider uppercase'>{languageDisplay}</span>
                )}
              </div>
            )}
          </div>
        </div>
      )
    }

    if (config.windowTheme === 'windows') {
      return (
        <div
          className='flex items-center justify-between border-b border-white/10 bg-[#2d2d30] px-2 py-1.5 select-none'
          style={{
            borderTopLeftRadius: `${borderRadius}px`,
            borderTopRightRadius: `${borderRadius}px`,
          }}>
          <div className='flex items-center gap-3'>
            <div className='flex items-center gap-1.5 px-2'>
              <div className='h-1 w-1 rounded-full bg-white/40' />
              <div className='h-1 w-1 rounded-full bg-white/40' />
              <div className='h-1 w-1 rounded-full bg-white/40' />
            </div>
            {hasContent && (
              <div className='flex items-center gap-2 text-[10px] text-white/60'>
                {config.showHeaderTitle && (
                  <span className='font-medium text-white/80'>
                    {config.headerTitle || 'code.ts'}
                  </span>
                )}
                {config.showHeaderTitle && showLanguageInHeader && (
                  <span className='text-white/40'>•</span>
                )}
                {showLanguageInHeader && (
                  <span className='tracking-wider uppercase'>{languageDisplay}</span>
                )}
              </div>
            )}
          </div>
          <div className='flex items-center gap-1'>
            <button
              className='flex h-6 w-6 items-center justify-center text-white/60 transition-colors hover:bg-white/10 hover:text-white'
              aria-label='Minimizar'>
              <Minus className='h-3.5 w-3.5' strokeWidth={2.5} />
            </button>
            <button
              className='flex h-6 w-6 items-center justify-center text-white/60 transition-colors hover:bg-white/10 hover:text-white'
              aria-label='Maximizar'>
              <Square className='h-3 w-3' strokeWidth={2.5} />
            </button>
            <button
              className='flex h-6 w-6 items-center justify-center text-white/60 transition-colors hover:bg-[#e81123] hover:text-white'
              aria-label='Fechar'>
              <X className='h-3.5 w-3.5' strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )
    }

    if (config.windowTheme === 'linux') {
      return (
        <div
          className='flex items-center justify-between border-b border-white/10 bg-[#383c4a] px-3 py-2 select-none'
          style={{
            borderTopLeftRadius: `${borderRadius}px`,
            borderTopRightRadius: `${borderRadius}px`,
          }}>
          <div className='flex items-center gap-3'>
            <div className='flex gap-1.5'>
              <div className='h-2.5 w-2.5 rounded-sm bg-[#ed333b]' />
              <div className='h-2.5 w-2.5 rounded-sm bg-[#f39c12]' />
              <div className='h-2.5 w-2.5 rounded-sm bg-[#52b788]' />
            </div>
            {hasContent && (
              <div className='flex items-center gap-2 text-[10px] text-white/70'>
                {config.showHeaderTitle && (
                  <span className='font-medium text-white/90'>
                    {config.headerTitle || 'code.ts'}
                  </span>
                )}
                {config.showHeaderTitle && showLanguageInHeader && (
                  <span className='text-white/50'>•</span>
                )}
                {showLanguageInHeader && (
                  <span className='tracking-wider uppercase'>{languageDisplay}</span>
                )}
              </div>
            )}
          </div>
          <div className='flex items-center gap-1'>
            <button className='flex h-5 w-5 items-center justify-center text-white/60 hover:bg-white/10'>
              <Minus className='h-3 w-3' strokeWidth={2.5} />
            </button>
            <button className='flex h-5 w-5 items-center justify-center text-white/60 hover:bg-white/10'>
              <Square className='h-2.5 w-2.5' strokeWidth={2.5} />
            </button>
            <button className='flex h-5 w-5 items-center justify-center text-white/60 hover:bg-[#ed333b]'>
              <X className='h-3 w-3' strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )
    }

    if (config.windowTheme === 'chrome') {
      return (
        <div
          className='flex items-center justify-between border-b border-white/5 bg-[#323232] px-3 py-2 select-none'
          style={{
            borderTopLeftRadius: `${borderRadius}px`,
            borderTopRightRadius: `${borderRadius}px`,
          }}>
          <div className='flex items-center gap-3'>
            <div className='flex items-center gap-1.5'>
              <div className='h-2 w-2 rounded-full bg-[#ea4335]' />
              <div className='h-2 w-2 rounded-full bg-[#fbbc04]' />
              <div className='h-2 w-2 rounded-full bg-[#34a853]' />
            </div>
            {hasContent && (
              <div className='flex items-center gap-2 text-[10px] text-white/60'>
                {config.showHeaderTitle && (
                  <span className='font-medium text-white/80'>
                    {config.headerTitle || 'code.ts'}
                  </span>
                )}
                {config.showHeaderTitle && showLanguageInHeader && (
                  <span className='text-white/40'>•</span>
                )}
                {showLanguageInHeader && (
                  <span className='tracking-wider uppercase'>{languageDisplay}</span>
                )}
              </div>
            )}
          </div>
          <div className='flex items-center gap-1'>
            <button className='flex h-6 w-6 items-center justify-center text-white/50 hover:bg-white/10'>
              <Minus className='h-3.5 w-3.5' strokeWidth={2} />
            </button>
            <button className='flex h-6 w-6 items-center justify-center text-white/50 hover:bg-white/10'>
              <Square className='h-3 w-3' strokeWidth={2} />
            </button>
            <button className='flex h-6 w-6 items-center justify-center text-white/50 hover:bg-[#ea4335]'>
              <X className='h-3.5 w-3.5' strokeWidth={2} />
            </button>
          </div>
        </div>
      )
    }

    if (config.windowTheme === 'vscode') {
      return (
        <div
          className='flex items-center justify-between border-b border-white/5 bg-[#1e1e1e] px-3 py-2 select-none'
          style={{
            borderTopLeftRadius: `${borderRadius}px`,
            borderTopRightRadius: `${borderRadius}px`,
          }}>
          <div className='flex items-center gap-3'>
            <div className='flex items-center gap-1.5'>
              <div className='h-2 w-2 rounded-full bg-[#ff5f56]' />
              <div className='h-2 w-2 rounded-full bg-[#ffbd2e]' />
              <div className='h-2 w-2 rounded-full bg-[#27c93f]' />
            </div>
            {hasContent && (
              <div className='flex items-center gap-2 text-[10px] text-white/60'>
                {config.showHeaderTitle && (
                  <span className='font-medium text-white/80'>
                    {config.headerTitle || 'code.ts'}
                  </span>
                )}
                {config.showHeaderTitle && showLanguageInHeader && (
                  <span className='text-white/40'>•</span>
                )}
                {showLanguageInHeader && (
                  <span className='tracking-wider uppercase'>{languageDisplay}</span>
                )}
              </div>
            )}
          </div>
          <div className='flex items-center gap-1'>
            <button className='flex h-5 w-5 items-center justify-center text-white/50 hover:bg-white/10'>
              <Minus className='h-3 w-3' strokeWidth={2} />
            </button>
            <button className='flex h-5 w-5 items-center justify-center text-white/50 hover:bg-white/10'>
              <Square className='h-2.5 w-2.5' strokeWidth={2} />
            </button>
            <button className='flex h-5 w-5 items-center justify-center text-white/50 hover:bg-[#ff5f56]'>
              <X className='h-3 w-3' strokeWidth={2} />
            </button>
          </div>
        </div>
      )
    }

    return null
  }

  const WindowFooter = () => {
    // Footer aparece se showFooter estiver ativo OU se languagePosition for 'footer' OU se houver texto customizado
    const showLanguageInFooter = config.languagePosition === 'footer'
    const hasCustomText = config.footerCustomText.trim().length > 0
    const hasFooterOptions = config.footerOptions.length > 0

    if (!config.showFooter && !showLanguageInFooter && !hasCustomText) return null

    const languageDisplay = config.language.charAt(0).toUpperCase() + config.language.slice(1)
    const lineCount = code.split('\n').length
    const charCount = code.length

    // Coleta todos os itens do footer
    const footerItems: string[] = []

    // Adiciona linguagem se estiver configurada para footer (sempre aparece quando languagePosition === 'footer')
    if (showLanguageInFooter) {
      footerItems.push(languageDisplay)
    }

    // Processa opções do footer (só se showFooter estiver ativo)
    if (config.showFooter) {
      config.footerOptions.forEach((option) => {
        switch (option) {
          case 'linguagem':
            // Só adiciona se não estiver já adicionada por languagePosition
            if (!showLanguageInFooter) {
              footerItems.push(languageDisplay)
            }
            break
          case 'linhas':
            footerItems.push(`${lineCount} ${lineCount === 1 ? 'linha' : 'linhas'}`)
            break
          case 'caracteres':
            footerItems.push(`${charCount.toLocaleString()} caracteres`)
            break
          case 'texto':
            // Adiciona texto customizado se houver
            if (config.footerCustomText.trim()) {
              footerItems.push(config.footerCustomText)
            }
            break
          default:
            // Permite texto livre
            if (option.trim()) {
              footerItems.push(option)
            }
        }
      })

      // Adiciona texto customizado se não estiver nas opções
      if (config.footerCustomText.trim() && !config.footerOptions.includes('texto')) {
        footerItems.push(config.footerCustomText)
      }
    } else {
      // Se showFooter estiver desativado mas houver texto customizado, adiciona
      if (hasCustomText) {
        footerItems.push(config.footerCustomText)
      }
    }

    if (footerItems.length === 0) return null

    const positionClasses = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
    }

    const borderRadius = config.borderRadius - 4

    return (
      <div
        className={cn(
          'border-t border-white/10 bg-[#0d0d0d]/50 px-4 py-2 select-none',
          'flex items-center gap-3 text-[10px] text-zinc-400',
          positionClasses[config.footerPosition],
        )}
        style={{
          borderBottomLeftRadius: `${borderRadius}px`,
          borderBottomRightRadius: `${borderRadius}px`,
        }}>
        {footerItems.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <span className='text-zinc-600'>•</span>}
            <span className='tracking-wider uppercase'>{item}</span>
          </React.Fragment>
        ))}
      </div>
    )
  }

  return (
    <div
      className='relative flex h-full w-full flex-col bg-zinc-50 dark:bg-zinc-950'
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}>
      {/* Background Pattern - Igual ao web-extractor */}
      <div className='pointer-events-none absolute inset-0 z-0'>
        <div className='absolute inset-0 h-full w-full bg-linear-to-b from-blue-50 to-transparent dark:from-blue-950/20' />
        <div className='absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]' />
      </div>

      {/* Toolbar Superior */}
      <div className='bg-background/95 hover:bg-background border-border/50 absolute top-3 right-3 z-50 flex items-center justify-between gap-2 rounded-lg border px-3 py-2 shadow-lg backdrop-blur-md transition-all'>
        <div className='flex items-center gap-1.5'>
          <Button
            variant='ghost'
            size='sm'
            className='hover:bg-muted h-7 rounded-md px-2.5 text-xs font-medium'
            onClick={handleCopyImage}
            disabled={isCopying || isExporting}>
            {isCopying ? (
              <Loader2 className='mr-1.5 h-3 w-3 animate-spin' />
            ) : (
              <Copy className='mr-1.5 h-3 w-3' />
            )}
          </Button>
          <Button
            size='sm'
            className='h-7 rounded-md px-3 text-xs font-medium shadow-sm'
            onClick={handleDownload}
            disabled={isCopying || isExporting}>
            {isExporting ? (
              <Loader2 className='h-3 w-3 animate-spin' />
            ) : (
              <Download className='h-3 w-3' />
            )}
          </Button>
        </div>

        {/* Controles de Zoom */}
        <div className='flex items-center gap-1.5'>
          <Button
            variant='ghost'
            size='sm'
            className='hover:bg-muted h-7 w-7 rounded-md p-0'
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
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
            disabled={zoom >= 3}
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

      {/* Container de Preview com Zoom e Scroll */}
      <div
        ref={containerRef}
        className={cn(
          'custom-scrollbar relative z-10 flex flex-1',
          zoom !== 1 ? 'overflow-auto p-12' : 'overflow-x-hidden overflow-y-auto p-12 pt-4',
          zoom !== 1 && 'cursor-grab',
          isDragging && 'cursor-grabbing',
        )}
        onWheel={handleWheel}
        id='preview-container'
        style={{
          scrollBehavior: 'smooth',
        }}
        onScroll={(e) => {
          // Previne scroll negativo (não permite ultrapassar o topo)
          if (e.currentTarget.scrollTop < 0) {
            e.currentTarget.scrollTop = 0
          }
        }}>
        <div
          className={cn(
            'transition-transform duration-200 ease-out',
            'flex w-full items-center justify-center', // Centralizado
          )}
          style={
            {
              transform: `translate3d(${zoom !== 1 ? position.x : 0}px, ${zoom !== 1 ? position.y : 0}px, 0) scale(${zoom})`,
              transformOrigin: 'center center', // Centralizado
              width: zoom === 1 ? '100%' : 'auto',
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              display: 'flex',
            } as React.CSSProperties
          }>
          <div
            ref={ref}
            onMouseDown={handleMouseDown}
            style={{
              background: config.background,
              padding: `${config.padding}px`,
              borderRadius: `${config.borderRadius}px`,
              // Tamanho FINAL da imagem (com background e padding) - SEM SOMBRA AQUI
              width: `${finalWidth}px`,
              minWidth: `${finalWidth}px`,
              maxWidth: `${finalWidth}px`,
              // Altura: se definida, usa o tamanho exato; se não, estende conforme necessário
              height: finalHeight > 0 ? `${finalHeight}px` : 'auto',
              minHeight: finalHeight > 0 ? `${finalHeight}px` : 'auto',
              // Se o conteúdo for maior, estende a imagem (não limita)
              maxHeight: 'none', // Permite estender se necessário
              // Flexbox para posicionamento vertical do conteúdo
              display: 'flex',
              flexDirection: 'column',
              // Sempre aplica alinhamento vertical quando há altura definida
              justifyContent:
                finalHeight > 0
                  ? config.contentVerticalAlign === 'top'
                    ? 'flex-start'
                    : config.contentVerticalAlign === 'bottom'
                      ? 'flex-end'
                      : 'center'
                  : 'flex-start', // Sem altura definida, começa no topo
            }}
            className='relative transition-all duration-300 ease-in-out'>
            {/* Container do Código */}
            <div
              className='bg-[#0d0d0d] ring-1 ring-white/10'
              style={{
                fontFamily: config.fontFamily,
                borderRadius: `${config.borderRadius - 4}px`,
                // Sombra aplicada na janela de código (sobre o gradiente)
                boxShadow: `0 ${config.shadowIntensity}px ${config.shadowIntensity * 1.5}px -${config.shadowIntensity / 2}px rgba(0,0,0,${Math.min(0.5, config.shadowIntensity / 200)})`,
                height: 'auto', // Sempre auto para permitir extensão
                minHeight: '0', // Não força altura mínima para permitir posicionamento flexível
                flexShrink: 0, // Não encolhe, mantém tamanho do conteúdo
                // Se o conteúdo for maior que o espaço disponível, estende (não limita)
                maxHeight: 'none', // Permite estender se necessário
                overflow: 'visible', // Permite estender, mas quebra linhas
                display: 'flex',
                flexDirection: 'column',
                // O posicionamento vertical é controlado pelo container pai (justifyContent)
              }}>
              <WindowHeader />

              <div
                className='code-snapshot-syntax-wrapper relative'
                style={{
                  fontSize: `${config.fontSize}px`,
                  fontFamily: `"${config.fontFamily}", 'Courier New', Courier, monospace`,
                }}>
                <style>{`
                  .code-snapshot-syntax-wrapper pre,
                  .code-snapshot-syntax-wrapper code,
                  .code-snapshot-syntax-wrapper pre *,
                  .code-snapshot-syntax-wrapper code *,
                  .code-snapshot-syntax-wrapper .token,
                  .code-snapshot-syntax-wrapper span {
                    font-family: "${config.fontFamily}", 'Courier New', Courier, monospace !important;
                    font-size: ${config.fontSize}px !important;
                  }
                `}</style>
                <SyntaxHighlighter
                  language={config.language}
                  style={(themes as any)[config.theme] || themes.vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    padding: '1.5rem',
                    background: 'transparent',
                    fontSize: `${config.fontSize}px`,
                    fontFamily: `"${config.fontFamily}", 'Courier New', Courier, monospace`,
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap', // Sempre quebra linha para evitar scroll horizontal
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    wordBreak: 'break-word',
                    overflow: 'visible', // Permite estender verticalmente se necessário
                    maxWidth: '100%',
                    width: '100%',
                  }}
                  wrapLines={true} // Sempre ativo
                  wrapLongLines={true} // Sempre ativo
                  PreTag={({ children, ...props }: any) => (
                    <pre
                      {...props}
                      style={{
                        ...props.style,
                        fontSize: `${config.fontSize}px !important`,
                        fontFamily: `"${config.fontFamily}", 'Courier New', Courier, monospace !important`,
                      }}>
                      {children}
                    </pre>
                  )}
                  CodeTag={({ children, ...props }: any) => (
                    <code
                      {...props}
                      style={{
                        ...props.style,
                        fontSize: `${config.fontSize}px !important`,
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
                    fontSize: `${config.fontSize}px`,
                    fontFamily: `"${config.fontFamily}", 'Courier New', Courier, monospace`,
                  }}>
                  {code || ' '}
                </SyntaxHighlighter>
              </div>
              <WindowFooter />
            </div>
          </div>
        </div>
      </div>

      {/* Dica de Zoom */}
      {zoom === 1 && (
        <div className='text-muted-foreground absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-medium opacity-40'>
          Ctrl + Scroll para zoom • Arraste quando ampliado
        </div>
      )}
    </div>
  )
}
