'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import chroma from 'chroma-js'
import { Check, Copy, Droplets, Grid3X3, Palette, Type } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface ColorInfoModalProps {
  hex: string
  name: string
  isOpen: boolean
  onClose: () => void
}

export function ColorInfoModal({ hex, name, isOpen, onClose }: ColorInfoModalProps) {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null)

  // Validação de segurança para o chroma
  if (!chroma.valid(hex)) return null

  const color = chroma(hex)

  // Dados de Contraste
  const whiteContrast = chroma.contrast(hex, 'white')
  const blackContrast = chroma.contrast(hex, 'black')
  const bestTextColor = whiteContrast > blackContrast ? 'white' : 'black'

  // Geração de Shades (Tons)
  const shades = chroma.scale(['white', hex, 'black']).mode('lch').colors(11)

  // Formatação de Valores
  const formatValue = (values: number[], suffix = '') => {
    return values.map((v) => Math.round(v)).join(', ') + suffix
  }

  const formats = [
    { label: 'HEX', value: hex.toUpperCase() },
    { label: 'RGB', value: `rgb(${formatValue(color.rgb())})` },
    {
      label: 'HSL',
      value: `hsl(${formatValue(color.hsl(), '%').replace(', ', 'deg, ').replace('%', '%, ').replace('%,', '%')})`,
    }, // Ajuste fino de string
    {
      label: 'CMYK',
      value: `cmyk(${formatValue(
        color.cmyk().map((v) => v * 100),
        '%',
      )})`,
    },
    { label: 'LAB', value: `lab(${formatValue(color.lab())})` },
  ]

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedFormat(label)
    toast.success(`${label} copiado!`)
    setTimeout(() => setCopiedFormat(null), 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-4xl gap-0 overflow-hidden bg-white p-0 dark:bg-neutral-950'>
        {/* Header Customizado */}
        <div className='flex items-center justify-between border-b px-6 py-4'>
          <DialogHeader className='space-y-1'>
            <DialogTitle className='flex items-center gap-3 text-xl font-bold'>
              <div
                className='h-8 w-8 rounded-full border border-black/10 shadow-sm'
                style={{ backgroundColor: hex }}
              />
              {name}
            </DialogTitle>
            <div className='text-muted-foreground ml-11 font-mono text-sm'>{hex.toUpperCase()}</div>
          </DialogHeader>
        </div>

        <div className='flex h-[600px] flex-col md:h-[500px] md:flex-row'>
          {/* COLUNA ESQUERDA: Visual Preview & Contraste */}
          <div className='flex w-full flex-col border-r border-neutral-200 md:w-1/2 dark:border-neutral-800'>
            {/* Preview Principal */}
            <div
              className='group relative flex w-full flex-1 flex-col items-center justify-center p-8 transition-all'
              style={{ backgroundColor: hex }}>
              <div
                className='space-y-2 text-center transition-opacity'
                style={{ color: bestTextColor }}>
                <h2 className='text-4xl font-black tracking-tight'>{hex.toUpperCase()}</h2>
                <p className='text-lg font-medium opacity-80'>{name}</p>
              </div>

              {/* Botão de Copiar Gigante (Aparece no Hover) */}
              <button
                onClick={() => copyToClipboard(hex, 'HEX')}
                className='absolute inset-0 flex cursor-pointer items-center justify-center bg-black/10 opacity-0 backdrop-blur-[2px] transition-all group-hover:opacity-100'>
                <div className='flex scale-90 transform items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-black shadow-xl transition-transform group-hover:scale-100'>
                  <Copy size={18} /> Copiar HEX
                </div>
              </button>
            </div>

            {/* Contrast Checker Mini */}
            <div className='grid h-1/3 grid-cols-2 border-t border-black/5'>
              <div
                className='flex flex-col items-center justify-center p-4'
                style={{ backgroundColor: hex, color: 'white' }}>
                <div className='text-2xl font-bold'>{whiteContrast.toFixed(2)}</div>
                <div className='text-xs font-semibold tracking-wider uppercase opacity-70'>
                  Texto Branco
                </div>
                <div
                  className={`mt-2 rounded px-2 py-0.5 text-[10px] font-bold ${whiteContrast >= 4.5 ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'}`}>
                  {whiteContrast >= 4.5 ? 'APROVADO' : 'REPROVADO'}
                </div>
              </div>
              <div
                className='flex flex-col items-center justify-center p-4'
                style={{ backgroundColor: hex, color: 'black' }}>
                <div className='text-2xl font-bold'>{blackContrast.toFixed(2)}</div>
                <div className='text-xs font-semibold tracking-wider uppercase opacity-70'>
                  Texto Preto
                </div>
                <div
                  className={`mt-2 rounded px-2 py-0.5 text-[10px] font-bold ${blackContrast >= 4.5 ? 'bg-green-600/20 text-green-900' : 'bg-red-600/20 text-red-900'}`}>
                  {blackContrast >= 4.5 ? 'APROVADO' : 'REPROVADO'}
                </div>
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA: Dados Técnicos e Shades */}
          <div className='flex w-full flex-col bg-neutral-50/50 dark:bg-neutral-900/50'>
            <Tabs defaultValue='formats' className='flex w-full flex-1 flex-col'>
              <div className='px-6 pt-4'>
                <TabsList className='grid w-full grid-cols-3'>
                  <TabsTrigger value='formats' className='gap-2'>
                    <Palette size={14} /> Formatos
                  </TabsTrigger>
                  <TabsTrigger value='shades' className='gap-2'>
                    <Grid3X3 size={14} /> Tons
                  </TabsTrigger>
                  <TabsTrigger value='props' className='gap-2'>
                    <Droplets size={14} /> Propriedades
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className='flex-1 overflow-y-auto p-6'>
                {/* ABA: FORMATOS */}
                <TabsContent value='formats' className='mt-0 space-y-3'>
                  {formats.map((f) => (
                    <div
                      key={f.label}
                      className='group flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-3 shadow-sm transition-colors hover:border-blue-500 dark:border-neutral-700 dark:bg-neutral-800'>
                      <div>
                        <span className='text-xs font-bold tracking-wider text-neutral-400 uppercase'>
                          {f.label}
                        </span>
                        <div className='mt-0.5 font-mono text-sm font-medium'>{f.value}</div>
                      </div>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='opacity-0 transition-opacity group-hover:opacity-100'
                        onClick={() => copyToClipboard(f.value, f.label)}>
                        {copiedFormat === f.label ? (
                          <Check size={16} className='text-green-500' />
                        ) : (
                          <Copy size={16} />
                        )}
                      </Button>
                    </div>
                  ))}

                  <div className='mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/30 dark:bg-blue-900/20'>
                    <h4 className='flex items-center gap-2 text-sm font-semibold text-blue-900 dark:text-blue-100'>
                      <Type size={16} /> Variável CSS
                    </h4>
                    <code className='mt-2 block font-mono text-xs text-blue-700 dark:text-blue-300'>
                      --color-{name.toLowerCase().replace(/\s+/g, '-')}: {hex};
                    </code>
                  </div>
                </TabsContent>

                {/* ABA: SHADES (Tons) */}
                <TabsContent value='shades' className='mt-0 h-full'>
                  <div className='grid h-full max-h-[380px] grid-cols-1 gap-1 overflow-y-auto pr-2'>
                    {shades.map((shadeHex) => {
                      const contrast = chroma.contrast(shadeHex, 'white') > 2 ? 'white' : 'black'
                      return (
                        <button
                          key={shadeHex}
                          onClick={() => copyToClipboard(shadeHex, 'Shade')}
                          className='group flex cursor-pointer items-center justify-between rounded-md px-4 py-3 text-left transition-transform hover:scale-[1.02] active:scale-95'
                          style={{ backgroundColor: shadeHex }}>
                          <span
                            className='font-mono text-xs font-bold uppercase'
                            style={{ color: contrast }}>
                            {shadeHex}
                          </span>
                          <span
                            className='text-xs font-medium opacity-0 group-hover:opacity-100'
                            style={{ color: contrast }}>
                            Copiar
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </TabsContent>

                {/* ABA: PROPRIEDADES */}
                <TabsContent value='props' className='mt-0 space-y-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    <PropertyCard label='Luminância' value={color.luminance().toFixed(2)} />
                    <PropertyCard
                      label='Temperatura'
                      value={`${Math.round(color.temperature())}K`}
                    />
                    <PropertyCard
                      label='Saturação'
                      value={`${Math.round(color.hsl()[1] * 100)}%`}
                    />
                    <PropertyCard label='Matiz' value={`${Math.round(color.hsl()[0] || 0)}°`} />
                  </div>

                  <Separator className='my-4' />

                  <div className='space-y-2'>
                    <h4 className='mb-3 text-sm font-medium'>Preview de Texto</h4>
                    <div
                      className='rounded-lg border p-4 text-sm'
                      style={{ color: hex, backgroundColor: 'white' }}>
                      Sphinx of black quartz, judge my vow.
                    </div>
                    <div
                      className='rounded-lg border p-4 text-sm'
                      style={{ color: hex, backgroundColor: 'black' }}>
                      Sphinx of black quartz, judge my vow.
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function PropertyCard({ label, value }: { label: string; value: string }) {
  return (
    <div className='rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-800'>
      <div className='text-muted-foreground text-xs'>{label}</div>
      <div className='mt-1 text-lg font-bold'>{value}</div>
    </div>
  )
}
