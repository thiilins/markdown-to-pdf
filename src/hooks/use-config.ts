import type { AppConfig, MarginPreset, Orientation, PageSize, ThemePreset } from '@/types/config'
import { MARGIN_PRESETS, PAGE_SIZES, THEME_PRESETS } from '@/types/config'
import { useCallback, useEffect, useState } from 'react'
import usePersistedState from './use-persisted-state'

const defaultConfig: AppConfig = {
  page: {
    size: 'a4',
    width: PAGE_SIZES.a4.width,
    height: PAGE_SIZES.a4.height,
    orientation: 'portrait',
    padding: '20mm',
    margin: { ...MARGIN_PRESETS.narrow.margin },
  },
  typography: {
    headings: 'Montserrat',
    body: 'Open Sans',
    code: 'Fira Code',
    quote: 'Merriweather',
    baseSize: 14,
    h1Size: 28,
    h2Size: 22,
    h3Size: 18,
    lineHeight: 1.6,
  },
  editor: {
    theme: 'auto',
    fontSize: 14,
    wordWrap: 'on',
    minimap: false,
    lineNumbers: 'on',
  },
  theme: THEME_PRESETS.modern,
}

export function useConfig() {
  const [config, setConfig] = usePersistedState<AppConfig>('md-to-pdf-config', defaultConfig)

  // Garante que o tema sempre existe
  useEffect(() => {
    if (!config.theme) {
      setConfig((prev) => ({
        ...prev,
        theme: THEME_PRESETS.modern,
      }))
    }
  }, [config.theme, setConfig])

  const updateConfig = useCallback(
    (updates: Partial<AppConfig>) => {
      setConfig((prev) => {
        const newConfig = { ...prev, ...updates }
        return newConfig
      })
    },
    [setConfig],
  )

  const updatePageSize = useCallback(
    (size: PageSize) => {
      const pageSize = PAGE_SIZES[size]
      setConfig((prev) => {
        const newConfig = {
          ...prev,
          page: {
            ...prev.page,
            size,
            width: pageSize.width,
            height: pageSize.height,
          },
        }
        if (typeof window !== 'undefined') {
          localStorage.setItem('md-to-pdf-config', JSON.stringify(newConfig))
        }
        return newConfig
      })
    },
    [setConfig],
  )

  const updateOrientation = useCallback(
    (orientation: Orientation) => {
      setConfig((prev) => {
        const isLandscape = orientation === 'landscape'
        const width = isLandscape ? prev.page.height : prev.page.width
        const height = isLandscape ? prev.page.width : prev.page.height

        const newConfig = {
          ...prev,
          page: {
            ...prev.page,
            orientation,
            width,
            height,
          },
        }
        if (typeof window !== 'undefined') {
          localStorage.setItem('md-to-pdf-config', JSON.stringify(newConfig))
        }
        return newConfig
      })
    },
    [setConfig],
  )

  const resetConfig = useCallback(() => {
    setConfig(defaultConfig)
  }, [setConfig])

  const applyMarginPreset = useCallback(
    (preset: MarginPreset) => {
      if (preset === 'custom') return

      const marginPreset = MARGIN_PRESETS[preset]
      setConfig((prev) => {
        const newConfig = {
          ...prev,
          page: {
            ...prev.page,
            margin: { ...marginPreset.margin },
          },
        }
        return newConfig
      })
    },
    [setConfig],
  )

  const applyThemePreset = useCallback(
    (preset: ThemePreset) => {
      if (preset === 'custom') return

      const themePreset = THEME_PRESETS[preset]
      setConfig((prev) => {
        const newConfig = {
          ...prev,
          theme: {
            name: themePreset.name,
            description: themePreset.description,
            background: themePreset.background,
            textColor: themePreset.textColor,
            headingColor: themePreset.headingColor,
            codeBackground: themePreset.codeBackground,
            codeTextColor: themePreset.codeTextColor,
            linkColor: themePreset.linkColor,
            borderColor: themePreset.borderColor,
            blockquoteColor: themePreset.blockquoteColor,
          },
        }
        return newConfig
      })
    },
    [setConfig],
  )

  return {
    config,
    updateConfig,
    updatePageSize,
    updateOrientation,
    resetConfig,
    applyMarginPreset,
    applyThemePreset,
  }
}
