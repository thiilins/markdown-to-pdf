'use client'

import usePersistedState from '@/hooks/use-persisted-state'
import {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { MARGIN_PRESETS, PAGE_SIZES, THEME_PRESETS, defaultConfig } from '../constants'
import { normalizeConfig } from '../utils/normalize-config'

interface ConfigContextType {
  config: AppConfig
  getCurrentMargin: () => MarginPreset
  updateConfig: (updates: Partial<AppConfig>) => void
  updatePageSize: (size: PageSize) => void
  updateOrientation: (orientation: Orientation) => void
  resetConfig: () => void
  getCurrentTheme: () => ThemePreset
  applyMarginPreset: (preset: MarginPreset) => void
  applyThemePreset: (preset: ThemePreset) => void
  isConfigOpen: boolean
  setIsConfigOpen: Dispatch<SetStateAction<boolean>>
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined)

export function ConfigProvider({ children }: { children: ReactNode }) {
  // Normaliza o config na inicialização para garantir que sempre tenha tema
  // Isso evita um ciclo extra de renderização que ocorria com o useEffect
  const [rawConfig, setRawConfig] = usePersistedState<AppConfig>('md-to-pdf-config', defaultConfig)
  const config = useMemo(() => normalizeConfig(rawConfig), [rawConfig])
  const [isConfigOpen, setIsConfigOpen] = useState(false)

  // Wrapper para setConfig que sempre normaliza antes de salvar
  const setConfig = useCallback<Dispatch<SetStateAction<AppConfig>>>(
    (value) => {
      setRawConfig((prev) => {
        const newConfig = typeof value === 'function' ? value(prev) : value
        return normalizeConfig(newConfig)
      })
    },
    [setRawConfig],
  )

  const updateConfig = useCallback(
    (updates: Partial<AppConfig>) => {
      setConfig((prev) => {
        const newConfig = { ...prev, ...updates }
        return newConfig
      })
    },
    [setConfig],
  )
  const getCurrentMarginPreset = useCallback((): MarginPreset => {
    const current = config.page.margin
    for (const [key, preset] of Object.entries(MARGIN_PRESETS)) {
      if (key === 'custom') continue
      if (
        preset.margin.top === current.top &&
        preset.margin.right === current.right &&
        preset.margin.bottom === current.bottom &&
        preset.margin.left === current.left
      ) {
        return key as MarginPreset
      }
    }
    return 'custom'
  }, [config.page.margin])

  // Detecta qual preset de tema está ativo
  // Nota: config.theme sempre existe devido à normalização
  const getCurrentThemePreset = useCallback((): ThemePreset => {
    const current = config.theme!
    for (const [key, preset] of Object.entries(THEME_PRESETS)) {
      if (key === 'custom') continue
      if (
        preset.background === current.background &&
        preset.textColor === current.textColor &&
        preset.headingColor === current.headingColor
      ) {
        return key as ThemePreset
      }
    }
    return 'custom'
  }, [config.theme])

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

  // Memoização do value do Context para evitar re-renders desnecessários
  const contextValue = useMemo<ConfigContextType>(
    () => ({
      config,
      isConfigOpen,
      setIsConfigOpen,
      updateConfig,
      updatePageSize,
      updateOrientation,
      resetConfig,
      getCurrentMargin: getCurrentMarginPreset,
      getCurrentTheme: getCurrentThemePreset,
      applyMarginPreset,
      applyThemePreset,
    }),
    [
      config,
      isConfigOpen,
      updateConfig,
      updatePageSize,
      updateOrientation,
      resetConfig,
      getCurrentMarginPreset,
      getCurrentThemePreset,
      applyMarginPreset,
      applyThemePreset,
    ],
  )

  return <ConfigContext.Provider value={contextValue}>{children}</ConfigContext.Provider>
}

export function useConfig() {
  const context = useContext(ConfigContext)
  if (context === undefined) {
    throw new Error('<useConfig> deve ser usado dentro de um ConfigProvider')
  }
  return context
}
