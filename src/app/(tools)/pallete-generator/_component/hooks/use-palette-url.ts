'use client'

import { useCallback, useEffect, useState } from 'react'
import type { PaletteType } from '../constants'

interface PaletteURLState {
  colors?: string // hex colors separados por hífen: ffffff-000000-ff0000
  type?: PaletteType
  base?: string // cor base em hex
}

/**
 * Hook para sincronizar estado da paleta com a URL
 * Permite compartilhamento via link
 */
export function usePaletteURL() {
  const [isReady, setIsReady] = useState(false)

  // Lê o estado da URL
  const readFromURL = useCallback((): PaletteURLState | null => {
    if (typeof window === 'undefined') return null

    try {
      const params = new URLSearchParams(window.location.search)
      const colors = params.get('colors')
      const type = params.get('type') as PaletteType | null
      const base = params.get('base')

      if (!colors && !type && !base) return null

      return {
        colors: colors || undefined,
        type: type || undefined,
        base: base || undefined,
      }
    } catch (error) {
      console.error('Erro ao ler URL:', error)
      return null
    }
  }, [])

  // Escreve o estado na URL
  const writeToURL = useCallback((colors: ColorInfo[], type: PaletteType, baseColor: string) => {
    if (typeof window === 'undefined') return

    try {
      const params = new URLSearchParams(window.location.search)

      // Codifica cores como hex sem #, separadas por hífen
      const colorsParam = colors.map((c) => c.hex.replace('#', '')).join('-')
      params.set('colors', colorsParam)
      params.set('type', type)
      params.set('base', baseColor.replace('#', ''))

      // Atualiza URL sem recarregar a página
      const newURL = `${window.location.pathname}?${params.toString()}`
      window.history.replaceState({}, '', newURL)
    } catch (error) {
      console.error('Erro ao escrever na URL:', error)
    }
  }, [])

  // Limpa a URL
  const clearURL = useCallback(() => {
    if (typeof window === 'undefined') return

    try {
      window.history.replaceState({}, '', window.location.pathname)
    } catch (error) {
      console.error('Erro ao limpar URL:', error)
    }
  }, [])

  // Gera link para compartilhamento
  const getShareableLink = useCallback(
    (colors: ColorInfo[], type: PaletteType, baseColor: string): string => {
      if (typeof window === 'undefined') return ''

      try {
        const colorsParam = colors.map((c) => c.hex.replace('#', '')).join('-')
        const params = new URLSearchParams({
          colors: colorsParam,
          type,
          base: baseColor.replace('#', ''),
        })

        return `${window.location.origin}${window.location.pathname}?${params.toString()}`
      } catch (error) {
        console.error('Erro ao gerar link:', error)
        return ''
      }
    },
    [],
  )

  // Decodifica cores da URL
  const decodeColorsFromURL = useCallback((colorsParam: string): string[] => {
    try {
      return colorsParam.split('-').map((hex) => `#${hex}`)
    } catch (error) {
      console.error('Erro ao decodificar cores:', error)
      return []
    }
  }, [])

  useEffect(() => {
    setIsReady(true)
  }, [])

  return {
    isReady,
    readFromURL,
    writeToURL,
    clearURL,
    getShareableLink,
    decodeColorsFromURL,
  }
}
