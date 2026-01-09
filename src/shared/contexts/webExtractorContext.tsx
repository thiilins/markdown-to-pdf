'use client'

import { scrapperHtmlV2, type ScrapeHtmlResponse } from '@/app/actions/scrapper-html-v2'
import {
  getHistory,
  saveToHistory,
  searchHistory,
  type HistoryEntry,
} from '@/shared/utils/web-extractor-history'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
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
  // Novo estado para o Modo Leitura
  isReaderMode: boolean
  toggleReaderMode: () => void
  // Histórico
  history: HistoryEntry[]
  loadHistory: () => Promise<void>
  searchHistoryQuery: (query: string) => Promise<HistoryEntry[]>
}

const WebExtractorContext = createContext<WebExtractorContextType | undefined>(undefined)

export function WebExtractorProvider({ children }: { children: ReactNode }) {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ScrapeHtmlResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isReaderMode, setIsReaderMode] = useState(true)
  const [history, setHistory] = useState<HistoryEntry[]>([])

  // Carrega histórico ao montar
  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = useCallback(async () => {
    const historyData = await getHistory()
    setHistory(historyData)
  }, [])

  const searchHistoryQuery = useCallback(async (query: string) => {
    return await searchHistory(query)
  }, [])

  const handleConvert = useCallback(async () => {
    if (!url.trim()) {
      setError('Por favor, insira uma URL válida')
      toast.error('Por favor, insira uma URL válida')
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)
    // Força o modo leitura ao carregar novo conteúdo
    setIsReaderMode(true)

    try {
      const response = await scrapperHtmlV2(url.trim())

      if (response.success && response.html) {
        setResult(response)
        toast.success('Conteúdo extraído com sucesso!')

        // Salva no histórico
        await saveToHistory({
          url: url.trim(),
          title: response.title || 'Sem título',
          excerpt: response.excerpt,
          timestamp: Date.now(),
          success: true,
        })

        // Recarrega histórico
        await loadHistory()
      } else {
        const errorMsg = response.error || 'Erro ao extrair conteúdo'
        setError(errorMsg)
        toast.error(errorMsg)

        // Salva falha no histórico também
        await saveToHistory({
          url: url.trim(),
          title: 'Falha na extração',
          excerpt: errorMsg,
          timestamp: Date.now(),
          success: false,
        })

        await loadHistory()
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao processar'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [url, loadHistory])

  const haveContent = useMemo(() => !!url && !!result && !!result.html, [url, result])

  const handleReset = useCallback(() => {
    setUrl('')
    setResult(null)
    setError(null)
  }, [])

  const toggleReaderMode = useCallback(() => {
    setIsReaderMode((prev) => !prev)
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
        isReaderMode,
        toggleReaderMode,
        history,
        loadHistory,
        searchHistoryQuery,
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
