'use client'

import { IconButtonTooltip } from '@/components/custom-ui/tooltip' // Ajuste o import conforme necessário
import { useMarkdown } from '@/shared/contexts/markdownContext'
import { useWebExtractor } from '@/shared/contexts/webExtractorContext'
import { Copy, Download, FileEdit } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function ResultActions() {
  const { result } = useWebExtractor()
  const { onAddMarkdown } = useMarkdown()
  const markdown = result?.markdown || ''
  const title = result?.title || ''
  const router = useRouter()

  const disabled = !markdown

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown)
      toast.success('Markdown copiado!')
    } catch {
      toast.error('Erro ao copiar')
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
      toast.success('Download iniciado')
    } catch {
      toast.error('Erro ao exportar')
    }
  }

  const handleOpenInEditor = () => {
    if (!markdown) {
      toast.error('Nenhum conteúdo para abrir')
      return
    }

    try {
      // Adiciona o conteúdo ao editor com o título como nome do arquivo
      const fileName = title ? title.replace(/[^a-z0-9]/gi, '_') : 'conteudo_extraido'
      // onAddMarkdown já seleciona o item adicionado automaticamente
      onAddMarkdown(markdown, fileName)
      // Navega para o editor
      router.push('/md-editor')
      toast.success('Conteúdo carregado no editor!')
    } catch (error) {
      console.error('Erro ao abrir no editor:', error)
      toast.error('Erro ao abrir no editor')
    }
  }

  return (
    <div className='flex items-center gap-1 border-l pl-2 dark:border-zinc-800'>
      <IconButtonTooltip
        disabled={disabled}
        content='Copiar MD'
        onClick={handleCopy}
        icon={Copy}
        className={{ button: 'h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100' }}
        variant='ghost'
      />
      <IconButtonTooltip
        disabled={disabled}
        content='Baixar Arquivo'
        onClick={handleExport}
        icon={Download}
        className={{ button: 'h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100' }}
        variant='ghost'
      />
      <IconButtonTooltip
        disabled={disabled}
        content='Abrir no Editor'
        onClick={handleOpenInEditor}
        icon={FileEdit}
        className={{
          button:
            'h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20',
        }}
        variant='ghost'
      />
    </div>
  )
}
