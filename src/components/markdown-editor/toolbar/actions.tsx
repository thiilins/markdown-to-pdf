import {
  AlertCircle,
  AlertTriangle,
  Info,
  Lightbulb,
  ListChevronsUpDown,
  ShieldAlert,
  Table,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu'
import { Heading1, Heading2, Heading3, Heading4, Heading5, Heading6 } from 'lucide-react'
import { useMemo, useState } from 'react'

export const MarkdownToolbarItem = ({
  icon,
  tooltip,
  onClick,
}: {
  icon: React.ElementType
  tooltip: string
  onClick?: () => void | Promise<void>
}) => {
  const Icon = icon
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-7 w-7 max-w-7 flex-1 rounded bg-transparent p-1'
          onClick={onClick}>
          <Icon className='h-4 w-4' />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  )
}

export const HeadingsToolbar = ({ actions }: { actions: IToolbarActions }) => {
  const [open, setOpen] = useState(false)
  const headings = [
    {
      icon: Heading1,
      title: 'Título 1',
      onClick: () => actions.insertHeading(1),
    },
    {
      icon: Heading2,
      title: 'Título 2',
      onClick: () => actions.insertHeading(2),
    },
    {
      icon: Heading3,
      title: 'Título 3',
      onClick: () => actions.insertHeading(3),
    },
    {
      icon: Heading4,
      title: 'Título 4',
      onClick: () => actions.insertHeading(4),
    },
    {
      icon: Heading5,
      title: 'Título 5',
      onClick: () => actions.insertHeading(5),
    },
    {
      icon: Heading6,
      title: 'Título 6',
      onClick: () => actions.insertHeading(6),
    },
  ]
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='h-7 w-7 rounded bg-transparent p-1'
          onClick={() => setOpen(!open)}>
          <Heading1 className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='start'
        className='bg-background text-foreground z-50 cursor-pointer rounded px-2 py-2 shadow-sm'>
        {headings.map((heading) => (
          <DropdownMenuItem
            key={heading.title}
            onClick={heading.onClick}
            className='hover:bg-accent hover:text-accent-foreground flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm font-normal'>
            <heading.icon className='mr-2 h-4 w-4' />
            {heading.title}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
export const MoreOptionsToolbar = ({
  moreOpen,
  setMoreOpen,
}: {
  moreOpen: boolean
  setMoreOpen: (moreOpen: boolean) => void
}) => {
  const content = useMemo(() => {
    return moreOpen
      ? { icon: ListChevronsUpDown, tooltip: 'Menos opções' }
      : { icon: ListChevronsUpDown, tooltip: 'Mais opções' }
  }, [moreOpen])
  return (
    <div className='flex flex-1 items-center justify-around gap-2 rounded border p-1'>
      <MarkdownToolbarItem
        icon={content.icon}
        tooltip={content.tooltip}
        onClick={() => setMoreOpen(!moreOpen)}
      />
    </div>
  )
}

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const rowsNum = parseInt(rows, 10)
    const colsNum = parseInt(cols, 10)

    if (rowsNum >= MIN_SIZE && rowsNum <= MAX_SIZE && colsNum >= MIN_SIZE && colsNum <= MAX_SIZE) {
      onInsert(rowsNum, colsNum)
      setOpen(false)
      // Reset para valores padrão após inserção
      setRows('3')
      setCols('3')
    }
  }

  const rowsNum = parseInt(rows, 10)
  const colsNum = parseInt(cols, 10)
  const isValid =
    !isNaN(rowsNum) &&
    !isNaN(colsNum) &&
    rowsNum >= MIN_SIZE &&
    rowsNum <= MAX_SIZE &&
    colsNum >= MIN_SIZE &&
    colsNum <= MAX_SIZE

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              variant='ghost'
              className='flex h-7 w-7 max-w-7 flex-1 rounded bg-transparent p-1'
              onClick={() => setOpen(!open)}>
              <Table className='h-4 w-4' />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Tabela dinâmica</TooltipContent>
      </Tooltip>
      <PopoverContent
        className='flex w-70 flex-col items-center justify-center space-y-4 p-4'
        align='start'
        onOpenAutoFocus={(e) => e.preventDefault()}>
        <div className='flex w-full flex-1 items-center justify-center gap-2'>
          <div className='flex flex-1 flex-col items-center justify-center'>
            <Label htmlFor='table-rows' className='text-sm font-medium'>
              Linhas
            </Label>
            <Input
              id='table-rows'
              type='number'
              min={MIN_SIZE}
              max={MAX_SIZE}
              value={rows}
              onChange={(e) => setRows(e.target.value)}
              placeholder='Ex: 3'
              className='w-full'
              autoFocus
            />
          </div>

          <div className='flex flex-1 flex-col items-center justify-center'>
            <Label htmlFor='table-cols' className='text-sm font-medium'>
              Colunas
            </Label>
            <Input
              id='table-cols'
              type='number'
              min={MIN_SIZE}
              max={MAX_SIZE}
              value={cols}
              onChange={(e) => setCols(e.target.value)}
              placeholder='Ex: 3'
              className='w-full'
            />
          </div>
        </div>

        <Button className='w-full flex-1' disabled={!isValid} onClick={handleSubmit}>
          Inserir Tabela ({rowsNum} × {colsNum})
        </Button>
      </PopoverContent>
    </Popover>
  )
}

export const CalloutsMenu = ({
  onInsert,
}: {
  onInsert: (type: 'NOTE' | 'TIP' | 'IMPORTANT' | 'WARNING' | 'CAUTION') => void
}) => {
  const [open, setOpen] = useState(false)

  const callouts = [
    {
      type: 'NOTE' as const,
      icon: Info,
      label: 'Nota',
      description: 'Informação importante',
    },
    {
      type: 'TIP' as const,
      icon: Lightbulb,
      label: 'Dica',
      description: 'Dica útil',
    },
    {
      type: 'IMPORTANT' as const,
      icon: AlertCircle,
      label: 'Importante',
      description: 'Informação importante',
    },
    {
      type: 'WARNING' as const,
      icon: AlertTriangle,
      label: 'Aviso',
      description: 'Aviso de atenção',
    },
    {
      type: 'CAUTION' as const,
      icon: ShieldAlert,
      label: 'Cuidado',
      description: 'Cuidado necessário',
    },
  ]

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className='flex h-7 w-7 max-w-7 flex-1 rounded bg-transparent p-1'
              onClick={() => setOpen(!open)}>
              <Info className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>Callouts/Admonitions</TooltipContent>
      </Tooltip>
      <DropdownMenuContent
        align='start'
        className='bg-background text-foreground z-50 cursor-pointer rounded px-2 py-2 shadow-sm'>
        {callouts.map((callout) => {
          const Icon = callout.icon
          return (
            <DropdownMenuItem
              key={callout.type}
              onClick={() => {
                onInsert(callout.type)
                setOpen(false)
              }}
              className='hover:bg-accent hover:text-accent-foreground flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm font-normal'>
              <Icon className='mr-2 h-4 w-4' />
              <div className='flex flex-col'>
                <span>{callout.label}</span>
                <span className='text-muted-foreground text-xs'>{callout.description}</span>
              </div>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
