'use client'

import { SelectComponent } from '@/components/custom-ui/select-component'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { AppConfig, MarginPreset, Orientation, PageSize } from '@/types/config'
import { MARGIN_PRESETS, PAGE_SIZES } from '@/types/config'
import { TabsContent } from '@radix-ui/react-tabs'
import { FileText, Maximize2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { convertUnit, extractNumber, extractUnit, type Unit } from './utils'

export const PageSizeConfigComponent = ({
  value,
  config,
  onPageSizeChange,
  onOrientationChange,
  onApplyMarginPreset,
  getCurrentMarginPreset,
  onConfigChange,
}: {
  value: string
  config: AppConfig
  onPageSizeChange: (size: PageSize) => void
  onOrientationChange: (orientation: Orientation) => void
  onApplyMarginPreset: (preset: MarginPreset) => void
  getCurrentMarginPreset: () => MarginPreset
  onConfigChange: (config: Partial<AppConfig>) => void
}) => {
  // Detecta a unidade atual baseado nos valores existentes
  const detectCurrentUnit = useCallback((): Unit => {
    const marginTop = extractUnit(config.page.margin.top)
    const padding = extractUnit(config.page.padding)
    return marginTop || padding || 'mm'
  }, [config.page.margin.top, config.page.padding])

  const [unit, setUnit] = useState<Unit>(detectCurrentUnit())

  // Atualiza a unidade quando o componente monta
  useEffect(() => {
    setUnit(detectCurrentUnit())
  }, [config.page.margin.top, config.page.padding, detectCurrentUnit])

  // Atualiza padding com a unidade selecionada
  const updatePadding = (numValue: number) => {
    const valueWithUnit = `${numValue}${unit}`
    onConfigChange({
      page: { ...config.page, padding: valueWithUnit },
    })
  }

  // Quando a unidade muda, converte todos os valores
  const handleUnitChange = (newUnit: Unit) => {
    setUnit(newUnit)

    // Converte todas as margens
    const currentTopUnit = extractUnit(config.page.margin.top)
    const topNum = extractNumber(config.page.margin.top)
    const topConverted = convertUnit(topNum, currentTopUnit, newUnit)

    const currentRightUnit = extractUnit(config.page.margin.right)
    const rightNum = extractNumber(config.page.margin.right)
    const rightConverted = convertUnit(rightNum, currentRightUnit, newUnit)

    const currentBottomUnit = extractUnit(config.page.margin.bottom)
    const bottomNum = extractNumber(config.page.margin.bottom)
    const bottomConverted = convertUnit(bottomNum, currentBottomUnit, newUnit)

    const currentLeftUnit = extractUnit(config.page.margin.left)
    const leftNum = extractNumber(config.page.margin.left)
    const leftConverted = convertUnit(leftNum, currentLeftUnit, newUnit)

    // Converte padding
    const currentPaddingUnit = extractUnit(config.page.padding)
    const paddingNum = extractNumber(config.page.padding)
    const paddingConverted = convertUnit(paddingNum, currentPaddingUnit, newUnit)

    onConfigChange({
      page: {
        ...config.page,
        margin: {
          top: `${topConverted}${newUnit}`,
          right: `${rightConverted}${newUnit}`,
          bottom: `${bottomConverted}${newUnit}`,
          left: `${leftConverted}${newUnit}`,
        },
        padding: `${paddingConverted}${newUnit}`,
      },
    })
  }

  return (
    <TabsContent value={value} className='mt-4 space-y-4'>
      <GeneralConfigPart
        config={config}
        onPageSizeChange={onPageSizeChange}
        onOrientationChange={onOrientationChange}
        unit={unit}
        handleUnitChange={handleUnitChange}
        getCurrentMarginPreset={getCurrentMarginPreset}
        onApplyMarginPreset={onApplyMarginPreset}
      />
    </TabsContent>
  )
}

const GeneralConfigPart = ({
  config,
  onPageSizeChange,
  onOrientationChange,
  unit,
  handleUnitChange,
  getCurrentMarginPreset,
  onApplyMarginPreset,
}: {
  config: AppConfig
  onPageSizeChange: (size: PageSize) => void
  onOrientationChange: (orientation: Orientation) => void
  getCurrentMarginPreset: () => MarginPreset
  onApplyMarginPreset: (preset: MarginPreset) => void
  unit: Unit
  handleUnitChange: (unit: Unit) => void
}) => {
  return (
    <Card>
      <CardHeader>
        <div className='mb-3 flex items-center gap-2'>
          <div className='rounded-lg bg-linear-to-br from-blue-500 to-indigo-600 p-2 text-white'>
            <FileText className='h-8 w-8' />
          </div>
          <div>
            <h3 className='text-foreground text-sm font-semibold'>Configurações Gerais</h3>
            <p className='text-muted-foreground text-xs'>
              Configurações de tamanho e orientação do documento e unidade de medida
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className='flex w-full flex-col gap-3'>
        <SelectComponent
          label='Tamanho'
          value={config.page.size}
          onValueChange={(value) => onPageSizeChange(value as PageSize)}
          data={Object.entries(PAGE_SIZES).map(([key, value]) => ({
            value: key,
            label: `${value.name} (${value.width} × ${value.height})`,
          }))}
          className={{
            trigger: 'bg-background/80 w-full! flex-1 backdrop-blur-sm',
            container: 'w-full! flex-1',
          }}
        />
        <SelectComponent
          label='Orientação'
          value={config.page.orientation}
          onValueChange={(value) => onOrientationChange(value as Orientation)}
          data={[
            { value: 'portrait', label: 'Retrato' },
            { value: 'landscape', label: 'Paisagem' },
          ]}
          className={{
            trigger: 'bg-background/80 w-full! flex-1 backdrop-blur-sm',
            container: 'w-full! flex-1',
          }}
        />
        <SelectComponent
          label='Unidade'
          value={unit}
          onValueChange={(value) => handleUnitChange(value as Unit)}
          data={[
            { value: 'mm', label: 'Milímetros (mm)' },
            { value: 'cm', label: 'Centímetros (cm)' },
            { value: 'px', label: 'Pixels (px)' },
          ]}
          className={{
            trigger: 'bg-background/80 w-full! flex-1 backdrop-blur-sm',
            container: 'w-full! flex-1',
          }}
        />
        <SelectComponent
          label='Margens'
          value={getCurrentMarginPreset()}
          onValueChange={(value) => onApplyMarginPreset(value as MarginPreset)}
          data={Object.entries(MARGIN_PRESETS).map(([key, preset]) => ({
            value: key,
            label: preset.name,
          }))}
          className={{
            trigger: 'bg-background/80 w-full! flex-1 backdrop-blur-sm',
            container: 'w-full! flex-1',
          }}
        />
      </CardContent>
    </Card>
  )
}
const PageSpacingPart = ({
  config,
  unit,
  unitColors,
  onConfigChange,
}: {
  config: AppConfig
  unit: Unit
  unitColors: { [key in Unit]: string }
  onConfigChange: (config: Partial<AppConfig>) => void
}) => {
  // Extrai apenas os números dos valores atuais
  const getMarginValue = (marginValue: string): number => {
    const num = extractNumber(marginValue)
    const currentUnit = extractUnit(marginValue)
    return convertUnit(num, currentUnit, unit)
  }

  const getPaddingValue = (): number => {
    const num = extractNumber(config.page.padding)
    const currentUnit = extractUnit(config.page.padding)
    return convertUnit(num, currentUnit, unit)
  }

  // Atualiza padding com a unidade selecionada
  const updatePadding = (numValue: number) => {
    const valueWithUnit = `${numValue}${unit}`
    onConfigChange({
      page: { ...config.page, padding: valueWithUnit },
    })
  }

  const updateMargin = (side: 'top' | 'right' | 'bottom' | 'left', numValue: number) => {
    const valueWithUnit = `${numValue}${unit}`
    onConfigChange({
      page: {
        ...config.page,
        margin: { ...config.page.margin, [side]: valueWithUnit },
      },
    })
  }
  return (
    <div className='border-gradient-to-br space-y-4 rounded-xl border-2 bg-linear-to-br from-orange-50 to-amber-50 p-4 dark:from-orange-950/30 dark:to-amber-950/30'>
      <div className='flex items-center gap-2'>
        <div className='rounded-lg bg-linear-to-br from-orange-500 to-amber-600 p-2 text-white'>
          <Maximize2 className='h-4 w-4' />
        </div>
        <div>
          <h3 className='text-foreground text-sm font-semibold'>Espaçamentos</h3>
          <p className='text-muted-foreground text-xs'>Margens e padding</p>
        </div>
      </div>

      {/* Padding */}
      <div className='space-y-1.5'>
        <Label className='text-muted-foreground flex items-center gap-1.5 text-xs font-medium'>
          <span className='h-1.5 w-1.5 rounded-full bg-orange-500'></span>
          Padding
        </Label>
        <div className='flex gap-2'>
          <Input
            type='number'
            step='0.1'
            min='0'
            value={getPaddingValue()}
            onChange={(e) => {
              const numValue = parseFloat(e.target.value) || 0
              updatePadding(numValue)
            }}
            placeholder='20'
            className='bg-background/80 h-9 flex-1 border-orange-200 backdrop-blur-sm focus:border-orange-400 dark:border-orange-800 dark:focus:border-orange-600'
          />
          <Badge
            className={`${unitColors[unit]} h-9 min-w-[60px] justify-center border font-medium`}>
            {unit}
          </Badge>
        </div>
      </div>

      {/* Margens - Grid Visual */}
      <div className='space-y-2'>
        <Label className='text-muted-foreground flex items-center gap-1.5 text-xs font-medium'>
          <span className='h-1.5 w-1.5 rounded-full bg-amber-500'></span>
          Margens
        </Label>
        <div className='grid grid-cols-2 gap-2.5'>
          {[
            { side: 'top' as const, label: 'Superior', icon: '⬆️' },
            { side: 'right' as const, label: 'Direita', icon: '➡️' },
            { side: 'bottom' as const, label: 'Inferior', icon: '⬇️' },
            { side: 'left' as const, label: 'Esquerda', icon: '⬅️' },
          ].map(({ side, label, icon }) => (
            <div key={side} className='space-y-1.5'>
              <Label className='text-muted-foreground flex items-center gap-1 text-xs'>
                <span>{icon}</span>
                {label}
              </Label>
              <div className='flex gap-2'>
                <Input
                  type='number'
                  step='0.1'
                  min='0'
                  value={getMarginValue(config.page.margin[side])}
                  onChange={(e) => {
                    const numValue = parseFloat(e.target.value) || 0
                    updateMargin(side, numValue)
                  }}
                  placeholder='0'
                  className='bg-background/80 h-9 flex-1 border-orange-200 backdrop-blur-sm focus:border-orange-400 dark:border-orange-800 dark:focus:border-orange-600'
                />
                <Badge
                  className={`${unitColors[unit]} h-9 min-w-[50px] justify-center border text-xs font-medium`}>
                  {unit}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
