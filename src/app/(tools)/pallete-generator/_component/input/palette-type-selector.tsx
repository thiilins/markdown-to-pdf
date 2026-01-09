'use client'

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Layers } from 'lucide-react'
import { PALETTE_TYPES, type PaletteType } from '../constants'

interface PaletteTypeSelectorProps {
  value: PaletteType
  onChange: (value: PaletteType) => void
}

export const PaletteTypeSelector = ({ value, onChange }: PaletteTypeSelectorProps) => {
  return (
    <div className='w-full space-y-3'>
      <Label className='text-muted-foreground flex items-center gap-2 text-xs font-medium tracking-wider uppercase'>
        <Layers className='h-3 w-3' />
        Harmonia
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className='h-10 w-full'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PALETTE_TYPES.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              <span className='font-medium'>{type.label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className='text-muted-foreground px-1 text-[10px]'>
        Define como as cores secundárias são calculadas com base na cor primária.
      </p>
    </div>
  )
}
