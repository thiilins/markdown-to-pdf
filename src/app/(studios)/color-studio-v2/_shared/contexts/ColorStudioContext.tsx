'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import type {
  ColorData,
  ColorStudioContextType,
  ExportFormat,
  PaletteAlgorithm,
  PaletteHistory,
  PaletteState,
} from '../types'
import { generatePaletteByAlgorithm, generateRandomColor } from '../utils/color-algorithms'

const ColorStudioContext = createContext<ColorStudioContextType | undefined>(undefined)

interface ColorStudioProviderProps {
  children: ReactNode
}

export function ColorStudioProvider({ children }: ColorStudioProviderProps) {
  // Estado principal da paleta
  const [palette, setPalette] = useState<PaletteState>({
    colors: [],
    algorithm: 'random',
  })

  // Histórico (undo/redo)
  const [historyStack, setHistoryStack] = useState<PaletteState[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // Histórico salvo
  const [history, setHistory] = useState<PaletteHistory[]>([])

  // Gerar nova paleta
  const generatePalette = useCallback(
    (algorithm?: PaletteAlgorithm) => {
      const algo = algorithm || palette.algorithm || 'random'
      const baseColor = palette.colors[0]?.hex

      const newColors = generatePaletteByAlgorithm(algo, baseColor, palette.colors)

      const newPalette: PaletteState = {
        colors: newColors,
        algorithm: algo,
        baseColor,
      }

      setPalette(newPalette)

      // Adiciona ao histórico de undo/redo
      setHistoryStack((prev) => [...prev.slice(0, historyIndex + 1), newPalette])
      setHistoryIndex((prev) => prev + 1)
    },
    [palette, historyIndex],
  )

  // Toggle lock de uma cor
  const toggleLock = useCallback((colorId: string) => {
    setPalette((prev) => ({
      ...prev,
      colors: prev.colors.map((c) => (c.id === colorId ? { ...c, locked: !c.locked } : c)),
    }))
  }, [])

  // Adicionar cor
  const addColor = useCallback((color?: ColorData) => {
    const newColor = color || generateRandomColor()
    setPalette((prev) => ({
      ...prev,
      colors: [...prev.colors, newColor],
    }))
  }, [])

  // Remover cor
  const removeColor = useCallback((colorId: string) => {
    setPalette((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c.id !== colorId),
    }))
  }, [])

  // Reordenar cores (drag & drop)
  const reorderColors = useCallback((startIndex: number, endIndex: number) => {
    setPalette((prev) => {
      const newColors = [...prev.colors]
      const [removed] = newColors.splice(startIndex, 1)
      newColors.splice(endIndex, 0, removed)
      return { ...prev, colors: newColors }
    })
  }, [])

  // Adicionar ao histórico salvo
  const addToHistory = useCallback(() => {
    const newHistoryItem: PaletteHistory = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      colors: palette.colors,
      algorithm: palette.algorithm,
      timestamp: Date.now(),
      isFavorite: false,
    }

    setHistory((prev) => [newHistoryItem, ...prev].slice(0, 50)) // Máximo 50
    toast.success('Paleta salva no histórico!')
  }, [palette])

  // Restaurar do histórico
  const restoreFromHistory = useCallback(
    (historyId: string) => {
      const item = history.find((h) => h.id === historyId)
      if (item) {
        setPalette({
          colors: item.colors,
          algorithm: item.algorithm,
        })
        toast.success('Paleta restaurada!')
      }
    },
    [history],
  )

  // Toggle favorito
  const toggleFavorite = useCallback((historyId: string) => {
    setHistory((prev) =>
      prev.map((h) => (h.id === historyId ? { ...h, isFavorite: !h.isFavorite } : h)),
    )
  }, [])

  // Limpar histórico
  const clearHistory = useCallback(() => {
    setHistory((prev) => prev.filter((h) => h.isFavorite))
    toast.success('Histórico limpo! (Favoritos mantidos)')
  }, [])

  // Export paleta
  const exportPalette = useCallback(
    (format: ExportFormat): string => {
      const colors = palette.colors

      switch (format) {
        case 'css':
          return colors.map((c, i) => `--color-${i + 1}: ${c.hex};`).join('\n')

        case 'scss':
          return colors.map((c, i) => `$color-${i + 1}: ${c.hex};`).join('\n')

        case 'tailwind':
          return `colors: {\n${colors.map((c, i) => `  'brand-${i + 1}': '${c.hex}',`).join('\n')}\n}`

        case 'json':
          return JSON.stringify(
            colors.map((c) => c.hex),
            null,
            2,
          )

        case 'figma':
          return JSON.stringify(
            colors.map((c, i) => ({
              name: `Color ${i + 1}`,
              value: c.hex,
            })),
            null,
            2,
          )

        default:
          return colors.map((c) => c.hex).join(', ')
      }
    },
    [palette],
  )

  // Sincronizar com URL (cada página implementa como quiser)
  const syncToURL = useCallback(() => {
    // Implementado por cada página individualmente
  }, [])

  // Carregar da URL (cada página implementa como quiser)
  const loadFromURL = useCallback(() => {
    // Implementado por cada página individualmente
  }, [])

  // Undo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1)
      setPalette(historyStack[historyIndex - 1])
    }
  }, [historyIndex, historyStack])

  // Redo
  const redo = useCallback(() => {
    if (historyIndex < historyStack.length - 1) {
      setHistoryIndex((prev) => prev + 1)
      setPalette(historyStack[historyIndex + 1])
    }
  }, [historyIndex, historyStack])

  const value: ColorStudioContextType = {
    palette,
    setPalette,
    generatePalette,
    toggleLock,
    addColor,
    removeColor,
    reorderColors,
    history,
    addToHistory,
    restoreFromHistory,
    toggleFavorite,
    clearHistory,
    exportPalette,
    syncToURL,
    loadFromURL,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < historyStack.length - 1,
  }

  return <ColorStudioContext.Provider value={value}>{children}</ColorStudioContext.Provider>
}

export function useColorStudio() {
  const context = useContext(ColorStudioContext)
  if (!context) {
    throw new Error('useColorStudio must be used within ColorStudioProvider')
  }
  return context
}
