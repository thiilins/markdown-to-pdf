'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import chroma from 'chroma-js'
import { Check } from 'lucide-react'
import { useState } from 'react'

interface ShadesPickerProps {
  baseHex: string
  currentHex: string
  isOpen: boolean
  onClose: () => void
  onSelectShade: (hex: string) => void
}

export function ShadesPicker({
  baseHex,
  currentHex,
  isOpen,
  onClose,
  onSelectShade,
}: ShadesPickerProps) {
  const [selectedShade, setSelectedShade] = useState(currentHex)

  // Gera 21 variações (10 mais claras, base, 10 mais escuras)
  const generateShades = () => {
    const shades: Array<{ hex: string; label: string }> = []
    const baseColor = chroma(baseHex)

    // 10 tons mais claros
    for (let i = 10; i >= 1; i--) {
      const lightness = baseColor.get('hsl.l') + (i * 0.06)
      const shade = baseColor.set('hsl.l', Math.min(lightness, 0.98))
      shades.push({
        hex: shade.hex(),
        label: `+${i * 10}%`,
      })
    }

    // Cor base
    shades.push({
      hex: baseColor.hex(),
      label: 'Base',
    })

    // 10 tons mais escuros
    for (let i = 1; i <= 10; i++) {
      const lightness = baseColor.get('hsl.l') - (i * 0.06)
      const shade = baseColor.set('hsl.l', Math.max(lightness, 0.02))
      shades.push({
        hex: shade.hex(),
        label: `-${i * 10}%`,
      })
    }

    return shades
  }

  const shades = generateShades()

  const handleSelect = (hex: string) => {
    setSelectedShade(hex)
  }

  const handleConfirm = () => {
    onSelectShade(selectedShade)
    onClose()
  }

  const getBestTextColor = (hex: string) => {
    return chroma(hex).luminance() > 0.5 ? '#000000' : '#FFFFFF'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Escolha uma variação</DialogTitle>
        </DialogHeader>

        <ScrollArea className='h-[500px] pr-4'>
          <div className='space-y-1'>
            {shades.map((shade, index) => {
              const isSelected = selectedShade === shade.hex
              const textColor = getBestTextColor(shade.hex)
              const isBase = shade.label === 'Base'

              return (
                <button
                  key={index}
                  onClick={() => handleSelect(shade.hex)}
                  className='relative flex h-16 w-full items-center justify-between rounded-lg border-2 transition-all hover:scale-[1.02]'
                  style={{
                    backgroundColor: shade.hex,
                    borderColor: isSelected ? '#3B82F6' : 'transparent',
                  }}>
                  <div
                    className='flex items-center gap-3 px-4'
                    style={{ color: textColor }}>
                    {isSelected && <Check className='h-5 w-5' />}
                    <div className='text-left'>
                      <div className='text-sm font-semibold'>
                        {shade.hex.toUpperCase()}
                      </div>
                      <div className='text-xs opacity-70'>
                        {isBase ? 'Cor Original' : shade.label}
                      </div>
                    </div>
                  </div>

                  {isBase && (
                    <div
                      className='mr-4 rounded-full bg-black/20 px-2 py-1 text-xs font-medium backdrop-blur-sm'
                      style={{ color: textColor }}>
                      Original
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </ScrollArea>

        <div className='flex gap-2'>
          <Button variant='outline' onClick={onClose} className='flex-1'>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} className='flex-1'>
            Aplicar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
