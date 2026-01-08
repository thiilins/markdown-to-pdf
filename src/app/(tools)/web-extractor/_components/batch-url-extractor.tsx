'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { scrapperHtmlV2 } from '@/app/actions/scrapper-html-v2'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  CheckCircle,
  Download,
  Loader2,
  Plus,
  Trash2,
  X,
  XCircle,
  Zap,
} from 'lucide-react'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

interface BatchUrl {
  id: string
  url: string
  status: 'pending' | 'loading' | 'success' | 'error'
  title?: string
  html?: string
  error?: string
}

export function BatchUrlExtractor() {
  const [urls, setUrls] = useState<BatchUrl[]>([])
  const [inputUrl, setInputUrl] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [combinedHtml, setCombinedHtml] = useState('')

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
  }, [inputUrl, urls])

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
    setCombinedHtml('')

    const results: string[] = []

    for (const url of urls) {
      // Atualiza status para loading
      setUrls((prev) =>
        prev.map((u) => (u.id === url.id ? { ...u, status: 'loading' as const } : u)),
      )

      try {
        const response = await scrapperHtmlV2(url.url)

        if (response.success && response.html) {
          // Sucesso
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

          // Adiciona ao HTML combinado com separador
          results.push(`
<!-- ========================================== -->
<!-- Fonte: ${url.url} -->
<!-- Título: ${response.title || 'Sem título'} -->
<!-- ========================================== -->

${response.html}
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
    setCombinedHtml(combined)

    setIsProcessing(false)

    const successCount = urls.filter((u) => u.status === 'success').length
    toast.success(`${successCount} de ${urls.length} URLs extraídas com sucesso!`)
  }, [urls])

  const downloadCombined = useCallback(() => {
    if (!combinedHtml) {
      toast.error('Nenhum conteúdo para baixar')
      return
    }

    const blob = new Blob([combinedHtml], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `combined-${Date.now()}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success('HTML combinado baixado!')
  }, [combinedHtml])

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
          <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500'>
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

      {/* Input de URL */}
      <div className='flex gap-2'>
        <Input
          type='url'
          placeholder='Cole uma URL e pressione Enter...'
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isProcessing}
          className='flex-1'
        />
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
                          className='shrink-0 rounded p-1 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 dark:hover:bg-red-900/20'>
                          <X className='h-4 w-4' />
                        </button>
                      )}
                    </div>
                    {idx < urls.length - 1 && <Separator className='my-1' />}
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
            <Button
              onClick={processUrls}
              disabled={isProcessing || urls.length === 0}
              className='flex-1 gap-2'>
              {isProcessing ? (
                <>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  Processando...
                </>
              ) : (
                <>
                  <Zap className='h-4 w-4' />
                  Extrair Todas
                </>
              )}
            </Button>

            {combinedHtml && (
              <Button
                onClick={downloadCombined}
                variant='outline'
                className='gap-2'
                disabled={isProcessing}>
                <Download className='h-4 w-4' />
                Baixar HTML
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
          <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20'>
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
