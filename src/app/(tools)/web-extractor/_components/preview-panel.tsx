'use client'

import { useWebExtractor } from '@/shared/contexts/webExtractorContext'
import { motion } from 'framer-motion'
import { Globe } from 'lucide-react'
import { useMemo } from 'react'
import { ResultActions } from './result-actions'
import { WebExtractorSearchComponent } from './view'

export function PreviewPanel() {
  const { result } = useWebExtractor()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, type: 'spring', damping: 20 }}
      className='flex h-full w-full max-w-[1400px] flex-col'>
      <div className='border-border/40 flex h-full min-h-0 flex-col overflow-hidden rounded-xl border bg-white/80 shadow-2xl shadow-black/5 backdrop-blur-xl dark:bg-zinc-900/80 dark:shadow-black/20'>
        {/* Header */}
        <div className='border-border/40 flex h-14 shrink-0 items-center justify-between border-b bg-zinc-50/50 px-4 backdrop-blur-md dark:bg-zinc-900/50'>
          <div className='flex w-20 items-center gap-2'>
            <div className='h-3 w-3 rounded-full bg-[#FF5F57] shadow-sm' />
            <div className='h-3 w-3 rounded-full bg-[#FEBC2E] shadow-sm' />
            <div className='h-3 w-3 rounded-full bg-[#28C840] shadow-sm' />
          </div>

          <div className='flex max-w-2xl flex-1 items-center justify-center px-4'>
            <WebExtractorSearchComponent />
          </div>

          <div className='flex w-auto items-center justify-end gap-2 sm:w-20'>
            <ResultActions />
          </div>
        </div>

        {/* Content */}
        <div className='relative flex min-h-0 flex-1 flex-col overflow-hidden bg-white dark:bg-zinc-950'>
          <PreviewResultContent />
          <PreviewResultFooter />
        </div>
      </div>
    </motion.div>
  )
}

export const PreviewResultContent = () => {
  const { result, isLoading, isReaderMode } = useWebExtractor() // Pegando isReaderMode

  const safeHtmlContent = useMemo(() => {
    if (!result?.html) return ''
    const { sanitizeHtml } = require('@/lib/security-utils')
    let sanitized = sanitizeHtml(result.html, { allowScripts: false })
    // Aplicar ajustes adicionais após sanitização
    sanitized = sanitized
      .replace(
        /<img /g,
        '<img referrerpolicy="no-referrer" style="max-width: 100%; height: auto; display: block; margin: 20px auto;" ',
      )
      .replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ')
    return sanitized
  }, [result?.html])

  const content = useMemo(() => {
    if (isLoading || !result?.html) {
      // ... (Loading state mantido igual)
      return (
        <div className='flex h-full flex-col items-center justify-center p-8 text-center'>
          <div className='relative mb-8'>
            <div className='bg-primary/10 absolute -inset-8 animate-pulse rounded-full blur-3xl' />
            <div className='bg-card border-border flex h-24 w-24 items-center justify-center rounded-2xl border shadow-xl'>
              {isLoading ? (
                <div className='h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-600' />
              ) : (
                <Globe className='text-muted-foreground h-10 w-10 opacity-50' />
              )}
            </div>
          </div>
          <div className='max-w-md space-y-3'>
            <h3 className='text-foreground text-xl font-semibold tracking-tight'>
              {isLoading ? 'Lendo site...' : 'Modo Leitura / Anti-Paywall'}
            </h3>
            <p className='text-muted-foreground text-sm leading-relaxed'>
              {isLoading
                ? 'Estamos acessando o site, removendo anúncios e recuperando imagens originais.'
                : 'Insira a URL acima para ler o conteúdo limpo, sem distrações.'}
            </p>
          </div>
        </div>
      )
    }

    return (
      // APLICANDO O TOGGLE DO READER MODE AQUI:
      // Se isReaderMode for true, usa max-w-4xl (coluna de leitura).
      // Se false, usa max-w-none e padding menor (modo full width).
      <div
        className={`animate-in fade-in slide-in-from-bottom-4 mx-auto w-full py-12 duration-500 ${isReaderMode ? 'max-w-4xl px-8' : 'max-w-full px-4'}`}>
        {result.title && (
          <div className='mb-10 border-b pb-6'>
            <h1 className='text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50'>
              {result.title}
            </h1>
          </div>
        )}

        <div
          className={`prose prose-zinc dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:rounded-xl prose-img:shadow-lg prose-pre:bg-zinc-100 dark:prose-pre:bg-zinc-900 [&_figcaption]:text-muted-foreground [&_figcaption]:mt-2 [&_figcaption]:text-center [&_figcaption]:text-sm [&_figure]:mx-auto [&_figure]:flex [&_figure]:flex-col [&_figure]:items-center [&_figure]:justify-center ${isReaderMode ? 'prose-lg' : 'prose-xl max-w-none'} `}
          dangerouslySetInnerHTML={{ __html: safeHtmlContent }}
        />
      </div>
    )
  }, [result, isLoading, safeHtmlContent, isReaderMode]) // Adicionado isReaderMode nas deps

  return <div className='custom-scrollbar h-full min-h-0 flex-1 overflow-y-auto'>{content}</div>
}

const PreviewResultFooter = () => {
  const { result } = useWebExtractor()
  if (!result?.html) return null
  return (
    <div className='border-border/40 absolute right-0 bottom-0 flex items-center gap-4 rounded-tl-xl border-t border-l bg-white/80 px-4 py-2 text-[11px] font-medium text-zinc-500 backdrop-blur-sm dark:bg-zinc-950/80'>
      <span>{result.html.length.toLocaleString()} caracteres</span>
      <span className='h-3 w-px bg-zinc-200 dark:bg-zinc-800' />
      <span>HTML Reader Mode</span>
    </div>
  )
}
