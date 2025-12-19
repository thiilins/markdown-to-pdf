'use client'

import { scrapeHtmlToMarkdown } from '@/app/actions/scrapper-html-v2'
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { toast } from 'sonner'
interface WebExtractorContextType {
  url: string
  setUrl: (url: string) => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  result: ScrapeHtmlResponse | null
  setResult: (result: ScrapeHtmlResponse | null) => void
  error: string | null
  setError: (error: string | null) => void
  handleConvert: () => Promise<void>
  handleReset: () => void
  haveContent: boolean
}

const WebExtractorContext = createContext<WebExtractorContextType | undefined>(undefined)

export function WebExtractorProvider({ children }: { children: ReactNode }) {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ScrapeHtmlResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const handleConvert = useCallback(async () => {
    if (!url.trim()) {
      setError('Por favor, insira uma URL válida')
      toast.error('Por favor, insira uma URL válida', {
        duration: 5000,
        description: 'Tente novamente ou use outra URL',
      })
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await scrapeHtmlToMarkdown(url.trim())

      if (response.success && response.markdown) {
        setResult(response)
        toast.success('Conteúdo convertido com sucesso!')
      } else {
        const errorMsg = response.error || 'Erro ao converter conteúdo'
        setError(errorMsg)
        toast.error(errorMsg, {
          duration: 5000,
          description: 'Tente novamente ou use outra URL',
        })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao processar'
      setError(errorMessage)
      toast.error(errorMessage, {
        duration: 5000,
        description: 'Verifique sua conexão e tente novamente',
      })
    } finally {
      setIsLoading(false)
    }
  }, [url])
  const haveContent = useMemo(() => !!url && !!result && !!result.markdown, [url, result])

  const handleReset = useCallback(() => {
    setUrl('')
    setResult(null)
    setError(null)
  }, [])
  return (
    <WebExtractorContext.Provider
      value={{
        url,
        setUrl,
        isLoading,
        setIsLoading,
        result,
        setResult,
        error,
        setError,
        handleConvert,
        haveContent,
        handleReset,
      }}>
      {children}
    </WebExtractorContext.Provider>
  )
}

export function useWebExtractor() {
  const context = useContext(WebExtractorContext)
  if (context === undefined) {
    throw new Error('useWebExtractor deve ser usado dentro de um WebExtractorProvider')
  }
  return context
}
