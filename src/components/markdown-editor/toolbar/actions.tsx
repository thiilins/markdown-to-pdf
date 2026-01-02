'use client'

import {
  AlertCircle,
  AlertTriangle,
  ChevronDown,
  Grid3X3,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Info,
  Lightbulb,
  Plus,
  ShieldAlert,
  Table as TableIcon,
  Type,
} from 'lucide-react'
import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

/**
 * Item padrão da toolbar (seguindo o padrão do action-toolbar)
 */
export const MarkdownToolbarItem = ({
  icon: Icon,
  tooltip,
  onClick,
  className,
  disabled,
}: {
  icon: React.ElementType
  tooltip: string
  onClick?: () => void
  className?: string
  disabled?: boolean
}) => {
  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          disabled={disabled}
          className={cn(
            'h-8 max-h-8 w-8 max-w-8 shrink-0 rounded-md transition-all sm:w-9 sm:max-w-9',
            className,
          )}
          onClick={onClick}>
          <Icon className='h-4 w-4' />
        </Button>
      </TooltipTrigger>
      <TooltipContent side='bottom' className='px-2 py-1 text-[12px] font-medium'>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  )
}

/**
 * Menu de Cabeçalhos (Dropdown compacto)
 */
export const HeadingsToolbar = ({ actions }: { actions: any }) => {
  const [open, setOpen] = React.useState(false)
  const headings = [
    { level: 1, icon: Heading1, label: 'Título 1', shortcut: '#' },
    { level: 2, icon: Heading2, label: 'Título 2', shortcut: '##' },
    { level: 3, icon: Heading3, label: 'Título 3', shortcut: '###' },
    { level: 4, icon: Heading4, label: 'Título 4', shortcut: '####' },
    { level: 5, icon: Heading5, label: 'Título 5', shortcut: '#####' },
    { level: 6, icon: Heading6, label: 'Título 6', shortcut: '######' },
  ]

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              size='sm'
              className={cn(
                'h-8 w-8 shrink-0 gap-0.5 rounded-md px-1.5 transition-all sm:w-9',
                open
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground',
              )}>
              <Type className='h-4 w-4' />
              <ChevronDown className='hidden h-2.5 w-2.5 opacity-50 transition-transform sm:block' />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side='bottom' className='px-2 py-1 text-[12px] font-medium'>
          Títulos
        </TooltipContent>
      </Tooltip>

      <DropdownMenuContent
        align='start'
        collisionPadding={16}
        className='w-52 max-w-[calc(100vw-2rem)] p-1.5'>
        <div className='text-muted-foreground mb-1 px-2 py-1 text-[10px] font-bold tracking-wider uppercase'>
          Hierarquia
        </div>
        {headings.map((item) => (
          <DropdownMenuItem
            key={item.level}
            onClick={() => {
              actions.insertHeading(item.level)
              setOpen(false)
            }}
            className='focus:bg-accent focus:text-accent-foreground flex cursor-pointer items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-xs transition-colors'>
            <div className='flex items-center gap-2'>
              <item.icon className='text-muted-foreground h-3.5 w-3.5' />
              <span className='font-medium'>{item.label}</span>
            </div>
            <span className='text-muted-foreground bg-muted rounded px-1.5 py-0.5 font-mono text-[9px]'>
              {item.shortcut}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/**
 * Gerador de Tabelas
 */
export const TableGenerator = ({
  onInsert,
}: {
  onInsert: (rows: number, cols: number) => void
}) => {
  const [open, setOpen] = useState(false)
  const [rows, setRows] = useState<string>('3')
  const [cols, setCols] = useState<string>('3')

  const MIN_SIZE = 2
  const MAX_SIZE = 50

  const handleSubmit = () => {
    const r = parseInt(rows, 10)
    const c = parseInt(cols, 10)
    if (!isNaN(r) && !isNaN(c) && r >= MIN_SIZE && c >= MIN_SIZE) {
      onInsert(r, c)
      setOpen(false)
      setRows('3')
      setCols('3')
    }
  }

  const isValid =
    parseInt(rows, 10) >= MIN_SIZE &&
    parseInt(rows, 10) <= MAX_SIZE &&
    parseInt(cols, 10) >= MIN_SIZE &&
    parseInt(cols, 10) <= MAX_SIZE

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className={cn(
                'hover:bg-accent hover:text-accent-foreground h-8 w-8 shrink-0 rounded-md transition-all sm:w-9',
                open && 'bg-accent text-accent-foreground',
              )}>
              <TableIcon className='h-4 w-4' />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent side='bottom' className='px-2 py-1 text-[12px] font-medium'>
          Tabela
        </TooltipContent>
      </Tooltip>
      <PopoverContent
        className='w-64 max-w-[calc(100vw-2rem)] p-3'
        align='start'
        collisionPadding={16}>
        <div className='space-y-3'>
          <div className='border-border flex items-center gap-2 border-b pb-2'>
            <Grid3X3 className='text-primary h-4 w-4' />
            <span className='text-sm font-semibold'>Gerar Tabela</span>
          </div>
          <div className='grid grid-cols-2 gap-3'>
            <div className='space-y-1.5'>
              <Label className='text-muted-foreground text-[10px] font-semibold tracking-wide uppercase'>
                Linhas
              </Label>
              <Input
                type='number'
                min={MIN_SIZE}
                max={MAX_SIZE}
                value={rows}
                onChange={(e) => setRows(e.target.value)}
                className='h-8 text-xs'
              />
            </div>
            <div className='space-y-1.5'>
              <Label className='text-muted-foreground text-[10px] font-semibold tracking-wide uppercase'>
                Colunas
              </Label>
              <Input
                type='number'
                min={MIN_SIZE}
                max={MAX_SIZE}
                value={cols}
                onChange={(e) => setCols(e.target.value)}
                className='h-8 text-xs'
              />
            </div>
          </div>
          <Button
            size='sm'
            className='h-8 w-full gap-1.5 text-xs font-medium'
            disabled={!isValid}
            onClick={handleSubmit}>
            <Plus className='h-3.5 w-3.5' /> Inserir Tabela
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

/**
 * Menu de Callouts
 */
export const CalloutsMenu = ({ onInsert }: { onInsert: (type: any) => void }) => {
  const [open, setOpen] = useState(false)
  const callouts = [
    { type: 'NOTE', icon: Info, label: 'Nota', color: 'text-blue-500' },
    { type: 'TIP', icon: Lightbulb, label: 'Dica', color: 'text-emerald-500' },
    { type: 'IMPORTANT', icon: AlertCircle, label: 'Importante', color: 'text-purple-500' },
    { type: 'WARNING', icon: AlertTriangle, label: 'Aviso', color: 'text-amber-500' },
    { type: 'CAUTION', icon: ShieldAlert, label: 'Cuidado', color: 'text-destructive' },
  ]

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className={cn(
                'hover:bg-accent hover:text-accent-foreground h-8 w-8 shrink-0 rounded-md transition-all sm:w-9',
                open && 'bg-accent text-accent-foreground',
              )}>
              <Info className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side='bottom' className='px-2 py-1 text-[12px] font-medium'>
          Alertas
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent
        align='start'
        collisionPadding={16}
        className='w-52 max-w-[calc(100vw-2rem)] p-1.5'>
        <div className='text-muted-foreground mb-1 px-2 py-1 text-[10px] font-bold tracking-wider uppercase'>
          Inserir Alerta
        </div>
        {callouts.map((item) => (
          <DropdownMenuItem
            key={item.type}
            onClick={() => {
              onInsert(item.type)
              setOpen(false)
            }}
            className='focus:bg-accent focus:text-accent-foreground flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-xs transition-colors'>
            <item.icon className={cn('h-3.5 w-3.5', item.color)} />
            <span className='font-medium'>{item.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
