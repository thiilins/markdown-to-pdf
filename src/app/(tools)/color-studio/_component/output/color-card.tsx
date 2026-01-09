'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import chroma from 'chroma-js'
import { Check, Copy, Palette } from 'lucide-react'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

interface ColorCardProps {
  color: ColorInfo
  index: number
  onColorEdit?: (index: number, newHex: string) => void
}

export function ColorCard({ color, index, onColorEdit }: ColorCardProps) {
  const [copied, setCopied] = useState(false)
  const [isEditingColor, setIsEditingColor] = useState(false)

  // Cálculo de contraste para o badge
  const bestTextColor = chroma.contrast(color.hex, 'white') > 4.5 ? 'white' : 'black'
  const contrastRatio = chroma.contrast(color.hex, bestTextColor).toFixed(1)

  // Calcula OKLCH
  const oklch = chroma(color.hex).oklch()
  const oklchString = `${(oklch[0] * 100).toFixed(1)}% ${oklch[1].toFixed(3)} ${oklch[2] ? oklch[2].toFixed(1) : '0'}`

  const handleCopy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('Cor copiada!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Erro ao copiar')
    }
  }, [])

  const handleColorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newColor = e.target.value
      if (onColorEdit && chroma.valid(newColor)) {
        onColorEdit(index, newColor)
      }
    },
    [index, onColorEdit],
  )

  return (
    <div className='group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 transition-all hover:-translate-y-1 hover:shadow-md dark:bg-slate-900 dark:ring-slate-800'>
      {/* Área Visual da Cor */}
      <div
        className='relative h-32 w-full cursor-pointer'
        style={{ backgroundColor: color.hex }}
        onClick={() => handleCopy(color.hex)}>
        {/* Overlay de Hover com Ação */}
        <div className='absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100'>
          <Button
            variant='secondary'
            size='sm'
            className='h-8 gap-1.5 rounded-full px-3 text-xs font-medium shadow-lg'>
            {copied ? <Check className='h-3.5 w-3.5' /> : <Copy className='h-3.5 w-3.5' />}
            {copied ? 'Copiado' : 'Copiar HEX'}
          </Button>
        </div>

        {/* Badge Informativo Flutuante */}
        <div
          className='absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-bold shadow-sm'
          style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: 'black' }}>
          <span
            className='h-1.5 w-1.5 rounded-full'
            style={{ backgroundColor: bestTextColor === 'white' ? '#000' : color.hex }}
          />
          <span>{contrastRatio}:1</span>
        </div>
      </div>

      {/* Dados Técnicos */}
      <div className='flex flex-col gap-2 p-3'>
        {/* Nome da Cor (Apenas Exibição) */}
        <div className='flex items-center gap-2'>
          <span className='flex-1 text-sm font-semibold text-slate-700 dark:text-slate-300'>
            {color.name}
          </span>
          {onColorEdit && (
            <Button
              variant='ghost'
              size='sm'
              className='h-6 w-6 p-0'
              onClick={() => setIsEditingColor(!isEditingColor)}
              title='Editar cor'>
              <Palette className='h-3.5 w-3.5' />
            </Button>
          )}
        </div>

        {/* Input de Edição de Cor */}
        {isEditingColor && onColorEdit && (
          <div className='flex items-center gap-2'>
            <Input
              type='color'
              value={color.hex}
              onChange={handleColorChange}
              className='h-8 w-full cursor-pointer'
            />
            <Input
              type='text'
              value={color.hex}
              onChange={handleColorChange}
              className='h-8 flex-1 font-mono text-xs'
              placeholder='#000000'
            />
          </div>
        )}

        <div className='flex items-baseline justify-between'>
          <span className='font-mono text-xs font-bold tracking-wider text-slate-900 uppercase dark:text-slate-100'>
            {color.hex}
          </span>
          <span className='text-[10px] font-medium text-slate-400'>#{index + 1}</span>
        </div>

        <div className='flex flex-col gap-1 text-[10px] text-slate-500'>
          <div className='flex gap-2'>
            <span
              className='cursor-pointer hover:text-slate-900 dark:hover:text-slate-100'
              onClick={() => handleCopy(color.rgb)}
              title='Clique para copiar RGB'>
              RGB {color.rgb.replace('rgb', '').replace(/[()]/g, '')}
            </span>
          </div>
          <div className='flex gap-2'>
            <span
              className='cursor-pointer hover:text-slate-900 dark:hover:text-slate-100'
              onClick={() => handleCopy(color.hsl)}
              title='Clique para copiar HSL'>
              HSL {color.hsl.replace('hsl', '').replace(/[(),]/g, ' ').trim()}
            </span>
          </div>
          <div className='flex gap-2'>
            <span
              className='cursor-pointer hover:text-slate-900 dark:hover:text-slate-100'
              onClick={() => handleCopy(oklchString)}
              title='Clique para copiar OKLCH'>
              OKLCH {oklchString}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
