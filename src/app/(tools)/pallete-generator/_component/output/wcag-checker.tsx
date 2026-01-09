'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Check, Sparkles, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { calculateAPCA, calculateWCAG } from '../palette-utils'

interface WCAGCheckerProps {
  colors: ColorInfo[]
}

export function WCAGChecker({ colors }: WCAGCheckerProps) {
  const [foreground, setForeground] = useState<string>(colors[0]?.hex || '#000000')
  const [background, setBackground] = useState<string>(colors[colors.length - 1]?.hex || '#FFFFFF')
  const [wcagResult, setWcagResult] = useState<WCAGResult | null>(null)
  const [apcaResult, setApcaResult] = useState<APCAResult | null>(null)

  useEffect(() => {
    if (foreground && background) {
      setWcagResult(calculateWCAG(foreground, background))
      setApcaResult(calculateAPCA(foreground, background))
    }
  }, [foreground, background])

  if (!colors.length) return null

  return (
    <Card className='overflow-hidden border-none shadow-sm ring-1 ring-slate-200 dark:ring-slate-800'>
      <div className='bg-muted/30 border-b px-4 py-3'>
        <div className='flex items-center justify-between'>
          <h3 className='text-sm font-semibold'>Verificador de Contraste</h3>
          <Badge variant='outline' className='gap-1'>
            <Sparkles className='h-3 w-3' />
            WCAG 2.1 + 3.0
          </Badge>
        </div>
      </div>

      <CardContent className='grid gap-0 p-0 lg:grid-cols-2'>
        {/* Painel de Controle (Esquerda) */}
        <div className='border-b border-slate-200 p-6 lg:border-r lg:border-b-0 dark:border-slate-800'>
          <div className='space-y-6'>
            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label className='text-muted-foreground text-xs uppercase'>
                  Texto (Foreground)
                </Label>
                <ColorSelect value={foreground} onChange={setForeground} colors={colors} />
              </div>
              <div className='space-y-2'>
                <Label className='text-muted-foreground text-xs uppercase'>
                  Fundo (Background)
                </Label>
                <ColorSelect value={background} onChange={setBackground} colors={colors} />
              </div>
            </div>

            {/* Tabs WCAG 2.1 vs APCA (WCAG 3.0) */}
            <Tabs defaultValue='wcag21' className='w-full'>
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value='wcag21'>WCAG 2.1</TabsTrigger>
                <TabsTrigger value='apca' className='gap-1'>
                  <Sparkles className='h-3 w-3' />
                  APCA (3.0)
                </TabsTrigger>
              </TabsList>

              <TabsContent value='wcag21' className='mt-4'>
                {wcagResult && (
                  <div className='flex flex-col items-center justify-center rounded-xl bg-slate-50 py-6 dark:bg-slate-900'>
                    <span className='text-muted-foreground text-sm font-medium'>
                      Razão de Contraste
                    </span>
                    <span
                      className={`text-5xl font-black tracking-tighter ${
                        wcagResult.grade === 'Fail' ? 'text-red-500' : 'text-emerald-500'
                      }`}>
                      {wcagResult.ratio.toFixed(2)}
                    </span>
                    <span
                      className={`mt-2 rounded-full px-3 py-0.5 text-xs font-bold ${
                        wcagResult.grade === 'Fail'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      }`}>
                      Nível {wcagResult.grade}
                    </span>
                  </div>
                )}
              </TabsContent>

              <TabsContent value='apca' className='mt-4'>
                {apcaResult && (
                  <div className='space-y-4'>
                    <div className='flex flex-col items-center justify-center rounded-xl bg-slate-50 py-6 dark:bg-slate-900'>
                      <span className='text-muted-foreground text-sm font-medium'>
                        Contraste Lc
                      </span>
                      <span
                        className={`text-5xl font-black tracking-tighter ${
                          apcaResult.level === 'Fail' || apcaResult.level === 'Poor'
                            ? 'text-red-500'
                            : apcaResult.level === 'Acceptable'
                              ? 'text-yellow-500'
                              : 'text-emerald-500'
                        }`}>
                        {Math.abs(apcaResult.contrast).toFixed(0)}
                      </span>
                      <span
                        className={`mt-2 rounded-full px-3 py-0.5 text-xs font-bold ${
                          apcaResult.level === 'Fail' || apcaResult.level === 'Poor'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : apcaResult.level === 'Acceptable'
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        }`}>
                        {apcaResult.level}
                      </span>
                    </div>

                    <div className='rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20'>
                      <p className='text-muted-foreground text-xs leading-relaxed'>
                        {apcaResult.description}
                      </p>
                      {apcaResult.isReadable && (
                        <p className='text-muted-foreground mt-2 text-xs'>
                          <strong>Recomendação:</strong> Fonte mínima {apcaResult.minFontSize}px,
                          peso {apcaResult.minFontWeight}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Painel de Preview (Direita) */}
        <div className='flex flex-col justify-between p-6'>
          {/* Visualização Real */}
          <div
            className='flex flex-1 flex-col items-center justify-center rounded-lg border p-8 text-center shadow-inner transition-colors duration-300'
            style={{ backgroundColor: background, color: foreground }}>
            <h4 className='mb-2 text-2xl font-bold'>Quase antes de morrer</h4>
            <p className='max-w-xs text-base opacity-90'>
              "Não deixe para amanhã o que você pode fazer hoje, pois o amanhã é incerto."
            </p>
          </div>

          {/* Checklist */}
          {wcagResult && (
            <div className='mt-6 grid grid-cols-2 gap-4'>
              <RequirementItem
                label='Texto Normal (AA)'
                sublabel='Mínimo 4.5:1'
                pass={wcagResult.aa.normal}
              />
              <RequirementItem
                label='Texto Grande (AA)'
                sublabel='Mínimo 3:1'
                pass={wcagResult.aa.large}
              />
              <RequirementItem
                label='Texto Normal (AAA)'
                sublabel='Mínimo 7:1'
                pass={wcagResult.aaa.normal}
              />
              <RequirementItem
                label='Texto Grande (AAA)'
                sublabel='Mínimo 4.5:1'
                pass={wcagResult.aaa.large}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Subcomponente de Select Customizado
function ColorSelect({
  value,
  onChange,
  colors,
}: {
  value: string
  onChange: (v: string) => void
  colors: ColorInfo[]
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className='h-12 w-full'>
        <div className='flex w-full items-center gap-3'>
          <div
            className='h-6 w-6 shrink-0 rounded-md border border-slate-200 shadow-sm dark:border-slate-700'
            style={{ backgroundColor: value }}
          />
          <span className='font-mono text-sm'>{value}</span>
        </div>
      </SelectTrigger>
      <SelectContent>
        {colors.map((color, i) => (
          <SelectItem key={i} value={color.hex}>
            <div className='flex items-center gap-2'>
              <div className='h-4 w-4 rounded-full' style={{ backgroundColor: color.hex }} />
              <span className='font-mono'>{color.hex}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

// Subcomponente de Item de Requisito
function RequirementItem({
  label,
  sublabel,
  pass,
}: {
  label: string
  sublabel: string
  pass: boolean
}) {
  return (
    <div className='flex items-start gap-3'>
      <div
        className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full ${
          pass ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
        }`}>
        {pass ? <Check className='h-3 w-3' /> : <X className='h-3 w-3' />}
      </div>
      <div>
        <p className='text-sm leading-none font-medium'>{label}</p>
        <p className='text-muted-foreground mt-1 text-[10px]'>{sublabel}</p>
      </div>
    </div>
  )
}
