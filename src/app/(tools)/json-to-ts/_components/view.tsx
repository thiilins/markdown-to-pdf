'use client'

import { Button } from '@/components/ui/button'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Copy, Download, FileCode, FileJson, FileType, RotateCcw } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { format } from 'prettier/standalone'
import type { Plugin } from 'prettier'

// Cache de plugin carregado dinamicamente para evitar problemas de minificação no Turbopack
const estreePluginCache: { plugin?: Plugin } = {}
import { CodeFormatterEditor } from '../../_components/code-formatter-editor'
import { FormatterOutputPanel } from '../../_components/formatter-output-panel'
import { JsonEditorToolbar } from '../../_components/json-editor-toolbar'
import {
  validateJson,
  formatJson,
  type JsonValidationResult,
} from '../../_components/json-formatter-utils'
import { convertJsonToTypeScriptInterfaces } from '../../_components/json-to-ts-utils'

const DEFAULT_JSON = `{"users":[{"id":1,"name":"João","email":"joao@example.com","active":true,"roles":["admin","user"],"metadata":{"createdAt":"2024-01-15","lastLogin":"2024-01-20"}},{"id":2,"name":"Maria","email":"maria@example.com","active":false,"roles":["user"],"metadata":{"createdAt":"2024-01-10","lastLogin":null}}],"total":2,"page":1,"limit":10}`

