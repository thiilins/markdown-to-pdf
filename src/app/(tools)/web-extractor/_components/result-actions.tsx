'use client'

import { Button } from '@/components/ui/button'
import { Copy, Download, ExternalLink } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface ResultActionsProps {
  markdown: string
  title?: string
}

export function ResultActions({ markdown, title }: ResultActionsProps) {
  const router = useRouter()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown)
      toast.success('Markdown copiado para a área de transferência!')
    } catch (error) {
      toast.error('Erro ao copiar markdown')
      console.error('Erro ao copiar:', error)
    }
  }

  const handleExport = () => {
    try {
      const blob = new Blob([markdown], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${title ? title.replace(/[^a-z0-9]/gi, '_') : 'conteudo'}.md`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('Arquivo Markdown exportado com sucesso!')
    } catch (error) {
      toast.error('Erro ao exportar arquivo')
      console.error('Erro ao exportar:', error)
    }
  }

  const handleOpenInMdToPdf = () => {
    try {
      // Codifica o markdown em base64 para passar via URL
      const encoded = btoa(encodeURIComponent(markdown))
      router.push(`/md-to-pdf?content=${encoded}`)
      toast.success('Abrindo no MD-to-PDF...')
    } catch (error) {
      toast.error('Erro ao abrir no MD-to-PDF')
      console.error('Erro ao abrir:', error)
    }
  }

  return (
    <div className='flex gap-2'>
      <Button onClick={handleCopy} variant='outline' size='sm'>
        <Copy className='mr-2 h-4 w-4' />
        Copiar
      </Button>
      <Button onClick={handleExport} variant='outline' size='sm'>
        <Download className='mr-2 h-4 w-4' />
        Exportar
      </Button>
      <Button onClick={handleOpenInMdToPdf} size='sm'>
        <ExternalLink className='mr-2 h-4 w-4' />
        Abrir no MD-to-PDF
      </Button>
    </div>
  )
}
