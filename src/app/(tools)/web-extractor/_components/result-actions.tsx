'use client'

import { useWebExtractor } from '@/shared/contexts/webExtractorContext'
import { Copy, Download, Eraser, ExternalLink } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { IconButtonTooltip } from '../../../../components/custom-ui/tooltip'

interface ResultActionsProps {
  markdown: string
  title?: string
}

export function ResultActions() {
  const { result, handleReset } = useWebExtractor()
  const markdown = result?.markdown || ''
  const title = result?.title || ''
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
      <IconButtonTooltip disabled={!markdown} content='Copiar' onClick={handleCopy} icon={Copy} />
      <IconButtonTooltip
        disabled={!markdown}
        content='Exportar'
        onClick={handleExport}
        icon={Download}
      />
      <IconButtonTooltip
        disabled={!markdown}
        variant='default'
        content='Abrir no MD-to-PDF'
        onClick={handleOpenInMdToPdf}
        icon={ExternalLink}
      />
    </div>
  )
}