export default function JsonToTsView() {
  const [jsonInput, setJsonInput] = useState<string>(DEFAULT_JSON)
  const [tsOutput, setTsOutput] = useState<string>('')
  const [validation, setValidation] = useState<JsonValidationResult>({
    isValid: true,
    errors: [],
    warnings: [],
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDesktop, setIsDesktop] = useState(true)
  const [mobileTab, setMobileTab] = useState<'input' | 'output'>('input')
  const [interfaceName, setInterfaceName] = useState<string>('Root')
  const [useExport, setUseExport] = useState<boolean>(true)
  const isFormattingRef = useRef(false)

  useEffect(() => {
    const checkSize = () => setIsDesktop(window.innerWidth >= 1024)
    checkSize()
    window.addEventListener('resize', checkSize)
    return () => window.removeEventListener('resize', checkSize)
  }, [])

  const validateAndFormatInput = useCallback((json: string) => {
    if (!json.trim()) {
      setValidation({ isValid: true, errors: [], warnings: [] })
      setTsOutput('')
      return
    }
    const result = validateJson(json)
    setValidation(result)

    // Se o JSON for válido, formatá-lo automaticamente
    if (result.isValid && !isFormattingRef.current) {
      try {
        const formatted = formatJson(json)
        // Só atualizar se o JSON formatado for diferente do atual (evitar loop infinito)
        if (formatted !== json) {
          isFormattingRef.current = true
          setJsonInput(formatted)
          // Resetar a flag após um pequeno delay
          setTimeout(() => {
            isFormattingRef.current = false
          }, 100)
        }
      } catch {
        // Ignorar erros de formatação
      }
    }
  }, [])

  const convertToTypeScript = useCallback(
    async (json: string) => {
      if (!json.trim() || !validation.isValid) {
        setTsOutput('')
        return
      }

      setIsProcessing(true)
      try {
        const { safeJsonParse } = await import('@/lib/security-utils')
        const parseResult = safeJsonParse(json, { maxSize: 10 * 1024 * 1024 })
        if (!parseResult.success) {
          throw new Error(parseResult.error || 'Erro ao parsear JSON')
        }
        const parsed = parseResult.data
        let result = convertJsonToTypeScriptInterfaces(parsed, interfaceName, useExport)

        // Formatar o TypeScript com Prettier
        try {
          if (!estreePluginCache.plugin) {
            const estreeModule = await import('prettier/plugins/estree')
            estreePluginCache.plugin = estreeModule.default
          }
          if (estreePluginCache.plugin) {
            result = await format(result, {
              parser: 'typescript',
              plugins: [estreePluginCache.plugin],
              printWidth: 100,
              tabWidth: 2,
              useTabs: false,
              semi: true,
              singleQuote: true,
              trailingComma: 'es5',
            })
          }
        } catch (prettierError) {
          // Se Prettier falhar, usar o resultado sem formatação
          console.warn('Erro ao formatar TypeScript com Prettier:', prettierError)
        }

        setTsOutput(result)
      } catch (error: any) {
        toast.error(error?.message || 'Erro ao converter JSON para TypeScript')
        setTsOutput('')
      } finally {
        setIsProcessing(false)
      }
    },
    [validation.isValid, interfaceName, useExport],
  )

  useEffect(() => {
    validateAndFormatInput(jsonInput)
  }, [jsonInput, validateAndFormatInput])

  useEffect(() => {
    if (validation.isValid && jsonInput.trim()) {
      convertToTypeScript(jsonInput)
    } else {
      setTsOutput('')
    }
  }, [jsonInput, validation.isValid, convertToTypeScript])

  const handleCopy = useCallback(async () => {
    if (!tsOutput) {
      toast.error('Nenhum código TypeScript para copiar')
      return
    }
    try {
      await navigator.clipboard.writeText(tsOutput)
      toast.success('Código TypeScript copiado!')
    } catch {
      toast.error('Erro ao copiar código')
    }
  }, [tsOutput])

  const handleDownload = useCallback(() => {
    if (!tsOutput) {
      toast.error('Nenhum código para baixar')
      return
    }
    const blob = new Blob([tsOutput], { type: 'text/typescript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const extension = useExport ? '.ts' : '.d.ts'
    a.download = `${interfaceName.toLowerCase()}${extension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Código baixado!')
  }, [tsOutput, interfaceName, useExport])

  const handleClear = useCallback(() => {
    setJsonInput('')
    setTsOutput('')
    setValidation({ isValid: true, errors: [], warnings: [] })
  }, [])

  const handleReset = useCallback(() => {
    setJsonInput(DEFAULT_JSON)
    setTsOutput('')
    setValidation({ isValid: true, errors: [], warnings: [] })
  }, [])

  const handleCopyInput = useCallback(async () => {
    if (!jsonInput) {
      toast.error('Nenhum JSON para copiar')
      return
    }
    try {
      await navigator.clipboard.writeText(jsonInput)
      toast.success('JSON copiado!')
    } catch {
      toast.error('Erro ao copiar JSON')
    }
  }, [jsonInput])

  return (
    <div className='bg-background flex h-[calc(100vh-4rem)] flex-col overflow-hidden'>
      {/* Header */}
      <div className='from-card to-card/95 shrink-0 border-b bg-gradient-to-b shadow-sm'>
        <div className='px-4 py-3 sm:px-6 sm:py-4'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex items-center gap-3'>
              <div className='bg-primary/10 ring-primary/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 sm:h-12 sm:w-12'>
                <FileType className='text-primary h-5 w-5 sm:h-6 sm:w-6' />
              </div>
              <div className='min-w-0 flex-1'>
                <h1 className='text-lg font-bold tracking-tight sm:text-xl'>
                  JSON to TypeScript
                </h1>
                <p className='text-muted-foreground mt-0.5 text-xs sm:text-sm'>
                  Converta JSON para interfaces TypeScript automaticamente
                </p>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              {jsonInput.trim() && (
                <Badge
                  variant={validation.isValid ? 'default' : 'destructive'}
                  className='gap-1.5 px-2.5 py-1'>
                  {validation.isValid ? (
                    <>
                      <FileJson className='h-3.5 w-3.5' />
                      <span className='font-medium'>JSON Válido</span>
                    </>
                  ) : (
                    <>
                      <FileCode className='h-3.5 w-3.5' />
                      <span className='font-medium'>{validation.errors.length} erro(s)</span>
                    </>
                  )}
                </Badge>
              )}

              <Button
                variant='ghost'
                size='sm'
                onClick={handleCopy}
                disabled={!tsOutput || isProcessing}
                className='h-9 w-9 p-0'>
                <Copy className='h-4 w-4' />
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleDownload}
                disabled={!tsOutput || isProcessing}
                className='h-9 w-9 p-0'>
                <Download className='h-4 w-4' />
              </Button>
              <Button variant='ghost' size='sm' onClick={handleClear} className='h-9 w-9 p-0'>
                <RotateCcw className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className='bg-muted/20 border-t px-4 py-2.5 sm:px-6'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex items-center gap-3'>
              <div className='flex items-center gap-2'>
                <FileType className='text-muted-foreground h-4 w-4' />
                <Label htmlFor='interface-name' className='text-sm font-medium'>
                  Nome da Interface
                </Label>
              </div>
              <input
                id='interface-name'
                type='text'
                value={interfaceName}
                onChange={(e) => setInterfaceName(e.target.value)}
                placeholder='Root'
                className='bg-background border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring h-8 w-[200px] rounded-md border px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
              />
            </div>
            <div className='flex items-center gap-3'>
              <div className='flex items-center gap-2'>
                <Label htmlFor='use-export' className='text-sm font-medium'>
                  Usar export
                </Label>
                <Switch
                  id='use-export'
                  checked={useExport}
                  onCheckedChange={setUseExport}
                />
              </div>
              <span className='text-muted-foreground text-xs'>
                {useExport ? '.ts' : '.d.ts'}
              </span>
            </div>
          </div>
        </div>
      </div>

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
                <FileJson className='h-4 w-4' />
                JSON
              </Button>
              <Button
                variant={mobileTab === 'output' ? 'secondary' : 'ghost'}
                size='sm'
                className='flex-1 gap-2'
                onClick={() => setMobileTab('output')}>
                <FileType className='h-4 w-4' />
                TypeScript
              </Button>
            </div>

            {mobileTab === 'input' && (
              <div className='flex flex-1 flex-col overflow-hidden'>
                <div className='flex h-full flex-col bg-background'>
                  <div className='bg-muted/30 border-b shrink-0 flex items-center justify-between px-4 py-2.5'>
                    <div className='flex items-center gap-2'>
                      <FileJson className='text-muted-foreground h-4 w-4' />
                      <span className='text-sm font-semibold'>JSON</span>
                    </div>
                  </div>
                  <JsonEditorToolbar
                    value={jsonInput}
                    onValueChange={setJsonInput}
                    onCopy={handleCopyInput}
                    onClear={handleClear}
                    onReset={handleReset}
                    defaultValue={DEFAULT_JSON}
                    validation={validation}
                  />
                  <div className='flex-1 overflow-hidden'>
                    <CodeFormatterEditor
                      value={jsonInput}
                      onChange={setJsonInput}
                      language='json'
                    />
                  </div>
                  {validation.errors.length > 0 && (
                    <div className='bg-destructive/10 border-destructive/20 shrink-0 border-t'>
                      <div className='px-4 py-3'>
                        <div className='flex items-start gap-2.5'>
                          <FileCode className='text-destructive mt-0.5 h-4 w-4 shrink-0' />
                          <div className='flex-1 min-w-0'>
                            <p className='text-destructive text-xs font-semibold mb-1.5'>
                              {validation.errors.length} erro(s) encontrado(s)
                            </p>
                            <ul className='text-destructive/90 space-y-1 text-xs'>
                              {validation.errors.map((error, idx) => (
                                <li key={idx} className='flex items-start gap-1.5'>
                                  <span className='text-destructive/60 mt-0.5'>•</span>
                                  <span className='flex-1'>{error}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {mobileTab === 'output' && (
              <div className='flex flex-1 flex-col overflow-hidden'>
                <FormatterOutputPanel
                  code={tsOutput}
                  language='typescript'
                  isProcessing={isProcessing}
                  onCopy={handleCopy}
                />
              </div>
            )}
          </div>
        ) : (
          <ResizablePanelGroup direction='horizontal' className='h-full'>
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className='flex h-full flex-col bg-background'>
                <div className='bg-muted/30 border-b shrink-0 flex items-center justify-between px-4 py-2.5'>
                  <div className='flex items-center gap-2'>
                    <FileJson className='text-muted-foreground h-4 w-4' />
                    <span className='text-sm font-semibold'>JSON</span>
                  </div>
                </div>
                <JsonEditorToolbar
                  value={jsonInput}
                  onValueChange={setJsonInput}
                  onCopy={handleCopyInput}
                  onClear={handleClear}
                  onReset={handleReset}
                  defaultValue={DEFAULT_JSON}
                  validation={validation}
                />
                <div className='flex-1 overflow-hidden'>
                  <CodeFormatterEditor
                    value={jsonInput}
                    onChange={setJsonInput}
                    language='json'
                  />
                </div>
                {validation.errors.length > 0 && (
                  <div className='bg-destructive/10 border-destructive/20 shrink-0 border-t'>
                    <div className='px-4 py-3'>
                      <div className='flex items-start gap-2.5'>
                        <FileCode className='text-destructive mt-0.5 h-4 w-4 shrink-0' />
                        <div className='flex-1 min-w-0'>
                          <p className='text-destructive text-xs font-semibold mb-1.5'>
                            {validation.errors.length} erro(s) encontrado(s)
                          </p>
                          <ul className='text-destructive/90 space-y-1 text-xs'>
                            {validation.errors.map((error, idx) => (
                              <li key={idx} className='flex items-start gap-1.5'>
                                <span className='text-destructive/60 mt-0.5'>•</span>
                                <span className='flex-1'>{error}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={50} minSize={30}>
              <FormatterOutputPanel
                code={tsOutput}
                language='typescript'
                isProcessing={isProcessing}
                onCopy={handleCopy}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </div>
  )
}

