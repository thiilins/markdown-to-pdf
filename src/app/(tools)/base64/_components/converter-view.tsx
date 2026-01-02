'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileImage, FileText, RotateCcw, Upload } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { CodeFormatterEditor } from '../../_components/code-formatter-editor'
import {
  decodeBase64,
  encodeBase64,
  fileToBase64,
  isValidBase64,
} from '../../_components/base64-utils'

const DEFAULT_TEXT = 'Hello, World!'

export default function Base64ConverterView() {
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text')
  const [textInput, setTextInput] = useState<string>(DEFAULT_TEXT)
  const [base64Output, setBase64Output] = useState<string>('')
  const [isEncoding, setIsEncoding] = useState(true)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [imageBase64, setImageBase64] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    const checkSize = () => setIsDesktop(window.innerWidth >= 1024)
    checkSize()
    window.addEventListener('resize', checkSize)
    return () => window.removeEventListener('resize', checkSize)
  }, [])

  useEffect(() => {
    if (activeTab === 'text' && textInput) {
      if (isEncoding) {
        try {
          const encoded = encodeBase64(textInput)
          setBase64Output(encoded)
        } catch (error: any) {
          setBase64Output('')
          toast.error(error?.message || 'Erro ao codificar')
        }
      } else {
        try {
          if (isValidBase64(textInput)) {
            const decoded = decodeBase64(textInput)
            setBase64Output(decoded)
          } else {
            setBase64Output('')
          }
        } catch (error: any) {
          setBase64Output('')
          toast.error(error?.message || 'Erro ao decodificar')
        }
      }
    }
  }, [textInput, isEncoding, activeTab])

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar tipo de arquivo (imagens)
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione um arquivo de imagem')
      return
    }

    // Validar tamanho (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Arquivo muito grande. Máximo: 10MB')
      return
    }

    try {
      const base64 = await fileToBase64(file)
      setImageBase64(base64)
      setImagePreview(base64)
      toast.success('Imagem convertida para Base64!')
    } catch (error: any) {
      toast.error(error?.message || 'Erro ao processar imagem')
    }
  }, [])

  const handleCopyText = useCallback(async () => {
    if (!base64Output) {
      toast.error('Nenhum resultado para copiar')
      return
    }
    try {
      await navigator.clipboard.writeText(base64Output)
      toast.success('Copiado!')
    } catch {
      toast.error('Erro ao copiar')
    }
  }, [base64Output])

  const handleCopyImage = useCallback(async () => {
    if (!imageBase64) {
      toast.error('Nenhuma imagem para copiar')
      return
    }
    try {
      await navigator.clipboard.writeText(imageBase64)
      toast.success('Base64 da imagem copiado!')
    } catch {
      toast.error('Erro ao copiar')
    }
  }, [imageBase64])

  const handleClear = useCallback(() => {
    setTextInput('')
    setBase64Output('')
    setImagePreview('')
    setImageBase64('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  const handleReset = useCallback(() => {
    setTextInput(DEFAULT_TEXT)
    setBase64Output('')
    setImagePreview('')
    setImageBase64('')
    setIsEncoding(true)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  return (
    <div className='bg-background flex h-[calc(100vh-4rem)] flex-col overflow-hidden'>
      {/* Header */}
      <div className='from-card to-card/95 shrink-0 border-b bg-gradient-to-b shadow-sm'>
        <div className='px-4 py-3 sm:px-6 sm:py-4'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex items-center gap-3'>
              <div className='bg-primary/10 ring-primary/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 sm:h-12 sm:w-12'>
                <FileText className='text-primary h-5 w-5 sm:h-6 sm:w-6' />
              </div>
              <div className='min-w-0 flex-1'>
                <h1 className='text-lg font-bold tracking-tight sm:text-xl'>Base64 Converter</h1>
                <p className='text-muted-foreground mt-0.5 text-xs sm:text-sm'>
                  Codifique e decodifique texto e imagens em Base64
                </p>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <Button variant='ghost' size='sm' onClick={handleClear} className='h-9 w-9 p-0'>
                <RotateCcw className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex flex-1 overflow-hidden'>
        {!isDesktop ? (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'text' | 'image')} className='flex h-full w-full flex-col'>
            <div className='bg-muted/30 shrink-0 border-b p-1'>
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value='text' className='gap-2'>
                  <FileText className='h-4 w-4' />
                  Texto
                </TabsTrigger>
                <TabsTrigger value='image' className='gap-2'>
                  <FileImage className='h-4 w-4' />
                  Imagem
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value='text' className='flex-1 overflow-hidden p-4'>
              <TextConverter
                textInput={textInput}
                base64Output={base64Output}
                isEncoding={isEncoding}
                onTextChange={setTextInput}
                onToggleMode={setIsEncoding}
                onCopy={handleCopyText}
              />
            </TabsContent>

            <TabsContent value='image' className='flex-1 overflow-hidden p-4'>
              <ImageConverter
                imagePreview={imagePreview}
                imageBase64={imageBase64}
                fileInputRef={fileInputRef}
                onFileUpload={handleFileUpload}
                onCopy={handleCopyImage}
              />
            </TabsContent>
          </Tabs>
        ) : (
          <ResizablePanelGroup direction='horizontal' className='h-full'>
            <ResizablePanel defaultSize={50} minSize={30}>
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'text' | 'image')} className='flex h-full flex-col'>
                <div className='bg-muted/30 shrink-0 border-b p-1'>
                  <TabsList className='grid w-full grid-cols-2'>
                    <TabsTrigger value='text' className='gap-2'>
                      <FileText className='h-4 w-4' />
                      Texto
                    </TabsTrigger>
                    <TabsTrigger value='image' className='gap-2'>
                      <FileImage className='h-4 w-4' />
                      Imagem
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value='text' className='flex-1 overflow-hidden'>
                  <div className='flex h-full flex-col'>
                    <div className='bg-muted/30 flex shrink-0 items-center justify-between border-b px-4 py-2.5'>
                      <div className='flex items-center gap-2'>
                        <FileText className='text-muted-foreground h-4 w-4' />
                        <span className='text-sm font-semibold'>Texto</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Label htmlFor='encode-mode' className='text-xs font-medium'>
                          {isEncoding ? 'Codificar' : 'Decodificar'}
                        </Label>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => setIsEncoding(!isEncoding)}
                          className='h-7 gap-1.5 px-2 text-xs'>
                          {isEncoding ? 'Decodificar' : 'Codificar'}
                        </Button>
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
                </TabsContent>

                <TabsContent value='image' className='flex-1 overflow-hidden'>
                  <ImageConverter
                    imagePreview={imagePreview}
                    imageBase64={imageBase64}
                    fileInputRef={fileInputRef}
                    onFileUpload={handleFileUpload}
                    onCopy={handleCopyImage}
                  />
                </TabsContent>
              </Tabs>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={50} minSize={30}>
              {activeTab === 'text' ? (
                <div className='flex h-full flex-col bg-background'>
                  <div className='bg-muted/30 flex shrink-0 items-center justify-between border-b px-4 py-2.5'>
                    <div className='flex items-center gap-2'>
                      <FileText className='text-muted-foreground h-4 w-4' />
                      <span className='text-sm font-semibold'>Resultado</span>
                      {base64Output && (
                        <Badge variant='secondary' className='ml-2 h-5 px-1.5 text-[10px]'>
                          {base64Output.length} caracteres
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={handleCopyText}
                      disabled={!base64Output}
                      className='h-7 gap-1.5 px-2 text-xs'>
                      Copiar
                    </Button>
                  </div>
                  <div className='flex-1 overflow-hidden'>
                    <CodeFormatterEditor
                      value={base64Output}
                      onChange={() => {}}
                      language='plaintext'
                    />
                  </div>
                </div>
              ) : (
                <div className='flex h-full flex-col bg-background'>
                  <div className='bg-muted/30 flex shrink-0 items-center justify-between border-b px-4 py-2.5'>
                    <div className='flex items-center gap-2'>
                      <FileImage className='text-muted-foreground h-4 w-4' />
                      <span className='text-sm font-semibold'>Base64</span>
                      {imageBase64 && (
                        <Badge variant='secondary' className='ml-2 h-5 px-1.5 text-[10px]'>
                          {imageBase64.length} caracteres
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={handleCopyImage}
                      disabled={!imageBase64}
                      className='h-7 gap-1.5 px-2 text-xs'>
                      Copiar
                    </Button>
                  </div>
                  <div className='custom-scrollbar flex-1 overflow-auto p-4'>
                    {imageBase64 ? (
                      <div className='bg-muted/30 rounded-lg border p-4 font-mono text-xs break-all'>
                        {imageBase64}
                      </div>
                    ) : (
                      <div className='text-muted-foreground flex h-full items-center justify-center'>
                        <p className='text-sm'>Base64 aparecerá aqui após upload</p>
                      </div>
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

function TextConverter({
  textInput,
  base64Output,
  isEncoding,
  onTextChange,
  onToggleMode,
  onCopy,
}: {
  textInput: string
  base64Output: string
  isEncoding: boolean
  onTextChange: (value: string) => void
  onToggleMode: (value: boolean) => void
  onCopy: () => void
}) {
  return (
    <div className='flex h-full flex-col gap-4'>
      <div className='flex flex-1 flex-col gap-2'>
        <div className='flex items-center justify-between'>
          <Label className='text-sm font-semibold'>Texto</Label>
          <Button
            variant='outline'
            size='sm'
            onClick={() => onToggleMode(!isEncoding)}
            className='h-7 gap-1.5 px-2 text-xs'>
            {isEncoding ? 'Decodificar' : 'Codificar'}
          </Button>
        </div>
        <div className='flex-1 overflow-hidden rounded-lg border'>
          <CodeFormatterEditor value={textInput} onChange={onTextChange} language='plaintext' />
        </div>
      </div>

      <div className='flex flex-1 flex-col gap-2'>
        <div className='flex items-center justify-between'>
          <Label className='text-sm font-semibold'>Resultado</Label>
          <Button
            variant='ghost'
            size='sm'
            onClick={onCopy}
            disabled={!base64Output}
            className='h-7 gap-1.5 px-2 text-xs'>
            Copiar
          </Button>
        </div>
        <div className='flex-1 overflow-hidden rounded-lg border'>
          <CodeFormatterEditor value={base64Output} onChange={() => {}} language='plaintext' />
        </div>
      </div>
    </div>
  )
}

function ImageConverter({
  imagePreview,
  imageBase64,
  fileInputRef,
  onFileUpload,
  onCopy,
}: {
  imagePreview: string
  imageBase64: string
  fileInputRef: React.RefObject<HTMLInputElement | null>
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  onCopy: () => void
}) {
  return (
    <div className='flex h-full flex-col gap-4'>
      <div className='flex flex-1 flex-col gap-2'>
        <Label className='text-sm font-semibold'>Upload de Imagem</Label>
        <div className='bg-muted/30 flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed p-8'>
          {imagePreview ? (
            <div className='flex h-full w-full flex-col items-center gap-4'>
              <img
                src={imagePreview}
                alt='Preview'
                className='max-h-64 max-w-full rounded-lg object-contain'
              />
              <Button
                variant='outline'
                size='sm'
                onClick={() => fileInputRef.current?.click()}
                className='gap-2'>
                <Upload className='h-4 w-4' />
                Trocar Imagem
              </Button>
            </div>
          ) : (
            <div className='flex flex-col items-center gap-4'>
              <FileImage className='text-muted-foreground h-12 w-12' />
              <div className='text-center'>
                <p className='text-sm font-semibold'>Selecione uma imagem</p>
                <p className='text-muted-foreground mt-1 text-xs'>PNG, JPG, GIF até 10MB</p>
              </div>
              <Button
                variant='outline'
                size='sm'
                onClick={() => fileInputRef.current?.click()}
                className='gap-2'>
                <Upload className='h-4 w-4' />
                Escolher Arquivo
              </Button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            onChange={onFileUpload}
            className='hidden'
          />
        </div>
      </div>

      {imageBase64 && (
        <div className='flex flex-col gap-2'>
          <div className='flex items-center justify-between'>
            <Label className='text-sm font-semibold'>Base64</Label>
            <Button
              variant='ghost'
              size='sm'
              onClick={onCopy}
              className='h-7 gap-1.5 px-2 text-xs'>
              Copiar
            </Button>
          </div>
          <div className='custom-scrollbar max-h-32 overflow-auto rounded-lg border bg-muted/30 p-3 font-mono text-xs break-all'>
            {imageBase64}
          </div>
        </div>
      )}
    </div>
  )
}

