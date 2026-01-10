'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import chroma from 'chroma-js'
import { Check, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ColorPicker } from '../../_shared/components/ColorPicker'
import { calculateAPCA, calculateWCAG, type APCAResult, type WCAGResult } from './contrast-utils'

export function ContrastCheckerView() {
  const [foreground, setForeground] = useState('#000000')
  const [background, setBackground] = useState('#FFFFFF')
  const [wcagResult, setWcagResult] = useState<WCAGResult | null>(null)
  const [apcaResult, setApcaResult] = useState<APCAResult | null>(null)
  const [showForegroundPicker, setShowForegroundPicker] = useState(false)
  const [showBackgroundPicker, setShowBackgroundPicker] = useState(false)

  useEffect(() => {
    if (foreground && background) {
      setWcagResult(calculateWCAG(foreground, background))
      setApcaResult(calculateAPCA(foreground, background))
    }
  }, [foreground, background])

  const swapColors = () => {
    const temp = foreground
    setForeground(background)
    setBackground(temp)
  }

  const getGradeColor = (grade: string) => {
    if (grade === 'AAA') return 'text-emerald-600 dark:text-emerald-400'
    if (grade === 'AA') return 'text-blue-600 dark:text-blue-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getLevelColor = (level: string) => {
    if (level === 'Excellent' || level === 'Good') return 'text-emerald-600 dark:text-emerald-400'
    if (level === 'Acceptable') return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  return (
    <div className='flex h-[calc(100vh-4rem)] w-full flex-col gap-6 bg-white p-6 md:flex-row dark:bg-neutral-950'>
      {/* Área de Seleção de Cores (40%) */}
      <div className='flex flex-col gap-6 md:w-2/5'>
        <Card>
          <CardContent className='p-6'>
            <h2 className='mb-6 text-xl font-bold'>Cores</h2>

            {/* Foreground */}
            <div className='mb-6'>
              <label className='mb-2 block text-sm font-medium'>Texto (Foreground)</label>
              <div className='relative flex items-center gap-3'>
                <div
                  className='h-16 w-16 cursor-pointer rounded-lg border-2 border-neutral-200 transition-all hover:scale-105 dark:border-neutral-700'
                  style={{ backgroundColor: foreground }}
                  onClick={() => setShowForegroundPicker(true)}
                />
                <div className='flex-1'>
                  <input
                    type='text'
                    value={foreground}
                    onChange={(e) => {
                      if (chroma.valid(e.target.value)) setForeground(e.target.value)
                    }}
                    className='w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 font-mono text-sm dark:border-neutral-700 dark:bg-neutral-800'
                  />
                </div>
                {showForegroundPicker && (
                  <div className='absolute top-full left-0 z-50 mt-2'>
                    <ColorPicker
                      color={foreground}
                      onChange={setForeground}
                      onClose={() => setShowForegroundPicker(false)}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Background */}
            <div className='mb-6'>
              <label className='mb-2 block text-sm font-medium'>Fundo (Background)</label>
              <div className='relative flex items-center gap-3'>
                <div
                  className='h-16 w-16 cursor-pointer rounded-lg border-2 border-neutral-200 transition-all hover:scale-105 dark:border-neutral-700'
                  style={{ backgroundColor: background }}
                  onClick={() => setShowBackgroundPicker(true)}
                />
                <div className='flex-1'>
                  <input
                    type='text'
                    value={background}
                    onChange={(e) => {
                      if (chroma.valid(e.target.value)) setBackground(e.target.value)
                    }}
                    className='w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 font-mono text-sm dark:border-neutral-700 dark:bg-neutral-800'
                  />
                </div>
                {showBackgroundPicker && (
                  <div className='absolute top-full left-0 z-50 mt-2'>
                    <ColorPicker
                      color={background}
                      onChange={setBackground}
                      onClose={() => setShowBackgroundPicker(false)}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Swap Button */}
            <Button onClick={swapColors} variant='outline' className='w-full'>
              Trocar Cores
            </Button>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardContent className='p-6'>
            <h3 className='mb-4 text-lg font-semibold'>Preview</h3>
            <div
              className='rounded-lg border-2 border-neutral-200 p-8 dark:border-neutral-700'
              style={{ backgroundColor: background }}>
              <p className='text-2xl font-bold' style={{ color: foreground }}>
                Texto de Exemplo
              </p>
              <p className='mt-2 text-base' style={{ color: foreground }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Área de Resultados (60%) */}
      <div className='flex-1'>
        <Tabs defaultValue='wcag' className='h-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='wcag'>WCAG 2.1</TabsTrigger>
            <TabsTrigger value='apca'>APCA (WCAG 3.0)</TabsTrigger>
          </TabsList>

          <TabsContent value='wcag' className='mt-6'>
            {wcagResult && (
              <Card>
                <CardContent className='p-6'>
                  <div className='mb-6 flex items-center justify-between'>
                    <h3 className='text-xl font-bold'>WCAG 2.1</h3>
                    <Badge
                      variant={wcagResult.grade === 'Fail' ? 'destructive' : 'default'}
                      className={cn('text-lg font-bold', getGradeColor(wcagResult.grade))}>
                      {wcagResult.grade}
                    </Badge>
                  </div>

                  {/* Ratio */}
                  <div className='mb-6 rounded-xl bg-neutral-50 p-6 text-center dark:bg-neutral-900'>
                    <p className='text-muted-foreground mb-2 text-sm'>Contraste</p>
                    <p className={cn('text-6xl font-black', getGradeColor(wcagResult.grade))}>
                      {wcagResult.ratio.toFixed(2)}:1
                    </p>
                  </div>

                  {/* Levels */}
                  <div className='space-y-4'>
                    <div>
                      <h4 className='mb-3 text-sm font-semibold'>Nível AA</h4>
                      <div className='space-y-2'>
                        <div className='flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-800'>
                          <span className='text-sm'>Texto Normal (≥4.5:1)</span>
                          {wcagResult.aa.normal ? (
                            <Check className='h-5 w-5 text-emerald-600' />
                          ) : (
                            <X className='h-5 w-5 text-red-600' />
                          )}
                        </div>
                        <div className='flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-800'>
                          <span className='text-sm'>Texto Grande (≥3.0:1)</span>
                          {wcagResult.aa.large ? (
                            <Check className='h-5 w-5 text-emerald-600' />
                          ) : (
                            <X className='h-5 w-5 text-red-600' />
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className='mb-3 text-sm font-semibold'>Nível AAA</h4>
                      <div className='space-y-2'>
                        <div className='flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-800'>
                          <span className='text-sm'>Texto Normal (≥7.0:1)</span>
                          {wcagResult.aaa.normal ? (
                            <Check className='h-5 w-5 text-emerald-600' />
                          ) : (
                            <X className='h-5 w-5 text-red-600' />
                          )}
                        </div>
                        <div className='flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-800'>
                          <span className='text-sm'>Texto Grande (≥4.5:1)</span>
                          {wcagResult.aaa.large ? (
                            <Check className='h-5 w-5 text-emerald-600' />
                          ) : (
                            <X className='h-5 w-5 text-red-600' />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value='apca' className='mt-6'>
            {apcaResult && (
              <Card>
                <CardContent className='p-6'>
                  <div className='mb-6 flex items-center justify-between'>
                    <h3 className='text-xl font-bold'>APCA (WCAG 3.0)</h3>
                    <Badge
                      variant={apcaResult.level === 'Fail' ? 'destructive' : 'default'}
                      className={cn('text-lg font-bold', getLevelColor(apcaResult.level))}>
                      {apcaResult.level}
                    </Badge>
                  </div>

                  {/* Lc Value */}
                  <div className='mb-6 rounded-xl bg-neutral-50 p-6 text-center dark:bg-neutral-900'>
                    <p className='text-muted-foreground mb-2 text-sm'>Contraste Lc</p>
                    <p className={cn('text-6xl font-black', getLevelColor(apcaResult.level))}>
                      {Math.abs(apcaResult.contrast).toFixed(0)}
                    </p>
                    <p className='text-muted-foreground mt-2 text-xs'>
                      {apcaResult.contrast < 0
                        ? 'Texto escuro sobre fundo claro'
                        : 'Texto claro sobre fundo escuro'}
                    </p>
                  </div>

                  {/* Recommendations */}
                  <div className='space-y-4'>
                    <div className='rounded-lg border border-neutral-200 bg-blue-50 p-4 dark:border-neutral-700 dark:bg-blue-900/20'>
                      <p className='mb-2 text-sm font-semibold text-blue-900 dark:text-blue-100'>
                        Recomendações
                      </p>
                      <p className='text-sm text-blue-800 dark:text-blue-200'>
                        {apcaResult.description}
                      </p>
                      {apcaResult.isReadable && (
                        <div className='mt-3 space-y-1 text-xs text-blue-700 dark:text-blue-300'>
                          <p>• Tamanho mínimo: {apcaResult.minFontSize}px</p>
                          <p>• Peso mínimo: {apcaResult.minFontWeight}</p>
                        </div>
                      )}
                    </div>

                    {/* Levels Info */}
                    <div className='rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-900'>
                      <p className='mb-2 text-xs font-semibold'>Níveis APCA:</p>
                      <ul className='text-muted-foreground space-y-1 text-xs'>
                        <li>
                          • <strong>90+:</strong> Excelente (qualquer texto)
                        </li>
                        <li>
                          • <strong>75+:</strong> Bom (texto normal 16px+)
                        </li>
                        <li>
                          • <strong>60+:</strong> Aceitável (texto grande ou negrito)
                        </li>
                        <li>
                          • <strong>45+:</strong> Pobre (texto muito grande)
                        </li>
                        <li>
                          • <strong>&lt;45:</strong> Insuficiente
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
