'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { AlertTriangle, Copy, FileCode, RotateCcw, Shield } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { CodeFormatterEditor } from '../../_components/code-formatter-editor'
import { decodeJwt, formatJson, type JwtParts } from '../../_components/jwt-utils'

const DEFAULT_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

export default function JwtDecoderView() {
  const [tokenInput, setTokenInput] = useState<string>(DEFAULT_TOKEN)
  const [jwtParts, setJwtParts] = useState<JwtParts>({
    header: {},
    payload: {},
    signature: '',
    isValid: false,
  })
  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    const checkSize = () => setIsDesktop(window.innerWidth >= 1024)
    checkSize()
    window.addEventListener('resize', checkSize)
    return () => window.removeEventListener('resize', checkSize)
  }, [])

  useEffect(() => {
    if (tokenInput.trim()) {
      const decoded = decodeJwt(tokenInput)
      setJwtParts(decoded)
    } else {
      setJwtParts({
        header: {},
        payload: {},
        signature: '',
        isValid: false,
      })
    }
  }, [tokenInput])

  const handleCopyHeader = useCallback(async () => {
    if (!jwtParts.isValid) {
      toast.error('Token inválido')
      return
    }
    try {
      const formatted = formatJson(jwtParts.header)
      await navigator.clipboard.writeText(formatted)
      toast.success('Header copiado!')
    } catch {
      toast.error('Erro ao copiar')
    }
  }, [jwtParts])

  const handleCopyPayload = useCallback(async () => {
    if (!jwtParts.isValid) {
      toast.error('Token inválido')
      return
    }
    try {
      const formatted = formatJson(jwtParts.payload)
      await navigator.clipboard.writeText(formatted)
      toast.success('Payload copiado!')
    } catch {
      toast.error('Erro ao copiar')
    }
  }, [jwtParts])

  const handleCopyToken = useCallback(async () => {
    if (!tokenInput) {
      toast.error('Nenhum token para copiar')
      return
    }
    try {
      await navigator.clipboard.writeText(tokenInput)
      toast.success('Token copiado!')
    } catch {
      toast.error('Erro ao copiar')
    }
  }, [tokenInput])

  const handleClear = useCallback(() => {
    setTokenInput('')
    setJwtParts({
      header: {},
      payload: {},
      signature: '',
      isValid: false,
    })
  }, [])

  const handleReset = useCallback(() => {
    setTokenInput(DEFAULT_TOKEN)
  }, [])

  return (
    <div className='bg-background flex h-[calc(100vh-4rem)] flex-col overflow-hidden'>
      {/* Header */}
      <div className='from-card to-card/95 shrink-0 border-b bg-gradient-to-b shadow-sm'>
        <div className='px-4 py-3 sm:px-6 sm:py-4'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex items-center gap-3'>
              <div className='bg-primary/10 ring-primary/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 sm:h-12 sm:w-12'>
                <Shield className='text-primary h-5 w-5 sm:h-6 sm:w-6' />
              </div>
              <div className='min-w-0 flex-1'>
                <h1 className='text-lg font-bold tracking-tight sm:text-xl'>JWT Debugger</h1>
                <p className='text-muted-foreground mt-0.5 text-xs sm:text-sm'>
                  Decodifique e analise tokens JWT
                </p>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              {jwtParts.isValid && (
                <Badge variant='default' className='gap-1.5 px-2.5 py-1'>
                  <FileCode className='h-3.5 w-3.5' />
                  <span className='font-medium'>Válido</span>
                </Badge>
              )}
              <Button variant='ghost' size='sm' onClick={handleClear} className='h-9 w-9 p-0'>
                <RotateCcw className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>

        {/* Warning */}
        <Alert className='bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900'>
          <AlertTriangle className='text-amber-600 dark:text-amber-400 h-4 w-4' />
          <AlertDescription className='text-amber-800 dark:text-amber-300 text-xs'>
            Decodificação local. Sua chave privada não é verificada aqui.
          </AlertDescription>
        </Alert>
      </div>

      {/* Main Content */}
      <div className='flex flex-1 overflow-hidden'>
        {!isDesktop ? (
          <div className='flex h-full w-full flex-col overflow-auto p-4'>
            <div className='space-y-4'>
              <div className='flex flex-col gap-2'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-semibold'>Token JWT</span>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={handleCopyToken}
                    className='h-7 gap-1.5 px-2 text-xs'>
                    <Copy className='h-3.5 w-3.5' />
                    Copiar
                  </Button>
                </div>
                <div className='h-32 overflow-hidden rounded-lg border'>
                  <CodeFormatterEditor
                    value={tokenInput}
                    onChange={setTokenInput}
                    language='plaintext'
                  />
                </div>
              </div>

              {jwtParts.isValid ? (
                <>
                  <div className='flex flex-col gap-2'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-semibold'>Header</span>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={handleCopyHeader}
                        className='h-7 gap-1.5 px-2 text-xs'>
                        <Copy className='h-3.5 w-3.5' />
                        Copiar
                      </Button>
                    </div>
                    <div className='h-48 overflow-hidden rounded-lg border'>
                      <CodeFormatterEditor
                        value={formatJson(jwtParts.header)}
                        onChange={() => {}}
                        language='json'
                      />
                    </div>
                  </div>

                  <div className='flex flex-col gap-2'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm font-semibold'>Payload</span>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={handleCopyPayload}
                        className='h-7 gap-1.5 px-2 text-xs'>
                        <Copy className='h-3.5 w-3.5' />
                        Copiar
                      </Button>
                    </div>
                    <div className='h-64 overflow-hidden rounded-lg border'>
                      <CodeFormatterEditor
                        value={formatJson(jwtParts.payload)}
                        onChange={() => {}}
                        language='json'
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className='text-muted-foreground flex items-center justify-center rounded-lg border p-8'>
                  <div className='text-center'>
                    <AlertTriangle className='mx-auto mb-2 h-8 w-8' />
                    <p className='text-sm font-semibold'>Token inválido</p>
                    {jwtParts.error && (
                      <p className='text-muted-foreground/70 mt-1 text-xs'>{jwtParts.error}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <ResizablePanelGroup direction='vertical' className='h-full'>
            <ResizablePanel defaultSize={30} minSize={20}>
              <div className='flex h-full flex-col bg-background'>
                <div className='bg-muted/30 flex shrink-0 items-center justify-between border-b px-4 py-2.5'>
                  <div className='flex items-center gap-2'>
                    <Shield className='text-muted-foreground h-4 w-4' />
                    <span className='text-sm font-semibold'>Token JWT</span>
                  </div>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={handleCopyToken}
                    className='h-7 gap-1.5 px-2 text-xs'>
                    <Copy className='h-3.5 w-3.5' />
                    Copiar
                  </Button>
                </div>
                <div className='flex-1 overflow-hidden'>
                  <CodeFormatterEditor
                    value={tokenInput}
                    onChange={setTokenInput}
                    language='plaintext'
                  />
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={70} minSize={30}>
              {jwtParts.isValid ? (
                <ResizablePanelGroup direction='horizontal' className='h-full'>
                  <ResizablePanel defaultSize={50} minSize={30}>
                    <div className='flex h-full flex-col bg-background'>
                      <div className='bg-muted/30 flex shrink-0 items-center justify-between border-b px-4 py-2.5'>
                        <div className='flex items-center gap-2'>
                          <FileCode className='text-muted-foreground h-4 w-4' />
                          <span className='text-sm font-semibold'>Header</span>
                        </div>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={handleCopyHeader}
                          className='h-7 gap-1.5 px-2 text-xs'>
                          <Copy className='h-3.5 w-3.5' />
                          Copiar
                        </Button>
                      </div>
                      <div className='flex-1 overflow-hidden'>
                        <CodeFormatterEditor
                          value={formatJson(jwtParts.header)}
                          onChange={() => {}}
                          language='json'
                        />
                      </div>
                    </div>
                  </ResizablePanel>

                  <ResizableHandle withHandle />

                  <ResizablePanel defaultSize={50} minSize={30}>
                    <div className='flex h-full flex-col bg-background'>
                      <div className='bg-muted/30 flex shrink-0 items-center justify-between border-b px-4 py-2.5'>
                        <div className='flex items-center gap-2'>
                          <FileCode className='text-muted-foreground h-4 w-4' />
                          <span className='text-sm font-semibold'>Payload</span>
                        </div>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={handleCopyPayload}
                          className='h-7 gap-1.5 px-2 text-xs'>
                          <Copy className='h-3.5 w-3.5' />
                          Copiar
                        </Button>
                      </div>
                      <div className='flex-1 overflow-hidden'>
                        <CodeFormatterEditor
                          value={formatJson(jwtParts.payload)}
                          onChange={() => {}}
                          language='json'
                        />
                      </div>
                    </div>
                  </ResizablePanel>
                </ResizablePanelGroup>
              ) : (
                <div className='text-muted-foreground flex h-full items-center justify-center'>
                  <div className='text-center'>
                    <AlertTriangle className='mx-auto mb-4 h-12 w-12' />
                    <p className='text-sm font-semibold'>Token inválido</p>
                    {jwtParts.error && (
                      <p className='text-muted-foreground/70 mt-1.5 text-xs max-w-md'>
                        {jwtParts.error}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </div>
  )
}

