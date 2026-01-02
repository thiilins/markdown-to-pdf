'use client'

import { Button } from '@/components/ui/button'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { FileCode, Palette } from 'lucide-react'
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

const DEFAULT_CSS = `.container{width:100%;max-width:1200px;margin:0 auto;padding:20px}.header{background:#333;color:#fff;padding:1rem;display:flex;justify-content:space-between;align-items:center}.nav ul{list-style:none;display:flex;gap:2rem;margin:0;padding:0}.btn{background:#007bff;color:#fff;border:none;padding:0.75rem 1.5rem;border-radius:4px;cursor:pointer;font-size:1rem;transition:background 0.3s}.btn:hover{background:#0056b3}.card{background:#fff;border:1px solid #ddd;border-radius:8px;padding:1.5rem;box-shadow:0 2px 4px rgba(0,0,0,0.1);margin-bottom:1rem}`

export default function CssFormatterView() {
  const [codeInput, setCodeInput] = useState<string>(DEFAULT_CSS)
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
    const result = validateCode(code, 'css')
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
          formatMode === 'minify' ? minifyCode(code, 'css') : await formatCode(code, 'css')
        setFormattedOutput(result)
        const lines = code.split('\n').length
        const chars = code.length
        const charsFormatted = result.length
        setStats({ lines, chars, charsFormatted })
      } catch (error: any) {
        toast.error(error?.message || 'Erro ao formatar código CSS')
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
    const blob = new Blob([formattedOutput], { type: 'text/css' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'formatted.css'
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
      <FormatterHeader
        icon={Palette}
        title='Formatador CSS'
        description='Formate, valide e minifique estilos CSS com Prettier'
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

      <div className='flex flex-1 overflow-hidden'>
        {!isDesktop ? (
          <div className='flex h-full w-full flex-col'>
            <div className='bg-muted/30 flex shrink-0 items-center border-b p-1'>
              <Button
                variant={mobileTab === 'input' ? 'secondary' : 'ghost'}
                size='sm'
                className='flex-1 gap-2'
                onClick={() => setMobileTab('input')}>
                <Palette className='h-4 w-4' />
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
                  language='css'
                  validation={validation}
                  icon={Palette}
                  label='Código CSS'
                />
              </div>
            )}

            {mobileTab === 'output' && (
              <div className='flex flex-1 flex-col overflow-hidden'>
                <FormatterOutputPanel
                  code={formattedOutput}
                  language='css'
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
                language='css'
                validation={validation}
                icon={Palette}
                label='Código CSS'
              />
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={50} minSize={30}>
              <FormatterOutputPanel
                code={formattedOutput}
                language='css'
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
