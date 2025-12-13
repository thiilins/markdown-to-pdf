'use client'

import { generatePDF } from '@/app/actions/pdf'
import { ENVIROMENT } from '@/env'
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
import { ConfigProvider, useConfig } from './configContext'
interface MDToPdfContextType {
  isLoading: boolean
  setIsLoading: Dispatch<SetStateAction<boolean>>
  onPrint: () => void
  onDownloadPDF: () => void
  config: AppConfig
  onConfigChange: (config: Partial<AppConfig>) => void
  onPageSizeChange: (size: PageSize) => void
  onOrientationChange: (orientation: Orientation) => void
  onReset: () => void
  onApplyMarginPreset: (preset: MarginPreset) => void
  onApplyThemePreset: (preset: ThemePreset) => void
  markdown: string
  setMarkdown: React.Dispatch<React.SetStateAction<string>>
  contentRef: RefObject<HTMLDivElement | null>
  disabledDownload: boolean
}

const MDToPdfContext = createContext<MDToPdfContextType | undefined>(undefined)

// Exporta o contexto para uso direto quando necessário
export { MDToPdfContext }

export function MDToPdfProvider({ children }: { children: ReactNode }) {
  const {
    config,
    updateConfig,
    updatePageSize,
    updateOrientation,
    resetConfig,
    applyMarginPreset,
    applyThemePreset,
  } = useConfig()

  const [isLoading, setIsLoading] = useState(false)
  const [markdown, setMarkdown] = useState<string>(DEFAULT_MARKDOWN)
  const contentRef = useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    documentTitle: `documento_${filename_now}`,
  })
  const [disabledDownload, setDisabledDownload] = useState(false)

  const handleDownloadPDF = useCallback(async () => {
    if (disabledDownload || !ENVIROMENT.ENABLE_EXPORT) {
      return
    }
    const sourceElement = contentRef.current

    if (!sourceElement) {
      alert('Conteúdo não encontrado para exportação.')
      return
    }

    const htmlContent = sourceElement.innerHTML
    setIsLoading(true)

    try {
      toast.loading('Gerando PDF...', {
        id: 'download-pdf',
        style: {
          backgroundColor: 'var(--secondary)',
          color: 'var(--secondary-foreground)',
        },
      })

      // Chama a Server Action que faz a requisição no servidor
      const result = await generatePDF(htmlContent, config)

      if (!result.success) {
        throw new Error('Erro na geração do PDF')
      }

      // Converte o base64 de volta para blob e faz o download
      const binaryString = window.atob(result.data)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      const blob = new Blob([bytes], { type: result.contentType || 'application/pdf' })

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = result.filename
      document.body.appendChild(a)
      a.click()

      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success('PDF gerado com sucesso.', {
        id: 'download-pdf',
        style: {
          backgroundColor: 'var(--success-bg)',
          color: 'var(--success-text)',
          borderColor: 'var(--success-border)',
        },
      })
    } catch (error) {
      toast.error('Erro ao gerar PDF. Tente novamente.', {
        id: 'download-pdf',
        style: {
          backgroundColor: 'var(--destructive)',
          color: 'var(--destructive-foreground)',
        },
      })
      console.error('Erro:', error)

      // Tratamento específico para diferentes tipos de erro
      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          alert(
            'Tempo de espera esgotado. O servidor pode estar em hot reload. Aguarde alguns segundos e tente novamente.',
          )
        } else if (error.message.includes('hot reload') || error.message.includes('indisponível')) {
          alert(error.message)
        } else {
          alert(`Erro ao gerar PDF: ${error.message}`)
        }
      } else {
        alert('Erro ao gerar PDF. Tente novamente.')
      }
    } finally {
      setIsLoading(false)
      setTimeout(async () => {
        toast.dismiss('download-pdf')
      }, 1000)
    }
  }, [config, contentRef, disabledDownload])

  useEffect(() => {
    if (!ENVIROMENT.ENABLE_EXPORT) {
      setDisabledDownload(true)
    }
  }, [])
  return (
    <ConfigProvider>
      <MDToPdfContext.Provider
        value={{
          isLoading,
          setIsLoading,
          onPrint: handlePrint,
          disabledDownload,
          onDownloadPDF: handleDownloadPDF,
          config,
          onConfigChange: updateConfig,
          onPageSizeChange: updatePageSize,
          onOrientationChange: updateOrientation,
          onReset: resetConfig,
          onApplyMarginPreset: applyMarginPreset,
          onApplyThemePreset: applyThemePreset,
          markdown,
          setMarkdown,
          contentRef,
        }}>
        {children}
      </MDToPdfContext.Provider>
    </ConfigProvider>
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
