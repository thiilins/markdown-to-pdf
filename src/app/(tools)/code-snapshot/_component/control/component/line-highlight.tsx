'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import { useCodeSnapshot } from '@/shared/contexts/codeSnapshotContext'
import { Check, Highlighter, Info, Trash2, X } from 'lucide-react'
import { WidgetWrapper } from '.'

// --- Wrapper Reutilizável com os Ajustes de UX ---

export function LineHighlightControl() {
  const { config, updateConfig } = useCodeSnapshot()

  const COLORS_HIGHLIGHT = [
    { color: '#facc15', name: 'Amarelo' },
    { color: '#4ade80', name: 'Verde' },
    { color: '#60a5fa', name: 'Azul' },
    { color: '#f472b6', name: 'Rosa' },
    { color: '#fb923c', name: 'Laranja' },
    { color: '#a78bfa', name: 'Roxo' },
    { color: '#f87171', name: 'Vermelho' },
    { color: '#2dd4bf', name: 'Ciano' },
  ]

  const removeLine = (lineToRemove: number) => {
    const updatedLines = (config.highlightedLines || []).filter((line) => line !== lineToRemove)
    updateConfig('highlightedLines', updatedLines)
  }

  return (
    <WidgetWrapper
      title='Destacar Linhas'
      subtitle='Anotação Visual'
      icon={Highlighter}
      colorClass='purple'>
      {/* Box de Informação com respiro e cores temáticas */}
      <div className='flex gap-3 rounded-xl border border-purple-100/50 bg-purple-50/40 p-3.5'>
        <Info className='mt-0.5 h-4 w-4 shrink-0 text-purple-400' />
        <p className='text-[11px] leading-relaxed font-medium text-purple-700/80'>
          Clique nos números das linhas no editor para ativar ou remover o destaque visual.
        </p>
      </div>

      {/* Seleção de Cores */}
      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <Label className='text-[11px] font-bold tracking-tight text-slate-500 uppercase'>
            Cor do Marca-texto
          </Label>
          <span className='rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[9px] font-bold text-slate-500 uppercase'>
            {config.highlightColor || '#FACC15'}
          </span>
        </div>
        <div className='grid grid-cols-4 gap-3'>
          {COLORS_HIGHLIGHT.map((item) => {
            const isSelected = config.highlightColor === item.color
            return (
              <button
                key={item.color}
                onClick={() => updateConfig('highlightColor', item.color)}
                className={cn(
                  'relative flex h-8 w-full cursor-pointer items-center justify-center rounded-lg shadow-sm transition-all hover:scale-105 active:scale-90',
                  isSelected ? 'z-10 ring-2 ring-purple-500 ring-offset-2' : 'hover:opacity-90',
                )}
                style={{ backgroundColor: item.color }}
                title={item.name}>
                {isSelected && <Check className='h-4 w-4 text-white drop-shadow-sm' />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Controle de Opacidade */}
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <Label className='text-[11px] font-bold tracking-tight text-slate-500 uppercase'>
            Intensidade
          </Label>
          <span className='rounded-full bg-purple-50 px-2 py-0.5 font-mono text-[11px] font-bold text-purple-600'>
            {Math.round((config.highlightOpacity || 0.25) * 100)}%
          </span>
        </div>
        <Slider
          value={[(config.highlightOpacity || 0.25) * 100]}
          min={10}
          max={80}
          step={5}
          onValueChange={(val) => updateConfig('highlightOpacity', val[0] / 100)}
          className='py-1'
        />
      </div>

      {/* Linhas Ativas */}
      {config.highlightedLines && config.highlightedLines.length > 0 && (
        <div className='animate-in fade-in mt-2 space-y-3 border-t border-slate-100 pt-5 duration-300'>
          <div className='flex items-center justify-between'>
            <Label className='text-[11px] font-bold tracking-tight text-slate-500 uppercase'>
              Linhas Ativas ({config.highlightedLines.length})
            </Label>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => updateConfig('highlightedLines', [])}
              className='h-7 rounded-lg px-2 text-[10px] font-bold text-red-500 transition-colors hover:bg-red-50 hover:text-red-600'>
              <Trash2 className='mr-1.5 h-3.5 w-3.5' />
              Limpar tudo
            </Button>
          </div>

          <div className='flex flex-wrap gap-2'>
            {config.highlightedLines
              .sort((a: number, b: number) => a - b)
              .map((line: number) => (
                <Badge
                  key={line}
                  variant='secondary'
                  className='group/badge flex cursor-default items-center gap-1.5 border-none bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600 transition-all hover:bg-red-100 hover:text-red-700'>
                  L{line}
                  <button
                    onClick={() => removeLine(line)}
                    className='ml-0.5 rounded-full p-0.5 transition-colors hover:bg-red-200/50'>
                    <X className='h-3 w-3' />
                  </button>
                </Badge>
              ))}
          </div>
        </div>
      )}
    </WidgetWrapper>
  )
}
