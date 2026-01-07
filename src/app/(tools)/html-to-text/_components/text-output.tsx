'use client'

import { IconButtonTooltip } from '@/components/custom-ui/tooltip'
import { Copy, FileText } from 'lucide-react'

interface TextOutputProps {
  text: string
  onCopy?: () => void
}

export function TextOutput({ text, onCopy }: TextOutputProps) {
  return (
    <div className='flex h-full flex-col'>
      <div className='bg-muted/20 flex shrink-0 items-center justify-between border-b px-4 py-2'>
        <div className='flex items-center gap-2'>
          <FileText className='h-3.5 w-3.5' />
          <span className='text-xs font-medium'>Texto Extraído</span>
        </div>
        {onCopy && (
          <IconButtonTooltip
            variant='ghost'
            icon={Copy}
            onClick={onCopy}
            content='Copiar texto'
            className={{ button: 'h-7 w-7' }}
          />
        )}
      </div>
      <div className='custom-scrollbar flex-1 overflow-auto p-6'>
        {text ? (
          <pre className='font-mono text-sm break-words whitespace-pre-wrap'>{text}</pre>
        ) : (
          <div className='text-muted-foreground flex h-full items-center justify-center text-sm'>
            O texto extraído aparecerá aqui
          </div>
        )}
      </div>
    </div>
  )
}
