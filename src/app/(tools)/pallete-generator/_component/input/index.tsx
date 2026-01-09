'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { SlidersHorizontal } from 'lucide-react'
import type { MoodType, PaletteType } from '../constants'
import type { PaletteHistoryItem } from '../hooks/use-palette-history'
import { ColorPicker } from './color-picker'
import { HistoryDrawer } from './history-drawer'
import { ImageUpload } from './image-upload'
import { MoodSelector } from './mood-selector'
import { PaletteTypeSelector } from './palette-type-selector'

interface PaletteInputProps {
  baseColor: string
  onBaseColorChange: (color: string) => void
  paletteType: PaletteType
  onPaletteTypeChange: (type: PaletteType) => void
  mood: MoodType | null
  onMoodChange: (mood: MoodType | null) => void
  onColorsExtracted: (colors: string[]) => void
  // Histórico
  history: PaletteHistoryItem[]
  favorites: Set<string>
  onToggleFavorite: (id: string) => void
  onRemoveFromHistory: (id: string) => void
  onClearHistory: () => void
  onRestorePalette: (colors: ColorInfo[], type: PaletteType, baseColor: string) => void
  onSharePalette: (item: PaletteHistoryItem) => void
}

export function PaletteInput({
  baseColor,
  onBaseColorChange,
  paletteType,
  onPaletteTypeChange,
  mood,
  onMoodChange,
  onColorsExtracted,
  history,
  favorites,
  onToggleFavorite,
  onRemoveFromHistory,
  onClearHistory,
  onRestorePalette,
  onSharePalette,
}: PaletteInputProps) {
  return (
    <div className='space-y-6'>
      {/* Botão de Histórico */}
      <div className='flex justify-end'>
        <HistoryDrawer
          history={history}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
          onRemove={onRemoveFromHistory}
          onClear={onClearHistory}
          onRestore={onRestorePalette}
          onShare={onSharePalette}
        />
      </div>

      {/* Seção Principal: Cor Base */}
      <Card className='overflow-hidden border-none shadow-md ring-1 ring-slate-200 dark:ring-slate-800'>
        <CardContent className='p-0'>
          <div className='bg-muted/30 border-b px-4 py-3'>
            <h2 className='flex items-center gap-2 text-sm font-semibold'>
              <SlidersHorizontal className='text-primary h-4 w-4' />
              Configuração Base
            </h2>
          </div>

          <div className='space-y-6 p-5'>
            <ColorPicker value={baseColor} onChange={onBaseColorChange} />

            <div className='space-y-4'>
              <PaletteTypeSelector value={paletteType} onChange={onPaletteTypeChange} />
            </div>

            <Separator />

            <MoodSelector value={mood} onChange={onMoodChange} />
          </div>
        </CardContent>
      </Card>

      {/* Seção Secundária: Extração */}
      <Card className='border-none shadow-sm ring-1 ring-slate-200 dark:ring-slate-800'>
        <CardContent className='p-5'>
          <ImageUpload onColorsExtracted={onColorsExtracted} />
        </CardContent>
      </Card>
    </div>
  )
}
