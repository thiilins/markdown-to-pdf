import { ColorPicker } from '@/components/custom-ui/color-selector'
import { SelectWithFilterComponent } from '@/components/custom-ui/select-with-filter'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import { GOOGLE_FONTS } from '@/types/config'
import { Minus, Plus } from 'lucide-react'
export const FontSelectComponent = ({
  value,
  onChange,
  label,
  key,
  className,
  icon,
  badge,
}: {
  label: string | React.ReactNode
  key: string
  value: string
  className?: {
    label?: string
    container?: string
  }
  badge?: {
    label: string
    className: string
  }
  icon?: React.ElementType
  onChange: (value: string) => void
}) => {
  const Icon = icon ?? null
  return (
    <div className={cn('flex flex-col gap-2 space-y-1.5', className?.container)}>
      <div className='flex items-center justify-between gap-2'>
        {label && (
          <Label
            className={cn(
              'text-muted-foreground flex items-center gap-1.5 text-xs font-medium',
              className?.label,
            )}>
            {Icon && <Icon className='h-3.5 w-3.5' />}
            {label}
          </Label>
        )}
        {badge && (
          <Badge className={cn('border px-2 py-0.5 text-xs font-medium', badge.className)}>
            {badge.label}
          </Badge>
        )}
      </div>
      <SelectWithFilterComponent
        key={key}
        id={key}
        data={GOOGLE_FONTS.map((font) => ({
          value: font.value,
          label: font.name,
        }))}
        value={value}
        onChange={(value) => onChange(value)}
      />
    </div>
  )
}

export const FontSizeSliderComponent = ({
  value,
  onChange,
  label,
  key,
  className,
  icon,
  badge,
  min,
  max,
  step,
}: {
  value: number
  onChange: (value: number) => void
  label: string
  key: string
  className?: {
    label?: string
    container?: string
    slider?: string
  }
  icon?: React.ElementType
  badge?: {
    label: string
    className: string
  }
  min: number
  max: number
  step: number
}) => {
  const Icon = icon ?? null
  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between'>
        <Label className='text-muted-foreground flex items-center gap-1.5 text-xs font-medium'>
          {Icon && <Icon className='h-3.5 w-3.5' />}
          {label}
        </Label>
        <Badge className={cn('border px-2 py-0.5 text-xs font-medium', badge?.className)}>
          {badge?.label}
        </Badge>
      </div>
      <div className='flex items-center gap-2'>
        <Button
          variant='ghost'
          onClick={() => onChange(value - step)}
          className='h-6! w-6! cursor-pointer rounded-full bg-violet-500/10'>
          <Minus className='h-3.5 w-3.5' />
        </Button>{' '}
        <Slider
          value={[value]}
          onValueChange={([value]) => onChange(value)}
          min={min}
          max={max}
          step={step}
          className={cn('w-full', className?.slider)}
        />
        <Button
          variant='ghost'
          onClick={() => onChange(value + step)}
          className='h-6! w-6! cursor-pointer rounded-full bg-violet-500/10'>
          <Plus className='h-3.5 w-3.5' />
        </Button>
      </div>
    </div>
  )
}

export const ColorSelectorComponent = ({
  value,
  onColorChange,
  label,
  className,
}: {
  value: string
  onColorChange: (value: string) => void
  label: string
  className?: {
    label?: string
    container?: string
    input?: string
  }
}) => {
  return (
    <div className={cn('flex w-full! flex-1 flex-col items-center gap-2', className?.container)}>
      <Label className={cn('text-muted-foreground flex-1 text-center text-xs', className?.label)}>
        {label}
      </Label>
      <ColorPicker value={value} onColorChange={onColorChange} />
    </div>
  )
}

export const GroupComponent = ({
  children,
  className,
  icon,
  label,
}: {
  children: React.ReactNode
  icon?: React.ElementType
  label: string
  className?: {
    container?: string
    label?: string
    content?: string
  }
}) => {
  const Icon = icon ?? null
  return (
    <div
      className={cn(
        'flex w-full! flex-col space-y-2! rounded-lg border p-3 shadow-none',
        className?.container,
      )}>
      <Label
        className={cn(
          'text-muted-foreground m-0 flex flex-1 items-center gap-2 p-0 text-xs font-medium',
          className?.label,
        )}>
        {Icon && <Icon className='h-4 w-4' />}
        {label}
      </Label>
      <CardContent className={cn('flex items-center gap-3', className?.content)}>
        {children}
      </CardContent>
    </div>
  )
}
