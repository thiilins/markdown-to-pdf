'use client'

import { IconButtonTooltip } from '@/components/custom-ui/tooltip'
import { Copy, Download, FileCode, Zap } from 'lucide-react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { darcula } from 'react-syntax-highlighter/dist/cjs/styles/hljs'

interface HtmlCodeViewerProps {
  html: string
  onCopy?: () => void
  onCopyFormatted?: () => void
  onDownload?: () => void
  showDownload?: boolean
}

export function HtmlCodeViewer({
  html,
  onCopy,
  onCopyFormatted,
  onDownload,
  showDownload = false,
}: HtmlCodeViewerProps) {
  return (
    <div className='flex h-full flex-col'>
      <div className='flex shrink-0 items-center justify-between border-b border-white/10 bg-[#2b2b2b] px-4 py-2'>
        <div className='flex items-center gap-2'>
          <FileCode className='h-3.5 w-3.5 text-zinc-300' />
          <span className='text-xs font-medium text-zinc-200'>Código HTML</span>
        </div>
        <div className='flex items-center gap-1'>
          {onCopy && (
            <IconButtonTooltip
              variant='ghost'
              icon={Copy}
              onClick={onCopy}
              content='Copiar HTML'
              className={{
                button: 'h-7 w-7 text-zinc-300 hover:bg-white/10 hover:text-white',
              }}
            />
          )}
          {onCopyFormatted && (
            <IconButtonTooltip
              variant='ghost'
              icon={Zap}
              onClick={onCopyFormatted}
              content='Copiar HTML Formatado'
              className={{
                button: 'h-7 w-7 text-zinc-300 hover:bg-white/10 hover:text-white',
              }}
            />
          )}
          {showDownload && onDownload && (
            <IconButtonTooltip
              variant='ghost'
              icon={Download}
              onClick={onDownload}
              content='Baixar HTML'
              className={{
                button: 'h-7 w-7 text-zinc-300 hover:bg-white/10 hover:text-white',
              }}
            />
          )}
        </div>
      </div>
      <div className='custom-scrollbar flex-1 overflow-auto bg-[#2b2b2b]'>
        <SyntaxHighlighter
          language='html'
          style={darcula}
          customStyle={{
            margin: 0,
            padding: '1.5rem',
            height: '100%',
            fontSize: '13px',
            backgroundColor: '#2b2b2b',
            fontFamily: 'var(--font-mono)',
          }}
          wrapLines={true}
          wrapLongLines={true}>
          {html || '<!-- O HTML aparecerá aqui -->'}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}
