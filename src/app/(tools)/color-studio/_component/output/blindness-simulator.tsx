'use client'

import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { EyeOff } from 'lucide-react'
import { useState } from 'react'

// Filtros SVG (Mantidos, apenas layout visual muda)
const FILTERS = {
  normal: [],
  protanopia: [0.567, 0.433, 0, 0, 0, 0.558, 0.442, 0, 0, 0, 0, 0.242, 0.758, 0, 0, 0, 0, 0, 1, 0],
  deuteranopia: [0.625, 0.375, 0, 0, 0, 0.7, 0.3, 0, 0, 0, 0, 0.3, 0.7, 0, 0, 0, 0, 0, 1, 0],
  tritanopia: [0.95, 0.05, 0, 0, 0, 0, 0.433, 0.567, 0, 0, 0, 0.475, 0.525, 0, 0, 0, 0, 0, 1, 0],
  achromatopsia: [
    0.299, 0.587, 0.114, 0, 0, 0.299, 0.587, 0.114, 0, 0, 0.299, 0.587, 0.114, 0, 0, 0, 0, 0, 1, 0,
  ],
}

export function BlindnessSimulator({ colors }: { colors: ColorInfo[] }) {
  const [activeFilter, setActiveFilter] = useState('protanopia')

  return (
    <Card className='overflow-hidden border-none shadow-sm ring-1 ring-slate-200 dark:ring-slate-800'>
      {/* Filtros Invisíveis */}
      <svg className='absolute h-0 w-0'>
        <defs>
          {Object.entries(FILTERS).map(
            ([key, matrix]) =>
              matrix.length > 0 && (
                <filter key={key} id={key}>
                  <feColorMatrix type='matrix' values={matrix.join(' ')} />
                </filter>
              ),
          )}
        </defs>
      </svg>

      <div className='bg-muted/30 flex items-center justify-between border-b px-4 py-3'>
        <div className='flex items-center gap-2'>
          <EyeOff className='text-muted-foreground h-4 w-4' />
          <h3 className='text-sm font-semibold'>Simulação de Visão</h3>
        </div>
        <Select value={activeFilter} onValueChange={setActiveFilter}>
          <SelectTrigger className='h-8 w-[180px] bg-white text-xs dark:bg-slate-950'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='protanopia'>Protanopia (Vermelho)</SelectItem>
            <SelectItem value='deuteranopia'>Deuteranopia (Verde)</SelectItem>
            <SelectItem value='tritanopia'>Tritanopia (Azul)</SelectItem>
            <SelectItem value='achromatopsia'>Achromatopsia (Mono)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <CardContent className='p-6'>
        <div className='space-y-8'>
          {/* Comparação Side-by-Side */}
          <div className='grid gap-6 md:grid-cols-2'>
            {/* Normal */}
            <div className='space-y-3'>
              <span className='text-muted-foreground text-xs font-medium tracking-wider uppercase'>
                Visão Normal
              </span>
              <div className='grid grid-cols-2 gap-2 sm:grid-cols-3'>
                {colors.map((c, i) => (
                  <div key={i} className='h-16 rounded-lg' style={{ backgroundColor: c.hex }} />
                ))}
              </div>
            </div>

            {/* Simulado */}
            <div className='space-y-3'>
              <span className='text-muted-foreground text-xs font-medium tracking-wider uppercase'>
                Simulação: {activeFilter}
              </span>
              <div className='grid grid-cols-2 gap-2 sm:grid-cols-3'>
                {colors.map((c, i) => (
                  <div
                    key={i}
                    className='h-16 rounded-lg transition-all'
                    style={{ backgroundColor: c.hex, filter: `url(#${activeFilter})` }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className='rounded-lg bg-blue-50 p-4 text-xs text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'>
            <strong>Dica:</strong> Certifique-se de que elementos importantes (como botões de ação
            ou alertas de erro) mantenham contraste suficiente mesmo sob a simulação. Evite depender
            apenas da cor para transmitir informações críticas.
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
