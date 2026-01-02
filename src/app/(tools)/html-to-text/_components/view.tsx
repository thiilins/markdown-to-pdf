'use client'

import { ToolShell, type ToolShellStat } from '@/app/(tools)/_components/tool-shell'
import { Scissors } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { DEFAULT_HTML } from './constants'
import { ConversionOptions as ConversionOptionsComponent } from './conversion-options'
import { HtmlEditor } from './html-editor'
import { TextOutput } from './text-output'
import {
  calculateStats,
  formatText,
  removeEmojis,
  removeExtraSpaces,
  removeHtmlInCodeElements,
  removeLineBreaks,
  removeLinks,
  trimLines,
} from './utils'

interface ConversionOptions {
  preserveLineBreaks: boolean
  removeExtraSpaces: boolean
  trimLines: boolean
  removeLinks: boolean
  removeEmojis: boolean
  removeHtmlInCode: boolean
  formatText: boolean
}

export default function HtmlToTextViewComponent() {
  const [htmlInput, setHtmlInput] = useState<string>(DEFAULT_HTML)
  const [textOutput, setTextOutput] = useState<string>('')
  const [options, setOptions] = useState<ConversionOptions>({
    preserveLineBreaks: true,
    removeExtraSpaces: true,
    trimLines: true,
    removeLinks: false,
    removeEmojis: false,
    removeHtmlInCode: false,
    formatText: false,
  })
  const [stats, setStats] = useState({ lines: 0, chars: 0, words: 0 })

  /**
   * Converte HTML para texto puro aplicando todas as opções de formatação
   *
   * @param html - HTML a ser convertido
   */
  const convertHtmlToText = useCallback(
    (html: string) => {
      if (!html.trim()) {
        setTextOutput('')
        setStats({ lines: 0, chars: 0, words: 0 })
        return
      }

      try {
        // Criar um parser DOM para extrair o texto
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')

        // Remover elementos que não devem aparecer no texto extraído
        const elementsToRemove = doc.querySelectorAll(
          'script, style, noscript, iframe, embed, object',
        )
        elementsToRemove.forEach((el) => el.remove())

        // Remover tags HTML dentro de elementos code e pre (se a opção estiver ativa)
        if (options.removeHtmlInCode) {
          removeHtmlInCodeElements(doc)
        }

        // Extrair texto do documento
        let text = doc.body.textContent || doc.body.innerText || ''

        // Aplicar remoção de links (antes de outras formatações para evitar conflitos)
        if (options.removeLinks) {
          text = removeLinks(text)
        }

        // Aplicar remoção de emojis
        if (options.removeEmojis) {
          text = removeEmojis(text)
        }

        // Aplicar opções de formatação de espaços e quebras de linha
        if (options.trimLines) {
          text = trimLines(text)
        }

        if (options.removeExtraSpaces) {
          text = removeExtraSpaces(text)
        }

        if (!options.preserveLineBreaks) {
          text = removeLineBreaks(text)
        }

        // Limpeza final: remover espaços duplicados que possam ter sobrado
        text = text.replace(/\s+/g, ' ').trim()

        // Aplicar formatação de texto (prettier) se a opção estiver ativa
        if (options.formatText) {
          text = formatText(text)
        }

        setTextOutput(text)

        // Calcular estatísticas do texto final
        setStats(calculateStats(text))
      } catch (error) {
        console.error('Erro ao converter HTML para texto:', error)
        toast.error('Erro ao converter HTML para texto')
        setTextOutput('')
        setStats({ lines: 0, chars: 0, words: 0 })
      }
    },
    [options],
  )

  // Auto-conversão quando o HTML ou opções mudam
  useEffect(() => {
    convertHtmlToText(htmlInput)
  }, [htmlInput, convertHtmlToText])

  const handleCopyText = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(textOutput)
      toast.success('Texto copiado para a área de transferência!')
    } catch (error) {
      toast.error('Erro ao copiar texto')
    }
  }, [textOutput])

  const handleDownloadText = useCallback(() => {
    if (!textOutput) {
      toast.error('Nenhum texto para baixar')
      return
    }

    const blob = new Blob([textOutput], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `html-to-text-${new Date().toISOString().slice(0, 10)}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Texto baixado com sucesso!')
  }, [textOutput])

  const handleClear = useCallback(() => {
    setHtmlInput('')
    setTextOutput('')
    setStats({ lines: 0, chars: 0, words: 0 })
  }, [])

  const handleReset = useCallback(() => {
    setHtmlInput(DEFAULT_HTML)
    setTextOutput('')
    setOptions({
      preserveLineBreaks: true,
      removeExtraSpaces: true,
      trimLines: true,
      removeLinks: false,
      removeEmojis: false,
      removeHtmlInCode: false,
      formatText: false,
    })
    setStats({ lines: 0, chars: 0, words: 0 })
  }, [])

  // Preparar estatísticas para ToolShell
  const toolShellStats: ToolShellStat[] = [
    { label: 'linhas', value: stats.lines },
    { label: 'palavras', value: stats.words },
    { label: 'chars', value: stats.chars.toLocaleString() },
  ]

  return (
    <ToolShell
      title='HTML para Texto'
      description='Extraia apenas o texto de documentos HTML, removendo todas as tags'
      icon={Scissors}
      layout='resizable'
      orientation='horizontal'
      defaultPanelSizes={[50, 50]}
      inputLabel='HTML'
      outputLabel='Texto'
      inputComponent={
        <ConversionOptionsComponent
          options={options}
          onOptionsChange={(newOptions: Partial<ConversionOptions>) =>
            setOptions((prev) => ({ ...prev, ...newOptions }))
          }
          editorComponent={<HtmlEditor value={htmlInput} onChange={setHtmlInput} />}
        />
      }
      outputComponent={<TextOutput text={textOutput} onCopy={handleCopyText} />}
      stats={toolShellStats}
      showCopyButton={false}
      showDownloadButton={true}
      showClearButton={true}
      showResetButton={true}
      onCopyOutput={handleCopyText}
      onDownloadOutput={handleDownloadText}
      onClear={handleClear}
      onReset={handleReset}
      hideOutputLabel={true}
      mobileTabs={true}
      mobileDefaultTab='input'
    />
  )
}
