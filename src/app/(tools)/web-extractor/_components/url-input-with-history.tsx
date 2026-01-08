'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useWebExtractor } from '@/shared/contexts/webExtractorContext'
import { clearHistory, removeFromHistory, type HistoryEntry } from '@/shared/utils/web-extractor-history'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Clock,
  Loader2,
  Search,
  Trash2,
  X,
  XCircle,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

export function UrlInputWithHistory() {
  const {
    url,
    setUrl,
    isLoading,
    handleConvert,
    error,
    result,
    handleReset,
    isReaderMode,
    toggleReaderMode,
    history,
    loadHistory,
  } = useWebExtractor()

  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const hasResult = !!result?.html

  // Filtra histórico baseado na query
  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return history

    const query = searchQuery.toLowerCase()
    return history.filter(
      (entry) =>
        entry.url.toLowerCase().includes(query) ||
        entry.title.toLowerCase().includes(query) ||
        entry.excerpt?.toLowerCase().includes(query),
    )
  }, [history, searchQuery])

  // Atualiza searchQuery quando url muda
  useEffect(() => {
    setSearchQuery(url)
  }, [url])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading && url.trim()) {
      handleConvert()
      setOpen(false)
    }
    if (e.key === 'Escape') {
      setOpen(false)
      inputRef.current?.blur()
    }
  }

  const handleSelectHistory = useCallback(
    (entry: HistoryEntry) => {
      setUrl(entry.url)
      setSearchQuery(entry.url)
      setOpen(false)
      inputRef.current?.focus()
    },
    [setUrl],
  )

  const handleRemoveEntry = useCallback(
    async (e: React.MouseEvent, id: string) => {
      e.stopPropagation()
      await removeFromHistory(id)
      await loadHistory()
      toast.success('Entrada removida do histórico')
    },
    [loadHistory],
  )

  const handleClearHistory = useCallback(async () => {
    await clearHistory()
    await loadHistory()
    toast.success('Histórico limpo')
    setOpen(false)
  }, [loadHistory])

  return (
    <div className='group relative w-full transition-all duration-300 ease-in-out'>
      <div
        className={cn(
          'flex items-center gap-2 rounded-lg border px-2 py-1.5 transition-all duration-300',
          error
            ? 'border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/20'
            : 'border-zinc-200 bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 dark:border-zinc-800 dark:bg-zinc-900',
        )}>
        {/* Ícone da Esquerda - Toggle Reader Mode */}
        <div className='flex items-center justify-center'>
          {hasResult ? (
            <button
              onClick={toggleReaderMode}
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-md transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800',
                isReaderMode ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400',
              )}
              title={isReaderMode ? 'Desativar Foco' : 'Ativar Modo Leitura'}>
              <BookOpen className='h-4 w-4' />
            </button>
          ) : (
            <div className='flex h-6 w-6 items-center justify-center text-zinc-400'>
              <Search className='h-4 w-4' />
            </div>
          )}
        </div>

        {/* Input com Autocomplete */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className='relative flex-1'>
              <Input
                ref={inputRef}
                type='url'
                placeholder='Cole a URL do artigo ou busque no histórico...'
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setUrl(e.target.value)
                  if (e.target.value.trim() && history.length > 0) {
                    setOpen(true)
                  }
                }}
                onFocus={() => {
                  if (history.length > 0) setOpen(true)
                }}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                className='text-foreground placeholder:text-muted-foreground h-7 border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0'
              />
            </div>
          </PopoverTrigger>

          {history.length > 0 && (
            <PopoverContent
              align='start'
              sideOffset={8}
              className='w-[600px] p-0'
              onOpenAutoFocus={(e) => e.preventDefault()}>
              {/* Header */}
              <div className='flex items-center justify-between border-b px-4 py-3'>
                <div className='flex items-center gap-2'>
                  <Clock className='h-4 w-4 text-zinc-400' />
                  <span className='text-sm font-semibold text-zinc-700 dark:text-zinc-300'>
                    Histórico de Extrações
                  </span>
                </div>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={handleClearHistory}
                  className='h-7 gap-1 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400'>
                  <Trash2 className='h-3 w-3' />
                  Limpar
                </Button>
              </div>

              {/* Lista de Histórico */}
              <ScrollArea className='max-h-[400px]'>
                {filteredHistory.length > 0 ? (
                  <div className='p-2'>
                    {filteredHistory.map((entry, idx) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.02 }}>
                        <button
                          onClick={() => handleSelectHistory(entry)}
                          className='group/item relative flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50'>
                          {/* Status Icon */}
                          <div className='mt-0.5 shrink-0'>
                            {entry.success ? (
                              <CheckCircle className='h-4 w-4 text-green-500' />
                            ) : (
                              <XCircle className='h-4 w-4 text-red-500' />
                            )}
                          </div>

                          {/* Content */}
                          <div className='min-w-0 flex-1'>
                            <div className='mb-1 flex items-start justify-between gap-2'>
                              <h4 className='line-clamp-1 text-sm font-semibold text-zinc-700 dark:text-zinc-200'>
                                {entry.title}
                              </h4>
                              <span className='shrink-0 text-xs text-zinc-400'>
                                {formatRelativeTime(entry.timestamp)}
                              </span>
                            </div>
                            <p className='line-clamp-1 text-xs text-zinc-500 dark:text-zinc-400'>
                              {entry.url}
                            </p>
                            {entry.excerpt && (
                              <p className='mt-1 line-clamp-2 text-xs text-zinc-400'>
                                {entry.excerpt}
                              </p>
                            )}
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={(e) => handleRemoveEntry(e, entry.id)}
                            className='mt-0.5 shrink-0 rounded p-1 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-600 group-hover/item:opacity-100 dark:hover:bg-red-900/20'>
                            <X className='h-3.5 w-3.5' />
                          </button>
                        </button>
                        {idx < filteredHistory.length - 1 && <Separator className='my-1' />}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className='flex flex-col items-center py-12 text-center'>
                    <Search className='mb-2 h-8 w-8 text-zinc-300' />
                    <p className='text-sm text-zinc-500'>Nenhum resultado encontrado</p>
                  </div>
                )}
              </ScrollArea>
            </PopoverContent>
          )}
        </Popover>

        {/* Ações da direita */}
        <div className='flex items-center gap-1'>
          {hasResult && (
            <button
              onClick={handleReset}
              disabled={isLoading}
              className='flex h-6 w-6 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800'
              title='Limpar e Voltar'>
              <X className='h-4 w-4' />
            </button>
          )}

          {!hasResult && url.trim().length > 0 && (
            <Button
              size='sm'
              onClick={() => {
                handleConvert()
                setOpen(false)
              }}
              disabled={isLoading}
              className='h-6 rounded-md bg-zinc-900 px-3 text-xs text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900'>
              {isLoading ? <Loader2 className='h-3 w-3 animate-spin' /> : <ArrowRight className='h-3 w-3' />}
            </Button>
          )}
        </div>
      </div>

      {/* Mensagem de Erro */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className='absolute top-full left-0 mt-2 flex w-full items-center justify-center'>
            <div className='flex items-center gap-2 rounded-md bg-red-100 px-3 py-1.5 text-xs font-medium text-red-600 shadow-sm dark:bg-red-900/80 dark:text-red-200'>
              <AlertCircle className='h-3 w-3' />
              {error}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Formata timestamp para tempo relativo
 */
function formatRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d atrás`
  if (hours > 0) return `${hours}h atrás`
  if (minutes > 0) return `${minutes}m atrás`
  return 'Agora'
}
