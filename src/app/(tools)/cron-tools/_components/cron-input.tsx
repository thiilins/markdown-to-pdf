'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { Clock, Command, Info, Wand2 } from 'lucide-react'
import { CronBuilder } from './cron-builder'
import { COMMON_CRON_EXPRESSIONS } from './cron-utils'

interface CronInputProps {
  value: string
  onChange: (value: string) => void
  onValidate?: () => void
}

export function CronInput({ value, onChange, onValidate }: CronInputProps) {
  const handlePresetSelect = (preset: string) => {
    onChange(preset)
    if (onValidate) {
      setTimeout(onValidate, 100)
    }
  }

  // Mapeamento visual das posições do CRON
  const cronParts = value.trim().split(/\s+/)
  const positions = ['Minuto', 'Hora', 'Dia (Mês)', 'Mês', 'Dia (Semana)']

  return (
    <div className='flex h-full flex-col gap-6 p-6'>
      {/* Área de Input Principal */}
      <div className='border-border/50 bg-muted/20 relative space-y-4 rounded-xl border p-6 shadow-sm backdrop-blur-sm'>
        <div className='flex items-center justify-between'>
          <Label
            htmlFor='cron-input'
            className='text-primary flex items-center gap-2 text-sm font-semibold'>
            <Clock className='h-4 w-4' />
            Expressão Cron
          </Label>
          <span className='text-muted-foreground text-[10px] font-medium tracking-widest uppercase'>
            Syntax
          </span>
        </div>

        <div className='relative'>
          <Input
            id='cron-input'
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder='* * * * *'
            className='focus:ring-primary/50 h-14 text-center font-mono text-2xl tracking-widest shadow-inner transition-all'
            autoFocus
            autoComplete='off'
          />
        </div>

        {/* Indicadores de Posição (Visual Mapping) */}
        <div className='grid grid-cols-5 gap-1 text-center'>
          {positions.map((pos, i) => (
            <div
              key={i}
              className={cn(
                'flex flex-col items-center gap-1 transition-opacity duration-300',
                cronParts[i] ? 'opacity-100' : 'opacity-30',
              )}>
              <div
                className={cn(
                  'h-1 w-full rounded-full',
                  cronParts[i] ? 'bg-primary/50' : 'bg-muted',
                )}
              />
              <span className='text-muted-foreground text-[10px] font-medium uppercase'>{pos}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs com Presets e Builder */}
      <Tabs defaultValue='presets' className='flex flex-1 flex-col overflow-hidden'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='presets' className='text-xs'>
            <Command className='mr-2 h-3 w-3' />
            Presets
          </TabsTrigger>
          <TabsTrigger value='builder' className='text-xs'>
            <Wand2 className='mr-2 h-3 w-3' />
            Builder
          </TabsTrigger>
        </TabsList>

        <TabsContent value='presets' className='mt-4 flex-1 overflow-hidden'>
          <ScrollArea className='bg-card/50 h-full rounded-lg border p-2'>
            <div className='grid grid-cols-1 gap-2 p-2 sm:grid-cols-2'>
              {COMMON_CRON_EXPRESSIONS.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handlePresetSelect(preset.value)}
                  className='group bg-muted/40 hover:border-primary/20 hover:bg-primary/5 flex cursor-pointer flex-col items-start gap-1 rounded-md border border-transparent p-3 text-left transition-all active:scale-95'>
                  <span className='text-foreground group-hover:text-primary text-sm font-medium'>
                    {preset.label}
                  </span>
                  <span className='text-muted-foreground group-hover:text-primary/70 font-mono text-xs'>
                    {preset.value}
                  </span>
                </button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value='builder' className='mt-4 flex-1 overflow-hidden'>
          <ScrollArea className='h-full'>
            <CronBuilder onGenerate={onChange} />
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Dica Rápida */}
      <div className='rounded-lg border border-blue-500/20 bg-blue-500/5 p-3'>
        <div className='flex items-start gap-2 text-xs text-blue-400'>
          <Info className='mt-0.5 h-4 w-4 shrink-0' />
          <p>
            Use <span className='rounded bg-blue-500/10 px-1 font-mono text-blue-300'>*/15</span>{' '}
            para intervalos,{' '}
            <span className='rounded bg-blue-500/10 px-1 font-mono text-blue-300'>1-5</span> para
            faixas e <span className='rounded bg-blue-500/10 px-1 font-mono text-blue-300'>,</span>{' '}
            para listas.
          </p>
        </div>
      </div>

      <Button onClick={onValidate} className='mt-auto w-full lg:hidden'>
        Validar Expressão
      </Button>
    </div>
  )
}
