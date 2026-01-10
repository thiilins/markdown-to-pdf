'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import chroma from 'chroma-js'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useColorStudio } from '../../../_shared/contexts/ColorStudioContext'
import { useSVGTemplates } from '../svg-loader'
import { VisualizerFooter } from './footer'
import { FullscreenPreviewVisualizer } from './fullscreen-preview'
import { VisualizerHeader } from './header'
import { VisualizerTemplates } from './templates'
import { VisualizerTooltip } from './tooltip'

export function VisualizerView() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const {
    algorithm,
    onSetAlgorithm,
    colors,
    onSetColors,
    syncColorsToURL,
    onGenerateNewPalette,
    onShuffleColors,
    onUpdateColor,
    onAddColor,
    onRemoveColor,
    onToggleLock,
    syncTimeoutRef,
  } = useColorStudio()

  const [activeCategory, setActiveCategory] = useState('all')
  const [fullscreenId, setFullscreenId] = useState<string | null>(null)
  const [hoverData, setHoverData] = useState<{ color: string; x: number; y: number } | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Carrega SVGs dinamicamente
  const { templates, isLoading } = useSVGTemplates()

  // Injeção de Variáveis CSS para os SVGs reagirem em tempo real
  // ✅ BUGFIX: Agora injeta TODAS as cores dinamicamente (--c1 até --c10+)
  const colorVariables = useMemo(() => {
    const vars: any = { '--white': '#FFFFFF', '--bg-app': '#F5F5F7' }
    colors.forEach((c, i) => {
      vars[`--c${i + 1}`] = c.hex
    })
    return vars
  }, [colors])

  const generateNewPalette = useCallback(() => {
    const newColors = onGenerateNewPalette()
    syncColorsToURL(newColors, true)
  }, [syncColorsToURL, onGenerateNewPalette])

  const handleShuffle = useCallback(() => {
    const shuffledColors = onShuffleColors()
    syncColorsToURL(shuffledColors, true) // immediate = true
  }, [syncColorsToURL, onShuffleColors])

  const handleCopy = useCallback((color: string) => {
    const hex = chroma(color).hex().toUpperCase()
    navigator.clipboard.writeText(hex)
    toast.success(`Copiado: ${hex}`)
  }, [])

  // --- FUNÇÕES DA PALETA ---
  const handleColorChange = useCallback(
    (id: string, newColor: string) => {
      const updated = onUpdateColor(id, newColor)
      syncColorsToURL(updated, true) // debounced (300ms) para o color picker
    },
    [syncColorsToURL, onUpdateColor],
  )

  const addColor = useCallback(() => {
    const newColors = onAddColor(colors.length)
    syncColorsToURL(newColors, true) // immediate = true para adicionar cor
  }, [colors, onAddColor, syncColorsToURL])

  const removeColor = useCallback(
    (id: string) => {
      const newColors = onRemoveColor(id)
      syncColorsToURL(newColors, true) // immediate = true para remover cor
    },
    [onRemoveColor, syncColorsToURL],
  )

  const toggleLock = useCallback(
    (id: string) => {
      return onToggleLock(id)
    },
    [onToggleLock],
  )

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return
      if (e.code === 'Space') {
        e.preventDefault()
        generateNewPalette()
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [generateNewPalette])

  return (
    <div className='relative flex h-[calc(100vh-4rem)] w-full flex-col'>
      <VisualizerTooltip hoverData={hoverData} />
      <VisualizerHeader activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      <ScrollArea className='flex-1'>
        <main className='mx-auto w-full max-w-7xl p-8 pb-48'>
          <VisualizerTemplates
            loading={isLoading}
            templates={templates}
            activeCategory={activeCategory}
            colorVariables={colorVariables}
            setHoverData={setHoverData}
            handleCopy={handleCopy}
            setFullscreenId={setFullscreenId}
          />
        </main>
      </ScrollArea>
      {/* 4. LIGHTBOX TELA CHEIA (FULLSCREEN REAL) */}
      <FullscreenPreviewVisualizer
        fullscreenId={fullscreenId}
        colorVariables={colorVariables}
        setFullscreenId={setFullscreenId}
        templates={templates}
        setHoverData={setHoverData}
        handleCopy={handleCopy}
      />
      <VisualizerFooter
        generate={generateNewPalette}
        colors={colors}
        handleColorChange={handleColorChange}
        removeColor={removeColor}
        toggleLock={toggleLock}
        addColor={addColor}
        handleShuffle={handleShuffle}
      />
    </div>
  )
}
