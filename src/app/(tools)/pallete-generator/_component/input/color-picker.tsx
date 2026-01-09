'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Copy, Hash } from 'lucide-react'
import { toast } from 'sonner'

interface ColorPickerProps {
  value: string
  onChange: (value: string) => void
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(value)
    toast.success('Código HEX copiado!')
  }

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <Label className='text-muted-foreground text-xs font-medium tracking-wider uppercase'>
          Cor Primária
        </Label>
        <button
          onClick={handleCopy}
          className='text-muted-foreground hover:text-primary flex items-center gap-1 text-xs transition-colors'>
          <Copy className='h-3 w-3' /> Copiar
        </button>
      </div>

      <div className='group relative flex flex-col gap-3'>
        {/* Visualizador de Cor Grande */}
        <div
          className='relative h-24 w-full cursor-pointer overflow-hidden rounded-xl border shadow-inner transition-all hover:shadow-md'
          style={{ backgroundColor: value }}>
          <input
            type='color'
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className='absolute inset-0 h-full w-full cursor-pointer opacity-0'
          />
          <div className='pointer-events-none absolute inset-0 bg-linear-to-t from-black/20 to-transparent' />
        </div>

        {/* Input de Texto HEX */}
        <div className='relative'>
          <div className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2'>
            <Hash className='h-4 w-4' />
          </div>
          <Input
            value={value.replace('#', '')}
            onChange={(e) => onChange(`#${e.target.value}`)}
            className='pl-9 font-mono tracking-widest uppercase'
            maxLength={7}
          />
        </div>
      </div>

      {/* Sugestões Rápidas (opcional, visual) */}
      <div className='flex gap-2 pt-1'>
        {['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'].map((color) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className='focus:ring-ring h-6 w-6 cursor-pointer rounded-full border shadow-sm transition-transform hover:scale-110 focus:ring-2 focus:ring-offset-2 focus:outline-none'
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  )
}
