'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Database, FileCode } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  formatCode,
  minifyCode,
  validateCode,
  type ValidationResult,
} from '../../_components/code-formatter-utils'
import { FormatterEditorPanel } from '../../_components/formatter-editor-panel'
import { FormatterOutputPanel } from '../../_components/formatter-output-panel'
import { FormatterHeader } from '../../_components/layouts/formatter-header'

const DEFAULT_SQL = `SELECT u.id,u.name,u.email,COUNT(o.id) as order_count,SUM(o.total) as total_spent FROM users u LEFT JOIN orders o ON u.id=o.user_id WHERE u.active=1 AND u.created_at>='2024-01-01' GROUP BY u.id,u.name,u.email HAVING COUNT(o.id)>0 ORDER BY total_spent DESC LIMIT 20`

export default function SqlFormatterView() {
  const [codeInput, setCodeInput] = useState<string>(DEFAULT_SQL)
  const [formattedOutput, setFormattedOutput] = useState<string>('')
  const [formatMode, setFormatMode] = useState<'beautify' | 'minify'>('beautify')
  const [sqlDialect, setSqlDialect] = useState<'postgresql' | 'mysql' | 'standard'>('postgresql')
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
    const result = validateCode(code, 'sql')
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
          formatMode === 'minify'
            ? minifyCode(code, 'sql')
            : await formatCode(code, 'sql', sqlDialect)
        setFormattedOutput(result)
        const lines = code.split('\n').length
        const chars = code.length
        const charsFormatted = result.length
        setStats({ lines, chars, charsFormatted })
      } catch (error: any) {
        toast.error(error?.message || 'Erro ao formatar código SQL')
        setFormattedOutput('')
        setStats({ lines: 0, chars: 0, charsFormatted: 0 })
      } finally {
        setIsProcessing(false)
      }
    },
    [formatMode, sqlDialect],
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
    const blob = new Blob([formattedOutput], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'formatted.sql'
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
        icon={Database}
        title='Formatador SQL'
        description='Formate, valide e minifique consultas SQL com suporte a múltiplos dialetos'
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
        extraActions={
          <div className='ml-2 flex items-center gap-2 border-l pl-2'>
            <Label htmlFor='sql-dialect' className='text-muted-foreground text-xs font-medium'>
              Dialeto:
            </Label>
            <Select value={sqlDialect} onValueChange={(v) => setSqlDialect(v as any)}>
              <SelectTrigger id='sql-dialect' className='h-8 w-[130px] text-xs'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='postgresql'>PostgreSQL</SelectItem>
                <SelectItem value='mysql'>MySQL</SelectItem>
                <SelectItem value='standard'>Standard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
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
                <Database className='h-4 w-4' />
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
                  language='sql'
                  validation={validation}
                  icon={Database}
                  label='Consulta SQL'
                />
              </div>
            )}

            {mobileTab === 'output' && (
              <div className='flex flex-1 flex-col overflow-hidden'>
                <FormatterOutputPanel
                  code={formattedOutput}
                  language='sql'
                  isProcessing={isProcessing}
                  onCopy={handleCopy}
                  stats={stats}
                />
              </div>
            )}
          </div>
        ) : (
          <ResizablePanelGroup id='sql-formatter-panels' direction='horizontal' className='h-full'>
            <ResizablePanel defaultSize={50} minSize={30}>
              <FormatterEditorPanel
                value={codeInput}
                onChange={setCodeInput}
                language='sql'
                validation={validation}
                icon={Database}
                label='Consulta SQL'
              />
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={50} minSize={30}>
              <FormatterOutputPanel
                code={formattedOutput}
                language='sql'
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
