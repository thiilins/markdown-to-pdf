'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import chroma from 'chroma-js'
import { AnimatePresence, motion } from 'framer-motion'
import { Download, Palette, Trash2, Upload, X, ZoomIn } from 'lucide-react'
import ntc from 'ntc'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { ColorPicker } from '../../_shared/components/ColorPicker'
import { getBestTextColor } from '../../_shared/utils/color-algorithms'
import { extractColorsFromImage, generateSuggestedPalettes, getPixelColor } from './image-utils'

export function ImagePickerView() {
  const [image, setImage] = useState<string | null>(null)
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null)
  const [extractedColors, setExtractedColors] = useState<ColorData[]>([])
  const [selectedColors, setSelectedColors] = useState<ColorData[]>([])
  const [isExtracting, setIsExtracting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null)
  const [pixelColor, setPixelColor] = useState<string | null>(null)
  const [pixelization, setPixelization] = useState(1)
  const [activePalette, setActivePalette] = useState<'dominant' | 'vibrant' | 'muted' | 'dark'>(
    'dominant',
  )
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Carregar imagem no canvas quando mudar
  useEffect(() => {
    if (image && imageRef.current && canvasRef.current) {
      const img = new Image()
      img.onload = () => {
        setImageElement(img)
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (canvas && ctx) {
          canvas.width = img.width
          canvas.height = img.height
          ctx.drawImage(img, 0, 0)
        }
      }
      img.crossOrigin = 'Anonymous'
      img.src = image
    }
  }, [image])

  // Atualizar cor do pixel quando mouse se move
  useEffect(() => {
    if (!imageElement || !mousePosition) {
      setPixelColor(null)
      return
    }

    const color = getPixelColor(imageElement, mousePosition.x, mousePosition.y)
    setPixelColor(color)
  }, [imageElement, mousePosition])

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Arquivo inválido. Use JPG, PNG ou WebP.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Imagem muito grande. Máximo 10MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    setIsExtracting(true)
    try {
      const colors = await extractColorsFromImage(file)
      setExtractedColors(colors)
      const suggested = generateSuggestedPalettes(colors)
      setSelectedColors(suggested.dominant)
      setActivePalette('dominant')
      toast.success('Paleta extraída da imagem!')
    } catch (error) {
      console.error(error)
      toast.error('Erro ao processar imagem')
    } finally {
      setIsExtracting(false)
    }
  }, [])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageElement || !pixelColor) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.floor((e.clientX - rect.left) * (imageElement.width / rect.width))
    const y = Math.floor((e.clientY - rect.top) * (imageElement.height / rect.height))

    const color = getPixelColor(imageElement, x, y)
    if (color && selectedColors.length < 8) {
      const colorData: ColorData = {
        id: `manual-${Date.now()}`,
        hex: color,
        rgb: chroma(color).rgb().join(', '),
        hsl: chroma(color)
          .hsl()
          .map((v, i) => (i === 0 ? Math.round(v) : Math.round(v * 100)))
          .join(', '),
        oklch: chroma(color)
          .oklch()
          .map((v, i) => (i === 0 ? (v * 100).toFixed(2) : v.toFixed(3)))
          .join(' '),
        lab: chroma(color).lab().toString(),
        cmyk: chroma(color).cmyk().toString(),
        rgba: chroma(color).rgba().toString(),
        name: ntc.name(color)[1],
        locked: false,
      }
      setSelectedColors((prev) => [...prev, colorData])
      toast.success('Cor adicionada!')
    } else if (selectedColors.length >= 8) {
      toast.error('Máximo de 8 cores')
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageElement) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.floor((e.clientX - rect.left) * (imageElement.width / rect.width))
    const y = Math.floor((e.clientY - rect.top) * (imageElement.height / rect.height))

    setMousePosition({ x, y })
  }

  const handleMouseLeave = () => {
    setMousePosition(null)
    setPixelColor(null)
  }

  const handleClear = () => {
    setImage(null)
    setImageElement(null)
    setExtractedColors([])
    setSelectedColors([])
    setPixelColor(null)
    setMousePosition(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handlePaletteChange = (type: 'dominant' | 'vibrant' | 'muted' | 'dark') => {
    if (extractedColors.length === 0) return
    const suggested = generateSuggestedPalettes(extractedColors)
    setSelectedColors(suggested[type])
    setActivePalette(type)
  }

  const removeColor = (id: string) => {
    setSelectedColors((prev) => prev.filter((c) => c.id !== id))
  }

  const updateColor = (id: string, newHex: string) => {
    if (!chroma.valid(newHex)) return
    const colorData: ColorData = {
      id,
      hex: newHex,
      rgb: chroma(newHex).rgb().join(', '),
      hsl: chroma(newHex)
        .hsl()
        .map((v, i) => (i === 0 ? Math.round(v) : Math.round(v * 100)))
        .join(', '),
      oklch: chroma(newHex)
        .oklch()
        .map((v, i) => (i === 0 ? (v * 100).toFixed(2) : v.toFixed(3)))
        .join(' '),
      lab: chroma(newHex).lab().toString(),
      cmyk: chroma(newHex).cmyk().toString(),
      rgba: chroma(newHex).rgba().toString(),
      name: ntc.name(newHex)[1],
      locked: false,
    }
    setSelectedColors((prev) => prev.map((c) => (c.id === id ? colorData : c)))
  }

  return (
    <div className='flex h-[calc(100vh-4rem)] w-full flex-col bg-white md:flex-row dark:bg-neutral-950'>
      {/* Área da Imagem (70%) */}
      <div className='relative flex-1 overflow-hidden'>
        {!image ? (
          // Upload Area
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              'flex h-full flex-col items-center justify-center gap-6 p-8 transition-colors',
              isDragging && 'bg-primary/5',
            )}>
            <div
              className={cn(
                'flex h-32 w-32 items-center justify-center rounded-full border-2 border-dashed transition-all',
                isDragging
                  ? 'border-primary bg-primary/10 scale-110'
                  : 'border-neutral-300 dark:border-neutral-700',
              )}>
              <Upload className='h-12 w-12 text-neutral-400' />
            </div>
            <div className='text-center'>
              <h2 className='mb-2 text-2xl font-bold'>Arraste uma imagem aqui</h2>
              <p className='text-muted-foreground mb-4'>ou clique para selecionar</p>
              <Button onClick={() => fileInputRef.current?.click()} variant='outline'>
                Selecionar Imagem
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              className='hidden'
              onChange={(e) => {
                if (e.target.files?.[0]) handleFileSelect(e.target.files[0])
              }}
            />
          </div>
        ) : (
          // Image Viewer com Lupa
          <div
            className='relative h-full w-full overflow-hidden'
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleImageClick}>
            <img
              ref={imageRef}
              src={image}
              alt='Uploaded'
              className={cn(
                'h-full w-full object-contain',
                pixelization > 1 && 'image-rendering-pixelated',
              )}
              style={{
                imageRendering: pixelization > 1 ? 'pixelated' : 'auto',
                imageResolution: pixelization > 1 ? `${pixelization}px` : 'auto',
              }}
            />

            {/* Canvas invisível para extração de pixel */}
            <canvas ref={canvasRef} className='hidden' />

            {/* Lupa (Magnifying Glass) */}
            {mousePosition && pixelColor && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className='pointer-events-none absolute z-50'
                style={{
                  left: mousePosition.x + 20,
                  top: mousePosition.y - 60,
                }}>
                <div
                  className='h-20 w-20 rounded-full border-4 border-white shadow-2xl'
                  style={{ backgroundColor: pixelColor }}
                />
                <div className='mt-2 rounded bg-black/80 px-2 py-1 text-center font-mono text-xs text-white'>
                  {pixelColor.toUpperCase()}
                </div>
              </motion.div>
            )}

            {/* Toolbar Superior */}
            <div className='absolute top-4 right-4 left-4 flex items-center justify-between'>
              <Button onClick={handleClear} variant='destructive' size='sm'>
                <Trash2 className='h-4 w-4' />
              </Button>
              {isExtracting && (
                <div className='rounded-full bg-white/90 px-4 py-2 text-sm font-medium shadow-lg'>
                  Extraindo cores...
                </div>
              )}
            </div>

            {/* Slider de Pixelização */}
            {image && (
              <div className='absolute right-4 bottom-4 left-4'>
                <Card className='bg-white/90 p-4 backdrop-blur-sm dark:bg-neutral-900/90'>
                  <div className='flex items-center gap-4'>
                    <ZoomIn className='h-4 w-4 text-neutral-500' />
                    <input
                      type='range'
                      min='1'
                      max='50'
                      value={pixelization}
                      onChange={(e) => setPixelization(Number(e.target.value))}
                      className='flex-1'
                    />
                    <span className='text-sm text-neutral-600 dark:text-neutral-400'>
                      {pixelization}x
                    </span>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sidebar de Paleta (30%) */}
      <div className='w-full border-t border-neutral-200 bg-neutral-50 p-6 md:w-96 md:border-t-0 md:border-l dark:border-neutral-800 dark:bg-neutral-900'>
        <ScrollArea className='h-full'>
          <div className='space-y-6'>
            {/* Título */}
            <div>
              <h2 className='text-xl font-bold'>Paleta Extraída</h2>
              <p className='text-muted-foreground text-sm'>
                {selectedColors.length} {selectedColors.length === 1 ? 'cor' : 'cores'}
              </p>
            </div>

            {/* Paletas Sugeridas */}
            {extractedColors.length > 0 && (
              <div>
                <h3 className='mb-3 text-sm font-semibold'>Sugestões</h3>
                <div className='grid grid-cols-2 gap-2'>
                  {(['dominant', 'vibrant', 'muted', 'dark'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => handlePaletteChange(type)}
                      className={cn(
                        'rounded-lg border px-3 py-2 text-xs font-medium capitalize transition-all',
                        activePalette === type
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-neutral-200 bg-white hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700',
                      )}>
                      {type === 'dominant' && 'Dominante'}
                      {type === 'vibrant' && 'Vibrante'}
                      {type === 'muted' && 'Pastel'}
                      {type === 'dark' && 'Escuro'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Cores Selecionadas */}
            <div>
              <h3 className='mb-3 text-sm font-semibold'>Cores Selecionadas</h3>
              <div className='space-y-2'>
                <AnimatePresence>
                  {selectedColors.map((color) => {
                    const textColor = getBestTextColor(color.hex)
                    return (
                      <motion.div
                        key={color.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className='group relative flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-800'>
                        <div
                          className='h-12 w-12 rounded-lg'
                          style={{ backgroundColor: color.hex }}
                        />
                        <div className='flex-1'>
                          <p className='font-mono text-sm font-semibold'>{color.hex}</p>
                          <p className='text-muted-foreground text-xs'>{color.name}</p>
                        </div>
                        <div className='flex gap-1'>
                          <button
                            onClick={() => setShowColorPicker(color.id)}
                            className='rounded p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-700'>
                            <Palette className='h-4 w-4' />
                          </button>
                          <button
                            onClick={() => removeColor(color.id)}
                            className='rounded p-1.5 text-neutral-400 transition-colors hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20'>
                            <X className='h-4 w-4' />
                          </button>
                        </div>

                        {/* Color Picker */}
                        {showColorPicker === color.id && (
                          <div className='absolute top-full right-0 z-50 mt-2'>
                            <ColorPicker
                              color={color.hex}
                              onChange={(newHex) => {
                                updateColor(color.id, newHex)
                                setShowColorPicker(null)
                              }}
                              onClose={() => setShowColorPicker(null)}
                            />
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            </div>

            {/* Barra de Cores Horizontal */}
            {selectedColors.length > 0 && (
              <div>
                <h3 className='mb-3 text-sm font-semibold'>Preview</h3>
                <div className='flex h-24 w-full overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700'>
                  {selectedColors.map((color) => (
                    <div key={color.id} className='flex-1' style={{ backgroundColor: color.hex }} />
                  ))}
                </div>
              </div>
            )}

            {/* Botão Exportar */}
            {selectedColors.length > 0 && (
              <Button className='w-full gap-2' size='lg'>
                <Download className='h-4 w-4' />
                Exportar Paleta
              </Button>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
