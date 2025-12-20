'use client'

import usePersistedStateInDB from '@/hooks/use-persisted-in-db'
import { useConfig } from '@/shared/contexts/configContext'
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { DEFAULT_HEADER_FOOTER, DEFAULT_HEADER_FOOTER_SLOT_ITEM } from '../constants/header-footer'
import { parseHeaderFooterText } from '../utils/parse-header-footer'
import { useMDToPdf } from './mdToPdfContext'

interface LogoStorage {
  header?: string // base64
  footer?: string // base64
}

interface HeaderFooterContextType {
  headerFooter: HeaderFooterConfig
  resetSlot: (slotType: 'header' | 'footer') => void
  updateHeaderFooter: (updates: Partial<HeaderFooterConfig>) => void
  updateSlot: (updates: Partial<HeaderFooterSlotItemConfig>, slotType: 'header' | 'footer') => void
  parseVariables: (
    text: string,
    pageNumber?: number,
    totalPages?: number,
    logoUrl?: string,
    logoSize?: { width: string; height: string },
  ) => string
  logos: LogoStorage
  setTempLogo: (base64: string | null, slotType: 'header' | 'footer') => Promise<void>
  setLogos: (base64: string | null, slotType: 'header' | 'footer') => Promise<void>
  onResetHeaderFooter: () => void
  handleOnResetEditorData: () => void

  // MODAL
  modalOpen: boolean
  logosTemp: LogoStorage
  handleOpenModal: () => void
  handleCloseModal: (save?: boolean) => void
  handleEditTemp: (
    updates: Partial<HeaderFooterSlotItemConfig>,
    slotType: 'header' | 'footer',
  ) => void
  headerFooterTemp: HeaderFooterConfig
}

const HeaderFooterContext = createContext<HeaderFooterContextType | undefined>(undefined)

/**
 * Variáveis disponíveis para uso em header/footer
 */

/**
 * Parse de variáveis dinâmicas no texto do header/footer
 */

