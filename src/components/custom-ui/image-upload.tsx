'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { FileImage, ImageIcon, Info, Loader2, MessageCircleQuestionMark, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { ConditionalRender } from './conditional-render'

interface FullImageUploadProps {
  value?: string // base64
  onChange: (base64: string | null) => Promise<void>
  label?: string
  maxSizeMB?: number
  slotType?: 'header' | 'footer'
}

interface LogoUploadProps {
  value?: string // base64
  onChange: (base64: string | null) => Promise<void>
  label?: string
  maxSizeMB?: number
}

export const FullImageUpload = ({
  value,
  onChange,
  label,
  maxSizeMB = 5,
  slotType = 'header',
}: FullImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione um arquivo de imagem')
      return
    }

    // Validação de tamanho
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      setError(`O arquivo deve ter no máximo ${maxSizeMB}MB`)
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      // Converte para base64
      const base64 = await fileToBase64(file)
      await onChange(base64)
    } catch (err) {
      setError('Erro ao processar a imagem. Tente novamente.')
      console.error('Erro ao converter imagem:', err)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = async () => {
    await onChange(null)
    setError(null)
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        resolve(result)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  return (
    <div className='bg-primary/20 space-y-2 rounded-md p-2'>
      <div className='flex items-center justify-between'>
        <ConditionalRender condition={!!label}>
          <Label>{label}</Label>
        </ConditionalRender>
        <ConditionalRender condition={!!value}>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={handleRemove}
            className='text-destructive hover:text-destructive h-7 text-xs'>
            <X className='mr-1 h-3 w-3' />
            Remover
          </Button>
        </ConditionalRender>
      </div>

      <ConditionalRender condition={!!value}>
        <div className='relative'>
          <div className='border-input bg-muted/50 relative flex items-center justify-center rounded-md border p-4'>
            <img
              src={value}
              alt={`${slotType === 'header' ? 'Cabeçalho' : 'Rodapé'} completo`}
              className='max-h-40 max-w-full object-contain'
            />
          </div>
          <p className='text-muted-foreground text-xs'>
            Esta imagem ocupará 100% da largura do {slotType === 'header' ? 'cabeçalho' : 'rodapé'}
          </p>
        </div>
      </ConditionalRender>
      <ConditionalRender condition={!value}>
        <div className='space-y-2'>
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            onChange={handleFileSelect}
            className='hidden'
            disabled={isUploading}
          />
          <Button
            type='button'
            variant='outline'
            className='border-primary hover:bg-primary text-primary w-full border shadow-none hover:text-white'
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Processando...
              </>
            ) : (
              <>
                <ImageIcon className='mr-2 h-4 w-4' />
                Adicionar Imagem Completa
              </>
            )}
          </Button>
          <ConditionalRender condition={!!error}>
            <p className='text-destructive text-xs'>{error}</p>
          </ConditionalRender>
          <p className='bg-primary/30 flex items-center justify-center rounded-md p-1 text-center text-[10px] text-violet-950'>
            <MessageCircleQuestionMark className='mr-1 h-3 w-3' /> Upload de imagem completa para{' '}
            {slotType === 'header' ? 'cabeçalho' : 'rodapé'} timbrado.
          </p>
          <div className='border-primary/20 flex items-center gap-2 rounded-md border bg-violet-950/80 p-1 text-[9px] text-white'>
            <Info className='h-5 w-5 text-white' />
            <div className='flex flex-col'>
              <span>
                <strong>Formatos aceitos:</strong> PNG, JPG, SVG, WEBP
              </span>
              <span>
                <strong>Tamanho máximo:</strong> {maxSizeMB} MB
              </span>
            </div>
          </div>
        </div>
      </ConditionalRender>
    </div>
  )
}

export const LogoUpload = ({ value, onChange, label, maxSizeMB = 2 }: LogoUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validação de tipo
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione um arquivo de imagem')
      return
    }

    // Validação de tamanho
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      setError(`O arquivo deve ter no máximo ${maxSizeMB}MB`)
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      // Converte para base64
      const base64 = await fileToBase64(file)
      await onChange(base64)
    } catch (err) {
      setError('Erro ao processar a imagem. Tente novamente.')
      console.error('Erro ao converter imagem:', err)
    } finally {
      setIsUploading(false)
      // Limpa o input para permitir selecionar o mesmo arquivo novamente
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = async () => {
    await onChange(null)
    setError(null)
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        resolve(result)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  return (
    <div className='bg-primary/20 space-y-2 rounded-md p-2'>
      <ConditionalRender condition={!!label}>
        <Label>{label}</Label>
      </ConditionalRender>
      <ConditionalRender condition={!!value}>
        <div className='relative'>
          <div className='border-input bg-muted/50 relative flex items-center justify-center rounded-md border p-4'>
            <img src={value} alt='Logo preview' className='max-h-20 max-w-full object-contain' />
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={handleRemove}
              className='absolute top-2 right-2 h-6 w-6 p-0'>
              <X className='h-4 w-4' />
            </Button>
          </div>
          <p className='text-muted-foreground text-xs'>Clique no X para remover o logo</p>
        </div>
      </ConditionalRender>
      <ConditionalRender condition={!value}>
        <div className='space-y-2'>
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            onChange={handleFileSelect}
            className='hidden'
            disabled={isUploading}
          />
          <Button
            type='button'
            variant='outline'
            className='border-primary hover:bg-primary text-primary w-full border shadow-none hover:text-white'
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Processando...
              </>
            ) : (
              <>
                <FileImage className='mr-2 h-4 w-4' />
                Adicionar Logo
              </>
            )}
          </Button>
          {error && <p className='text-destructive text-xs'>{error}</p>}
          <div className='border-primary/20 flex items-center gap-2 rounded-md border bg-violet-950/80 p-1 text-[9px] text-white'>
            <Info className='h-5 w-5 text-white' />
            <div className='flex flex-col'>
              <span>
                <strong>Formatos aceitos:</strong> PNG, JPG, SVG, WEBP
              </span>
              <span>
                <strong>Tamanho máximo:</strong> {maxSizeMB} MB
              </span>
            </div>
          </div>
        </div>
      </ConditionalRender>
    </div>
  )
}
