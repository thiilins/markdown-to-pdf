'use client'

import { getData, saveData } from '@/shared/utils'
import { useCallback, useEffect, useState } from 'react'
import type { PaletteType } from '../constants'

export interface PaletteHistoryItem {
  id: string
  colors: ColorInfo[]
  type: PaletteType
  baseColor: string
  timestamp: number
  isFavorite: boolean
  name?: string
}

const DB_NAME = process.env.NEXT_PUBLIC_LOCAL_STORAGE_DATABASE_NAME || 'md_tools_pro_db'
const STORE_NAME = process.env.NEXT_PUBLIC_LOCAL_STORAGE_STORE_NAME || 'mdtp_store'
const HISTORY_KEY = '@MD_TOOLS_PRO:palette-history'
const FAVORITES_KEY = '@MD_TOOLS_PRO:palette-favorites'
const MAX_HISTORY = 20

export function usePaletteHistory() {
  const [history, setHistory] = useState<PaletteHistoryItem[]>([])
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [isLoaded, setIsLoaded] = useState(false)

  // Carrega histórico e favoritos do IndexDB
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedHistory = await getData<PaletteHistoryItem[]>(DB_NAME, STORE_NAME, HISTORY_KEY)
        const storedFavorites = await getData<string[]>(DB_NAME, STORE_NAME, FAVORITES_KEY)

        if (storedHistory) {
          setHistory(storedHistory)
        }

        if (storedFavorites) {
          setFavorites(new Set(storedFavorites))
        }
      } catch (error) {
        console.error('Erro ao carregar histórico do IndexDB:', error)
      } finally {
        setIsLoaded(true)
      }
    }

    loadData()
  }, [])

  // Adiciona uma paleta ao histórico
  const addToHistory = useCallback(
    async (colors: ColorInfo[], type: PaletteType, baseColor: string) => {
      if (!isLoaded) return

      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      const newItem: PaletteHistoryItem = {
        id,
        colors,
        type,
        baseColor,
        timestamp: Date.now(),
        isFavorite: false,
      }

      setHistory((prev) => {
        // Remove duplicatas (mesma cor base e tipo)
        const filtered = prev.filter((item) => !(item.baseColor === baseColor && item.type === type))

        // Adiciona no início e limita o tamanho
        const updated = [newItem, ...filtered].slice(0, MAX_HISTORY)

        // Salva no IndexDB
        saveData(DB_NAME, STORE_NAME, HISTORY_KEY, updated, true).catch((error) => {
          console.error('Erro ao salvar histórico no IndexDB:', error)
        })

        return updated
      })

      return id
    },
    [isLoaded],
  )

  // Toggle favorito
  const toggleFavorite = useCallback(
    (id: string) => {
      if (!isLoaded) return

      setFavorites((prev) => {
        const updated = new Set(prev)
        if (updated.has(id)) {
          updated.delete(id)
        } else {
          updated.add(id)
        }

        // Salva no IndexDB
        saveData(DB_NAME, STORE_NAME, FAVORITES_KEY, [...updated], true).catch((error) => {
          console.error('Erro ao salvar favoritos no IndexDB:', error)
        })

        return updated
      })

      // Atualiza o item no histórico
      setHistory((prev) => {
        const updated = prev.map((item) =>
          item.id === id ? { ...item, isFavorite: !item.isFavorite } : item,
        )

        saveData(DB_NAME, STORE_NAME, HISTORY_KEY, updated, true).catch((error) => {
          console.error('Erro ao atualizar histórico no IndexDB:', error)
        })

        return updated
      })
    },
    [isLoaded],
  )

  // Remove item do histórico
  const removeFromHistory = useCallback(
    (id: string) => {
      if (!isLoaded) return

      setHistory((prev) => {
        const updated = prev.filter((item) => item.id !== id)

        saveData(DB_NAME, STORE_NAME, HISTORY_KEY, updated, true).catch((error) => {
          console.error('Erro ao remover do histórico no IndexDB:', error)
        })

        return updated
      })

      // Remove dos favoritos também
      setFavorites((prev) => {
        if (prev.has(id)) {
          const updated = new Set(prev)
          updated.delete(id)

          saveData(DB_NAME, STORE_NAME, FAVORITES_KEY, [...updated], true).catch((error) => {
            console.error('Erro ao remover dos favoritos no IndexDB:', error)
          })

          return updated
        }
        return prev
      })
    },
    [isLoaded],
  )

  // Limpa todo o histórico (exceto favoritos)
  const clearHistory = useCallback(() => {
    if (!isLoaded) return

    setHistory((prev) => {
      const updated = prev.filter((item) => favorites.has(item.id))

      saveData(DB_NAME, STORE_NAME, HISTORY_KEY, updated, true).catch((error) => {
        console.error('Erro ao limpar histórico no IndexDB:', error)
      })

      return updated
    })
  }, [favorites, isLoaded])

  // Renomeia uma paleta
  const renamePalette = useCallback(
    (id: string, name: string) => {
      if (!isLoaded) return

      setHistory((prev) => {
        const updated = prev.map((item) => (item.id === id ? { ...item, name } : item))

        saveData(DB_NAME, STORE_NAME, HISTORY_KEY, updated, true).catch((error) => {
          console.error('Erro ao renomear paleta no IndexDB:', error)
        })

        return updated
      })
    },
    [isLoaded],
  )

  return {
    history,
    favorites,
    addToHistory,
    toggleFavorite,
    removeFromHistory,
    clearHistory,
    renamePalette,
  }
}
