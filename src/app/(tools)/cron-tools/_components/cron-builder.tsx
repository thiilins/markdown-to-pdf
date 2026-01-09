'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Wand2 } from 'lucide-react'
import { useState } from 'react'

interface CronBuilderProps {
  onGenerate: (expression: string) => void
}

export function CronBuilder({ onGenerate }: CronBuilderProps) {
  const [minute, setMinute] = useState('*')
  const [hour, setHour] = useState('*')
  const [dayOfMonth, setDayOfMonth] = useState('*')
  const [month, setMonth] = useState('*')
  const [dayOfWeek, setDayOfWeek] = useState('*')

  const handleGenerate = () => {
    const expression = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`
    onGenerate(expression)
  }

  // Helper para renderizar os selects com o mesmo estilo
  const renderField = (
    label: string,
    value: string,
    setValue: (v: string) => void,
    options: { value: string; label: string }[],
  ) => (
    <div className='bg-background/40 border-border/40 hover:border-primary/20 space-y-1.5 rounded-lg border p-3 transition-colors'>
      <div className='flex items-center justify-between'>
        <Label className='text-muted-foreground text-xs font-semibold tracking-wider uppercase'>
          {label}
        </Label>
        <span className='text-primary/70 bg-primary/10 rounded px-1.5 py-0.5 font-mono text-[10px]'>
          {value}
        </span>
      </div>
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className='focus:ring-primary/20 h-9 border-white/10 bg-transparent'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              <span className='flex items-center gap-2'>
                <span className='w-8 text-right font-mono text-xs opacity-70'>{opt.value}</span>
                <span>{opt.label}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )

  // Opções (Mantidas iguais, apenas omitidas por brevidade, use as mesmas do seu código original)
  const minuteOptions = [
    { value: '*', label: 'Qualquer minuto' },
    { value: '0', label: 'No minuto 0' },
    { value: '*/5', label: 'A cada 5 min' },
    { value: '*/15', label: 'A cada 15 min' },
    { value: '*/30', label: 'A cada 30 min' },
  ]
  const hourOptions = [
    { value: '*', label: 'Qualquer hora' },
    { value: '0', label: 'Meia-noite (0h)' },
    { value: '9', label: 'Início exp. (9h)' },
    { value: '12', label: 'Almoço (12h)' },
    { value: '18', label: 'Fim exp. (18h)' },
    { value: '*/2', label: 'A cada 2 horas' },
  ]
  const dayOfMonthOptions = [
    { value: '*', label: 'Qualquer dia' },
    { value: '1', label: 'Dia 1' },
    { value: '15', label: 'Dia 15' },
    { value: '1-15', label: 'Primeira quinzena' },
  ]
  const monthOptions = [
    { value: '*', label: 'Qualquer mês' },
    { value: '1', label: 'Janeiro' },
    { value: '6', label: 'Junho' },
    { value: '12', label: 'Dezembro' },
  ]
  const dayOfWeekOptions = [
    { value: '*', label: 'Qualquer dia' },
    { value: '1-5', label: 'Segunda a Sexta' },
    { value: '0,6', label: 'Fim de semana' },
    { value: '1', label: 'Segunda-feira' },
    { value: '5', label: 'Sexta-feira' },
  ]

  return (
    <div className='flex h-full flex-col gap-4 p-2'>
      <ScrollArea className='flex-1 pr-3'>
        <div className='space-y-3'>
          {renderField('Minuto', minute, setMinute, minuteOptions)}
          {renderField('Hora', hour, setHour, hourOptions)}
          {renderField('Dia do Mês', dayOfMonth, setDayOfMonth, dayOfMonthOptions)}
          {renderField('Mês', month, setMonth, monthOptions)}
          {renderField('Dia da Semana', dayOfWeek, setDayOfWeek, dayOfWeekOptions)}
        </div>
      </ScrollArea>

      <div className='border-border/50 border-t pt-2'>
        <Button
          onClick={handleGenerate}
          className='bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20 w-full shadow-lg transition-all hover:scale-[1.02]'
          size='lg'>
          <Wand2 className='mr-2 h-4 w-4 animate-pulse' />
          Gerar Expressão
        </Button>
      </div>
    </div>
  )
}
