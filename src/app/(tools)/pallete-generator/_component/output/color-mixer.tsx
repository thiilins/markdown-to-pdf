'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import chroma from 'chroma-js'
import { Blend, Copy, RotateCcw } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

interface ColorMixerProps {
  colors: ColorInfo[]
}

export function ColorMixer({ colors }: ColorMixerProps) {
  const [colorA, setColorA] = useState<string>(colors[0]?.hex || '#3B82F6')
  const [colorB, setColorB] = useState<string>(colors[1]?.hex || '#8B5CF6')
  const [steps, setSteps] = useState<number>(5)
  const [blendedColors, setBlendedColors] = useState<string[]>([])

  useEffect(() => {
    if (colors.length > 0) {
      setColorA(colors[0].hex)
      setColorB(colors[1]?.hex || colors[0].hex)
    }
  }, [colors])

  useEffect(() => {
    if (colorA && colorB) {
      const scale = chroma.scale([colorA, colorB]).mode('lch').colors(steps)
      setBlendedColors(scale)
    }
  }, [colorA, colorB, steps])

  const handleReset = useCallback(() => {
    if (colors.length > 0) {
      setColorA(colors[0].hex)
      setColorB(colors[1]?.hex || colors[0].hex)
      setSteps(5)
      toast.success('Mixer resetado!')
    }
  }, [colors])

  const handleCopyAll = useCallback(() => {
    const cssVars = blendedColors.map((color, i) => `  --blend-${i + 1}: ${color};`).join('\n')
    const css = `:root {\n${cssVars}\n}`
    navigator.clipboard.writeText(css)
    toast.success('CSS copiado!')
  }, [blendedColors])

  const handleCopyColor = useCallback((color: string) => {
    navigator.clipboard.writeText(color)
    toast.success('Cor copiada!')
  }, [])

  if (colors.length === 0) {
    return (
      <Card>
        <CardContent className='flex h-64 items-center justify-center'>
          <p className='text-muted-foreground text-sm'>
            Gere uma paleta primeiro para usar o mixer
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <div>
          <CardTitle className='flex items-center gap-2'>
            <Blend className='h-5 w-5' />
            Color Mixer
          </CardTitle>
          <CardDescription>
            Misture duas cores e veja os passos intermediários (blend)
          </CardDescription>
        </div>
        <div className='flex items-center gap-2'>
          <Button size='sm' variant='outline' onClick={handleReset} className='gap-2'>
            <RotateCcw className='h-3 w-3' />
            Resetar
          </Button>
          <Button size='sm' onClick={handleCopyAll} className='gap-2'>
            <Copy className='h-3 w-3' />
            Copiar CSS
          </Button>
        </div>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Seleção de Cores */}
        <div className='grid gap-4 md:grid-cols-2'>
          <div className='space-y-2'>
            <Label>Cor A</Label>
            <Select value={colorA} onValueChange={setColorA}>
              <SelectTrigger>
                <div className='flex items-center gap-2'>
                  <div className='h-4 w-4 rounded border' style={{ backgroundColor: colorA }} />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {colors.map((color, i) => (
                  <SelectItem key={i} value={color.hex}>
                    <div className='flex items-center gap-2'>
                      <div
                        className='h-4 w-4 rounded border'
                        style={{ backgroundColor: color.hex }}
                      />
                      <span>{color.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label>Cor B</Label>
            <Select value={colorB} onValueChange={setColorB}>
              <SelectTrigger>
                <div className='flex items-center gap-2'>
                  <div className='h-4 w-4 rounded border' style={{ backgroundColor: colorB }} />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {colors.map((color, i) => (
                  <SelectItem key={i} value={color.hex}>
                    <div className='flex items-center gap-2'>
                      <div
                        className='h-4 w-4 rounded border'
                        style={{ backgroundColor: color.hex }}
                      />
                      <span>{color.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Controle de Passos */}
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <Label>Número de Passos</Label>
            <span className='text-muted-foreground text-sm font-medium'>{steps}</span>
          </div>
          <Slider
            value={[steps]}
            onValueChange={(val) => setSteps(val[0])}
            min={3}
            max={15}
            step={1}
            className='w-full'
          />
        </div>

        {/* Preview do Blend */}
        <div className='space-y-3'>
          <Label>Cores Geradas</Label>

          {/* Faixa de Visualização */}
          <div className='flex h-16 w-full overflow-hidden rounded-lg border'>
            {blendedColors.map((color, i) => (
              <div
                key={i}
                className='flex-1 transition-all hover:flex-2'
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>

          {/* Cards de Cores */}
          <div className='grid gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
            {blendedColors.map((color, i) => (
              <div
                key={i}
                className='group relative overflow-hidden rounded-lg border transition-all hover:shadow-md'>
                <div
                  className='h-20 w-full cursor-pointer'
                  style={{ backgroundColor: color }}
                  onClick={() => handleCopyColor(color)}>
                  <div className='absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100'>
                    <Button
                      variant='secondary'
                      size='sm'
                      className='pointer-events-none opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100'>
                      <Copy className='mr-2 h-3 w-3' />
                      Copiar
                    </Button>
                  </div>
                </div>
                <div className='bg-background p-2'>
                  <p className='text-center font-mono text-[10px] font-medium'>
                    {color.toUpperCase()}
                  </p>
                  <p className='text-muted-foreground text-center text-[9px]'>Passo {i + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
