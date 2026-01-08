'use client'

import { scrapperHtmlV2 } from '@/app/actions/scrapper-html-v2'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useWebExtractor } from '@/shared/contexts/webExtractorContext'
import { saveToHistory } from '@/shared/utils/web-extractor-history'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  History as HistoryIcon,
  Loader2,
  Plus,
  Search,
  Trash2,
  X,
  XCircle,
  Zap,
} from 'lucide-react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

interface BatchUrl {
  id: string
  url: string
  status: 'pending' | 'loading' | 'success' | 'error'
  title?: string
  html?: string
  error?: string
}

interface BatchUrlExtractorProps {
  onClose?: () => void
}

export function BatchUrlExtractor({ onClose }: BatchUrlExtractorProps) {
  const { history, loadHistory, setResult, setUrl } = useWebExtractor()
  const [urls, setUrls] = useState<BatchUrl[]>([])
  const [inputUrl, setInputUrl] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [combinedHtml, setCombinedHtml] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Filtra histórico
  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return history.slice(0, 10)

    const query = searchQuery.toLowerCase()
    return history
      .filter(
        (entry) =>
          entry.url.toLowerCase().includes(query) ||
          entry.title.toLowerCase().includes(query) ||
          entry.excerpt?.toLowerCase().includes(query),
      )
      .slice(0, 10)
  }, [history, searchQuery])

  const addUrl = useCallback(() => {
    const trimmed = inputUrl.trim()
    if (!trimmed) return

    // Valida URL
    try {
      new URL(trimmed)
    } catch {
      toast.error('URL inválida')
      return
    }

    // Verifica duplicatas
    if (urls.some((u) => u.url === trimmed)) {
      toast.error('URL já adicionada')
      return
    }

    setUrls((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        url: trimmed,
        status: 'pending',
      },
    ])
    setInputUrl('')
    setSearchQuery('')
    setShowHistory(false)
  }, [inputUrl, urls])

  const addFromHistory = useCallback(
    (url: string) => {
      if (urls.some((u) => u.url === url)) {
        toast.error('URL já adicionada')
        return
      }

      setUrls((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          url,
          status: 'pending',
        },
      ])
      setInputUrl('')
      setSearchQuery('')
      setShowHistory(false)
      inputRef.current?.focus()
    },
    [urls],
  )

  const removeUrl = useCallback((id: string) => {
    setUrls((prev) => prev.filter((u) => u.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setUrls([])
    setCombinedHtml('')
  }, [])

  const processUrls = useCallback(async () => {
    if (urls.length === 0) {
      toast.error('Adicione pelo menos uma URL')
      return
    }

    setIsProcessing(true)

    const results: string[] = []
    let successCount = 0

    for (const url of urls) {
      // Atualiza status para loading
      setUrls((prev) =>
        prev.map((u) => (u.id === url.id ? { ...u, status: 'loading' as const } : u)),
      )

      try {
        const response = await scrapperHtmlV2(url.url)

        if (response.success && response.html) {
          // Sucesso
          successCount++

          setUrls((prev) =>
            prev.map((u) =>
              u.id === url.id
                ? {
                    ...u,
                    status: 'success' as const,
                    title: response.title || 'Sem título',
                    html: response.html,
                  }
                : u,
            ),
          )

          // Salva no histórico
          await saveToHistory({
            url: url.url,
            title: response.title || 'Sem título',
            excerpt: response.excerpt,
            timestamp: Date.now(),
            success: true,
          })

          // Adiciona ao HTML combinado com separador visual melhorado
          results.push(`
<article style="border-top: 4px solid #8b5cf6; padding-top: 2rem; margin-top: 3rem; margin-bottom: 3rem;">
  <header style="margin-bottom: 2rem; padding: 1.5rem; background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); border-radius: 12px; border-left: 4px solid #8b5cf6;">
    <h2 style="margin: 0 0 0.75rem 0; color: #111827; font-size: 1.75rem; font-weight: 700;">${response.title || 'Sem título'}</h2>
    <p style="margin: 0; color: #6b7280; font-size: 0.875rem; display: flex; align-items: center; gap: 0.5rem;">
      <strong style="color: #8b5cf6;">🔗 Fonte:</strong>
      <a href="${url.url}" target="_blank" style="color: #8b5cf6; text-decoration: none; border-bottom: 1px solid #8b5cf6;">${url.url}</a>
    </p>
  </header>
  <div style="line-height: 1.8;">
    ${response.html}
  </div>
  <hr style="margin-top: 3rem; border: none; border-top: 2px dashed #e5e7eb;" />
</article>
`)
        } else {
          // Erro
          const errorMsg = response.error || 'Falha ao extrair'
          setUrls((prev) =>
            prev.map((u) =>
              u.id === url.id
                ? {
                    ...u,
                    status: 'error' as const,
                    error: errorMsg,
                  }
                : u,
            ),
          )

          // Salva erro no histórico
          await saveToHistory({
            url: url.url,
            title: 'Falha na extração',
            excerpt: errorMsg,
            timestamp: Date.now(),
            success: false,
          })
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido'
        setUrls((prev) =>
          prev.map((u) =>
            u.id === url.id
              ? {
                  ...u,
                  status: 'error' as const,
                  error: errorMsg,
                }
              : u,
          ),
        )
      }

      // Pequeno delay entre requisições
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    // Combina todos os HTMLs
    const combined = results.join('\n\n')

    // Recarrega histórico
    await loadHistory()

    setIsProcessing(false)

    if (successCount > 0) {
      // Armazena o HTML combinado
      setCombinedHtml(combined)
      toast.success(
        `${successCount} de ${urls.length} URLs extraídas! Clique em "Visualizar" para ver o resultado.`,
      )
    } else {
      toast.error('Nenhuma URL foi extraída com sucesso')
    }
  }, [urls, loadHistory])

  const handleVisualize = useCallback(() => {
    if (!combinedHtml) return

    const successCount = urls.filter((u) => u.status === 'success').length

    // Exibe no preview principal
    setResult({
      success: true,
      html: combinedHtml,
      title: `📚 Conteúdo Agregado (${successCount} ${successCount === 1 ? 'artigo' : 'artigos'})`,
      excerpt: `${successCount} de ${urls.length} URLs extraídas com sucesso`,
    })

    // Define URL fictícia para o agregado
    setUrl(`agregado://${Date.now()}`)

    // Fecha o modal
    if (onClose) {
      onClose()
    }
  }, [combinedHtml, urls, setResult, setUrl, onClose])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addUrl()
    }
  }

  const successCount = urls.filter((u) => u.status === 'success').length
  const errorCount = urls.filter((u) => u.status === 'error').length
  const progress = urls.length > 0 ? ((successCount + errorCount) / urls.length) * 100 : 0

  return (
    <div className='flex h-full w-full flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-purple-500 to-pink-500'>
            <Zap className='h-5 w-5 text-white' />
          </div>
          <div>
            <h3 className='text-lg font-bold text-zinc-900 dark:text-zinc-100'>
              Agregador de URLs
            </h3>
            <p className='text-xs text-zinc-500'>
              Extraia múltiplas URLs e combine em um único HTML
            </p>
          </div>
        </div>
        {urls.length > 0 && (
          <Button variant='ghost' size='sm' onClick={clearAll} disabled={isProcessing}>
            <Trash2 className='h-4 w-4' />
          </Button>
        )}
      </div>

      <Separator />

      {/* Input de URL com Histórico */}
      <div className='relative flex gap-2'>
        <div className='relative flex-1'>
          <div className='relative'>
            <Search className='pointer-events-none absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 text-zinc-400' />
            <Input
              ref={inputRef}
              type='url'
              placeholder='Cole uma URL ou busque no histórico...'
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setInputUrl(e.target.value)
                setShowHistory(e.target.value.length > 0 && history.length > 0)
              }}
              onFocus={() => {
                if (history.length > 0) setShowHistory(true)
              }}
              onBlur={() => {
                // Delay para permitir clique no histórico
                setTimeout(() => setShowHistory(false), 200)
              }}
              onKeyDown={handleKeyDown}
              disabled={isProcessing}
              className='pr-10 pl-9'
            />
            {history.length > 0 && (
              <button
                type='button'
                onClick={() => setShowHistory(!showHistory)}
                className='absolute top-1/2 right-3 z-10 -translate-y-1/2 text-zinc-400 transition-colors hover:text-zinc-600'>
                <HistoryIcon className='h-4 w-4' />
              </button>
            )}
          </div>

          {/* Dropdown de Histórico */}
          {showHistory && filteredHistory.length > 0 && (
            <div className='absolute top-full left-0 z-50 mt-2 w-full rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900'>
              <div className='flex items-center gap-2 border-b border-zinc-200 px-3 py-2 dark:border-zinc-800'>
                <Clock className='h-3.5 w-3.5 text-zinc-400' />
                <span className='text-xs font-semibold text-zinc-600 dark:text-zinc-400'>
                  Histórico de Extrações
                </span>
              </div>
              <ScrollArea className='max-h-[300px]'>
                <div className='p-1'>
                  {filteredHistory.map((entry) => (
                    <button
                      key={entry.id}
                      type='button'
                      onMouseDown={(e) => {
                        e.preventDefault()
                        addFromHistory(entry.url)
                      }}
                      className='flex w-full items-start gap-2 rounded-md p-2 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50'>
                      <div className='mt-0.5 shrink-0'>
                        {entry.success ? (
                          <CheckCircle className='h-3.5 w-3.5 text-green-500' />
                        ) : (
                          <XCircle className='h-3.5 w-3.5 text-red-500' />
                        )}
                      </div>
                      <div className='min-w-0 flex-1'>
                        <h4 className='line-clamp-1 text-xs font-semibold text-zinc-700 dark:text-zinc-200'>
                          {entry.title}
                        </h4>
                        <p className='line-clamp-1 text-[10px] text-zinc-500'>{entry.url}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        <Button onClick={addUrl} disabled={isProcessing || !inputUrl.trim()}>
          <Plus className='h-4 w-4' />
        </Button>
      </div>

      {/* Lista de URLs */}
      {urls.length > 0 && (
        <>
          <ScrollArea className='h-[300px] rounded-lg border border-zinc-200 dark:border-zinc-800'>
            <div className='p-2'>
              <AnimatePresence>
                {urls.map((url, idx) => (
                  <motion.div
                    key={url.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: idx * 0.05 }}>
                    <div className='group flex items-start gap-3 rounded-lg p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'>
                      {/* Status Icon */}
                      <div className='mt-0.5 shrink-0'>
                        {url.status === 'pending' && (
                          <div className='h-5 w-5 rounded-full border-2 border-zinc-300 dark:border-zinc-600' />
                        )}
                        {url.status === 'loading' && (
                          <Loader2 className='h-5 w-5 animate-spin text-blue-500' />
                        )}
                        {url.status === 'success' && (
                          <CheckCircle className='h-5 w-5 text-green-500' />
                        )}
                        {url.status === 'error' && <XCircle className='h-5 w-5 text-red-500' />}
                      </div>

                      {/* Content */}
                      <div className='min-w-0 flex-1'>
                        <p className='line-clamp-1 text-sm font-medium text-zinc-700 dark:text-zinc-200'>
                          {url.title || url.url}
                        </p>
                        <p className='line-clamp-1 text-xs text-zinc-500'>{url.url}</p>
                        {url.error && (
                          <div className='mt-1 flex items-center gap-1 text-xs text-red-600'>
                            <AlertCircle className='h-3 w-3' />
                            {url.error}
                          </div>
                        )}
                      </div>

                      {/* Remove Button */}
                      {!isProcessing && (
                        <button
                          onClick={() => removeUrl(url.id)}
                          className='shrink-0 rounded p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20'>
                          <X className='h-4 w-4' />
                        </button>
                      )}
                    </div>
                    {idx < urls.length - 1 && (
                      <Separator className='my-2 bg-linear-to-r from-transparent via-zinc-200 to-transparent dark:via-zinc-700' />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>

          {/* Progress */}
          {isProcessing && (
            <div className='space-y-2'>
              <div className='flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400'>
                <span>Processando...</span>
                <span>
                  {successCount + errorCount} / {urls.length}
                </span>
              </div>
              <Progress value={progress} className='h-2' />
            </div>
          )}

          {/* Actions */}
          <div className='flex gap-2'>
            {!combinedHtml || isProcessing ? (
              <Button
                onClick={processUrls}
                disabled={isProcessing || urls.length === 0}
                className='w-full gap-2'>
                {isProcessing ? (
                  <>
                    <Loader2 className='h-4 w-4 animate-spin' />
                    Processando...
                  </>
                ) : (
                  <>
                    <Zap className='h-4 w-4' />
                    Extrair Todas ({urls.length})
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleVisualize}
                className='w-full gap-2 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700'>
                <Eye className='h-4 w-4' />
                Visualizar Resultado
              </Button>
            )}
          </div>

          {/* Summary */}
          {!isProcessing && (successCount > 0 || errorCount > 0) && (
            <div className='flex items-center justify-center gap-4 rounded-lg bg-zinc-50 p-3 text-xs dark:bg-zinc-800/50'>
              {successCount > 0 && (
                <div className='flex items-center gap-1 text-green-600 dark:text-green-400'>
                  <CheckCircle className='h-4 w-4' />
                  <span className='font-semibold'>{successCount} sucesso</span>
                </div>
              )}
              {errorCount > 0 && (
                <div className='flex items-center gap-1 text-red-600 dark:text-red-400'>
                  <XCircle className='h-4 w-4' />
                  <span className='font-semibold'>{errorCount} erro(s)</span>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {urls.length === 0 && (
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20'>
            <Zap className='h-8 w-8 text-purple-600 dark:text-purple-400' />
          </div>
          <h4 className='mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300'>
            Nenhuma URL adicionada
          </h4>
          <p className='max-w-xs text-xs text-zinc-500'>
            Cole URLs acima para extrair e combinar múltiplos artigos em um único arquivo HTML
          </p>
        </div>
      )}
    </div>
  )
}
