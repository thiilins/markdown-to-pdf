'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Separator } from '@/components/ui/separator'
import {
  CheckCircle2,
  Copy,
  Download,
  FileText,
  Globe,
  Mail,
  Network,
  RotateCcw,
  Search,
  User,
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { CodeFormatterEditor } from '../../_components/code-formatter-editor'
import {
  extractData,
  formatAsCsv,
  formatAsList,
  type ExtractionOptions,
  type ExtractionResult,
} from '../../_components/data-extractor-utils'

const DEFAULT_TEXT = `Contato: joao@example.com ou maria@company.com.br
Acesse https://www.example.com e https://github.com/user/repo
Servidor em 192.168.1.1 e 10.0.0.1
CPF: 123.456.789-00 e 98765432100
Mais emails: admin@test.org, suporte@help.com`

export default function DataExtractorView() {
  const [textInput, setTextInput] = useState<string>(DEFAULT_TEXT)
  const [extractionResult, setExtractionResult] = useState<ExtractionResult>({
    emails: [],
    urls: [],
    ips: [],
    cpfs: [],
    total: 0,
  })
  const [options, setOptions] = useState<ExtractionOptions>({
    extractEmails: true,
    extractUrls: true,
    extractIps: true,
    extractCpfs: true,
  })
  const [isDesktop, setIsDesktop] = useState(true)
  const [mobileTab, setMobileTab] = useState<'input' | 'output'>('input')

  useEffect(() => {
    const checkSize = () => setIsDesktop(window.innerWidth >= 1024)
    checkSize()
    window.addEventListener('resize', checkSize)
    return () => window.removeEventListener('resize', checkSize)
  }, [])

  useEffect(() => {
    if (textInput.trim()) {
      const result = extractData(textInput, options)
      setExtractionResult(result)
    } else {
      setExtractionResult({
        emails: [],
        urls: [],
        ips: [],
        cpfs: [],
        total: 0,
      })
    }
  }, [textInput, options])

  const handleCopyCsv = useCallback(async () => {
    if (extractionResult.total === 0) {
      toast.error('Nenhum dado extraído para copiar')
      return
    }
    try {
      const csv = formatAsCsv(extractionResult)
      await navigator.clipboard.writeText(csv)
      toast.success('Dados copiados como CSV!')
    } catch {
      toast.error('Erro ao copiar dados')
    }
  }, [extractionResult])

  const handleCopyList = useCallback(async () => {
    if (extractionResult.total === 0) {
      toast.error('Nenhum dado extraído para copiar')
      return
    }
    try {
      const list = formatAsList(extractionResult)
      await navigator.clipboard.writeText(list)
      toast.success('Dados copiados como lista!')
    } catch {
      toast.error('Erro ao copiar dados')
    }
  }, [extractionResult])

  const handleClear = useCallback(() => {
    setTextInput('')
    setExtractionResult({
      emails: [],
      urls: [],
      ips: [],
      cpfs: [],
      total: 0,
    })
  }, [])

  const handleReset = useCallback(() => {
    setTextInput(DEFAULT_TEXT)
  }, [])

  const toggleOption = useCallback((key: keyof ExtractionOptions) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }))
  }, [])

  return (
    <div className='bg-background flex h-[calc(100vh-4rem)] flex-col overflow-hidden'>
      {/* Header */}
      <div className='from-card to-card/95 shrink-0 border-b bg-gradient-to-b shadow-sm'>
        <div className='px-4 py-3 sm:px-6 sm:py-4'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex items-center gap-3'>
              <div className='bg-primary/10 ring-primary/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 sm:h-12 sm:w-12'>
                <Search className='text-primary h-5 w-5 sm:h-6 sm:w-6' />
              </div>
              <div className='min-w-0 flex-1'>
                <h1 className='text-lg font-bold tracking-tight sm:text-xl'>
                  Extrator de Dados
                </h1>
                <p className='text-muted-foreground mt-0.5 text-xs sm:text-sm'>
                  Extraia emails, URLs, IPs e CPFs de textos
                </p>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              {extractionResult.total > 0 && (
                <Badge variant='default' className='gap-1.5 px-2.5 py-1'>
                  <CheckCircle2 className='h-3.5 w-3.5' />
                  <span className='font-medium'>{extractionResult.total} item(ns)</span>
                </Badge>
              )}

              <Button
                variant='ghost'
                size='sm'
                onClick={handleCopyCsv}
                disabled={extractionResult.total === 0}
                className='h-9 w-9 p-0'>
                <Copy className='h-4 w-4' />
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleCopyList}
                disabled={extractionResult.total === 0}
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
          <div className='flex flex-wrap items-center gap-4 sm:gap-6'>
            <div className='flex items-center gap-2'>
              <Checkbox
                id='extract-emails'
                checked={options.extractEmails}
                onCheckedChange={() => toggleOption('extractEmails')}
              />
              <Label htmlFor='extract-emails' className='flex cursor-pointer items-center gap-1.5'>
                <Mail className='h-3.5 w-3.5 text-muted-foreground' />
                <span className='text-sm font-medium'>Emails</span>
                {extractionResult.emails.length > 0 && (
                  <Badge variant='secondary' className='ml-1 h-5 px-1.5 text-[10px]'>
                    {extractionResult.emails.length}
                  </Badge>
                )}
              </Label>
            </div>

            <div className='flex items-center gap-2'>
              <Checkbox
                id='extract-urls'
                checked={options.extractUrls}
                onCheckedChange={() => toggleOption('extractUrls')}
              />
              <Label htmlFor='extract-urls' className='flex cursor-pointer items-center gap-1.5'>
                <Globe className='h-3.5 w-3.5 text-muted-foreground' />
                <span className='text-sm font-medium'>URLs</span>
                {extractionResult.urls.length > 0 && (
                  <Badge variant='secondary' className='ml-1 h-5 px-1.5 text-[10px]'>
                    {extractionResult.urls.length}
                  </Badge>
                )}
              </Label>
            </div>

            <div className='flex items-center gap-2'>
              <Checkbox
                id='extract-ips'
                checked={options.extractIps}
                onCheckedChange={() => toggleOption('extractIps')}
              />
              <Label htmlFor='extract-ips' className='flex cursor-pointer items-center gap-1.5'>
                <Network className='h-3.5 w-3.5 text-muted-foreground' />
                <span className='text-sm font-medium'>IPs</span>
                {extractionResult.ips.length > 0 && (
                  <Badge variant='secondary' className='ml-1 h-5 px-1.5 text-[10px]'>
                    {extractionResult.ips.length}
                  </Badge>
                )}
              </Label>
            </div>

            <div className='flex items-center gap-2'>
              <Checkbox
                id='extract-cpfs'
                checked={options.extractCpfs}
                onCheckedChange={() => toggleOption('extractCpfs')}
              />
              <Label htmlFor='extract-cpfs' className='flex cursor-pointer items-center gap-1.5'>
                <User className='h-3.5 w-3.5 text-muted-foreground' />
                <span className='text-sm font-medium'>CPFs</span>
                {extractionResult.cpfs.length > 0 && (
                  <Badge variant='secondary' className='ml-1 h-5 px-1.5 text-[10px]'>
                    {extractionResult.cpfs.length}
                  </Badge>
                )}
              </Label>
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
                <FileText className='h-4 w-4' />
                Texto
              </Button>
              <Button
                variant={mobileTab === 'output' ? 'secondary' : 'ghost'}
                size='sm'
                className='flex-1 gap-2'
                onClick={() => setMobileTab('output')}>
                <Search className='h-4 w-4' />
                Resultados
              </Button>
            </div>

            {mobileTab === 'input' && (
              <div className='flex flex-1 flex-col overflow-hidden'>
                <div className='flex h-full flex-col bg-background'>
                  <div className='bg-muted/30 flex shrink-0 items-center justify-between border-b px-4 py-2.5'>
                    <div className='flex items-center gap-2'>
                      <FileText className='text-muted-foreground h-4 w-4' />
                      <span className='text-sm font-semibold'>Texto</span>
                    </div>
                  </div>
                  <div className='flex-1 overflow-hidden'>
                    <CodeFormatterEditor
                      value={textInput}
                      onChange={setTextInput}
                      language='plaintext'
                    />
                  </div>
                </div>
              </div>
            )}

            {mobileTab === 'output' && (
              <div className='flex flex-1 flex-col overflow-hidden'>
                <ExtractionResultsPanel
                  result={extractionResult}
                  onCopyCsv={handleCopyCsv}
                  onCopyList={handleCopyList}
                />
              </div>
            )}
          </div>
        ) : (
          <ResizablePanelGroup direction='horizontal' className='h-full'>
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className='flex h-full flex-col bg-background'>
                <div className='bg-muted/30 flex shrink-0 items-center justify-between border-b px-4 py-2.5'>
                  <div className='flex items-center gap-2'>
                    <FileText className='text-muted-foreground h-4 w-4' />
                    <span className='text-sm font-semibold'>Texto</span>
                  </div>
                </div>
                <div className='flex-1 overflow-hidden'>
                  <CodeFormatterEditor
                    value={textInput}
                    onChange={setTextInput}
                    language='plaintext'
                  />
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={50} minSize={30}>
              <ExtractionResultsPanel
                result={extractionResult}
                onCopyCsv={handleCopyCsv}
                onCopyList={handleCopyList}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </div>
  )
}

