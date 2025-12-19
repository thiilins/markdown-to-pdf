'use client'

import { SelectComponent } from '@/components/custom-ui/select-component'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MARGIN_PRESETS, PAGE_SIZES } from '@/shared/constants'
import { useConfig } from '@/shared/contexts/configContext'
import { convertUnit, extractNumber, extractUnit } from '@/shared/utils'
import { TabsContent } from '@radix-ui/react-tabs'
import { useCallback, useEffect, useState } from 'react'
import { SettingsCard } from './layout'

export const PageSizeConfigComponent = () => {
  const {
    config,
    updateConfig,
    updatePageSize,
    updateOrientation,
    applyMarginPreset,
    getCurrentMargin,
  } = useConfig()
  const detectCurrentUnit = useCallback((): Unit => {
    const marginTop = extractUnit(config.page.margin.top)
    const padding = extractUnit(config.page.padding)
    return marginTop || padding || 'mm'
  }, [config.page.margin.top, config.page.padding])

  const [unit, setUnit] = useState<Unit>(detectCurrentUnit())

  useEffect(() => {
    setUnit(detectCurrentUnit())
  }, [config.page.margin.top, config.page.padding, detectCurrentUnit])

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

    updateConfig({
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
    <TabsContent value='page' className='mt-4 space-y-4'>
      <SettingsCard type='page'>
        <SelectComponent
          label='Tamanho'
          value={config.page.size}
          onValueChange={(value) => updatePageSize(value as PageSize)}
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
          onValueChange={(value) => updateOrientation(value as Orientation)}
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
          value={getCurrentMargin()}
          onValueChange={(value) => applyMarginPreset(value as MarginPreset)}
          data={Object.entries(MARGIN_PRESETS).map(([key, preset]) => ({
            value: key,
            label: preset.name,
          }))}
          className={{
            trigger: 'bg-background/80 w-full! flex-1 backdrop-blur-sm',
            container: 'w-full! flex-1',
          }}
        />
        {getCurrentMargin() === 'custom' && (
          <PageSpacingPart config={config} unit={unit} onConfigChange={updateConfig} />
        )}
      </SettingsCard>
    </TabsContent>
  )
}

const PageSpacingPart = ({
  config,
  unit,
  onConfigChange,
}: {
  config: AppConfig
  unit: Unit
  onConfigChange: (config: Partial<AppConfig>) => void
}) => {
  // Calcula valores iniciais convertidos
  const getConvertedMargin = (marginValue: string): string => {
    const num = extractNumber(marginValue)
    const currentUnit = extractUnit(marginValue)
    return String(convertUnit(num, currentUnit, unit))
  }

  const getConvertedPadding = (): string => {
    const num = extractNumber(config.page.padding)
    const currentUnit = extractUnit(config.page.padding)
    return String(convertUnit(num, currentUnit, unit))
  }

  // Estados locais para permitir edição livre
  const [paddingInput, setPaddingInput] = useState(getConvertedPadding())
  const [marginInputs, setMarginInputs] = useState({
    top: getConvertedMargin(config.page.margin.top),
    right: getConvertedMargin(config.page.margin.right),
    bottom: getConvertedMargin(config.page.margin.bottom),
    left: getConvertedMargin(config.page.margin.left),
  })

  // Sincroniza estados locais quando config ou unit mudam externamente
  useEffect(() => {
    setPaddingInput(getConvertedPadding())
    setMarginInputs({
      top: getConvertedMargin(config.page.margin.top),
      right: getConvertedMargin(config.page.margin.right),
      bottom: getConvertedMargin(config.page.margin.bottom),
      left: getConvertedMargin(config.page.margin.left),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit])

  // Filtra apenas números e ponto decimal
  const sanitizeNumericInput = (value: string): string => {
    return value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
  }

  const handlePaddingChange = (value: string) => {
    const sanitized = sanitizeNumericInput(value)
    setPaddingInput(sanitized)
  }

  const handlePaddingBlur = () => {
    const numValue = parseFloat(paddingInput) || 0
    setPaddingInput(String(numValue))
    onConfigChange({
      page: { ...config.page, padding: `${numValue}${unit}` },
    })
  }

  const handleMarginChange = (side: 'top' | 'right' | 'bottom' | 'left', value: string) => {
    const sanitized = sanitizeNumericInput(value)
    setMarginInputs((prev) => ({ ...prev, [side]: sanitized }))
  }

  const handleMarginBlur = (side: 'top' | 'right' | 'bottom' | 'left') => {
    const numValue = parseFloat(marginInputs[side]) || 0
    setMarginInputs((prev) => ({ ...prev, [side]: String(numValue) }))
    onConfigChange({
      page: {
        ...config.page,
        margin: { ...config.page.margin, [side]: `${numValue}${unit}` },
      },
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, onBlur: () => void) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur()
      onBlur()
    }
  }

  return (
    <div className='space-y-3 pt-2'>
      {/* Padding */}
      <div className='space-y-1.5'>
        <Label className='text-muted-foreground text-xs font-medium'>Padding</Label>
        <div className='flex items-center gap-2'>
          <Input
            inputMode='decimal'
            value={paddingInput}
            onChange={(e) => handlePaddingChange(e.target.value)}
            onBlur={handlePaddingBlur}
            onKeyDown={(e) => handleKeyDown(e, handlePaddingBlur)}
            placeholder='20'
            className='bg-background/80 h-9 flex-1 backdrop-blur-sm'
          />
          <Badge variant='secondary' className='h-9 min-w-[50px] justify-center font-medium'>
            {unit}
          </Badge>
        </div>
      </div>

      {/* Margens */}
      <div className='space-y-1.5'>
        <Label className='text-muted-foreground text-xs font-medium'>Margens Personalizadas</Label>
        <div className='grid grid-cols-2 gap-2'>
          {[
            { side: 'top' as const, label: 'Superior' },
            { side: 'right' as const, label: 'Direita' },
            { side: 'bottom' as const, label: 'Inferior' },
            { side: 'left' as const, label: 'Esquerda' },
          ].map(({ side, label }) => (
            <div key={side} className='space-y-1'>
              <Label className='text-muted-foreground text-[11px]'>{label}</Label>
              <div className='flex items-center gap-1.5'>
                <Input
                  type='number'
                  step='0.1'
                  min='0'
                  value={marginInputs[side]}
                  onChange={(e) => handleMarginChange(side, e.target.value)}
                  onBlur={() => handleMarginBlur(side)}
                  onKeyDown={(e) => handleKeyDown(e, () => handleMarginBlur(side))}
                  placeholder='0'
                  className='bg-background/80 h-8 flex-1 backdrop-blur-sm'
                />
                <Badge variant='secondary' className='h-8 min-w-[40px] justify-center text-xs'>
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
