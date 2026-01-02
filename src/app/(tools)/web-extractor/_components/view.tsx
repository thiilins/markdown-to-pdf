'use client'

import { IconButtonTooltip } from '@/components/custom-ui/tooltip'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useWebExtractor } from '@/shared/contexts/webExtractorContext'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, ArrowRight, BookOpen, Loader2, Search, X } from 'lucide-react'
import { PreviewPanel } from './preview-panel'

export const WebExtractorViewComponent = () => {
  return (
    <main className='relative flex h-full w-full flex-col overflow-hidden bg-zinc-50 dark:bg-zinc-950'>
      {/* Background Decorativo */}
      <div className='pointer-events-none absolute inset-0 flex justify-center'>
        <div className='absolute inset-0 h-full w-full bg-linear-to-b from-blue-50 to-transparent dark:from-blue-950/20' />
        <div className='absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]' />
      </div>

      <div className='z-10 flex h-full min-h-0 flex-1 flex-col items-center justify-center p-4 md:p-8'>
        <PreviewPanel />
      </div>
    </main>
  )
}

export const WebExtractorSearchComponent = () => {
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
  } = useWebExtractor()

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading && url.trim()) {
      handleConvert()
    }
  }

  const hasResult = !!result?.html

  return (
    <div className='group relative w-full transition-all duration-300 ease-in-out'>
      <div
        className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 transition-all duration-300 ${
          error
            ? 'border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/20'
            : 'border-zinc-200 bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 dark:border-zinc-800 dark:bg-zinc-900'
        } `}>
        {/* Ícone da Esquerda - AGORA FUNCIONAL (Toggle Reader Mode) */}
        <div className='flex items-center justify-center'>
          {hasResult ? (
            <IconButtonTooltip
              content={isReaderMode ? 'Desativar Foco' : 'Ativar Modo Leitura'}
              onClick={toggleReaderMode}
              className={{
                button: `h-6 w-6 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 ${isReaderMode ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400'}`,
              }}
              icon={BookOpen}
            />
          ) : (
            <div className='flex h-6 w-6 items-center justify-center text-zinc-400'>
              <Search className='h-4 w-4' />
            </div>
          )}
        </div>

        <Input
          type='url'
          placeholder='Cole a URL do artigo (ex: G1, Medium, Dev.to...)'
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          className='text-foreground placeholder:text-muted-foreground h-7 flex-1 border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0'
        />

        {/* Ações da direita */}
        <div className='flex items-center gap-1'>
          {hasResult && (
            <IconButtonTooltip
              content='Limpar e Voltar'
              onClick={handleReset}
              disabled={isLoading}
              className={{ button: 'h-6 w-6 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800' }}
              icon={X}
            />
          )}

          {!hasResult && url.trim().length > 0 && (
            <Button
              size='sm'
              onClick={handleConvert}
              disabled={isLoading}
              className='h-6 rounded-md bg-zinc-900 px-3 text-xs text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900'>
              {isLoading ? (
                <Loader2 className='h-3 w-3 animate-spin' />
              ) : (
                <ArrowRight className='h-3 w-3' />
              )}
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
