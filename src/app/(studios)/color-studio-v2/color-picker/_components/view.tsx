'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import chroma from 'chroma-js'
import { Check, Copy } from 'lucide-react'
import ntc from 'ntc'
import { useState } from 'react'
import { toast } from 'sonner'
import { ColorPicker } from '../../_shared/components/ColorPicker'
import { getBestTextColor } from '../../_shared/utils/color-algorithms'

export function ColorPickerView() {
  const [color, setColor] = useState('#3B82F6')
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null)

  const colorData = chroma(color)
  const rgb = colorData.rgb()
  const hsl = colorData.hsl()
  const hsv = colorData.hsv()
  const cmyk = colorData.cmyk()
  const lab = colorData.lab()
  const oklch = colorData.oklch()
  const name = ntc.name(color)[1]

  const formats = {
    hex: color.toUpperCase(),
    rgb: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
    rgba: `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 1)`,
    hsl: `hsl(${Math.round(hsl[0])}, ${Math.round(hsl[1] * 100)}%, ${Math.round(hsl[2] * 100)}%)`,
    hsla: `hsla(${Math.round(hsl[0])}, ${Math.round(hsl[1] * 100)}%, ${Math.round(hsl[2] * 100)}%, 1)`,
    hsv: `hsv(${Math.round(hsv[0])}, ${Math.round(hsv[1] * 100)}%, ${Math.round(hsv[2] * 100)}%)`,
    cmyk: `cmyk(${Math.round(cmyk[0] * 100)}%, ${Math.round(cmyk[1] * 100)}%, ${Math.round(cmyk[2] * 100)}%, ${Math.round(cmyk[3] * 100)}%)`,
    lab: `lab(${lab[0].toFixed(2)}, ${lab[1].toFixed(2)}, ${lab[2].toFixed(2)})`,
    oklch: `oklch(${(oklch[0] * 100).toFixed(2)}% ${oklch[1].toFixed(3)} ${oklch[2] ? oklch[2].toFixed(2) : 0})`,
  }

  const handleCopy = (format: string, value: string) => {
    navigator.clipboard.writeText(value)
    setCopiedFormat(format)
    toast.success('Copiado!')
    setTimeout(() => setCopiedFormat(null), 2000)
  }

  // Gerar shades
  const shades = chroma
    .scale(['#ffffff', color, '#000000'])
    .mode('oklch')
    .colors(11)
    .map((shade, i) => {
      const shadeName = [
        '50',
        '100',
        '200',
        '300',
        '400',
        '500',
        '600',
        '700',
        '800',
        '900',
        '950',
      ][i]
      return { name: shadeName, hex: shade }
    })

  const textColor = getBestTextColor(color)

  return (
    <div className='flex h-[calc(100vh-4rem)] w-full flex-col gap-6 bg-white p-6 md:flex-row dark:bg-neutral-950'>
      {/* Color Picker (40%) */}
      <div className='flex flex-col gap-6 md:w-2/5'>
        <Card>
          <CardContent className='p-6'>
            <h2 className='mb-6 text-xl font-bold'>Seletor de Cor</h2>
            <div className='flex justify-center'>
              <ColorPicker color={color} onChange={setColor} />
            </div>
          </CardContent>
        </Card>

        {/* Color Preview */}
        <Card>
          <CardContent className='p-0'>
            <div className='rounded-t-lg p-8 text-center' style={{ backgroundColor: color }}>
              <p className='text-4xl font-black' style={{ color: textColor }}>
                {formats.hex}
              </p>
              <p className='mt-2 text-lg font-semibold opacity-80' style={{ color: textColor }}>
                {name}
              </p>
            </div>
            <div className='p-6'>
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <p className='text-muted-foreground mb-1'>Luminância</p>
                  <p className='font-semibold'>{colorData.luminance().toFixed(3)}</p>
                </div>
                <div>
                  <p className='text-muted-foreground mb-1'>Saturação</p>
                  <p className='font-semibold'>{Math.round(hsl[1] * 100)}%</p>
                </div>
                <div>
                  <p className='text-muted-foreground mb-1'>Brilho</p>
                  <p className='font-semibold'>{Math.round(hsv[2] * 100)}%</p>
                </div>
                <div>
                  <p className='text-muted-foreground mb-1'>Temperatura</p>
                  <p className='font-semibold'>
                    {hsl[0] >= 0 && hsl[0] < 60
                      ? 'Quente'
                      : hsl[0] >= 60 && hsl[0] < 180
                        ? 'Fria'
                        : 'Neutra'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formats & Shades (60%) */}
      <div className='flex-1'>
        <Tabs defaultValue='formats' className='h-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='formats'>Formatos</TabsTrigger>
            <TabsTrigger value='shades'>Variações</TabsTrigger>
          </TabsList>

          <TabsContent value='formats' className='mt-6'>
            <Card>
              <CardContent className='p-6'>
                <h3 className='mb-6 text-xl font-bold'>Formatos de Cor</h3>
                <div className='space-y-3'>
                  {Object.entries(formats).map(([format, value]) => (
                    <div
                      key={format}
                      className='flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800'>
                      <div>
                        <p className='text-muted-foreground text-xs font-semibold uppercase'>
                          {format}
                        </p>
                        <p className='mt-1 font-mono text-sm'>{value}</p>
                      </div>
                      <Button variant='ghost' size='icon' onClick={() => handleCopy(format, value)}>
                        {copiedFormat === format ? (
                          <Check className='h-4 w-4 text-emerald-600' />
                        ) : (
                          <Copy className='h-4 w-4' />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='shades' className='mt-6'>
            <Card>
              <CardContent className='p-6'>
                <h3 className='mb-6 text-xl font-bold'>Escala de Cores</h3>
                <div className='space-y-2'>
                  {shades.map((shade) => {
                    const shadeTextColor = getBestTextColor(shade.hex)
                    const isCurrent = chroma.deltaE(shade.hex, color) < 5
                    return (
                      <div
                        key={shade.name}
                        className='group relative flex items-center gap-4 rounded-lg border-2 border-transparent transition-all hover:border-neutral-300 dark:hover:border-neutral-700'
                        style={{
                          backgroundColor: shade.hex,
                          borderColor: isCurrent ? color : undefined,
                        }}>
                        <div className='flex w-20 items-center justify-center py-4'>
                          <span
                            className='font-mono text-sm font-bold'
                            style={{ color: shadeTextColor }}>
                            {shade.name}
                          </span>
                        </div>
                        <div className='flex-1 py-4'>
                          <p
                            className='font-mono text-sm font-semibold'
                            style={{ color: shadeTextColor }}>
                            {shade.hex.toUpperCase()}
                          </p>
                        </div>
                        <div className='px-4'>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => {
                              setColor(shade.hex)
                              toast.success('Cor atualizada!')
                            }}
                            className='opacity-0 transition-opacity group-hover:opacity-100'
                            style={{ color: shadeTextColor }}>
                            <Check className='h-4 w-4' />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
