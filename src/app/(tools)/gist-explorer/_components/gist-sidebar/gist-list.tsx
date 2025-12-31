'use client'

import { TooltipComponent } from '@/components/custom-ui/tooltip'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { getIcon } from '@/shared/constants/file-icons'
import { useGist } from '@/shared/contexts/gistContext'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  ArchiveX,
  Calendar,
  FileCode2,
  GitFork,
  Lock,
  Star,
  Unlock,
} from 'lucide-react'
import moment from 'moment'
import { useMemo } from 'react'

export const GistList = () => {
  const { filteredGists, selectedGistId, onSelectGist, isLoading, error, gists } = useGist()

  if (isLoading) {
    return (
      <div className='flex flex-1 flex-col gap-3 p-4'>
        {Array.from({ length: 5 }).map((_, i) => (
          <GistItemSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex h-full flex-1 flex-col items-center justify-center p-6 text-center'>
        <div className='bg-destructive/10 rounded-full p-4'>
          <AlertCircle className='text-destructive h-8 w-8' />
        </div>
        <h3 className='mt-3 font-semibold'>Erro ao carregar</h3>
        <p className='text-muted-foreground text-xs'>Não foi possível buscar os dados.</p>
      </div>
    )
  }

  if (gists.length === 0) {
    return (
      <div className='flex h-full flex-1 flex-col items-center justify-center p-6 text-center'>
        <div className='bg-muted/50 ring-border rounded-full p-6 ring-1'>
          <ArchiveX className='text-muted-foreground/40 h-10 w-10' />
        </div>
        <h3 className='mt-4 font-semibold'>Nenhum Gist encontrado</h3>
        <p className='text-muted-foreground max-w-[200px] text-xs'>
          Sincronize sua conta ou altere os filtros de busca.
        </p>
      </div>
    )
  }

  return (
    <div className='custom-scrollbar h-full w-full overflow-y-auto p-4'>
      <motion.div layout className='flex min-h-full flex-col gap-3 pb-4'>
        <AnimatePresence mode='popLayout'>
          {filteredGists.map((gist) => (
            <GistListItem
              key={gist.id}
              gist={gist}
              isSelected={selectedGistId === gist.id}
              onClick={() => onSelectGist(gist)}
            />
          ))}
        </AnimatePresence>

        {filteredGists.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='text-muted-foreground flex flex-1 flex-col items-center justify-center py-12 text-center text-sm'>
            <FilterIcon className='mb-3 h-10 w-10 opacity-10' />
            <p>Nenhum resultado para este filtro.</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

const FilterIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className={className}>
    <polygon points='22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3' />
  </svg>
)

const GistListItem = ({ gist, isSelected = false, onClick }: any) => {
  const firstFile = gist.files[0]
  const fileCount = gist.files.length
  const createdDate = moment(gist.created_at)
  const timeAgo = formatDistanceToNow(createdDate.toISOString(), {
    addSuffix: true,
    locale: ptBR,
  })
  const MainIcon = firstFile ? getIcon(firstFile.language || '') : FileCode2

  // Configuração dinâmica de cores baseada no status
  const config = useMemo(() => {
    if (gist.public) {
      return {
        // Status Colors (Emerald)
        border: 'group-hover:border-emerald-500/30 border-emerald-500/20 bg-emerald-500/10',
        shadow: 'group-hover:shadow-[0_4px_20px_-12px_rgba(16,185,129,0.3)]',
        iconBg: 'bg-emerald-500/10',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        barColor: 'bg-emerald-500',
        statusIcon: Unlock,
        label: 'Public',
      }
    }
    return {
      // Status Colors (Amber)
      border: 'group-hover:border-amber-500/30 border-amber-500/20 bg-amber-500/10',
      shadow: 'group-hover:shadow-[0_4px_20px_-12px_rgba(245,158,11,0.3)]',
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-600 dark:text-amber-400',
      barColor: 'bg-amber-500',
      statusIcon: Lock,
      label: 'Private',
    }
  }, [gist.public])

  const StatusIcon = config.statusIcon

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className={cn(
        'group relative w-full shrink-0 cursor-pointer overflow-hidden rounded-xl border transition-all duration-300 ease-out',
        isSelected
          ? 'border-primary/40 bg-background ring-primary/10 shadow-lg ring-1'
          : `bg-card hover:bg-background ${config.border} ${config.shadow}`,
      )}>
      {/* Background Gradient Effect (Selected) */}
      {isSelected && (
        <div className='from-primary/5 absolute inset-0 bg-linear-to-r via-transparent to-transparent opacity-100' />
      )}

      {/* Hover Light Effect */}
      <div
        className={cn(
          'absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100',
          !isSelected && 'bg-gradient-to-br from-white/5 to-transparent dark:from-white/5',
        )}
      />

      {/* Left Status Bar (Accent) */}
      <div
        className={cn(
          'absolute top-0 bottom-0 left-0 w-1 transition-all duration-300',
          isSelected
            ? 'bg-primary'
            : `${config.barColor}/40 group-hover:w-1.5 group-hover:${config.barColor}`,
        )}
      />

      <div className='relative z-10 flex flex-col gap-3 p-3 pl-5'>
        {/* Header Section */}
        <div className='flex items-start justify-between gap-3'>
          <div className='flex min-w-0 flex-1 items-start gap-3'>
            {/* Main Icon Box */}
            <div className='relative shrink-0 pt-0.5'>
              <div
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-xl border shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md',
                  isSelected
                    ? 'border-primary/20 bg-background text-primary'
                    : `border-border/40 bg-background ${config.iconColor}`,
                )}>
                <MainIcon className='h-6 w-6' />
              </div>
              {/* Status Badge Mini */}
              <div
                className={cn(
                  'border-background absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full border shadow-sm',
                  config.iconBg,
                  config.iconColor,
                )}>
                <StatusIcon className='h-2.5 w-2.5' />
              </div>
            </div>

            {/* Title & Metadata */}
            <div className='flex min-w-0 flex-col gap-1'>
              <h3
                className={cn(
                  'truncate font-mono text-sm font-semibold tracking-tight transition-colors',
                  isSelected ? 'text-primary' : 'text-foreground',
                )}>
                {firstFile?.filename || 'Untitled Gist'}
              </h3>

              <div className='text-muted-foreground flex items-center gap-2 text-[11px]'>
                <span className='text-foreground/80 font-medium'>
                  {gist.owner?.login || 'Anonymous'}
                </span>
                <span className='bg-muted-foreground/40 h-0.5 w-0.5 rounded-full' />
                <span className='flex items-center gap-1'>
                  <Calendar className='h-3 w-3 opacity-70' />
                  {timeAgo}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description (Optional) */}
        {gist.description && (
          <p className='text-muted-foreground/80 line-clamp-2 pl-1 text-xs leading-relaxed'>
            {gist.description}
          </p>
        )}

        {/* Footer: Tech Stack & Stats */}
        <div className='border-border/30 mt-1 flex items-center justify-between border-t pt-2.5'>
          {/* File Avatars */}
          <div className='flex items-center -space-x-2 pl-1'>
            {gist.files.slice(0, 4).map((file: any, index: number) => {
              const FileIcon = getIcon(file.language || '')
              return (
                <TooltipComponent
                  key={`${file.filename}-${index}`}
                  content={file.language || 'Plain Text'}>
                  <div className='border-background bg-muted text-muted-foreground hover:border-primary/20 hover:text-primary relative z-0 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-200 hover:z-10 hover:scale-110'>
                    <FileIcon className='h-3 w-3' />
                  </div>
                </TooltipComponent>
              )
            })}
            {fileCount > 4 && (
              <div className='border-background bg-muted text-muted-foreground relative z-0 flex h-6 w-6 items-center justify-center rounded-full border-2 text-[9px] font-bold'>
                +{fileCount - 4}
              </div>
            )}
          </div>

          {/* Badges Right */}
          <div className='flex items-center gap-2'>
            {/* Fake Stats for "Aliveness" */}
            <div className='text-muted-foreground/60 flex items-center gap-1 text-[10px]'>
              <GitFork className='h-3 w-3' />
              <span>0</span>
              <Star className='ml-1 h-3 w-3' />
              <span>0</span>
            </div>

            {/* Status Pill */}
            <div
              className={cn(
                'rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase',
                config.iconBg,
                config.iconColor,
              )}>
              {config.label}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export const GistItemSkeleton = () => {
  return (
    <div className='bg-muted/10 relative w-full overflow-hidden rounded-xl border border-transparent p-4'>
      <div className='mb-4 flex gap-4'>
        <Skeleton className='h-11 w-11 shrink-0 rounded-xl' />
        <div className='flex-1 space-y-2 py-0.5'>
          <Skeleton className='h-4 w-3/4' />
          <Skeleton className='h-3 w-1/3' />
        </div>
      </div>
      <Skeleton className='mb-4 h-3 w-full opacity-70' />
      <div className='border-border/50 flex items-center justify-between border-t pt-3'>
        <div className='flex -space-x-2'>
          <Skeleton className='border-background h-6 w-6 rounded-full border-2' />
          <Skeleton className='border-background h-6 w-6 rounded-full border-2' />
          <Skeleton className='border-background h-6 w-6 rounded-full border-2' />
        </div>
        <Skeleton className='h-4 w-16 rounded-full' />
      </div>
    </div>
  )
}
