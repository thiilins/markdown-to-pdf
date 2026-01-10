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
import { Copy, Download } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface ExportPreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  code: string
  filename?: string
}

export function ExportPreviewModal({
  open,
  onOpenChange,
  title,
  code,
  filename = 'palette',
}: ExportPreviewModalProps) {
  const [copied, setCopied] = useState(false)

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
    a.download = filename
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
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Copie ou baixe o código gerado</DialogDescription>
        </DialogHeader>

        <ScrollArea className='max-h-[60vh] rounded-md border bg-muted p-4'>
          <pre className='text-xs'>
            <code>{code}</code>
          </pre>
        </ScrollArea>

        <div className='flex gap-2'>
          <Button onClick={handleCopy} variant='outline' className='flex-1 gap-2'>
            <Copy className='h-4 w-4' />
            {copied ? 'Copiado!' : 'Copiar'}
          </Button>
          <Button onClick={handleDownload} variant='outline' className='flex-1 gap-2'>
            <Download className='h-4 w-4' />
            Baixar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
