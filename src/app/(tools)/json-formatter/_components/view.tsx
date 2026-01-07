'use client'

import { Button } from '@/components/ui/button'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { FileCode, FileJson } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  formatJson,
  minifyJson,
  validateJson,
  type JsonValidationResult,
} from '../../_components/json-formatter-utils'
import { FormatterEditorPanel } from '../../_components/formatter-editor-panel'
import { FormatterHeader } from '../../_components/formatter-header'
import { FormatterOutputPanel } from '../../_components/formatter-output-panel'
import { JsonTreeView } from '../../_components/json-tree-view'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const DEFAULT_JSON = `{"users":[{"id":1,"name":"João","email":"joao@example.com","active":true,"roles":["admin","user"],"metadata":{"createdAt":"2024-01-15","lastLogin":"2024-01-20"}},{"id":2,"name":"Maria","email":"maria@example.com","active":false,"roles":["user"],"metadata":{"createdAt":"2024-01-10","lastLogin":null}}],"total":2,"page":1,"limit":10}`

export default function JsonFormatterView() {
  const [codeInput, setCodeInput] = useState<string>(DEFAULT_JSON)
  const [formattedOutput, setFormattedOutput] = useState<string>('')
  const [formatMode, setFormatMode] = useState<'beautify' | 'minify'>('beautify')
  const [validation, setValidation] = useState<JsonValidationResult>({
    isValid: true,
    errors: [],
    warnings: [],
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [stats, setStats] = useState({ lines: 0, chars: 0, charsFormatted: 0 })
  const [isDesktop, setIsDesktop] = useState(true)
  const [mobileTab, setMobileTab] = useState<'input' | 'output'>('input')
  const [outputView, setOutputView] = useState<'formatted' | 'tree'>('formatted')
  const [currentJsonPath, setCurrentJsonPath] = useState<string | null>(null)

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
    const result = validateJson(code)
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
        const result = formatMode === 'minify' ? minifyJson(code) : formatJson(code)
        setFormattedOutput(result)
        const lines = code.split('\n').length
        const chars = code.length
        const charsFormatted = result.length
        setStats({ lines, chars, charsFormatted })
      } catch (error: any) {
        toast.error(error?.message || 'Erro ao formatar JSON')
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
    if (validation.isValid) {
      processCode(codeInput)
    } else {
      setFormattedOutput('')
      setStats({ lines: 0, chars: 0, charsFormatted: 0 })
    }
  }, [codeInput, processCode, validateInput, validation.isValid])

  const handleCopy = useCallback(async () => {
    if (!formattedOutput) {
      toast.error('Nenhum JSON formatado para copiar')
      return
    }
    try {
      await navigator.clipboard.writeText(formattedOutput)
      toast.success('JSON copiado!')
    } catch {
      toast.error('Erro ao copiar JSON')
    }
  }, [formattedOutput])

  const handleDownload = useCallback(() => {
    if (!formattedOutput) {
      toast.error('Nenhum JSON para baixar')
      return
    }
    const blob = new Blob([formattedOutput], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'formatted.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('JSON baixado!')
  }, [formattedOutput])

  const handleClear = useCallback(() => {
    setCodeInput('')
    setFormattedOutput('')
    setStats({ lines: 0, chars: 0, charsFormatted: 0 })
    setValidation({ isValid: true, errors: [], warnings: [] })
  }, [])

  const handleReset = useCallback(() => {
    setCodeInput(DEFAULT_JSON)
    setFormattedOutput('')
    setStats({ lines: 0, chars: 0, charsFormatted: 0 })
    setValidation({ isValid: true, errors: [], warnings: [] })
  }, [])

  const handleCopyInput = useCallback(async () => {
    if (!codeInput) {
      toast.error('Nenhum JSON para copiar')
      return
    }
    try {
      await navigator.clipboard.writeText(codeInput)
      toast.success('JSON copiado!')
    } catch {
      toast.error('Erro ao copiar JSON')
    }
  }, [codeInput])

  return (
    <div className='bg-background flex h-[calc(100vh-4rem)] flex-col overflow-hidden'>
      <FormatterHeader
        icon={FileJson}
        title='Formatador JSON'
        description='Valide, formate e minifique JSON com validação em tempo real'
        validation={{
          isValid: validation.isValid,
          errors: validation.errors,
          warnings: validation.warnings,
        }}
        stats={stats}
        isProcessing={isProcessing}
        formatMode={formatMode}
        onFormatModeChange={setFormatMode}
        onCopy={handleCopy}
        onDownload={handleDownload}
        onClear={handleClear}
        canCopy={!!formattedOutput && validation.isValid}
        canDownload={!!formattedOutput && validation.isValid}
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
                <FileJson className='h-4 w-4' />
                JSON
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
                  language='json'
                  validation={{
                    isValid: validation.isValid,
                    errors: validation.errors,
                    warnings: validation.warnings,
                  }}
                  icon={FileJson}
                  label='JSON'
                  showJsonToolbar={true}
                  onCopy={handleCopyInput}
                  onClear={handleClear}
                  onReset={handleReset}
                  defaultValue={DEFAULT_JSON}
                  onJsonPathChange={setCurrentJsonPath}
                />
              </div>
            )}

            {mobileTab === 'output' && (
              <div className='flex flex-1 flex-col overflow-hidden'>
                <Tabs value={outputView} onValueChange={(v) => setOutputView(v as any)} className='flex h-full flex-col'>
                  <div className='bg-muted/30 border-b px-4 pt-3'>
                    <TabsList className='grid w-full grid-cols-2'>
                      <TabsTrigger value='formatted' className='text-xs'>
                        Formatado
                      </TabsTrigger>
                      <TabsTrigger value='tree' className='text-xs' disabled={!validation.isValid}>
                        Tree View
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value='formatted' className='m-0 flex-1 overflow-hidden'>
                    <FormatterOutputPanel
                      code={formattedOutput}
                      language='json'
                      isProcessing={isProcessing}
                      onCopy={handleCopy}
                      stats={stats}
                    />
                  </TabsContent>
                  <TabsContent value='tree' className='m-0 flex-1 overflow-hidden'>
                    <JsonTreeView jsonText={codeInput} />
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        ) : (
          <ResizablePanelGroup direction='horizontal' className='h-full'>
            <ResizablePanel defaultSize={50} minSize={30}>
              <FormatterEditorPanel
                value={codeInput}
                onChange={setCodeInput}
                language='json'
                validation={{
                  isValid: validation.isValid,
                  errors: validation.errors,
                  warnings: validation.warnings,
                }}
                icon={FileJson}
                label='JSON'
                showJsonToolbar={true}
                onCopy={handleCopyInput}
                onClear={handleClear}
                onReset={handleReset}
                defaultValue={DEFAULT_JSON}
                onJsonPathChange={setCurrentJsonPath}
              />
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={50} minSize={30}>
              <div className='flex h-full flex-col'>
                <Tabs value={outputView} onValueChange={(v) => setOutputView(v as any)} className='flex h-full flex-col'>
                  <div className='bg-muted/30 border-b px-4 pt-3'>
                    <TabsList className='grid w-full grid-cols-2'>
                      <TabsTrigger value='formatted' className='text-xs'>
                        Formatado
                      </TabsTrigger>
                      <TabsTrigger value='tree' className='text-xs' disabled={!validation.isValid}>
                        Tree View
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value='formatted' className='m-0 flex-1 overflow-hidden'>
                    <FormatterOutputPanel
                      code={formattedOutput}
                      language='json'
                      isProcessing={isProcessing}
                      onCopy={handleCopy}
                      stats={stats}
                    />
                  </TabsContent>
                  <TabsContent value='tree' className='m-0 flex-1 overflow-hidden'>
                    <JsonTreeView jsonText={codeInput} />
                  </TabsContent>
                </Tabs>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </div>
  )
}

