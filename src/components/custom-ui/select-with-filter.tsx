'use client'

import { Check, ChevronsUpDown } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { CommandLoading } from 'cmdk'
// Função para normalizar texto removendo acentos
const normalizeText = (text: string): string => {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export function SelectWithFilterComponent({
  onChange,
  data,
  className,
  value,
  placeholder,
  emptyMessage,
  disabled = false,
  id
}: SelectWithFilterComponentProps) {
  const t = (key: string) => key

  if (!emptyMessage) emptyMessage = t('Sem resultados')

  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)

  const filteredData = useMemo(() => {
    if (!search || search.trim() === '') return data

    const normalizedSearch = normalizeText(search.trim())
    return data.filter(item => {
      const normalizedLabel = normalizeText(item.label)
      const normalizedValue = normalizeText(item.value)
      return (
        normalizedLabel.includes(normalizedSearch) || normalizedValue.includes(normalizedSearch)
      )
    })
  }, [search, data])

  const setValue = (value: string) => {
    onChange?.(value)
  }

  const handleSearch = useCallback((value: string) => {
    setSearch(value)
  }, [])
  return (
    <Popover
      open={open}
      onOpenChange={newOpen => {
        setOpen(newOpen)
        if (!newOpen) {
          setSearch('')
        }
      }}>
      <PopoverTrigger id={id} asChild className={cn('w-full!', className?.trigger)}>
        <Button
          variant='outline'
          disabled={disabled}
          role='combobox'
          className={cn(
            'w-full justify-between rounded-lg border border-input/50 px-3 py-2 transition-all duration-200 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:border-input',
            className?.buttonTrigger,
            !value && 'text-muted-foreground/70',
            disabled && 'cursor-not-allowed opacity-50'
          )}>
          <span className='flex-1 truncate text-left'>
            {value ? data.find(item => item.value === value)?.label : placeholder}
          </span>
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform duration-200 group-data-[state=open]:rotate-180' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align='start'
        className={cn(
          'w-full rounded-lg border border-border/50 p-0 shadow-lg backdrop-blur-sm',
          className?.content
        )}>
        <Command>
          <CommandInput
            placeholder={placeholder}
            onValueChange={handleSearch}
            className='border-0 transition-colors duration-200 placeholder:text-muted-foreground/70 focus:ring-0'
          />
          <CommandList>
            <CommandEmpty className='py-6 text-center text-sm text-muted-foreground/70'>
              {emptyMessage}
            </CommandEmpty>
            <CommandGroup>
              {filteredData.map(item => (
                <CommandItem
                  value={item.label}
                  key={item.value}
                  onSelect={() => {
                    setValue(item.value)
                    setOpen(false)
                  }}
                  className={cn(
                    'mx-1 my-0.5 cursor-pointer rounded-md px-2 py-1.5 transition-colors duration-150 hover:bg-muted/50 data-selected:bg-primary/10 data-selected:text-primary',
                    className?.item
                  )}>
                  <span className='truncate'>{item.label}</span>
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4 transition-opacity duration-150',
                      item.value === value ? 'text-primary opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

interface SelectWithFilterPaginatedProps {
  onChange: (value: string) => void
  data: { value: string; label: string }[]
  className?: string
  itemClassName?: string
  value?: string
  placeholder?: string
  emptyMessage?: string
  pageSize?: number
}
export function SelectWithFilterPaginatedComponent({
  onChange,
  data,
  className,
  value,
  placeholder,
  emptyMessage,
  pageSize = 100,
  itemClassName
}: SelectWithFilterPaginatedProps) {
  const t = (key: string) => key
  if (!placeholder) placeholder = t('Selecione')
  if (!emptyMessage) emptyMessage = t('Sem resultados')

  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [visibleItems, setVisibleItems] = useState(pageSize)

  // Filtra e pagina os dados
  const filteredData = useMemo(() => {
    if (!searchTerm || searchTerm.trim() === '') {
      return data.slice(0, visibleItems)
    }

    const normalizedSearch = normalizeText(searchTerm.trim())
    return data
      .filter(item => {
        const normalizedLabel = normalizeText(item.label)
        const normalizedValue = normalizeText(item.value)
        return (
          normalizedLabel.includes(normalizedSearch) || normalizedValue.includes(normalizedSearch)
        )
      })
      .slice(0, visibleItems)
  }, [data, searchTerm, visibleItems])

  // Handler para detectar scroll até o final
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget
    const isNearBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 50

    // Só carrega mais itens se não estiver fazendo busca
    if (isNearBottom && !searchTerm && filteredData.length < data.length) {
      setVisibleItems(prev => prev + pageSize)
    }
  }

  return (
    <Popover
      open={open}
      onOpenChange={newOpen => {
        setOpen(newOpen)
        if (!newOpen) {
          setSearchTerm('')
          setVisibleItems(pageSize)
        }
      }}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          className={cn(
            'w-[200px] justify-between rounded-lg border border-input/50 transition-all duration-200 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:border-input',
            className,
            !value && 'text-muted-foreground/70'
          )}>
          <span className='truncate'>
            {value ? data.find(item => item.value === value)?.label : placeholder}
          </span>
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform duration-200 group-data-[state=open]:rotate-180' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          'w-[200px] rounded-lg border border-border/50 p-0 shadow-lg backdrop-blur-sm',
          className
        )}>
        <Command>
          <CommandInput
            placeholder={t('Buscar')}
            onValueChange={setSearchTerm}
            className='border-0 transition-colors duration-200 placeholder:text-muted-foreground/70 focus:ring-0'
          />
          <CommandList className='max-h-[300px]' onScroll={handleScroll}>
            <CommandEmpty className='py-6 text-center text-sm text-muted-foreground/70'>
              {emptyMessage}
            </CommandEmpty>
            <CommandGroup>
              {filteredData.map(item => (
                <CommandItem
                  value={item.label}
                  key={item.value}
                  onSelect={() => {
                    onChange(item.value)
                    setOpen(false)
                  }}
                  className={cn(
                    'mx-1 my-0.5 cursor-pointer rounded-md px-2 py-1.5 transition-colors duration-150 hover:bg-muted/50 data-selected:bg-primary/10 data-selected:text-primary',
                    itemClassName
                  )}>
                  <span className='truncate'>{item.label}</span>
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4 transition-opacity duration-150',
                      item.value === value ? 'text-primary opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
              {filteredData.length < data.length && !searchTerm && (
                <CommandLoading className='py-3 text-center text-sm text-muted-foreground/70'>
                  Carregando mais itens...
                </CommandLoading>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
