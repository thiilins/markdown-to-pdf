'use client'

import { ENVIROMENT } from '@/env'
import usePersistedStateInDB from '@/hooks/use-persisted-in-db'
import {
  Dispatch,
  RefObject,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useReactToPrint } from 'react-to-print'
import { toast } from 'sonner'
import { DEFAULT_MARKDOWN } from '../constants'
import { handleDownloadPDFApi } from '../constants/download-pdf-api'
import { filename_now } from '../utils'
import { useConfig } from './configContext'
interface MDToPdfContextType {
  isLoading: boolean
  setIsLoading: Dispatch<SetStateAction<boolean>>
  onPrint: () => void
  onDownloadPDF: () => void
  markdown: string
  setMarkdown: (newState: string) => Promise<void>
  contentRef: RefObject<HTMLDivElement | null>
  disabledDownload: boolean
  onResetMarkdown: () => void
}

const MDToPdfContext = createContext<MDToPdfContextType | undefined>(undefined)

export function MDToPdfProvider({ children }: { children: ReactNode }) {
  const { config } = useConfig()
  const [isLoading, setIsLoading] = useState(false)
  const [markdown, setMarkdown] = usePersistedStateInDB<string>(
    'md-to-pdf-markdown',
    DEFAULT_MARKDOWN,
  )
  const contentRef = useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    documentTitle: `documento_${filename_now}`,
  })
  const [disabledDownload, setDisabledDownload] = useState(false)

  const handleDownloadPDF = useCallback(async () => {
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

  useEffect(() => {
    if (!ENVIROMENT.ENABLE_EXPORT) {
      setDisabledDownload(true)
    }
  }, [])
  const onResetMarkdown = useCallback(() => {
    setMarkdown(DEFAULT_MARKDOWN)
  }, [setMarkdown])

  // Memoização do value do Context para evitar re-renders desnecessários
  const contextValue = useMemo<MDToPdfContextType>(
    () => ({
      isLoading,
      setIsLoading,
      onPrint: handlePrint,
      disabledDownload,
      onResetMarkdown,
      onDownloadPDF: handleDownloadPDF,
      markdown,
      setMarkdown,
      contentRef,
    }),
    [
      isLoading,
      disabledDownload,
      handleDownloadPDF,
      handlePrint,
      markdown,
      setMarkdown,
      onResetMarkdown,
    ],
  )

  return <MDToPdfContext.Provider value={contextValue}>{children}</MDToPdfContext.Provider>
}

export function useMDToPdf() {
  const context = useContext(MDToPdfContext)
  if (context === undefined) {
    throw new Error('<useMDToPdf> deve ser usado dentro de um MDToPdfProvider')
  }
  return context
}

export function useMDToPdfValid() {
  const context = useContext(MDToPdfContext)
  if (context === undefined) {
    return false
  }
  return true
}
