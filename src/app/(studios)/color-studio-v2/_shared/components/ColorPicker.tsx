'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import chroma from 'chroma-js'
import { Check, Copy, Pipette, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
  onClose?: () => void
  className?: string
}

export function ColorPicker({ color, onChange, onClose, className }: ColorPickerProps) {
  const [currentColor, setCurrentColor] = useState(color)
  const [hexInput, setHexInput] = useState(color.toUpperCase())
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hueCanvasRef = useRef<HTMLCanvasElement>(null)
  const [isDraggingSaturation, setIsDraggingSaturation] = useState(false)
  const [isDraggingHue, setIsDraggingHue] = useState(false)

  // Extrai HSL da cor atual
  const getHSL = () => {
    try {
      const c = chroma(currentColor)
      return {
        h: c.get('hsl.h') || 0,
        s: c.get('hsl.s'),
        l: c.get('hsl.l'),
      }
    } catch {
      return { h: 0, s: 0.5, l: 0.5 }
    }
  }

  const { h, s, l } = getHSL()

  // Desenha o seletor de saturação/luminosidade
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Gradiente horizontal (saturação)
    for (let x = 0; x < width; x++) {
      const saturation = x / width

      // Gradiente vertical (luminosidade)
      for (let y = 0; y < height; y++) {
        const lightness = 1 - y / height

        const color = chroma.hsl(h, saturation, lightness)
        ctx.fillStyle = color.hex()
        ctx.fillRect(x, y, 1, 1)
      }
    }
  }, [h])

  // Desenha a barra de matiz (hue)
  useEffect(() => {
    const canvas = hueCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    for (let x = 0; x < width; x++) {
      const hue = (x / width) * 360
      const color = chroma.hsl(hue, 1, 0.5)
      ctx.fillStyle = color.hex()
      ctx.fillRect(x, 0, 1, height)
    }
  }, [])

  // Handler para o canvas de saturação/luminosidade
  const handleSaturationClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newS = x / rect.width
    const newL = 1 - y / rect.height

    const newColor = chroma.hsl(h, newS, newL).hex()
    setCurrentColor(newColor)
    setHexInput(newColor.toUpperCase())
    onChange(newColor)
  }

  // Handler para a barra de matiz
  const handleHueClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = hueCanvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left

    const newH = (x / rect.width) * 360
    const newColor = chroma.hsl(newH, s, l).hex()
    setCurrentColor(newColor)
    setHexInput(newColor.toUpperCase())
    onChange(newColor)
  }

  // Atualiza cor quando o input HEX muda
  const handleHexChange = (value: string) => {
    setHexInput(value)

    // Valida e aplica se for um HEX válido
    const hexRegex = /^#?([A-Fa-f0-9]{6})$/
    if (hexRegex.test(value)) {
      const normalizedHex = value.startsWith('#') ? value : `#${value}`
      if (chroma.valid(normalizedHex)) {
        setCurrentColor(normalizedHex)
        onChange(normalizedHex)
      }
    }
  }

  // Copia HEX
  const copyHex = () => {
    navigator.clipboard.writeText(currentColor.toUpperCase())
    setCopied(true)
    toast.success('HEX copiado!')
    setTimeout(() => setCopied(false), 2000)
  }

  // Formatos de cor
  const rgb = chroma(currentColor).rgb()
  const hsl = chroma(currentColor).hsl()

  return (
    <div className={cn('w-80 rounded-xl border bg-white p-4 shadow-2xl dark:bg-neutral-900', className)}>
      {/* Header */}
      <div className='mb-4 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Pipette className='h-5 w-5 text-neutral-500' />
          <span className='font-semibold text-neutral-900 dark:text-neutral-100'>Escolher Cor</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className='rounded-lg p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100'>
            <X className='h-5 w-5' />
          </button>
        )}
      </div>

      {/* Preview da cor */}
      <div
        className='mb-4 h-20 w-full rounded-lg border-2 border-neutral-200 shadow-inner dark:border-neutral-700'
        style={{ backgroundColor: currentColor }}
      />

      {/* Canvas de Saturação/Luminosidade */}
      <div className='relative mb-4'>
        <canvas
          ref={canvasRef}
          width={272}
          height={160}
          className='w-full cursor-crosshair rounded-lg border border-neutral-200 dark:border-neutral-700'
          onClick={handleSaturationClick}
          onMouseDown={() => setIsDraggingSaturation(true)}
          onMouseUp={() => setIsDraggingSaturation(false)}
          onMouseMove={(e) => isDraggingSaturation && handleSaturationClick(e)}
        />
        {/* Indicador de posição */}
        <div
          className='pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-lg'
          style={{
            left: `${s * 100}%`,
            top: `${(1 - l) * 100}%`,
          }}
        />
      </div>

      {/* Barra de Matiz (Hue) */}
      <div className='relative mb-4'>
        <canvas
          ref={hueCanvasRef}
          width={272}
          height={20}
          className='w-full cursor-pointer rounded-lg border border-neutral-200 dark:border-neutral-700'
          onClick={handleHueClick}
          onMouseDown={() => setIsDraggingHue(true)}
          onMouseUp={() => setIsDraggingHue(false)}
          onMouseMove={(e) => isDraggingHue && handleHueClick(e)}
        />
        {/* Indicador de posição */}
        <div
          className='pointer-events-none absolute top-1/2 h-6 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg'
          style={{
            left: `${(h / 360) * 100}%`,
          }}
        />
      </div>

      <Separator className='my-4' />

      {/* Input HEX */}
      <div className='mb-3'>
        <Label className='mb-2 text-xs font-medium text-neutral-500'>HEX</Label>
        <div className='flex gap-2'>
          <Input
            value={hexInput}
            onChange={(e) => handleHexChange(e.target.value)}
            className='font-mono text-sm uppercase'
            placeholder='#000000'
            maxLength={7}
          />
          <Button
            size='icon'
            variant='outline'
            onClick={copyHex}
            className='shrink-0'>
            {copied ? <Check className='h-4 w-4 text-green-500' /> : <Copy className='h-4 w-4' />}
          </Button>
        </div>
      </div>

      {/* Outros formatos */}
      <div className='grid grid-cols-2 gap-2 text-xs'>
        <div>
          <Label className='text-xs font-medium text-neutral-500'>RGB</Label>
          <div className='mt-1 rounded bg-neutral-50 px-2 py-1.5 font-mono text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'>
            {Math.round(rgb[0])}, {Math.round(rgb[1])}, {Math.round(rgb[2])}
          </div>
        </div>
        <div>
          <Label className='text-xs font-medium text-neutral-500'>HSL</Label>
          <div className='mt-1 rounded bg-neutral-50 px-2 py-1.5 font-mono text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'>
            {Math.round(hsl[0] || 0)}°, {Math.round(hsl[1] * 100)}%, {Math.round(hsl[2] * 100)}%
          </div>
        </div>
      </div>
    </div>
  )
}