function ExtractionResultsPanel({
  result,
  onCopyCsv,
  onCopyList,
}: {
  result: ExtractionResult
  onCopyCsv: () => void
  onCopyList: () => void
}) {
  return (
    <div className='flex h-full flex-col bg-background'>
      <div className='bg-muted/30 flex shrink-0 items-center justify-between border-b px-4 py-2.5'>
        <div className='flex items-center gap-2'>
          <Search className='text-muted-foreground h-4 w-4' />
          <span className='text-sm font-semibold'>Resultados</span>
          {result.total > 0 && (
            <Badge variant='secondary' className='ml-2 h-5 px-1.5 text-[10px]'>
              {result.total} encontrado(s)
            </Badge>
          )}
        </div>
        <div className='flex items-center gap-1'>
          <Button
            variant='ghost'
            size='sm'
            onClick={onCopyCsv}
            disabled={result.total === 0}
            className='h-7 gap-1.5 px-2 text-xs'>
            <Copy className='h-3.5 w-3.5' />
            CSV
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={onCopyList}
            disabled={result.total === 0}
            className='h-7 gap-1.5 px-2 text-xs'>
            <Copy className='h-3.5 w-3.5' />
            Lista
          </Button>
        </div>
      </div>

      <div className='custom-scrollbar flex-1 overflow-auto p-4'>
        {result.total === 0 ? (
          <div className='text-muted-foreground flex h-full items-center justify-center'>
            <div className='text-center'>
              <Search className='text-muted-foreground/50 mx-auto mb-4 h-12 w-12' />
              <p className='text-sm font-semibold'>Nenhum dado encontrado</p>
              <p className='text-muted-foreground/70 mt-1.5 text-xs max-w-xs'>
                Os dados extraídos aparecerão aqui
              </p>
            </div>
          </div>
        ) : (
          <div className='space-y-6'>
            {result.emails.length > 0 && (
              <div>
                <div className='mb-3 flex items-center gap-2'>
                  <Mail className='text-primary h-4 w-4' />
                  <h3 className='text-sm font-semibold'>Emails ({result.emails.length})</h3>
                </div>
                <div className='bg-muted/30 rounded-lg border p-3'>
                  <div className='space-y-1.5'>
                    {result.emails.map((email, idx) => (
                      <div
                        key={idx}
                        className='bg-background rounded border px-3 py-2 text-xs font-mono'>
                        {email}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {result.urls.length > 0 && (
              <div>
                <div className='mb-3 flex items-center gap-2'>
                  <Globe className='text-primary h-4 w-4' />
                  <h3 className='text-sm font-semibold'>URLs ({result.urls.length})</h3>
                </div>
                <div className='bg-muted/30 rounded-lg border p-3'>
                  <div className='space-y-1.5'>
                    {result.urls.map((url, idx) => (
                      <div
                        key={idx}
                        className='bg-background rounded border px-3 py-2 text-xs font-mono break-all'>
                        {url}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {result.ips.length > 0 && (
              <div>
                <div className='mb-3 flex items-center gap-2'>
                  <Network className='text-primary h-4 w-4' />
                  <h3 className='text-sm font-semibold'>IPs ({result.ips.length})</h3>
                </div>
                <div className='bg-muted/30 rounded-lg border p-3'>
                  <div className='space-y-1.5'>
                    {result.ips.map((ip, idx) => (
                      <div
                        key={idx}
                        className='bg-background rounded border px-3 py-2 text-xs font-mono'>
                        {ip}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {result.cpfs.length > 0 && (
              <div>
                <div className='mb-3 flex items-center gap-2'>
                  <User className='text-primary h-4 w-4' />
                  <h3 className='text-sm font-semibold'>CPFs ({result.cpfs.length})</h3>
                </div>
                <div className='bg-muted/30 rounded-lg border p-3'>
                  <div className='space-y-1.5'>
                    {result.cpfs.map((cpf, idx) => (
                      <div
                        key={idx}
                        className='bg-background rounded border px-3 py-2 text-xs font-mono'>
                        {cpf}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

