'use client'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown, Loader2, Search } from 'lucide-react'
import { useMemo, useState } from 'react'

// Normalização de texto auxiliar
const normalizeText = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

interface SelectWithFilterPaginatedProps {
  onChange: (value: string) => void
  data: { value: string; label: string; icon?: React.ElementType }[]
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
  placeholder = 'Selecione',
  emptyMessage = 'Sem resultados',
  pageSize = 50,
  itemClassName,
}: SelectWithFilterPaginatedProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [visibleItems, setVisibleItems] = useState(pageSize)

  // Filtra e pagina os dados
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) {
      return data.slice(0, visibleItems)
    }

    const normalizedSearch = normalizeText(searchTerm.trim())
    return data
      .filter((item) => {
        const normalizedLabel = normalizeText(item.label)
        return normalizedLabel.includes(normalizedSearch)
      })
      .slice(0, visibleItems)
  }, [data, searchTerm, visibleItems])

  const selectedItem = data.find((item) => item.value === value)
  const SelectedIcon = selectedItem?.icon

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget
    const isNearBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 50

    if (isNearBottom && !searchTerm && filteredData.length < data.length) {
      setVisibleItems((prev) => prev + pageSize)
    }
  }

  return (
    <Popover
      open={open}
      onOpenChange={(newOpen) => {
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
            'group border-border/50 bg-background/50 hover:bg-accent/50 h-9 w-[200px] justify-between rounded-md border px-3 text-sm font-normal shadow-sm',
            !value && 'text-muted-foreground',
            className,
          )}>
          <div className='flex items-center gap-2 truncate'>
            {SelectedIcon && <SelectedIcon className='text-muted-foreground/70 h-4 w-4' />}
            <span className='truncate'>{selectedItem ? selectedItem.label : placeholder}</span>
          </div>
          <ChevronsUpDown className='ml-2 h-3.5 w-3.5 shrink-0 opacity-50 transition-transform duration-200 group-data-[state=open]:rotate-180' />
        </Button>
      </PopoverTrigger>

      <PopoverContent className='w-[200px] p-0 shadow-lg backdrop-blur-sm'>
        <Command shouldFilter={false}>
          <div className='flex items-center border-b px-3'>
            <Search className='mr-2 h-4 w-4 shrink-0 opacity-50' />
            <CommandInput
              placeholder={placeholder}
              onValueChange={setSearchTerm}
              className='placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none'
            />
          </div>

          <CommandList className='max-h-[300px]' onScroll={handleScroll}>
            <CommandEmpty className='text-muted-foreground py-6 text-center text-xs'>
              {emptyMessage}
            </CommandEmpty>

            <CommandGroup>
              {filteredData.map((item) => {
                const ItemIcon = item.icon
                return (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={() => {
                      onChange(item.value)
                      setOpen(false)
                    }}
                    className={cn(
                      'aria-selected:bg-accent cursor-pointer rounded-sm px-2 py-1.5 text-sm',
                      item.value === value &&
                        'bg-primary/5 text-primary aria-selected:bg-primary/10 aria-selected:text-primary',
                      itemClassName,
                    )}>
                    <div className='flex flex-1 items-center gap-2 overflow-hidden'>
                      {ItemIcon && (
                        <ItemIcon
                          className={cn(
                            'h-4 w-4 shrink-0',
                            item.value === value ? 'text-primary' : 'text-muted-foreground',
                          )}
                        />
                      )}
                      <span className='truncate font-medium'>{item.label}</span>
                    </div>
                    {item.value === value && <Check className='text-primary ml-2 h-3.5 w-3.5' />}
                  </CommandItem>
                )
              })}

              {filteredData.length < data.length && !searchTerm && (
                <div className='text-muted-foreground flex items-center justify-center py-4 text-xs'>
                  <Loader2 className='mr-2 h-3 w-3 animate-spin' />
                  Carregando mais...
                </div>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
