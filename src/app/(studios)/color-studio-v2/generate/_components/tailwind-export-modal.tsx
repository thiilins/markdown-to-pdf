'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { Copy, Download } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import {
  exportTailwindV3Hex,
  exportTailwindV3HSL,
  exportTailwindV3OKLCH,
  exportTailwindV3RGB,
  exportTailwindV4Hex,
  exportTailwindV4HSL,
  exportTailwindV4OKLCH,
  exportTailwindV4RGB,
  type ExportColor,
} from './export-utils'

interface TailwindExportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  colors: ExportColor[]
}

type TailwindVersion = 'v3' | 'v4'
type ColorSpace = 'hex' | 'oklch' | 'rgb' | 'hsl'

export function TailwindExportModal({
  open,
  onOpenChange,
  colors,
}: TailwindExportModalProps) {
  const [version, setVersion] = useState<TailwindVersion>('v4')
  const [colorSpace, setColorSpace] = useState<ColorSpace>('rgb')
  const [copied, setCopied] = useState(false)

  const getCode = (): string => {
    if (version === 'v3') {
      switch (colorSpace) {
        case 'hex':
          return exportTailwindV3Hex(colors)
        case 'oklch':
          return exportTailwindV3OKLCH(colors)
        case 'rgb':
          return exportTailwindV3RGB(colors)
        case 'hsl':
          return exportTailwindV3HSL(colors)
      }
    } else {
      switch (colorSpace) {
        case 'hex':
          return exportTailwindV4Hex(colors)
        case 'oklch':
          return exportTailwindV4OKLCH(colors)
        case 'rgb':
          return exportTailwindV4RGB(colors)
        case 'hsl':
          return exportTailwindV4HSL(colors)
      }
    }
  }

  const code = getCode()

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    toast.success('Código copiado!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tailwind-${version}-${colorSpace}.${version === 'v3' ? 'json' : 'css'}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Arquivo baixado!')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle>Export Tailwind code</DialogTitle>
          <DialogDescription>Escolha a versão e o espaço de cor</DialogDescription>
        </DialogHeader>

        {/* Seletores */}
        <div className='flex gap-4'>
          <div className='flex-1'>
            <label className='mb-2 block text-sm font-medium'>Version</label>
            <div className='flex gap-2'>
              <button
                onClick={() => setVersion('v3')}
                className={cn(
                  'flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-all',
                  version === 'v3'
                    ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700',
                )}>
                v3
              </button>
              <button
                onClick={() => setVersion('v4')}
                className={cn(
                  'flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-all',
                  version === 'v4'
                    ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700',
                )}>
                v4
              </button>
            </div>
          </div>

          <div className='flex-1'>
            <label className='mb-2 block text-sm font-medium'>Color space</label>
            <div className='grid grid-cols-4 gap-2'>
              {(['hex', 'oklch', 'rgb', 'hsl'] as ColorSpace[]).map((space) => (
                <button
                  key={space}
                  onClick={() => setColorSpace(space)}
                  className={cn(
                    'rounded-lg border px-3 py-2 text-xs font-medium uppercase transition-all',
                    colorSpace === space
                      ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700',
                  )}>
                  {space}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview do Código */}
        <ScrollArea className='max-h-[50vh] rounded-md border bg-muted p-4'>
          <pre className='text-xs'>
            <code>{code}</code>
          </pre>
        </ScrollArea>

        {/* Botões de Ação */}
        <div className='flex gap-2'>
          <Button onClick={handleCopy} variant='outline' className='flex-1 gap-2'>
            <Copy className='h-4 w-4' />
            {copied ? 'Copiado!' : 'Copy'}
          </Button>
          <Button onClick={handleDownload} variant='outline' className='flex-1 gap-2'>
            <Download className='h-4 w-4' />
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