export function HeaderFooterProvider({ children }: { children: ReactNode }) {
  const { onResetMarkdown } = useMDToPdf()
  const { config, updateConfig } = useConfig()
  const [logosStore, setLogosStore] = usePersistedStateInDB<LogoStorage>('header-footer-logos', {})
  const [logosTemp, setLogosTemp] = useState<LogoStorage>(logosStore)
  const [modalOpen, setModalOpen] = useState(true)

  const [headerFooterTemp, setHeaderFooterTemp] = useState<HeaderFooterConfig>(
    config.headerFooter || DEFAULT_HEADER_FOOTER,
  )
  const headerFooter = useMemo<HeaderFooterConfig>(
    () => config.headerFooter || DEFAULT_HEADER_FOOTER,
    [config.headerFooter],
  )

  const handleOpenModal = useCallback(() => {
    setHeaderFooterTemp(config.headerFooter || DEFAULT_HEADER_FOOTER)
    setModalOpen(true)
  }, [config.headerFooter])

  const handleCloseModal = useCallback(
    (save?: boolean) => {
      if (save) {
        updateConfig({
          headerFooter: headerFooterTemp,
        })
        setLogosStore(logosTemp)
      }
      setHeaderFooterTemp(config.headerFooter || DEFAULT_HEADER_FOOTER)
      setLogosTemp(logosStore || {})
      setModalOpen(false)
    },
    [config.headerFooter, updateConfig, headerFooterTemp, setLogosStore, logosTemp, logosStore],
  )

  const handleEditTemp = useCallback(
    (updates: Partial<HeaderFooterSlotItemConfig>, slotType: 'header' | 'footer') => {
      setHeaderFooterTemp((prev) => ({
        ...prev,
        [slotType]: {
          ...prev[slotType],
          ...updates,
        },
      }))
    },
    [],
  )

  const updateHeaderFooter = useCallback(
    (updates: Partial<HeaderFooterConfig>) => {
      updateConfig({
        headerFooter: {
          ...headerFooter,
          ...updates,
        },
      })
    },
    [headerFooter, updateConfig],
  )

  const updateSlot = useCallback(
    (updates: Partial<HeaderFooterSlotItemConfig>, slotType: 'header' | 'footer') => {
      updateConfig({
        headerFooter: {
          ...headerFooter,
          [slotType]: {
            ...headerFooter[slotType],
            ...updates,
          },
        },
      })
    },
    [headerFooter, updateConfig],
  )

  const parseVariables = useCallback(
    (
      text: string,
      pageNumber?: number,
      totalPages?: number,
      logoUrl?: string,
      logoSize?: { width: string; height: string },
    ) => {
      return parseHeaderFooterText(text, pageNumber, totalPages, logoUrl, logoSize)
    },
    [],
  )

  const setTempLogo = useCallback(
    async (base64: string | null, slotType: 'header' | 'footer') => {
      const newLogos: LogoStorage = {
        ...logosStore,
        [slotType]: base64 || undefined,
      }
      setLogosTemp(newLogos)
      // Atualiza o config também se houver logo
      if (base64) {
        handleEditTemp(
          {
            logo: {
              url: base64,
              position: headerFooter.header.logo?.position || 'left',
              size: headerFooter.header.logo?.size || { width: '50px', height: '50px' },
            },
          },
          slotType,
        )
      } else {
        updateSlot({ logo: undefined }, slotType)
      }
    },
    [
      handleEditTemp,
      headerFooter.header.logo?.position,
      headerFooter.header.logo?.size,
      logosStore,
      updateSlot,
    ],
  )

  const setLogos = useCallback(
    async (base64: string | null, slotType: 'header' | 'footer') => {
      const newLogos: LogoStorage = {
        ...logosStore,
        [slotType]: base64 || undefined,
      }
      await setLogosStore(newLogos)
      // Atualiza o config também se houver logo
      if (base64) {
        updateSlot(
          {
            logo: {
              url: base64,
              position: headerFooter.footer.logo?.position || 'left',
              size: headerFooter.footer.logo?.size || { width: '50px', height: '50px' },
            },
          },
          slotType,
        )
      } else {
        updateSlot({ logo: undefined }, slotType)
      }
    },
    [setLogosStore, updateSlot, headerFooter.footer.logo, logosStore],
  )

  const resetSlot = useCallback(
    (slotType: 'header' | 'footer') => {
      updateSlot(DEFAULT_HEADER_FOOTER_SLOT_ITEM, slotType)
    },
    [updateSlot],
  )

  const onResetHeaderFooter = useCallback(() => {
    updateHeaderFooter({
      header: DEFAULT_HEADER_FOOTER_SLOT_ITEM,
      footer: DEFAULT_HEADER_FOOTER_SLOT_ITEM,
    })
    setLogosStore({})
  }, [updateHeaderFooter, setLogosStore])

  const handleOnResetEditorData = useCallback(() => {
    onResetHeaderFooter()
    onResetMarkdown()
  }, [onResetHeaderFooter, onResetMarkdown])

  const contextValue = useMemo<HeaderFooterContextType>(
    () => ({
      headerFooter,
      updateHeaderFooter,
      updateSlot,
      resetSlot,
      logosTemp: logosTemp || {},
      parseVariables,
      headerFooterTemp,
      logos: logosStore || {},
      setTempLogo,
      onResetHeaderFooter,
      setLogos,
      handleOnResetEditorData,
      modalOpen,
      handleOpenModal,
      handleCloseModal,
      handleEditTemp,
    }),
    [
      headerFooter,
      updateHeaderFooter,
      logosTemp,
      updateSlot,
      parseVariables,
      headerFooterTemp,
      logosStore,
      setTempLogo,
      onResetHeaderFooter,
      setLogos,
      handleOnResetEditorData,
      modalOpen,
      handleOpenModal,
      handleCloseModal,
      handleEditTemp,
      resetSlot,
    ],
  )

  return (
    <HeaderFooterContext.Provider value={contextValue}>{children}</HeaderFooterContext.Provider>
  )
}

export function useHeaderFooter() {
  const context = useContext(HeaderFooterContext)
  if (context === undefined) {
    throw new Error('<useHeaderFooter> deve ser usado dentro de um HeaderFooterProvider')
  }
  return context
}
