'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { WebToMarkdownService } from '@/services/webToMarkdownService'
import { Globe, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { PreviewPanel } from './preview-panel'
import { ResultActions } from './result-actions'

export const WebExtractorViewComponent = () => {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ScrapeHtmlResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleConvert = async () => {
    if (!url.trim()) {
      setError('Por favor, insira uma URL válida')
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await WebToMarkdownService.scrape({ url: url.trim() })

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
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading && url.trim()) {
      handleConvert()
    }
  }

  return (
    <div className='flex min-h-full w-full flex-1 flex-col overflow-hidden'>
      {/* Header */}
      <div className='flex items-center gap-2 border-b p-4'>
        <Globe className='text-primary h-5 w-5' />
        <h2 className='font-bold'>Web to Markdown</h2>
      </div>

      {/* Input Section */}
      <div className='bg-muted/20 border-b p-4'>
        <div className='space-y-2'>
          <div className='flex gap-2'>
            <Input
              type='url'
              placeholder='https://example.com/article'
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className='h-9'
            />
            <Button
              onClick={handleConvert}
              disabled={isLoading || !url.trim()}
              size='sm'
              className='h-9'>
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Convertendo
                </>
              ) : (
                'Converter'
              )}
            </Button>
          </div>
          {error && (
            <p className='text-destructive text-xs' role='alert'>
              {error}
            </p>
          )}
        </div>
      </div>

      {/* Result Info & Actions */}
      {result && result.markdown && (
        <div className='bg-background border-b px-4 py-3'>
          <div className='flex items-center justify-between'>
            <div className='min-w-0 flex-1'>
              {result.title && <h3 className='truncate text-sm font-medium'>{result.title}</h3>}
              {result.excerpt && (
                <p className='text-muted-foreground line-clamp-1 text-xs'>{result.excerpt}</p>
              )}
            </div>
            <div className='ml-4'>
              <ResultActions markdown={result.markdown} title={result.title} />
            </div>
          </div>
        </div>
      )}

      {/* Preview Section */}
      <div className='flex flex-1 flex-col overflow-hidden'>
        {result?.markdown ? (
          <PreviewPanel markdown={result.markdown} />
        ) : (
          <div className='bg-muted/10 flex h-full items-center justify-center'>
            <div className='text-muted-foreground text-center'>
              <Globe className='mx-auto mb-4 h-16 w-16 opacity-20' />
              <p className='font-medium'>
                {isLoading ? 'Convertendo conteúdo...' : 'Nenhum conteúdo convertido ainda'}
              </p>
              <p className='text-muted-foreground mt-2 text-sm'>
                {isLoading
                  ? 'Aguarde enquanto extraímos o conteúdo do site...'
                  : 'Cole uma URL acima e clique em "Converter" para começar'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
