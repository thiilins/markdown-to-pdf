'use client'

import { Button } from '@/components/ui/button'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { FileCode } from 'lucide-react'
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

const DEFAULT_JS = `function processUserData(users){const activeUsers=users.filter(u=>u.active&&u.emailVerified);const sortedUsers=activeUsers.sort((a,b)=>new Date(b.lastLogin)-new Date(a.lastLogin));const userStats={total:users.length,active:activeUsers.length,recent:sortedUsers.slice(0,10)};return userStats}async function fetchUserData(userId){try{const response=await fetch(\`/api/users/\${userId}\`);if(!response.ok)throw new Error('Failed to fetch');const data=await response.json();return{success:true,data};}catch(error){console.error('Error:',error);return{success:false,error:error.message};}}const users=[{id:1,name:'João',active:true,emailVerified:true,lastLogin:'2024-01-15'},{id:2,name:'Maria',active:true,emailVerified:false,lastLogin:'2024-01-10'}];const stats=processUserData(users);console.log(stats);`

export default function JavascriptFormatterView() {
  const [codeInput, setCodeInput] = useState<string>(DEFAULT_JS)
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
    const result = validateCode(code, 'javascript')
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
            ? minifyCode(code, 'javascript')
            : await formatCode(code, 'javascript')
        setFormattedOutput(result)
        const lines = code.split('\n').length
        const chars = code.length
        const charsFormatted = result.length
        setStats({ lines, chars, charsFormatted })
      } catch (error: any) {
        toast.error(error?.message || 'Erro ao formatar código JavaScript')
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
    const blob = new Blob([formattedOutput], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'formatted.js'
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
        icon={FileCode}
        title='Formatador JavaScript'
        description='Formate, valide e minifique código JavaScript com Prettier'
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
                <FileCode className='h-4 w-4' />
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
                  language='javascript'
                  validation={validation}
                  icon={FileCode}
                  label='Código JavaScript'
                />
              </div>
            )}

            {mobileTab === 'output' && (
              <div className='flex flex-1 flex-col overflow-hidden'>
                <FormatterOutputPanel
                  code={formattedOutput}
                  language='javascript'
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
                language='javascript'
                validation={validation}
                icon={FileCode}
                label='Código JavaScript'
              />
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={50} minSize={30}>
              <FormatterOutputPanel
                code={formattedOutput}
                language='javascript'
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
