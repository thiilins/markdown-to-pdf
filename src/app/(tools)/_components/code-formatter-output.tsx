'use client'

import { IconButtonTooltip } from '@/components/custom-ui/tooltip'
import { Copy, FileCode, Loader2 } from 'lucide-react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { darcula } from 'react-syntax-highlighter/dist/cjs/styles/hljs'

interface CodeFormatterOutputProps {
  code: string
  language: 'html' | 'css' | 'javascript' | 'sql'
  isProcessing?: boolean
  onCopy?: () => void
}

const languageMap: Record<string, string> = {
  html: 'html',
  css: 'css',
  javascript: 'javascript',
  sql: 'sql',
}

export function CodeFormatterOutput({
  code,
  language,
  isProcessing = false,
  onCopy,
}: CodeFormatterOutputProps) {
  return (
    <div className='flex h-full flex-col'>
      <div className='bg-muted/30 border-b shrink-0 flex items-center justify-between px-4 py-2.5'>
        <div className='flex items-center gap-2'>
          <FileCode className='h-4 w-4 text-muted-foreground' />
          <span className='text-sm font-medium'>Código Formatado</span>
          {isProcessing && <Loader2 className='text-primary h-3.5 w-3.5 animate-spin' />}
        </div>
        {onCopy && code && (
          <IconButtonTooltip
            variant='ghost'
            icon={Copy}
            onClick={onCopy}
            content='Copiar código formatado'
            className={{
              button: 'h-7 w-7',
            }}
          />
        )}
      </div>
      <div className='custom-scrollbar flex-1 overflow-auto bg-[#1e1e1e]'>
        {code ? (
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
              <FileCode className='text-muted-foreground/50 mx-auto mb-3 h-12 w-12' />
              <p className='text-sm font-medium'>Aguardando código...</p>
              <p className='text-muted-foreground/70 mt-1 text-xs'>
                O código formatado aparecerá aqui
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}




