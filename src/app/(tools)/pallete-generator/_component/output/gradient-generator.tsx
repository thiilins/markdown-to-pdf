'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Check, Copy, Plus, RotateCcw, Sparkles, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

type GradientType = 'linear' | 'radial' | 'conic' | 'mesh'
type GradientDirection =
  | '0deg'
  | '45deg'
  | '90deg'
  | '135deg'
  | '180deg'
  | '225deg'
  | '270deg'
  | '315deg'

interface GradientGeneratorProps {
  colors: ColorInfo[]
}

interface ColorStop {
  color: string
  position: number
}

export function GradientGenerator({ colors }: GradientGeneratorProps) {
  const [type, setType] = useState<GradientType>('linear')
  const [direction, setDirection] = useState<GradientDirection>('90deg')
  const [colorCount, setColorCount] = useState(3)
  const [copied, setCopied] = useState(false)
  const [customColors, setCustomColors] = useState<ColorStop[]>([])
  const [isCustomMode, setIsCustomMode] = useState(false)

  // Inicializa cores customizadas quando colorCount muda
  useEffect(() => {
    if (!isCustomMode) {
      const stops = colors.slice(0, Math.min(colorCount, colors.length)).map((c, i, arr) => ({
        color: c.hex,
        position: Math.round((i / (arr.length - 1)) * 100),
      }))
      setCustomColors(stops)
    }
  }, [colorCount, colors, isCustomMode])

  const selectedColors = isCustomMode
    ? customColors
    : colors.slice(0, Math.min(colorCount, colors.length)).map((c, i, arr) => ({
        color: c.hex,
        position: Math.round((i / (arr.length - 1)) * 100),
      }))

  const generateGradientCSS = useCallback(() => {
    if (selectedColors.length === 0) return ''

    const colorStops = selectedColors.map((c) => `${c.color} ${c.position}%`).join(', ')

    switch (type) {
      case 'linear':
        return `linear-gradient(${direction}, ${colorStops})`
      case 'radial':
        return `radial-gradient(circle, ${colorStops})`
      case 'conic':
        return `conic-gradient(from ${direction}, ${colorStops})`
      case 'mesh':
        // Mesh gradient usando múltiplos radial-gradients sobrepostos
        // Cria efeito de "manchas" suaves e orgânicas
        return selectedColors
          .map((c, i) => {
            const positions = ['at 20% 30%', 'at 80% 20%', 'at 50% 70%', 'at 10% 80%', 'at 90% 60%']
            const pos = positions[i % positions.length]
            const size = ['circle at', 'ellipse at'][i % 2]
            return `radial-gradient(${size} ${pos}, ${c.color} 0%, transparent 50%)`
          })
          .join(', ')
      default:
        return ''
    }
  }, [type, direction, selectedColors])

  const handleColorChange = useCallback((index: number, newColor: string) => {
    setIsCustomMode(true)
    setCustomColors((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], color: newColor }
      return updated
    })
  }, [])

  const handlePositionChange = useCallback((index: number, newPosition: number) => {
    setIsCustomMode(true)
    setCustomColors((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], position: newPosition }
      return updated
    })
  }, [])

  const handleAddColor = useCallback(() => {
    setIsCustomMode(true)
    const lastPosition = customColors[customColors.length - 1]?.position || 100
    const newPosition = Math.min(lastPosition + 10, 100)
    setCustomColors((prev) => [
      ...prev,
      { color: colors[0]?.hex || '#000000', position: newPosition },
    ])
  }, [customColors, colors])

  const handleRemoveColor = useCallback(
    (index: number) => {
      if (customColors.length <= 2) return // Mínimo 2 cores
      setIsCustomMode(true)
      setCustomColors((prev) => prev.filter((_, i) => i !== index))
    },
    [customColors.length],
  )

  const handleReset = useCallback(() => {
    setIsCustomMode(false)
  }, [])

  const gradientCSS = generateGradientCSS()

  const handleCopy = useCallback(async () => {
    if (!gradientCSS) return
    try {
      await navigator.clipboard.writeText(`background-image: ${gradientCSS};`)
      setCopied(true)
      toast.success('CSS copiado!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Erro ao copiar')
    }
  }, [gradientCSS])

  if (colors.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Sparkles className='h-5 w-5' />
            Gerador de Gradientes
          </CardTitle>
          <CardDescription>Gere uma paleta primeiro para criar gradientes</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Sparkles className='h-5 w-5' />
          Gerador de Gradientes
        </CardTitle>
        <CardDescription>Crie gradientes modernos com as cores da sua paleta</CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Controles */}
        <div className='grid gap-4 sm:grid-cols-3'>
          <div className='space-y-2'>
            <Label>Tipo de Gradiente</Label>
            <Select value={type} onValueChange={(v) => setType(v as GradientType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='linear'>Linear</SelectItem>
                <SelectItem value='radial'>Radial</SelectItem>
                <SelectItem value='conic'>Cônico</SelectItem>
                <SelectItem value='mesh'>Mesh (Moderno)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type !== 'mesh' && (
            <div className='space-y-2'>
              <Label>Direção</Label>
              <Select value={direction} onValueChange={(v) => setDirection(v as GradientDirection)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='0deg'>↑ 0° (Norte)</SelectItem>
                  <SelectItem value='45deg'>↗ 45° (Nordeste)</SelectItem>
                  <SelectItem value='90deg'>→ 90° (Leste)</SelectItem>
                  <SelectItem value='135deg'>↘ 135° (Sudeste)</SelectItem>
                  <SelectItem value='180deg'>↓ 180° (Sul)</SelectItem>
                  <SelectItem value='225deg'>↙ 225° (Sudoeste)</SelectItem>
                  <SelectItem value='270deg'>← 270° (Oeste)</SelectItem>
                  <SelectItem value='315deg'>↖ 315° (Noroeste)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className='space-y-2'>
            <Label>Número de Cores: {colorCount}</Label>
            <Slider
              value={[colorCount]}
              onValueChange={([v]) => setColorCount(v)}
              min={2}
              max={Math.min(colors.length, 6)}
              step={1}
              className='mt-2'
            />
          </div>
        </div>

        {/* Preview do Gradiente */}
        <div className='space-y-3'>
          <Label>Preview</Label>
          <div
            className='h-48 w-full rounded-lg border shadow-inner'
            style={{ backgroundImage: gradientCSS }}
          />
        </div>

        {/* Cores Customizáveis */}
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <Label>Cores do Gradiente</Label>
            <div className='flex gap-2'>
              {isCustomMode && (
                <Button size='sm' variant='outline' onClick={handleReset} className='gap-2'>
                  <RotateCcw className='h-3 w-3' />
                  Resetar
                </Button>
              )}
              <Button size='sm' onClick={handleAddColor} className='gap-2'>
                <Plus className='h-3 w-3' />
                Adicionar Cor
              </Button>
            </div>
          </div>

          <div className='space-y-2'>
            {selectedColors.map((colorStop, i) => (
              <div key={i} className='flex items-center gap-3 rounded-lg border p-3'>
                <div className='flex items-center gap-2'>
                  <input
                    type='color'
                    value={colorStop.color}
                    onChange={(e) => handleColorChange(i, e.target.value)}
                    className='h-10 w-10 cursor-pointer rounded border'
                  />
                  <Input
                    type='text'
                    value={colorStop.color}
                    onChange={(e) => handleColorChange(i, e.target.value)}
                    className='w-24 font-mono text-xs'
                  />
                </div>

                {type !== 'mesh' && (
                  <div className='flex flex-1 items-center gap-2'>
                    <Slider
                      value={[colorStop.position]}
                      onValueChange={([v]) => handlePositionChange(i, v)}
                      min={0}
                      max={100}
                      step={1}
                      className='flex-1'
                    />
                    <span className='text-muted-foreground w-12 text-right font-mono text-xs'>
                      {colorStop.position}%
                    </span>
                  </div>
                )}

                {selectedColors.length > 2 && (
                  <Button
                    size='icon'
                    variant='ghost'
                    onClick={() => handleRemoveColor(i)}
                    className='h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600'>
                    <Trash2 className='h-4 w-4' />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CSS Code */}
        <div className='space-y-2'>
          <Label>CSS</Label>
          <div className='relative'>
            <pre className='bg-muted overflow-x-auto rounded-lg border p-4 font-mono text-xs'>
              <code>background-image: {gradientCSS};</code>
            </pre>
            <Button
              size='icon'
              variant='ghost'
              className='absolute top-2 right-2 h-8 w-8'
              onClick={handleCopy}>
              {copied ? <Check className='h-4 w-4 text-green-500' /> : <Copy className='h-4 w-4' />}
            </Button>
          </div>
        </div>

        {/* Variações Sugeridas */}
        <div className='space-y-3'>
          <Label>Variações Rápidas</Label>
          <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
            {/* Linear Vertical */}
            <div
              className='group relative h-24 cursor-pointer overflow-hidden rounded-lg border transition-all hover:scale-105 hover:shadow-lg'
              style={{
                backgroundImage: `linear-gradient(180deg, ${selectedColors.map((c) => `${c.color} ${c.position}%`).join(', ')})`,
              }}
              onClick={() => {
                setType('linear')
                setDirection('180deg')
              }}>
              <div className='bg-background/80 absolute inset-0 flex items-center justify-center opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100'>
                <span className='text-xs font-medium'>Linear Vertical</span>
              </div>
            </div>
            {/* Linear Horizontal */}
            <div
              className='group relative h-24 cursor-pointer overflow-hidden rounded-lg border transition-all hover:scale-105 hover:shadow-lg'
              style={{
                backgroundImage: `linear-gradient(90deg, ${selectedColors.map((c) => `${c.color} ${c.position}%`).join(', ')})`,
              }}
              onClick={() => {
                setType('linear')
                setDirection('90deg')
              }}>
              <div className='bg-background/80 absolute inset-0 flex items-center justify-center opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100'>
                <span className='text-xs font-medium'>Linear Horizontal</span>
              </div>
            </div>
            {/* Radial */}
            <div
              className='group relative h-24 cursor-pointer overflow-hidden rounded-lg border transition-all hover:scale-105 hover:shadow-lg'
              style={{
                backgroundImage: `radial-gradient(circle, ${selectedColors.map((c) => `${c.color} ${c.position}%`).join(', ')})`,
              }}
              onClick={() => setType('radial')}>
              <div className='bg-background/80 absolute inset-0 flex items-center justify-center opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100'>
                <span className='text-xs font-medium'>Radial</span>
              </div>
            </div>
            {/* Diagonal */}
            <div
              className='group relative h-24 cursor-pointer overflow-hidden rounded-lg border transition-all hover:scale-105 hover:shadow-lg'
              style={{
                backgroundImage: `linear-gradient(45deg, ${selectedColors.map((c) => `${c.color} ${c.position}%`).join(', ')})`,
              }}
              onClick={() => {
                setType('linear')
                setDirection('45deg')
              }}>
              <div className='bg-background/80 absolute inset-0 flex items-center justify-center opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100'>
                <span className='text-xs font-medium'>Diagonal 45°</span>
              </div>
            </div>
            {/* Conic */}
            <div
              className='group relative h-24 cursor-pointer overflow-hidden rounded-lg border transition-all hover:scale-105 hover:shadow-lg'
              style={{
                backgroundImage: `conic-gradient(from 0deg, ${selectedColors.map((c) => `${c.color} ${c.position}%`).join(', ')})`,
              }}
              onClick={() => {
                setType('conic')
                setDirection('0deg')
              }}>
              <div className='bg-background/80 absolute inset-0 flex items-center justify-center opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100'>
                <span className='text-xs font-medium'>Cônico</span>
              </div>
            </div>
            {/* Mesh */}
            <div
              className='group relative h-24 cursor-pointer overflow-hidden rounded-lg border transition-all hover:scale-105 hover:shadow-lg'
              style={{
                backgroundImage: selectedColors
                  .map((c, i) => {
                    const positions = [
                      'at 20% 30%',
                      'at 80% 20%',
                      'at 50% 70%',
                      'at 10% 80%',
                      'at 90% 60%',
                    ]
                    const pos = positions[i % positions.length]
                    const size = ['circle at', 'ellipse at'][i % 2]
                    return `radial-gradient(${size} ${pos}, ${c.color} 0%, transparent 50%)`
                  })
                  .join(', '),
              }}
              onClick={() => setType('mesh')}>
              <div className='bg-background/80 absolute inset-0 flex items-center justify-center opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100'>
                <span className='text-xs font-medium'>Mesh (Moderno)</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
