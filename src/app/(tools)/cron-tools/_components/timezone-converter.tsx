'use client'

import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Clock, Globe } from 'lucide-react'
import { useState } from 'react'
import { getNextExecutions, type CronExecution } from './cron-utils'

interface TimezoneConverterProps {
  expression: string
  isValid: boolean
}

const TIMEZONES = [
  { value: 'America/Sao_Paulo', label: 'São Paulo (BRT/BRST)' },
  { value: 'America/New_York', label: 'Nova York (EST/EDT)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)' },
  { value: 'Europe/London', label: 'Londres (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Asia/Tokyo', label: 'Tóquio (JST)' },
  { value: 'Asia/Shanghai', label: 'Xangai (CST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEDT/AEST)' },
  { value: 'UTC', label: 'UTC' },
]

export function TimezoneConverter({ expression, isValid }: TimezoneConverterProps) {
  const [selectedTimezone, setSelectedTimezone] = useState('America/Sao_Paulo')
  const [executions, setExecutions] = useState<CronExecution[]>([])

  const handleTimezoneChange = (tz: string) => {
    setSelectedTimezone(tz)
    if (isValid && expression) {
      const nextExecs = getNextExecutions(expression, 5, tz)
      setExecutions(nextExecs)
    }
  }

  // Carregar execuções iniciais
  if (isValid && expression && executions.length === 0) {
    const nextExecs = getNextExecutions(expression, 5, selectedTimezone)
    setExecutions(nextExecs)
  }

  if (!isValid) {
    return (
      <div className='flex h-full items-center justify-center p-8 text-center'>
        <div className='flex flex-col items-center gap-3 opacity-50'>
          <div className='bg-muted/20 rounded-full p-4'>
            <Globe className='text-muted-foreground h-8 w-8' />
          </div>
          <p className='text-muted-foreground text-sm'>
            Digite uma expressão válida para converter timezones
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='flex h-full flex-col gap-6 p-6'>
      {/* Seletor Estilizado */}
      <div className='border-border/50 bg-muted/20 relative space-y-2 rounded-xl border p-4 shadow-sm backdrop-blur-sm'>
        <div className='mb-2 flex items-center gap-2'>
          <Globe className='text-primary h-4 w-4' />
          <Label className='text-sm font-semibold'>Região de Destino</Label>
        </div>

        <Select value={selectedTimezone} onValueChange={handleTimezoneChange}>
          <SelectTrigger className='bg-background/50 hover:border-primary/30 focus:ring-primary/20 h-10 border-white/10 transition-all'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TIMEZONES.map((tz) => (
              <SelectItem key={tz.value} value={tz.value}>
                {tz.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='flex min-h-0 flex-1 flex-col gap-3'>
        <Label className='text-muted-foreground pl-1 text-[10px] font-semibold tracking-wider uppercase'>
          Horários Locais Calculados
        </Label>

        <ScrollArea className='bg-muted/10 flex-1 rounded-lg border p-1'>
          <div className='space-y-2 p-2'>
            {executions.map((execution, index) => (
              <div
                key={index}
                className='group bg-background/40 hover:bg-background/60 hover:border-primary/20 hover:shadow-primary/5 flex items-center justify-between rounded-lg border border-transparent p-3 backdrop-blur-sm transition-all hover:shadow-lg'>
                <div className='flex items-center gap-3'>
                  <div className='bg-primary/10 text-primary ring-primary/20 flex h-8 w-8 items-center justify-center rounded-full ring-1 transition-transform group-hover:scale-110'>
                    <Clock className='h-4 w-4' />
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-foreground font-mono text-sm font-semibold'>
                      {execution.formatted.split(',')[0]}
                    </span>
                    <span className='text-muted-foreground text-xs font-medium'>
                      {execution.formatted.split(',')[1]}
                    </span>
                  </div>
                </div>
                <Badge
                  variant='secondary'
                  className='bg-background/50 group-hover:bg-primary/10 group-hover:text-primary font-mono text-[10px] transition-colors'>
                  {execution.relative}
                </Badge>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className='flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 text-xs text-blue-400'>
        <span className='flex h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-blue-400' />
        <p>Cálculo automático de DST (Horário de Verão) aplicado.</p>
      </div>
    </div>
  )
}
