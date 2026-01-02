'use client'

import { ToolShell, type ToolShellStat } from '@/app/(tools)/_components/tool-shell'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useMarkdown } from '@/shared/contexts/markdownContext'
import { FileCode, PanelsTopLeft, Sparkles, SquareSplitVertical } from 'lucide-react'
import { marked } from 'marked'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { HtmlOutputViewer } from './html-output-viewer'
import { MarkdownEditorWithOptions } from './markdown-editor-with-options'

interface ConversionOptions {
  sanitize: boolean
  breaks: boolean
  gfm: boolean
  mangle: boolean
}

export const MdToHtmlViewComponent = () => {
  const { markdown, onResetMarkdown } = useMarkdown()
  const [htmlOutput, setHtmlOutput] = useState<string>('')
  const [viewMode, setViewMode] = useState<'split' | 'preview' | 'code'>('split')
  const [options, setOptions] = useState<ConversionOptions>({
    sanitize: false,
    breaks: true,
    gfm: true,
    mangle: false,
  })
  const [stats, setStats] = useState({ lines: 0, chars: 0, words: 0 })

  // Configurar marked com opções
  useEffect(() => {
    marked.setOptions({
      breaks: options.breaks,
      gfm: options.gfm,
      mangle: options.mangle,
    } as any)
  }, [options])

  // Converter markdown para HTML
  const convertToHtml = useCallback(
    (content: string) => {
      if (!content.trim()) {
        setHtmlOutput('')
        setStats({ lines: 0, chars: 0, words: 0 })
        return
      }

      try {
        let html = marked.parse(content) as string

        // Sanitização básica se necessário
        if (options.sanitize) {
          html = html
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
            .replace(/on\w+="[^"]*"/gi, '')
            .replace(/on\w+='[^']*'/gi, '')
            .replace(/javascript:/gi, '')
        }

        setHtmlOutput(html)

        // Calcular estatísticas
        const lines = content.split('\n').length
        const chars = content.length
        const words = content.trim().split(/\s+/).filter(Boolean).length
        setStats({ lines, chars, words })
      } catch (error: any) {
        console.error('Erro ao converter markdown:', error)
        toast.error('Erro ao converter markdown para HTML')
        setHtmlOutput('')
      }
    },
    [options],
  )

  // Auto-conversão quando o conteúdo muda
  useEffect(() => {
    const content = markdown?.content || ''
    convertToHtml(content)
  }, [markdown?.content, convertToHtml])

  const handleCopyHtml = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(htmlOutput)
      toast.success('HTML copiado para a área de transferência!')
    } catch (error) {
      toast.error('Erro ao copiar HTML')
    }
  }, [htmlOutput])

  const handleDownloadHtml = useCallback(() => {
    if (!htmlOutput) {
      toast.error('Nenhum HTML para baixar')
      return
    }

    const blob = new Blob([htmlOutput], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `markdown-${new Date().toISOString().slice(0, 10)}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('HTML baixado com sucesso!')
  }, [htmlOutput])

  const handleCopyFormattedHtml = useCallback(async () => {
    try {
      const formatted = htmlOutput
        .replace(/></g, '>\n<')
        .split('\n')
        .map((line) => {
          const indent = line.match(/^(\s*)/)?.[1]?.length || 0
          const depth = line.match(/<\//) ? -1 : line.match(/<[^/]/) ? 1 : 0
          return '  '.repeat(Math.max(0, indent / 2 + depth)) + line.trim()
        })
        .join('\n')

      await navigator.clipboard.writeText(formatted)
      toast.success('HTML formatado copiado!')
    } catch (error) {
      await navigator.clipboard.writeText(htmlOutput)
      toast.success('HTML copiado!')
    }
  }, [htmlOutput])

  const handleEditorScroll = useCallback((percentage: number) => {
    // Sincronização de scroll opcional
  }, [])

  // Preparar estatísticas para ToolShell
  const toolShellStats: ToolShellStat[] = [
    { label: 'linhas', value: stats.lines },
    { label: 'palavras', value: stats.words },
    { label: 'chars', value: stats.chars.toLocaleString() },
  ]

  return (
    <ToolShell
      title='Markdown para HTML'
      description='Converta seu Markdown em HTML puro com opções de formatação e sanitização'
      icon={Sparkles}
      layout='resizable'
      orientation='horizontal'
      defaultPanelSizes={[40, 60]}
      inputLabel='Editor Markdown'
      outputLabel='HTML'
      inputComponent={
        <MarkdownEditorWithOptions
          options={options}
          onOptionsChange={(newOptions) => setOptions((prev) => ({ ...prev, ...newOptions }))}
          onScroll={handleEditorScroll}
          onResetMarkdown={onResetMarkdown}
        />
      }
      outputComponent={
        <HtmlOutputViewer
          html={htmlOutput}
          viewMode={viewMode}
          onCopy={handleCopyHtml}
          onCopyFormatted={handleCopyFormattedHtml}
          onDownload={handleDownloadHtml}
        />
      }
      stats={toolShellStats}
      showCopyButton={false}
      showDownloadButton={true}
      showClearButton={false}
      showResetButton={true}
      onCopyOutput={handleCopyHtml}
      onDownloadOutput={handleDownloadHtml}
      onReset={onResetMarkdown}
      hideOutputLabel={true}
      headerSlot={
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
          <TabsList className='h-8 shrink-0'>
            <TabsTrigger value='split' className='px-2 text-xs sm:px-3'>
              <SquareSplitVertical className='mr-1 h-3.5 w-3.5 sm:mr-1.5' />
              <span className='hidden sm:inline'>Split</span>
            </TabsTrigger>
            <TabsTrigger value='preview' className='px-2 text-xs sm:px-3'>
              <PanelsTopLeft className='mr-1 h-3.5 w-3.5 sm:mr-1.5' />
              <span className='hidden sm:inline'>Preview</span>
            </TabsTrigger>
            <TabsTrigger value='code' className='px-2 text-xs sm:px-3'>
              <FileCode className='mr-1 h-3.5 w-3.5 sm:mr-1.5' />
              <span className='hidden sm:inline'>Código</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      }
      mobileTabs={true}
      mobileDefaultTab='input'
    />
  )
}
