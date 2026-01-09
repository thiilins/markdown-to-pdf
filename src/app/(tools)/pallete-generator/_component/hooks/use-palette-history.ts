'use client'

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

const STORAGE_KEY = 'palette-history'
const FAVORITES_KEY = 'palette-favorites'
const MAX_HISTORY = 20

export function usePaletteHistory() {
  const [history, setHistory] = useState<PaletteHistoryItem[]>([])
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  // Carrega histórico e favoritos do localStorage
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(STORAGE_KEY)
      const storedFavorites = localStorage.getItem(FAVORITES_KEY)

      if (storedHistory) {
        setHistory(JSON.parse(storedHistory))
      }

      if (storedFavorites) {
        setFavorites(new Set(JSON.parse(storedFavorites)))
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error)
    }
  }, [])

  // Adiciona uma paleta ao histórico
  const addToHistory = useCallback((colors: ColorInfo[], type: PaletteType, baseColor: string) => {
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

      // Salva no localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (error) {
        console.error('Erro ao salvar histórico:', error)
      }

      return updated
    })

    return id
  }, [])

  // Toggle favorito
  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const updated = new Set(prev)
      if (updated.has(id)) {
        updated.delete(id)
      } else {
        updated.add(id)
      }

      // Salva no localStorage
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify([...updated]))
      } catch (error) {
        console.error('Erro ao salvar favoritos:', error)
      }

      return updated
    })

    // Atualiza o item no histórico
    setHistory((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item,
      )

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (error) {
        console.error('Erro ao atualizar histórico:', error)
      }

      return updated
    })
  }, [])

  // Remove item do histórico
  const removeFromHistory = useCallback((id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id)

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (error) {
        console.error('Erro ao remover do histórico:', error)
      }

      return updated
    })

    // Remove dos favoritos também
    setFavorites((prev) => {
      if (prev.has(id)) {
        const updated = new Set(prev)
        updated.delete(id)

        try {
          localStorage.setItem(FAVORITES_KEY, JSON.stringify([...updated]))
        } catch (error) {
          console.error('Erro ao remover dos favoritos:', error)
        }

        return updated
      }
      return prev
    })
  }, [])

  // Limpa todo o histórico (exceto favoritos)
  const clearHistory = useCallback(() => {
    setHistory((prev) => {
      const updated = prev.filter((item) => favorites.has(item.id))

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (error) {
        console.error('Erro ao limpar histórico:', error)
      }

      return updated
    })
  }, [favorites])

  // Renomeia uma paleta
  const renamePalette = useCallback((id: string, name: string) => {
    setHistory((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, name } : item))

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (error) {
        console.error('Erro ao renomear paleta:', error)
      }

      return updated
    })
  }, [])

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
