'use client'

import { ToolShell } from '@/app/(tools)/_components/tool-shell'
import { useMarkdown } from '@/shared/contexts/markdownContext'
import { FileCode2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'
import { OpenApiEditor } from './editor'
import { OpenApiPreview } from './output'
import {
  EXAMPLE_SPECS,
  convertToMarkdown,
  parseOpenAPI,
  validateInput,
  type ParsedOpenAPI,
} from './utils'

export function OpenApiPdfViewComponent() {
  const { onAddMarkdownList } = useMarkdown()
  const [input, setInput] = useState<string>(EXAMPLE_SPECS.petstore)
  const [result, setResult] = useState<ParsedOpenAPI | null>(null)
  const [markdown, setMarkdown] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  const handleParse = useCallback(async () => {
    if (!input.trim()) {
      setResult(null)
      setMarkdown('')
      return
    }

    const validation = validateInput(input)
    if (!validation.isValid) {
      // Não limpa o resultado imediatamente para evitar "flicker" enquanto digita,
      // mas também não atualiza com erro.
      // Opcional: Mostrar erro visual no input ao invés de toast
      return
    }

    setIsProcessing(true)

    try {
      const parsed = await parseOpenAPI(input)
      const md = convertToMarkdown(parsed)

      setResult(parsed)
      setMarkdown(md)
    } catch (error: any) {
      console.error('Erro ao processar OpenAPI:', error)
      // Silencioso no catch para não spammar toasts enquanto digita
    } finally {
      setIsProcessing(false)
    }
  }, [input])

  // Debounce para processamento
  useEffect(() => {
    const timer = setTimeout(() => {
      if (input.trim()) {
        handleParse()
      }
    }, 800) // Aumentei um pouco o debounce para evitar processamento excessivo em specs grandes
    return () => clearTimeout(timer)
  }, [input, handleParse])

  const handleCopy = useCallback(async () => {
    if (!markdown) {
      toast.error('Nada para copiar ainda')
      return
    }
    await navigator.clipboard.writeText(markdown)
    toast.success('Markdown copiado para a área de transferência!')
  }, [markdown])

  const handleClear = useCallback(() => {
    setInput('')
    setResult(null)
    setMarkdown('')
    toast.info('Editor limpo')
  }, [])

  const handleReset = useCallback(() => {
    setInput(EXAMPLE_SPECS.petstore)
    toast.success('Exemplo carregado')
  }, [])

  const handleDownloadMarkdown = useCallback(() => {
    if (!markdown) {
      toast.error('Nenhuma documentação gerada')
      return
    }
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${result?.title.toLowerCase().replace(/\s+/g, '-') || 'api-docs'}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Arquivo Markdown baixado!')
  }, [markdown, result])

  const handleEditInMdEditor = useCallback(() => {
    if (!markdown) {
      toast.error('Gere a documentação antes de editar no Editor de Markdown')
      return
    }
    try {
      onAddMarkdownList([{ id: uuidv4(), content: markdown, name: result?.title || 'api-docs' }])
      toast.success('Abrindo Editor de Markdown...')
      router.push('/md-editor')
    } catch (e) {
      toast.error('Erro ao abrir Editor de Markdown.')
    }
  }, [markdown, onAddMarkdownList, result, router])

  return (
    <ToolShell
      title='OpenAPI to PDF'
      description='Transforme especificações Swagger/OpenAPI (JSON/YAML) em documentação técnica profissional.'
      icon={FileCode2}
      layout='resizable'
      orientation='horizontal'
      defaultPanelSizes={[45, 55]}
      inputLabel='Editor de Especificação'
      outputLabel='Pré-visualização da Documentação'
      inputComponent={<OpenApiEditor value={input} onChange={setInput} />}
      outputComponent={
        <OpenApiPreview
          result={result}
          markdown={markdown}
          isProcessing={isProcessing}
          onEditInMdEditor={handleEditInMdEditor}
          onDownloadMarkdown={handleDownloadMarkdown}
        />
      }
      showCopyButton={true}
      showClearButton={true}
      showResetButton={true}
      onCopyOutput={handleCopy}
      onClear={handleClear}
      onReset={handleReset}
      stats={
        result
          ? [
              {
                label: 'Versão da API',
                value: result.version,
                variant: 'outline',
              },
              {
                label: 'Endpoints',
                value: result.paths.length.toString(),
                variant: 'default',
              },
              {
                label: 'Schemas',
                value: result.schemas.length.toString(),
                variant: 'secondary',
              },
            ]
          : []
      }
      mobileTabs={true}
      mobileDefaultTab='input'
    />
  )
}
