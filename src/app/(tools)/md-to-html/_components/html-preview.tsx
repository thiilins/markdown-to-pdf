'use client'

import { IconButtonTooltip } from '@/components/custom-ui/tooltip'
import { Copy, Eye } from 'lucide-react'
import { useRef } from 'react'

interface HtmlPreviewProps {
  html: string
  onCopy?: () => void
}

export function HtmlPreview({ html, onCopy }: HtmlPreviewProps) {
  const previewContainerRef = useRef<HTMLDivElement>(null)

  return (
    <div className='flex h-full flex-col'>
      <div className='bg-muted/20 flex shrink-0 items-center justify-between border-b px-4 py-2'>
        <div className='flex items-center gap-2'>
          <Eye className='h-3.5 w-3.5' />
          <span className='text-xs font-medium'>Preview HTML</span>
        </div>
        {onCopy && (
          <IconButtonTooltip
            variant='ghost'
            icon={Copy}
            onClick={onCopy}
            content='Copiar HTML'
            className={{ button: 'h-7 w-7' }}
          />
        )}
      </div>
      <div ref={previewContainerRef} className='custom-scrollbar flex-1 overflow-auto p-6'>
        {html ? (
          <div
            className='prose prose-sm dark:prose-invert max-w-none'
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <div className='text-muted-foreground flex h-full items-center justify-center text-sm'>
            O preview aparecerá aqui
          </div>
        )}
      </div>
    </div>
  )
}
