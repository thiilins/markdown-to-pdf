'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Clock, Heart, History, Share2, Trash2, X } from 'lucide-react'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import type { PaletteType } from '../constants'
import type { PaletteHistoryItem } from '../hooks/use-palette-history'

interface HistoryDrawerProps {
  history: PaletteHistoryItem[]
  favorites: Set<string>
  onToggleFavorite: (id: string) => void
  onRemove: (id: string) => void
  onClear: () => void
  onRestore: (colors: ColorInfo[], type: PaletteType, baseColor: string) => void
  onShare: (item: PaletteHistoryItem) => void
}

export function HistoryDrawer({
  history,
  favorites,
  onToggleFavorite,
  onRemove,
  onClear,
  onRestore,
  onShare,
}: HistoryDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState<'all' | 'favorites'>('all')

  const filteredHistory =
    filter === 'favorites' ? history.filter((item) => favorites.has(item.id)) : history

  const handleRestore = useCallback(
    (item: PaletteHistoryItem) => {
      onRestore(item.colors, item.type, item.baseColor)
      setIsOpen(false)
      toast.success('Paleta restaurada!')
    },
    [onRestore],
  )

  const handleShare = useCallback(
    (item: PaletteHistoryItem) => {
      onShare(item)
      toast.success('Link copiado!')
    },
    [onShare],
  )

  const handleClear = useCallback(() => {
    if (confirm('Tem certeza que deseja limpar o histórico? (Favoritos serão mantidos)')) {
      onClear()
      toast.success('Histórico limpo!')
    }
  }, [onClear])

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant='outline' size='sm' className='gap-2'>
          <History className='h-4 w-4' />
          Histórico
          {history.length > 0 && (
            <Badge variant='secondary' className='ml-1 h-5 px-1.5 text-xs'>
              {history.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side='right' className='w-full sm:max-w-md'>
        <SheetHeader>
          <SheetTitle className='flex items-center gap-2'>
            <History className='h-5 w-5' />
            Paletas Recentes
          </SheetTitle>
          <SheetDescription>
            Acesse suas paletas anteriores ou favoritas. Clique para restaurar.
          </SheetDescription>
        </SheetHeader>

        <div className='mt-6 space-y-4'>
          {/* Filtros */}
          <div className='flex gap-2'>
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setFilter('all')}
              className='flex-1 gap-2'>
              <Clock className='h-3 w-3' />
              Todas ({history.length})
            </Button>
            <Button
              variant={filter === 'favorites' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setFilter('favorites')}
              className='flex-1 gap-2'>
              <Heart className='h-3 w-3' />
              Favoritas ({favorites.size})
            </Button>
          </div>

          {/* Botão Limpar */}
          {history.length > 0 && (
            <Button
              variant='ghost'
              size='sm'
              onClick={handleClear}
              className='w-full gap-2 text-red-500 hover:bg-red-50 hover:text-red-600'>
              <Trash2 className='h-3 w-3' />
              Limpar Histórico
            </Button>
          )}

          {/* Lista de Paletas */}
          <ScrollArea className='h-[calc(100vh-280px)]'>
            {filteredHistory.length === 0 ? (
              <div className='text-muted-foreground flex flex-col items-center justify-center py-12 text-center'>
                <History className='mb-3 h-12 w-12 opacity-20' />
                <p className='text-sm'>
                  {filter === 'favorites'
                    ? 'Nenhuma paleta favorita ainda'
                    : 'Nenhuma paleta no histórico'}
                </p>
              </div>
            ) : (
              <div className='space-y-3'>
                {filteredHistory.map((item) => (
                  <PaletteHistoryCard
                    key={item.id}
                    item={item}
                    isFavorite={favorites.has(item.id)}
                    onToggleFavorite={onToggleFavorite}
                    onRemove={onRemove}
                    onRestore={handleRestore}
                    onShare={handleShare}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
}

interface PaletteHistoryCardProps {
  item: PaletteHistoryItem
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
  onRemove: (id: string) => void
  onRestore: (item: PaletteHistoryItem) => void
  onShare: (item: PaletteHistoryItem) => void
}

function PaletteHistoryCard({
  item,
  isFavorite,
  onToggleFavorite,
  onRemove,
  onRestore,
  onShare,
}: PaletteHistoryCardProps) {
  const timeAgo = getTimeAgo(item.timestamp)

  return (
    <div className='group bg-card relative overflow-hidden rounded-lg border transition-all hover:shadow-md'>
      {/* Preview das Cores */}
      <div
        className='flex h-16 cursor-pointer'
        onClick={() => onRestore(item)}
        title='Clique para restaurar'>
        {item.colors.map((color, i) => (
          <div
            key={i}
            className='flex-1 transition-transform group-hover:scale-105'
            style={{ backgroundColor: color.hex }}
          />
        ))}
      </div>

      {/* Info */}
      <div className='space-y-2 p-3'>
        <div className='flex items-start justify-between gap-2'>
          <div className='flex-1'>
            <div className='flex items-center gap-2'>
              <Badge variant='outline' className='text-xs'>
                {item.type}
              </Badge>
              <span className='text-muted-foreground text-xs'>{timeAgo}</span>
            </div>
            <p className='text-muted-foreground mt-1 font-mono text-xs'>{item.baseColor}</p>
          </div>

          {/* Ações */}
          <div className='flex gap-1'>
            <Button
              size='icon'
              variant='ghost'
              className='h-7 w-7'
              onClick={() => onToggleFavorite(item.id)}
              title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}>
              <Heart className={`h-3 w-3 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button
              size='icon'
              variant='ghost'
              className='h-7 w-7'
              onClick={() => onShare(item)}
              title='Compartilhar'>
              <Share2 className='h-3 w-3' />
            </Button>
            <Button
              size='icon'
              variant='ghost'
              className='h-7 w-7 text-red-500 hover:bg-red-50 hover:text-red-600'
              onClick={() => onRemove(item.id)}
              title='Remover'>
              <X className='h-3 w-3' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)

  if (seconds < 60) return 'agora'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m atrás`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h atrás`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d atrás`
  return new Date(timestamp).toLocaleDateString('pt-BR')
}
