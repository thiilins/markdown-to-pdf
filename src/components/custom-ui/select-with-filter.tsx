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
import { Check, ChevronsUpDown, Search } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'

// Tipagem aprimorada para suportar ícones
export interface SelectOption {
  value: string
  label: string
  icon?: React.ElementType
}

interface SelectWithFilterComponentProps {
  id?: string
  value?: string
  onChange?: (value: string) => void
  data: SelectOption[]
  placeholder?: string
  emptyMessage?: string
  disabled?: boolean
  className?: {
    trigger?: string
    content?: string
    item?: string
    buttonTrigger?: string
  }
}

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
  placeholder = 'Selecione...',
  emptyMessage = 'Nenhum resultado.',
  disabled = false,
  id,
}: SelectWithFilterComponentProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filteredData = useMemo(() => {
    if (!search.trim()) return data

    const normalizedSearch = normalizeText(search.trim())
    return data.filter((item) => {
      const normalizedLabel = normalizeText(item.label)
      return normalizedLabel.includes(normalizedSearch)
    })
  }, [search, data])

  const selectedItem = useMemo(() => data.find((item) => item.value === value), [data, value])
  const SelectedIcon = selectedItem?.icon

  const handleSelect = useCallback(
    (currentValue: string) => {
      onChange?.(currentValue)
      setOpen(false)
      setSearch('')
    },
    [onChange],
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger id={id} asChild className={className?.trigger}>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            'group border-border/50 bg-background/50 hover:bg-accent/50 hover:text-accent-foreground h-9 w-full justify-between rounded-md border px-3 text-sm font-normal shadow-sm transition-all disabled:opacity-50',
            !value && 'text-muted-foreground',
            className?.buttonTrigger,
          )}>
          <div className='flex items-center gap-2 truncate'>
            {SelectedIcon && <SelectedIcon className='text-muted-foreground/70 h-4 w-4 shrink-0' />}
            <span className='truncate'>{selectedItem ? selectedItem.label : placeholder}</span>
          </div>
          <ChevronsUpDown className='ml-2 h-3.5 w-3.5 shrink-0 opacity-50 transition-transform duration-200 group-data-[state=open]:rotate-180' />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align='start'
        className={cn('w-[200px] p-0 shadow-lg backdrop-blur-sm', className?.content)}>
        <Command shouldFilter={false}>
          <div className='flex items-center border-b px-3' cmdk-input-wrapper=''>
            <Search className='mr-2 h-4 w-4 shrink-0 opacity-50' />
            <CommandInput
              placeholder={placeholder}
              value={search}
              onValueChange={setSearch}
              className='placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50'
            />
          </div>
          <CommandList>
            <CommandEmpty className='text-muted-foreground py-6 text-center text-xs'>
              {emptyMessage}
            </CommandEmpty>
            <CommandGroup>
              {filteredData.map((item) => {
                const isSelected = item.value === value
                const ItemIcon = item.icon

                return (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={() => handleSelect(item.value)}
                    className={cn(
                      'aria-selected:bg-accent aria-selected:text-accent-foreground cursor-pointer rounded-sm px-2 py-1.5 text-sm transition-colors',
                      isSelected &&
                        'bg-primary/5 text-primary aria-selected:bg-primary/10 aria-selected:text-primary',
                      className?.item,
                    )}>
                    <div className='flex flex-1 items-center gap-2 overflow-hidden'>
                      {ItemIcon && (
                        <ItemIcon
                          className={cn(
                            'h-4 w-4 shrink-0',
                            isSelected ? 'text-primary' : 'text-muted-foreground/70',
                          )}
                        />
                      )}
                      <span className='truncate font-medium'>{item.label}</span>
                    </div>

                    {isSelected && <Check className='text-primary ml-2 h-3.5 w-3.5' />}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
