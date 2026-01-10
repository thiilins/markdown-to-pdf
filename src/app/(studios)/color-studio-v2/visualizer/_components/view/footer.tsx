import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import chroma from 'chroma-js'
import { motion } from 'framer-motion'
import {
  ChevronDown,
  Download,
  Lock,
  LockOpen,
  Minus,
  Plus,
  RefreshCcw,
  Shuffle,
  Undo,
} from 'lucide-react'
import { useMemo } from 'react'
import { ColorPicker } from '../../../_shared/components/ColorPicker'

interface VisualizerFooterProps {
  colors: GeneratorColor[]
  handleColorChange: (id: string, hex: string) => void
  removeColor: (id: string) => void
  toggleLock: (id: string) => void
  addColor: () => void
  handleShuffle: () => void
  generate: () => void
}

const PaletteItem = ({
  color,
  index,
  onChange,
  onToggleLock,
  cols,
}: {
  cols: number
  color: GeneratorColor
  index: number
  onChange: (id: string, hex: string) => void
  onToggleLock: (id: string) => void
}) => {
  const iconColor = useMemo(
    () => (chroma.contrast(color.hex, 'white') > 2.2 ? 'white' : 'black'),
    [color],
  )

  const width = 100 / cols
  const style = {
    width: `${width}%`,
  }
  return (
    <div className='group relative h-12 overflow-hidden' style={style}>
      <Popover>
        <PopoverTrigger asChild>
          {/* Motion.div apenas para a transição suave de cor, sem alterar layout */}
          <motion.button
            animate={{ backgroundColor: color.hex }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className='h-full w-full cursor-pointer transition-transform outline-none active:scale-95'
            type='button'
          />
        </PopoverTrigger>
        <PopoverContent
          side='top'
          align='center'
          sideOffset={20}
          className='border-none bg-transparent! p-0 shadow-none'>
          <ColorPicker color={color.hex} onChange={(c) => onChange(color.id, c)} />
        </PopoverContent>
      </Popover>

      <div className='pointer-events-none absolute top-[4px] flex'>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleLock(color.id)
          }}
          className={cn(
            'pointer-events-auto flex h-5 w-5 cursor-pointer items-center justify-center rounded-full transition-all',
            color.locked ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 hover:bg-black/10',
          )}
          style={{ color: iconColor }}
          type='button'>
          {color.locked ? (
            <Lock size={10} strokeWidth={2.5} />
          ) : (
            <LockOpen size={10} strokeWidth={2.5} />
          )}
        </button>
      </div>
    </div>
  )
}

export const VisualizerFooter = ({
  colors,
  handleColorChange,
  removeColor,
  toggleLock,
  addColor,
  handleShuffle,
  generate,
}: VisualizerFooterProps) => {
  const canAdd = colors.length < 10
  const canRemove = colors.length > 2

  return (
    <footer className='fixed right-0 bottom-0 left-0 z-50 border-t border-neutral-200 bg-white/95 px-6 py-3 backdrop-blur-md dark:border-neutral-800 dark:bg-[#0a0a0a]/95'>
      <div className='mx-auto flex max-w-[1600px] items-center justify-between'>
        {/* ESQUERDA: Paleta Estática */}
        <div className='flex items-center gap-3'>
          <div className='flex h-12 w-[450px] max-w-[450px] items-center overflow-hidden rounded-xl bg-neutral-100 ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10'>
            {colors.map((color, index) => (
              <PaletteItem
                // KEY ESTÁVEL (Apenas o index): Isso impede que a barra "pule" ao dar shuffle
                key={`slot-${index}`}
                cols={colors?.length}
                index={index}
                color={color}
                onChange={handleColorChange}
                onToggleLock={toggleLock}
              />
            ))}
          </div>

          {/* Controles de Quantidade (Min 2 - Max 10) */}
          <div className='flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900'>
            <button
              onClick={addColor}
              disabled={!canAdd}
              className='flex h-6 w-8 cursor-pointer items-center justify-center text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-black disabled:opacity-30 disabled:hover:bg-transparent dark:hover:bg-neutral-800'>
              <Plus size={14} />
            </button>
            <div className='h-px bg-neutral-200 dark:bg-neutral-800' />
            <button
              onClick={() => removeColor(colors[colors.length - 1].id)}
              disabled={!canRemove}
              className='flex h-6 w-8 cursor-pointer items-center justify-center text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-black disabled:opacity-30 disabled:hover:bg-transparent dark:hover:bg-neutral-800'>
              <Minus size={14} />
            </button>
          </div>
        </div>

        {/* DIREITA: Ações de Toolbar */}
        <div className='flex items-center gap-2'>
          <div className='hidden items-center gap-1 md:flex'>
            <Button
              variant='ghost'
              size='icon'
              className='h-10 w-10 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900'>
              <Undo size={18} className='text-neutral-500' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              onClick={handleShuffle}
              className='h-10 w-10 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900'>
              <Shuffle size={18} className='text-neutral-500' />
            </Button>
          </div>

          <div className='mx-2 h-8 w-px bg-neutral-200 dark:bg-neutral-800' />

          {/* Botão Generate Compacto */}
          <div className='flex items-center overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950'>
            <button
              onClick={generate}
              className='flex h-10 cursor-pointer items-center gap-2 px-4 text-sm font-bold transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900'>
              <RefreshCcw size={15} />
              Generate
            </button>
            <div className='h-10 w-px bg-neutral-200 dark:bg-neutral-800' />
            <button className='flex h-10 cursor-pointer items-center px-2 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900'>
              <ChevronDown size={16} />
            </button>
          </div>

          <Button className='h-10 cursor-pointer rounded-xl bg-blue-600 px-6 font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95'>
            <Download size={18} className='mr-2' />
            Export
          </Button>
        </div>
      </div>
    </footer>
  )
}
