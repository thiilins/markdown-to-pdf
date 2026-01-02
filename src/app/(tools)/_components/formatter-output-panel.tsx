'use client'

import { IconButtonTooltip } from '@/components/custom-ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { Copy, FileCode, Loader2, Sparkles } from 'lucide-react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { darcula } from 'react-syntax-highlighter/dist/cjs/styles/hljs'

interface FormatterOutputPanelProps {
  code: string
  language: 'html' | 'css' | 'javascript' | 'sql' | 'json' | 'typescript'
  isProcessing?: boolean
  onCopy?: () => void
  stats?: {
    lines: number
    chars: number
    charsFormatted: number
  }
}

const languageMap: Record<string, string> = {
  html: 'html',
  css: 'css',
  javascript: 'javascript',
  sql: 'sql',
  json: 'json',
}

export function FormatterOutputPanel({
  code,
  language,
  isProcessing = false,
  onCopy,
  stats,
}: FormatterOutputPanelProps) {
  const hasCode = code.trim().length > 0
  const reduction = stats && stats.chars > 0
    ? Math.round(((stats.chars - stats.charsFormatted) / stats.chars) * 100)
    : 0

  return (
    <div className='flex h-full flex-col bg-background'>
      {/* Output Header */}
      <div className='bg-muted/30 border-b shrink-0 flex items-center justify-between px-4 py-2.5'>
        <div className='flex items-center gap-2.5'>
          <div className='bg-primary/10 flex h-7 w-7 items-center justify-center rounded-lg'>
            <Sparkles className='text-primary h-3.5 w-3.5' />
          </div>
          <div>
            <div className='flex items-center gap-2'>
              <span className='text-sm font-semibold'>Código Formatado</span>
              {isProcessing && <Loader2 className='text-primary h-3.5 w-3.5 animate-spin' />}
            </div>
            {hasCode && stats && (
              <div className='text-muted-foreground mt-0.5 flex items-center gap-2 text-xs'>
                <span>{stats.charsFormatted.toLocaleString()} caracteres</span>
                {reduction > 0 && (
                  <>
                    <span className='text-muted-foreground/50'>•</span>
                    <Badge variant='secondary' className='h-4 px-1.5 text-[10px]'>
                      -{reduction}%
                    </Badge>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        {onCopy && hasCode && (
          <IconButtonTooltip
            variant='ghost'
            icon={Copy}
            onClick={onCopy}
            content='Copiar código formatado'
            className={{
              button: 'h-8 w-8',
            }}
          />
        )}
      </div>

      {/* Output Content */}
      <div className='custom-scrollbar flex-1 overflow-auto bg-[#1e1e1e]'>
        {hasCode ? (
          <SyntaxHighlighter
            language={languageMap[language]}
            style={darcula}
            customStyle={{
              margin: 0,
              padding: '1.5rem',
              height: '100%',
              fontSize: '13px',
              backgroundColor: '#1e1e1e',
              fontFamily: 'var(--font-mono)',
              lineHeight: '1.6',
            }}
            wrapLines={true}
            wrapLongLines={true}>
            {code}
          </SyntaxHighlighter>
        ) : (
          <div className='text-muted-foreground flex h-full items-center justify-center'>
            <div className='text-center'>
              <div className='bg-muted/50 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl'>
                <FileCode className='text-muted-foreground/50 h-8 w-8' />
              </div>
              <p className='text-sm font-semibold'>Aguardando código...</p>
              <p className='text-muted-foreground/70 mt-1.5 text-xs max-w-xs'>
                O código formatado aparecerá aqui após você inserir código no editor
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

