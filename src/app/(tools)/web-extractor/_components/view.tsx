'use client'

import { IconButtonTooltip } from '@/components/custom-ui/tooltip'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useWebExtractor } from '@/shared/contexts/webExtractorContext'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, ArrowLeft, BadgeCheck, Loader2, Search, Sparkles } from 'lucide-react'
import { PreviewPanel } from './preview-panel'

export const WebExtractorViewComponent = () => {
  return (
    <main className='bg-background flex min-h-full w-full flex-1 flex-col overflow-hidden bg-[url(https://loremflickr.com/1200/800/city)] bg-cover bg-center'>
      <div className='flex flex-1 flex-col overflow-hidden bg-zinc-50/30 dark:bg-zinc-950/30'>
        <div className='flex-1 overflow-hidden p-2'>
          <PreviewPanel />
        </div>
      </div>
    </main>
  )
}

const StatusBadge = ({ result }: { result: any | null }) => {
  return result ? (
    <div className='flex items-center gap-2'>
      <Sparkles className='text-primary h-3.5 w-3.5 animate-pulse' />
      <span className='text-xs font-medium'>Extração Concluída</span>
    </div>
  ) : (
    <div className='flex items-center gap-2'>
      <BadgeCheck className='text-primary h-3.5 w-3.5 animate-pulse' />
      <span className='text-xs font-medium'>Pronto para converter</span>
    </div>
  )
}

export const WebExtractorSearchComponent = () => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading && url.trim()) {
      handleConvert()
    }
  }
  const { url, setUrl, isLoading, handleConvert, error, result, handleReset } = useWebExtractor()

  return (
    <div className='flex w-full items-center justify-center'>
      <div className='w-full max-w-4xl'>
        <div className='flex gap-3'>
          <div className='flex w-full items-center gap-2'>
            <IconButtonTooltip
              disabled={!result?.markdown || isLoading}
              className={{
                button: 'h-7 w-7',
              }}
              variant='default'
              content='Limpar'
              onClick={handleReset}
              icon={ArrowLeft}
            />
            <Input
              type='url'
              placeholder='Cole a URL do artigo (ex: G1, Wikipedia, Medium...)'
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className='bg-background border-primary/10 focus-visible:ring-primary/20 h-8 truncate overflow-hidden text-ellipsis shadow-sm transition-all'
            />
          </div>
          <Button
            onClick={handleConvert}
            disabled={isLoading || !url.trim()}
            className='shadow-primary/10 h-8 w-8 px-6 font-bold shadow-lg transition-transform active:scale-95'>
            {isLoading ? (
              <>
                <Loader2 className='h-4 w-4 animate-spin' />
              </>
            ) : (
              <Search className='h-4 w-4' />
            )}
          </Button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className='text-destructive flex items-center gap-2 pl-1 text-xs font-medium'>
              <AlertCircle className='h-3 w-3' />
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
