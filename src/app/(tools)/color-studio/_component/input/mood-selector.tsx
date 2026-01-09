'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import { MOOD_COLORS, MOOD_ICONS, MOOD_TYPES, type MoodType } from '../constants'

interface MoodSelectorProps {
  value: MoodType | null
  onChange: (mood: MoodType | null) => void
}

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <Label className='text-muted-foreground text-xs font-medium tracking-wider uppercase'>
          Atmosfera
        </Label>
        {value && (
          <Button
            variant='ghost'
            size='icon'
            className='hover:bg-destructive/10 hover:text-destructive h-5 w-5 rounded-full'
            onClick={(e) => {
              e.stopPropagation()
              onChange(null)
            }}
            title='Remover mood'>
            <X className='h-3 w-3' />
          </Button>
        )}
      </div>

      <div className='grid gap-2 sm:grid-cols-2'>
        {MOOD_TYPES.map((mood) => {
          const Icon = MOOD_ICONS[mood.value as keyof typeof MOOD_ICONS]
          const isSelected = value === mood.value

          return (
            <button
              key={mood.value}
              onClick={() => onChange(mood.value as MoodType)}
              className={cn(
                'group focus-visible:ring-primary relative flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-left transition-all duration-200 outline-none focus-visible:ring-2',
                isSelected
                  ? 'border-primary bg-primary/5 ring-primary/20 ring-1'
                  : 'border-border bg-card hover:bg-muted/50 hover:border-primary/30',
              )}>
              {/* Ícone com Gradiente */}
              <div
                className={cn(
                  'flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-linear-to-br shadow-sm transition-all',
                  MOOD_COLORS[mood.value as keyof typeof MOOD_COLORS],
                  isSelected
                    ? 'scale-100 opacity-100'
                    : 'opacity-90 group-hover:scale-105 group-hover:opacity-100',
                )}>
                <Icon className='h-4.5 w-4.5 text-white' />
              </div>

              <div className='min-w-0 flex-1 space-y-0.5'>
                <div className='flex items-center justify-between'>
                  <span
                    className={cn(
                      'text-xs font-semibold transition-colors',
                      isSelected ? 'text-primary' : 'text-foreground',
                    )}>
                    {mood.label}
                  </span>
                </div>
                <p className='text-muted-foreground line-clamp-2 text-[10px] leading-tight'>
                  {mood.description}
                </p>
              </div>

              {/* Indicador Ativo (Ponto) */}
              {isSelected && (
                <div className='bg-primary absolute top-3 right-3 h-1.5 w-1.5 rounded-full shadow-[0_0_8px_rgba(var(--primary),0.5)]' />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
