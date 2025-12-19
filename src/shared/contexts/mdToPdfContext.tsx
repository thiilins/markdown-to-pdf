'use client'

import { ENVIROMENT } from '@/env'
import usePersistedState from '@/hooks/use-persisted-state'
import {
  Dispatch,
  RefObject,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useReactToPrint } from 'react-to-print'
import { toast } from 'sonner'
import { DEFAULT_MARKDOWN } from '../constants'
import { filename_now } from '../utils'
import { handleDownloadPDFApi } from '../utils/download-pdf-api'
import { useConfig } from './configContext'
interface MDToPdfContextType {
  isLoading: boolean
  setIsLoading: Dispatch<SetStateAction<boolean>>
  onPrint: () => void
  onDownloadPDF: () => void
  markdown: string
  setMarkdown: React.Dispatch<React.SetStateAction<string>>
  contentRef: RefObject<HTMLDivElement | null>
  disabledDownload: boolean
}

const MDToPdfContext = createContext<MDToPdfContextType | undefined>(undefined)

export function MDToPdfProvider({ children }: { children: ReactNode }) {
  const { config } = useConfig()
  const [isLoading, setIsLoading] = useState(false)
  const [markdown, setMarkdown] = usePersistedState<string>('md-to-pdf-markdown', DEFAULT_MARKDOWN)
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
  return (
    <MDToPdfContext.Provider
      value={{
        isLoading,
        setIsLoading,
        onPrint: handlePrint,
        disabledDownload,
        onDownloadPDF: handleDownloadPDF,
        markdown,
        setMarkdown,
        contentRef,
      }}>
      {children}
    </MDToPdfContext.Provider>
  )
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
