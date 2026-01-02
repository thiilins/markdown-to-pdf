'use client'

import { Button } from '@/components/ui/button'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Code2, FileCode } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  formatCode,
  minifyCode,
  validateCode,
  type ValidationResult,
} from '../../_components/code-formatter-utils'
import { FormatterEditorPanel } from '../../_components/formatter-editor-panel'
import { FormatterHeader } from '../../_components/formatter-header'
import { FormatterOutputPanel } from '../../_components/formatter-output-panel'

const DEFAULT_HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Exemplo HTML</title>
</head>
<body>
<header class="main-header">
<h1>Bem-vindo</h1>
<nav><ul><li><a href="#home">Home</a></li><li><a href="#about">Sobre</a></li><li><a href="#contact">Contato</a></li></ul></nav>
</header>
<main>
<section id="hero"><div class="container"><h2>Título Principal</h2><p>Este é um exemplo de HTML não formatado que será formatado automaticamente.</p><button class="btn-primary">Clique Aqui</button></div></section>
</main>
<footer><p>&copy; 2024 Todos os direitos reservados</p></footer>
</body>
</html>`

export default function HtmlFormatterView() {
  const [codeInput, setCodeInput] = useState<string>(DEFAULT_HTML)
  const [formattedOutput, setFormattedOutput] = useState<string>('')
  const [formatMode, setFormatMode] = useState<'beautify' | 'minify'>('beautify')
  const [validation, setValidation] = useState<ValidationResult>({
    isValid: true,
    errors: [],
    warnings: [],
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [stats, setStats] = useState({ lines: 0, chars: 0, charsFormatted: 0 })
  const [isDesktop, setIsDesktop] = useState(true)
  const [mobileTab, setMobileTab] = useState<'input' | 'output'>('input')

  useEffect(() => {
    const checkSize = () => setIsDesktop(window.innerWidth >= 1024)
    checkSize()
    window.addEventListener('resize', checkSize)
    return () => window.removeEventListener('resize', checkSize)
  }, [])

  const validateInput = useCallback((code: string) => {
    if (!code.trim()) {
      setValidation({ isValid: true, errors: [], warnings: [] })
      return
    }
    const result = validateCode(code, 'html')
    setValidation(result)
  }, [])

  const processCode = useCallback(
    async (code: string) => {
      if (!code.trim()) {
        setFormattedOutput('')
        setStats({ lines: 0, chars: 0, charsFormatted: 0 })
        return
      }

      setIsProcessing(true)
      try {
        const result =
          formatMode === 'minify' ? minifyCode(code, 'html') : await formatCode(code, 'html')
        setFormattedOutput(result)
        const lines = code.split('\n').length
        const chars = code.length
        const charsFormatted = result.length
        setStats({ lines, chars, charsFormatted })
      } catch (error: any) {
        toast.error(error?.message || 'Erro ao formatar código HTML')
        setFormattedOutput('')
        setStats({ lines: 0, chars: 0, charsFormatted: 0 })
      } finally {
        setIsProcessing(false)
      }
    },
    [formatMode],
  )

  useEffect(() => {
    validateInput(codeInput)
    processCode(codeInput)
  }, [codeInput, processCode, validateInput])

  const handleCopy = useCallback(async () => {
    if (!formattedOutput) {
      toast.error('Nenhum código formatado para copiar')
      return
    }
    try {
      await navigator.clipboard.writeText(formattedOutput)
      toast.success('Código copiado!')
    } catch {
      toast.error('Erro ao copiar código')
    }
  }, [formattedOutput])

  const handleDownload = useCallback(() => {
    if (!formattedOutput) {
      toast.error('Nenhum código para baixar')
      return
    }
    const blob = new Blob([formattedOutput], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'formatted.html'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Código baixado!')
  }, [formattedOutput])

  const handleClear = useCallback(() => {
    setCodeInput('')
    setFormattedOutput('')
    setStats({ lines: 0, chars: 0, charsFormatted: 0 })
    setValidation({ isValid: true, errors: [], warnings: [] })
  }, [])

  return (
    <div className='bg-background flex h-[calc(100vh-4rem)] flex-col overflow-hidden'>
      {/* Header */}
      <FormatterHeader
        icon={Code2}
        title='Formatador HTML'
        description='Formate, valide e minifique código HTML com Prettier'
        validation={validation}
        stats={stats}
        isProcessing={isProcessing}
        formatMode={formatMode}
        onFormatModeChange={setFormatMode}
        onCopy={handleCopy}
        onDownload={handleDownload}
        onClear={handleClear}
        canCopy={!!formattedOutput}
        canDownload={!!formattedOutput}
      />

      {/* Main Content */}
      <div className='flex flex-1 overflow-hidden'>
        {!isDesktop ? (
          <div className='flex h-full w-full flex-col'>
            <div className='bg-muted/30 flex shrink-0 items-center border-b p-1'>
              <Button
                variant={mobileTab === 'input' ? 'secondary' : 'ghost'}
                size='sm'
                className='flex-1 gap-2'
                onClick={() => setMobileTab('input')}>
                <Code2 className='h-4 w-4' />
                Código
              </Button>
              <Button
                variant={mobileTab === 'output' ? 'secondary' : 'ghost'}
                size='sm'
                className='flex-1 gap-2'
                onClick={() => setMobileTab('output')}>
                <FileCode className='h-4 w-4' />
                Formatado
              </Button>
            </div>

            {mobileTab === 'input' && (
              <div className='flex flex-1 flex-col overflow-hidden'>
                <FormatterEditorPanel
                  value={codeInput}
                  onChange={setCodeInput}
                  language='html'
                  validation={validation}
                  icon={Code2}
                  label='Código HTML'
                />
              </div>
            )}

            {mobileTab === 'output' && (
              <div className='flex flex-1 flex-col overflow-hidden'>
                <FormatterOutputPanel
                  code={formattedOutput}
                  language='html'
                  isProcessing={isProcessing}
                  onCopy={handleCopy}
                  stats={stats}
                />
              </div>
            )}
          </div>
        ) : (
          <ResizablePanelGroup direction='horizontal' className='h-full'>
            <ResizablePanel defaultSize={50} minSize={30}>
              <FormatterEditorPanel
                value={codeInput}
                onChange={setCodeInput}
                language='html'
                validation={validation}
                icon={Code2}
                label='Código HTML'
              />
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={50} minSize={30}>
              <FormatterOutputPanel
                code={formattedOutput}
                language='html'
                isProcessing={isProcessing}
                onCopy={handleCopy}
                stats={stats}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </div>
  )
}
