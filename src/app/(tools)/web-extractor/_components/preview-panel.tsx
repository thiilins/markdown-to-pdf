'use client'

import { Card } from '@/components/ui/card'
import { useWebExtractor } from '@/shared/contexts/webExtractorContext'
import { motion } from 'framer-motion'
import { Globe } from 'lucide-react'
import { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import { ResultActions } from './result-actions'
import { WebExtractorSearchComponent } from './view'

export function PreviewPanel() {
  const { result } = useWebExtractor()
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className='mx-auto flex h-full w-full max-w-7xl flex-col'>
      <Card className='border-background shadown-black flex flex-1 flex-col overflow-hidden bg-white p-0 shadow-2xl dark:bg-zinc-950'>
        <div className='bg-muted/40 flex flex-col items-center justify-between border-b px-6 py-3'>
          {result ? (
            <div className='flex w-full items-center justify-center p-0'>
              <Globe className='mr-2 h-4 w-4 text-gray-400' />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='bg-card/30 p-0'>
                <div className='flex flex-1 flex-col text-center'>
                  {result?.title && (
                    <h3 className='flex-1 truncate text-[13px] leading-tight font-normal text-gray-400'>
                      Web Extractor - {result?.title}
                    </h3>
                  )}
                </div>
              </motion.div>
            </div>
          ) : (
            <div className='flex w-full items-center justify-center p-0'>
              <Globe className='mr-2 h-4 w-4 text-gray-400' />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='bg-card/30 p-0'>
                <div className='flex flex-1 flex-col text-center'>
                  <h3 className='flex-1 truncate text-[13px] leading-tight font-normal text-gray-400'>
                    Web Extractor
                  </h3>
                </div>
              </motion.div>
            </div>
          )}

          <div className='flex w-full items-center justify-between px-6 py-3'>
            <div className='flex items-center gap-4'>
              <div className='flex gap-1.5'>
                <div className='h-3 w-3 cursor-pointer rounded-full bg-red-400/40 transition-colors hover:bg-red-400' />
                <div className='h-3 w-3 cursor-pointer rounded-full bg-amber-400/40 transition-colors hover:bg-amber-400' />
                <div className='h-3 w-3 cursor-pointer rounded-full bg-emerald-400/40 transition-colors hover:bg-emerald-400' />
              </div>
              <div className='bg-border mx-1 h-5 w-px' />
            </div>
            <WebExtractorSearchComponent />
            <ResultActions />
          </div>
        </div>

        <PreviewResultContent />
        <PreviewResultFooter />
      </Card>
    </motion.div>
  )
}

export const PreviewResultContent = () => {
  const { result, isLoading } = useWebExtractor()
  const content = useMemo(() => {
    if (isLoading || !result) {
      return (
        <div className='flex h-full flex-col items-center justify-center p-8 text-center'>
          <div className='relative mb-6'>
            <div className='bg-primary/5 absolute -inset-4 animate-pulse rounded-full blur-2xl' />
            <Globe className='text-primary relative h-20 w-20 opacity-20' />
          </div>
          <div className='max-w-sm space-y-2'>
            <h3 className='text-lg font-bold'>
              {isLoading ? 'Extraindo Conteúdo...' : 'Pronto para converter'}
            </h3>
            <p className='text-muted-foreground text-sm'>
              {isLoading
                ? 'Nossa IA está limpando o HTML e gerando o seu Markdown em alta definição.'
                : 'Insira um link acima para remover anúncios, trackers e paywalls de qualquer site.'}
            </p>
          </div>
        </div>
      )
    }

    return <ReactMarkdown>{result.markdown}</ReactMarkdown>
  }, [result, isLoading])
  return (
    <div className='flex-1 overflow-y-auto bg-zinc-50/20 dark:bg-zinc-950/20 print:hidden'>
      <div className='max-[1920px] mx-auto h-full p-8 lg:p-16'>
        <article className='prose prose-zinc dark:prose-invert prose-headings:font-black prose-headings:tracking-tight prose-p:leading-relaxed prose-img:rounded-2xl prose-img:shadow-2xl prose-img:border prose-img:border-primary/5 max-w-none'>
          {content}
        </article>
      </div>
    </div>
  )
}

const PreviewResultFooter = () => {
  const { result } = useWebExtractor()
  return (
    <div className='text-muted-foreground bg-card/80 flex h-12 items-center justify-between border-t px-8 py-3 text-[10px] font-medium backdrop-blur-sm'>
      <div className='flex items-center gap-4'>
        {!result || !result.markdown
          ? 'Dictum et factum.'
          : `${result?.markdown?.length?.toLocaleString() || 0} caracteres`}
      </div>
    </div>
  )
}
