'use client'

import { IconButtonTooltip } from '@/components/custom-ui/tooltip'
import { useMarkdown } from '@/shared/contexts/markdownContext'
import { useWebExtractor } from '@/shared/contexts/webExtractorContext'
import { Code, Download, FilePenLine, FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'
import { convertHtmlToMarkdown } from './utils'
export function ResultActions() {
  const { result } = useWebExtractor()
  const { onAddMarkdownList, onSelectMarkdown } = useMarkdown()
  const htmlContent = result?.html || ''
  const title = result?.title || ''
  const router = useRouter()
  const disabled = !htmlContent

  const handleCopyVisual = useCallback(async () => {
    if (!htmlContent) return
    try {
      const blob = new Blob([htmlContent], { type: 'text/html' })
      const data = [new ClipboardItem({ 'text/html': blob })]
      await navigator.clipboard.write(data)
      toast.success('Conteúdo copiado!')
    } catch (err) {
      toast.error('Erro ao copiar')
    }
  }, [htmlContent])

  const handleExportMarkdown = useCallback(() => {
    if (!htmlContent) return

    try {
      const markdown = convertHtmlToMarkdown(htmlContent, title)

      const blob = new Blob([markdown], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url

      const safeTitle = title ? title.replace(/[^a-z0-9]/gi, '_').substring(0, 50) : 'artigo'
      a.download = `${safeTitle}.md`

      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success('Download do Markdown iniciado!')
    } catch (e) {
      console.error(e)
      toast.error('Erro ao converter para Markdown')
    }
  }, [htmlContent, title])

  const handleOpenInEditor = useCallback(async () => {
    if (!htmlContent) return
    const markdown = convertHtmlToMarkdown(htmlContent, title)
    const id = uuidv4()
    onAddMarkdownList([{ id, content: markdown, name: title }])
    onSelectMarkdown(id)
    router.push('/md-editor')
  }, [htmlContent, title, onAddMarkdownList, router, onSelectMarkdown])

  const handleCopySource = useCallback(async () => {
    if (!htmlContent) return
    navigator.clipboard.writeText(htmlContent)
    toast.info('Código HTML bruto copiado!')
  }, [htmlContent])

  return (
    <div className='flex items-center gap-1 border-l pl-2 dark:border-zinc-800'>
      <IconButtonTooltip
        disabled={disabled}
        content='Copiar Leitura'
        onClick={handleCopyVisual}
        icon={FileText}
        className={{ button: 'h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100' }}
        variant='ghost'
      />
      <IconButtonTooltip
        disabled={disabled}
        content='Baixar Markdown'
        onClick={handleExportMarkdown}
        icon={Download}
        className={{ button: 'h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100' }}
        variant='ghost'
      />
      <IconButtonTooltip
        disabled={disabled}
        content='Abrir no Editor'
        onClick={handleOpenInEditor}
        icon={FilePenLine}
        className={{ button: 'h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100' }}
        variant='ghost'
      />
      <IconButtonTooltip
        disabled={disabled}
        content='Copiar Código Fonte'
        onClick={handleCopySource}
        icon={Code}
        className={{ button: 'h-8 w-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100' }}
        variant='ghost'
      />
    </div>
  )
}
