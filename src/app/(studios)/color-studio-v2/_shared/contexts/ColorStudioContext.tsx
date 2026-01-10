'use client'

import { createContext, useCallback, useContext, useRef, type ReactNode } from 'react'
import { toast } from 'sonner'

import usePersistedStateInDB from '@/hooks/use-persisted-in-db'
import { useRouter } from 'next/navigation'
import {
  addRandomColorFn,
  generateNewPaletteFn,
  removeColorFn,
  shuffleColorsFn,
  toogleColorLockFn,
} from '../utils'

const ColorStudioContext = createContext<ColorStudioContextType | undefined>(undefined)

interface ColorStudioProviderProps {
  children: ReactNode
}

export function ColorStudioProvider({ children }: ColorStudioProviderProps) {
  const router = useRouter()
  const [pallete, setPallete] = usePersistedStateInDB<{
    color: GeneratorColor[]
    algorithm: PaletteAlgorithm
  }>('color-studio-v2-pallete', {
    color: [],
    algorithm: 'complementary',
  })
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [historyState, setHistoryState] = usePersistedStateInDB<{
    history: PaletteHistory[]
    historyIndex: number
  }>('color-studio-v2-history', {
    history: [],
    historyIndex: -1,
  })
  const onAddToHistory = useCallback(
    (colors: GeneratorColor[], algorithm: PaletteAlgorithm) => {
      const newHistoryItem: PaletteHistory = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        colors: colors,
        algorithm: algorithm,
        timestamp: Date.now(),
        isFavorite: false,
      }

      setHistoryState({
        history: [newHistoryItem, ...historyState.history].slice(0, 50),
        historyIndex: historyState.historyIndex + 1,
      })
    },
    [historyState, setHistoryState],
  )

  // Restaurar do histórico
  const onRestoreFromHistory = useCallback(
    (historyId: string) => {
      const item = historyState.history.find((h) => h.id === historyId)
      if (!item) {
        return pallete.color
      }
      setPallete({
        color: item.colors,
        algorithm: item.algorithm,
      })
      toast.success('Paleta restaurada!')
      return item.colors
    },
    [historyState.history, pallete.color, setPallete],
  )

  // Toggle favorito
  const onToggleFavorite = useCallback(
    (historyId: string) => {
      const newState = historyState.history.map((h) =>
        h.id === historyId ? { ...h, isFavorite: !h.isFavorite } : h,
      )
      setHistoryState({
        ...historyState,
        history: newState,
      })
    },
    [historyState, setHistoryState],
  )

  const onShuffleColors = useCallback(() => {
    const shuffledColors = shuffleColorsFn(pallete.color)
    setPallete({
      color: shuffledColors,
      algorithm: pallete.algorithm,
    })
    return shuffledColors
  }, [pallete, setPallete])
  const onClearHistory = useCallback(() => {
    setHistoryState({
      history: [],
      historyIndex: 0,
    })
    toast.success('Histórico limpo! ')
  }, [setHistoryState])

  // Undo
  const onUndo = useCallback(() => {
    if (historyState.historyIndex && historyState.historyIndex > 0) {
      setHistoryState({
        ...historyState,
        historyIndex: historyState.historyIndex - 1,
      })
      return historyState.history[historyState.historyIndex - 1]?.colors
    }
  }, [historyState, setHistoryState])

  // Redo
  const onRedo = useCallback(() => {
    if (historyState.historyIndex && historyState.historyIndex < historyState.history.length - 1) {
      setHistoryState({
        ...historyState,
        historyIndex: historyState.historyIndex + 1,
      })
      return historyState.history[historyState.historyIndex + 1]?.colors
    }
  }, [historyState, setHistoryState])

  const syncColorsToURL = useCallback(
    (colorsToSync: GeneratorColor[], immediate = false) => {
      //  o timeout anterior se existir
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current)
      }

      const updateURL = () => {
        const hexColors = colorsToSync.map((c) => c.hex.replace('#', '')).join('-')
        router.replace(`?colors=${hexColors}`, { scroll: false })
      }
      // Se for imediato (ex: gerar nova paleta, adicionar/remover cor), executa agora
      if (immediate) {
        updateURL()
      } else {
        syncTimeoutRef.current = setTimeout(updateURL, 300)
      }
    },
    [router],
  )
  const onGenerateNewPalette = useCallback(() => {
    const newPallete = generateNewPaletteFn(pallete.color, pallete.algorithm)
    setPallete({
      color: newPallete,
      algorithm: pallete.algorithm,
    })
    return newPallete
  }, [pallete, setPallete])

  const onRemoveColor = useCallback(
    (id: string) => {
      const newColors = removeColorFn(pallete.color, id)
      setPallete({
        color: newColors,
        algorithm: pallete.algorithm,
      })
      return newColors
    },
    [pallete, setPallete],
  )
  const onAddColor = useCallback(
    (index?: number) => {
      const indexToAdd = index ?? pallete.color.length
      const newColors = addRandomColorFn(pallete.color, pallete.algorithm, indexToAdd)
      setPallete({
        color: newColors,
        algorithm: pallete.algorithm,
      })
      return newColors
    },
    [pallete, setPallete],
  )
  const onUpdateColor = useCallback(
    (id: string, hex: string) => {
      const newColors = pallete.color.map((c) => (c.id === id ? { ...c, hex } : c))
      setPallete({
        color: newColors,
        algorithm: pallete.algorithm,
      })
      return newColors
    },
    [pallete, setPallete],
  )
  const onToggleLock = useCallback(
    (id: string) => {
      setPallete({
        color: toogleColorLockFn(pallete.color, id),
        algorithm: pallete.algorithm,
      })
    },
    [pallete, setPallete],
  )
  const onSetAlgorithm = useCallback(
    (algorithm: PaletteAlgorithm) => {
      setPallete({
        color: pallete.color,
        algorithm: algorithm,
      })
    },
    [pallete, setPallete],
  )
  const onSetColors = useCallback(
    (colors: GeneratorColor[]) => {
      setPallete({
        color: colors,
        algorithm: pallete.algorithm,
      })
    },
    [pallete, setPallete],
  )
  const value: ColorStudioContextType = {
    history: historyState.history,
    onToggleLock,
    onUpdateColor,
    onAddColor,
    onRemoveColor,
    onGenerateNewPalette,
    onAddToHistory,
    onRestoreFromHistory,
    onToggleFavorite,
    onClearHistory,
    onUndo,
    onRedo,
    canUndo: historyState.historyIndex > 0,
    canRedo: historyState.historyIndex < historyState.history.length - 1,
    algorithm: pallete.algorithm,
    onSetAlgorithm,
    colors: pallete.color,
    onSetColors,
    syncColorsToURL,
    syncTimeoutRef,
    onShuffleColors,
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
