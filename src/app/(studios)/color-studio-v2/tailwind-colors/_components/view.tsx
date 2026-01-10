'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import chroma from 'chroma-js'
import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { ColorPicker } from '../../_shared/components/ColorPicker'
import { getBestTextColor } from '../../_shared/utils/color-algorithms'
import {
  exportTailwindV3Config,
  exportTailwindV4CSS,
  generateAllTailwindScales,
  generateTailwindScale,
} from './tailwind-utils'

export function TailwindColorsView() {
  const [customColor, setCustomColor] = useState('#3B82F6')
  const [customName, setCustomName] = useState('brand')
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null)
  const [showColorPicker, setShowColorPicker] = useState(false)

  const customScale = generateTailwindScale(customColor)
  const allScales = generateAllTailwindScales()
  const stops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

  const handleCopy = (text: string, format: string) => {
    navigator.clipboard.writeText(text)
    setCopiedFormat(format)
    toast.success('Copiado!')
    setTimeout(() => setCopiedFormat(null), 2000)
  }

  const handleCopyClass = (colorName: string, stop: string) => {
    const className = `bg-${colorName}-${stop}`
    handleCopy(className, `${colorName}-${stop}`)
  }

  const handleCopyHex = (hex: string) => {
    handleCopy(hex, 'hex')
  }

  return (
    <div className='flex h-[calc(100vh-4rem)] w-full flex-col gap-6 bg-white p-6 dark:bg-neutral-950'>
      <Tabs defaultValue='default' className='h-full'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='default'>Cores Padrão</TabsTrigger>
          <TabsTrigger value='custom'>Gerador Customizado</TabsTrigger>
        </TabsList>

        <TabsContent value='default' className='mt-6'>
          <Card>
            <CardContent className='p-6'>
              <h2 className='mb-6 text-xl font-bold'>Cores Padrão do Tailwind</h2>
              <div className='overflow-x-auto'>
                <div className='min-w-full'>
                  {/* Header */}
                  <div className='mb-2 grid grid-cols-12 gap-2'>
                    <div className='text-muted-foreground text-xs font-semibold'>Cor</div>
                    {stops.map((stop) => (
                      <div
                        key={stop}
                        className='text-muted-foreground text-center text-xs font-semibold'>
                        {stop}
                      </div>
                    ))}
                  </div>

                  {/* Rows */}
                  <div className='space-y-2'>
                    {Object.entries(allScales).map(([colorName, scale]) => (
                      <div
                        key={colorName}
                        className='grid grid-cols-12 gap-2 rounded-lg border border-neutral-200 bg-white p-2 dark:border-neutral-700 dark:bg-neutral-800'>
                        <div className='flex items-center'>
                          <span className='text-sm font-semibold capitalize'>{colorName}</span>
                        </div>
                        {stops.map((stop) => {
                          const hex = scale[stop]
                          const textColor = getBestTextColor(hex)
                          return (
                            <button
                              key={stop}
                              onClick={() => handleCopyClass(colorName, stop.toString())}
                              className='group relative flex h-12 items-center justify-center rounded border border-neutral-200 transition-all hover:scale-105 hover:shadow-md dark:border-neutral-700'
                              style={{ backgroundColor: hex }}
                              title={`${colorName}-${stop}: ${hex}`}>
                              <span
                                className='font-mono text-[10px] font-bold opacity-0 transition-opacity group-hover:opacity-100'
                                style={{ color: textColor }}>
                                {hex.replace('#', '').toUpperCase()}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='custom' className='mt-6'>
          <div className='grid gap-6 md:grid-cols-2'>
            {/* Input */}
            <Card>
              <CardContent className='p-6'>
                <h2 className='mb-6 text-xl font-bold'>Gerar Escala Customizada</h2>
                <div className='space-y-4'>
                  <div>
                    <label className='mb-2 block text-sm font-medium'>Nome da Cor</label>
                    <Input
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder='brand'
                    />
                  </div>
                  <div>
                    <label className='mb-2 block text-sm font-medium'>Cor Base</label>
                    <div className='relative flex items-center gap-3'>
                      <div
                        className='h-16 w-16 cursor-pointer rounded-lg border-2 border-neutral-200 transition-all hover:scale-105 dark:border-neutral-700'
                        style={{ backgroundColor: customColor }}
                        onClick={() => setShowColorPicker(true)}
                      />
                      <div className='flex-1'>
                        <Input
                          value={customColor}
                          onChange={(e) => {
                            if (chroma.valid(e.target.value)) setCustomColor(e.target.value)
                          }}
                          className='font-mono'
                        />
                      </div>
                      {showColorPicker && (
                        <div className='absolute top-full left-0 z-50 mt-2'>
                          <ColorPicker
                            color={customColor}
                            onChange={setCustomColor}
                            onClose={() => setShowColorPicker(false)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardContent className='p-6'>
                <h2 className='mb-6 text-xl font-bold'>Preview da Escala</h2>
                <div className='space-y-2'>
                  {stops.map((stop) => {
                    const hex = customScale[stop]
                    const textColor = getBestTextColor(hex)
                    return (
                      <div
                        key={stop}
                        className='group flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-3 transition-all hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800'>
                        <div
                          className='h-12 w-12 rounded border border-neutral-200 dark:border-neutral-700'
                          style={{ backgroundColor: hex }}
                        />
                        <div className='flex-1'>
                          <p className='text-sm font-semibold'>{stop}</p>
                          <p className='text-muted-foreground font-mono text-xs'>{hex}</p>
                        </div>
                        <Button variant='ghost' size='icon' onClick={() => handleCopyHex(hex)}>
                          {copiedFormat === `hex-${stop}` ? (
                            <Check className='h-4 w-4 text-emerald-600' />
                          ) : (
                            <Copy className='h-4 w-4' />
                          )}
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Export */}
          <Card>
            <CardContent className='p-6'>
              <h2 className='mb-6 text-xl font-bold'>Exportar Configuração</h2>
              <div className='grid gap-4 md:grid-cols-2'>
                <div>
                  <h3 className='mb-3 text-sm font-semibold'>Tailwind v3 (JSON)</h3>
                  <div className='relative rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-900'>
                    <pre className='overflow-x-auto text-xs'>
                      {exportTailwindV3Config(customName, customScale)}
                    </pre>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='absolute top-2 right-2'
                      onClick={() =>
                        handleCopy(exportTailwindV3Config(customName, customScale), 'v3')
                      }>
                      {copiedFormat === 'v3' ? (
                        <Check className='h-4 w-4 text-emerald-600' />
                      ) : (
                        <Copy className='h-4 w-4' />
                      )}
                    </Button>
                  </div>
                </div>
                <div>
                  <h3 className='mb-3 text-sm font-semibold'>Tailwind v4 (CSS Variables)</h3>
                  <div className='relative rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-900'>
                    <pre className='overflow-x-auto text-xs'>
                      {exportTailwindV4CSS(customName, customScale)}
                    </pre>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='absolute top-2 right-2'
                      onClick={() =>
                        handleCopy(exportTailwindV4CSS(customName, customScale), 'v4')
                      }>
                      {copiedFormat === 'v4' ? (
                        <Check className='h-4 w-4 text-emerald-600' />
                      ) : (
                        <Copy className='h-4 w-4' />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
