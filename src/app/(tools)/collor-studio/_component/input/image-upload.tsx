'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ImagePlus, Loader2, X } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'

interface ImageUploadProps {
  onColorsExtracted: (colors: string[]) => void
}

export function ImageUpload({ onColorsExtracted }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isExtracting, setIsExtracting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) {
        toast.error('Arquivo inválido. Use JPG, PNG ou WebP.')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target?.result as string)
      reader.readAsDataURL(file)

      setIsExtracting(true)
      try {
        const { extractColorsFromImage } = await import('../palette-utils')
        const colors = await extractColorsFromImage(file)
        onColorsExtracted(colors)
        toast.success('Paleta extraída da imagem!')
      } catch (error) {
        console.error(error)
        toast.error('Erro ao processar imagem')
      } finally {
        setIsExtracting(false)
      }
    },
    [onColorsExtracted],
  )

  const handleClear = () => {
    setPreview(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFileSelect(e.dataTransfer.files[0])
    }
  }

  return (
    <div className='space-y-3'>
      <Label className='text-muted-foreground text-xs font-medium tracking-wider uppercase'>
        Extrair de Imagem
      </Label>

      {preview ? (
        <div className='group bg-muted/50 relative overflow-hidden rounded-lg border'>
          <img
            src={preview}
            alt='Preview'
            className='h-40 w-full object-cover transition-opacity group-hover:opacity-75'
          />
          <Button
            size='icon'
            variant='destructive'
            className='absolute top-2 right-2 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100'
            onClick={handleClear}>
            <X className='h-3 w-3' />
          </Button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-8 text-center transition-all ${
            isDragging
              ? 'border-primary bg-primary/5 ring-primary/20 scale-[0.99] ring-2'
              : 'border-muted-foreground/25 bg-muted/5 hover:bg-muted/10 hover:border-primary/50'
          }`}>
          <input
            ref={inputRef}
            type='file'
            accept='image/*'
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFileSelect(file)
            }}
            className='hidden'
          />
          <div className='bg-muted rounded-full p-3'>
            {isExtracting ? (
              <Loader2 className='text-muted-foreground h-5 w-5 animate-spin' />
            ) : (
              <ImagePlus className='text-muted-foreground h-5 w-5' />
            )}
          </div>
          <div className='space-y-1'>
            <p className='text-sm font-medium'>
              {isDragging ? 'Solte a imagem aqui' : 'Clique ou arraste para upload'}
            </p>
            <p className='text-muted-foreground text-xs'>JPG, PNG ou WebP</p>
          </div>
        </div>
      )}
    </div>
  )
}
