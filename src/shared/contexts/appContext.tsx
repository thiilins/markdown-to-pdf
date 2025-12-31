'use client'

import { ENVIROMENT } from '@/env'
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
import { useReactToPrint } from 'react-to-print'
import { toast } from 'sonner'
import { MARGIN_PRESETS, PAGE_SIZES, THEME_PRESETS, defaultConfig } from '../constants'
import { filename_now, handleDownloadPDFApi } from '../utils'
import { normalizeConfig } from '../utils/normalize-config'
import { useMarkdown } from './markdownContext'
interface AppContextType {
  config: AppConfig
  isConfigOpen: boolean
  setIsConfigOpen: Dispatch<SetStateAction<boolean>>
  updateConfig: (updates: Partial<AppConfig>) => void
  updatePageSize: (size: PageSize) => void
  updateOrientation: (orientation: Orientation) => void
  resetConfig: () => void
  zoom: number
  onResetZoom: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  onZoomChange: (zoom: number) => void
  isLoading: boolean
  setIsLoading: Dispatch<SetStateAction<boolean>>
  disabledDownload: boolean
  onPrint: () => void
  applyMarginPreset: (preset: MarginPreset) => void
  applyThemePreset: (preset: ThemePreset) => void
  getCurrentMargin: () => MarginPreset
  getCurrentTheme: () => ThemePreset
  onDownloadPDF: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const { contentRef, markdown } = useMarkdown()

  const disabledDownload = !ENVIROMENT.ENABLE_EXPORT
  const [isLoading, setIsLoading] = useState(false)
  const [rawConfig, setRawConfig] = usePersistedState<AppConfig>('md-to-pdf-config', defaultConfig)
  const config = useMemo(() => normalizeConfig(rawConfig), [rawConfig])
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [zoom, setZoom] = usePersistedState('zoom', 1)
  /**
   *
   *  FUNÇOES
   *
   */
  const onDownloadPDF = useCallback(async () => {
    const element = contentRef.current
    if (!element) return toast.error('Conteúdo não encontrado para exportação.')
    const htmlContent = element.innerHTML
    const filename = `documento_${filename_now}.pdf`
    setIsLoading(true)
    try {
      return await handleDownloadPDFApi(config, htmlContent, filename)
    } finally {
      setIsLoading(false)
    }
  }, [config, contentRef])

  const documentTitle = useMemo(() => {
    const name = markdown?.name || `documento_${filename_now}`
    return name
  }, [markdown?.name])

  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    documentTitle: documentTitle,
  })
  /*
   * ZOOM FUNCTIONS
   */
  const onZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 0.1, 0.3))
  }, [setZoom])
  const onZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 0.1, 1.5))
  }, [setZoom])
  const onResetZoom = useCallback(() => {
    setZoom(1)
  }, [setZoom])
  const onZoomChange = useCallback(
    (newZoom: number) => {
      setZoom(newZoom)
    },
    [setZoom],
  )

  /**
   * CONFIG FUNCTIONS
   *   - Removido de ConfigContext para simplificar o contexto
   */
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

  const ContextValues = useMemo(
    () => ({
      zoom,
      onResetZoom,
      onZoomIn,
      onZoomOut,
      onZoomChange,
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
      isLoading,
      setIsLoading,
      disabledDownload,
      onPrint: handlePrint,
      onDownloadPDF,
    }),
    [
      zoom,
      onResetZoom,
      onZoomIn,
      onZoomOut,
      onZoomChange,
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
      isLoading,
      disabledDownload,
      handlePrint,
      onDownloadPDF,
    ],
  )

  return <AppContext.Provider value={ContextValues}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('<useApp> deve ser usado dentro de um AppProvider')
  }
  return context
}
