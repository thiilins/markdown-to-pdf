'use client'

import { TooltipComponent } from '@/components/custom-ui/tooltip'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import { Calendar, FileCode2, Globe, Lock, User } from 'lucide-react'
import { getIcon } from './gist-preview/icons'

export const GistItem = ({ gist, isSelected = false, onClick }: GistItemProps) => {
  const firstFile = gist.files[0]
  const fileCount = gist.files.length
  const createdDate = new Date(gist.created_at)
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true, locale: ptBR })

  // Define o ícone principal
  const MainIcon = firstFile ? getIcon(firstFile.language || '') : FileCode2

  // Configurações de Cores baseadas no status
  const statusConfig = gist.public
    ? {
        color: 'bg-emerald-500',
        text: 'text-emerald-600',
        bgSoft: 'bg-emerald-500/10',
        border: 'group-hover:border-emerald-500/30',
      }
    : {
        color: 'bg-amber-500',
        text: 'text-amber-600',
        bgSoft: 'bg-amber-500/10',
        border: 'group-hover:border-amber-500/30',
      }

  return (
    <div
      onClick={onClick}
      className={cn(
        // shrink-0: IMPEDE que o card seja esmagado
        // relative: Para posicionar a barra colorida
        // overflow-hidden: Garante que nada saia das bordas arredondadas
        'group bg-card relative w-full shrink-0 cursor-pointer overflow-hidden rounded-xl border p-4 transition-all duration-200 hover:shadow-md',
        isSelected ? 'ring-primary border-primary ring-2 ring-offset-1' : statusConfig.border,
      )}>
      {/* Barra Lateral Colorida (Fixa o bug visual da borda torta) */}
      <div className={cn('absolute top-0 bottom-0 left-0 w-1.5', statusConfig.color)} />

      {/* Cabeçalho */}
      <div className='mb-3 flex items-start gap-3 pl-2'>
        {' '}
        {/* pl-2 para afastar da barra colorida */}
        {/* Ícone com fundo suave */}
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg shadow-sm transition-colors',
            statusConfig.bgSoft,
            statusConfig.text,
          )}>
          <MainIcon className='h-5 w-5' />
        </div>
        <div className='min-w-0 flex-1'>
          <div className='flex items-center justify-between gap-2'>
            <h3 className='text-foreground group-hover:text-primary truncate font-semibold transition-colors'>
              {firstFile?.filename || 'Sem nome'}
            </h3>
            {/* Badge de Status sutil */}
            <div
              className={cn(
                'flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium',
                statusConfig.bgSoft,
                statusConfig.text,
              )}>
              {gist.public ? <Globe className='h-3 w-3' /> : <Lock className='h-3 w-3' />}
              {gist.public ? 'Público' : 'Privado'}
            </div>
          </div>

          <div className='text-muted-foreground mt-1 flex items-center gap-2 text-xs'>
            <span className='flex items-center gap-1'>
              <Calendar className='h-3 w-3' />
              {timeAgo}
            </span>
            {fileCount > 1 && (
              <>
                <span>•</span>
                <span>+{fileCount - 1} arquivo(s)</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Descrição (opcional, se não tiver esconde) */}
      {gist.description && (
        <p className='text-muted-foreground mb-4 line-clamp-2 pl-2 text-xs leading-relaxed'>
          {gist.description}
        </p>
      )}

      {/* Rodapé: Autor e Tecnologias */}
      <div className='mt-auto flex items-center justify-between border-t pt-3 pl-2'>
        <div className='text-muted-foreground flex items-center gap-1.5 text-xs font-medium'>
          <User className='h-3.5 w-3.5' />
          <span className='max-w-[100px] truncate'>{gist.owner?.login || 'Anônimo'}</span>
        </div>

        {/* Lista de ícones dos arquivos */}
        <div className='flex items-center -space-x-2 transition-all duration-300 hover:space-x-1'>
          {gist.files.slice(0, 4).map((file, index) => {
            const FileIcon = getIcon(file.language || '')
            return (
              <TooltipComponent
                key={`${file.filename}-${index}`}
                content={file.language || 'Texto'}>
                <div className='bg-background hover:border-primary relative flex h-6 w-6 items-center justify-center rounded-full border shadow-sm hover:z-10 hover:scale-110'>
                  <FileIcon className='text-muted-foreground h-3.5 w-3.5' />
                </div>
              </TooltipComponent>
            )
          })}
          {gist.files.length > 4 && (
            <div className='bg-muted text-muted-foreground z-10 flex h-6 w-6 items-center justify-center rounded-full border text-[9px] font-bold'>
              +{gist.files.length - 4}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const GistItemSkeleton = () => {
  return (
    <div className='bg-card w-full shrink-0 rounded-xl border p-4'>
      {/* Skeleton content... */}
      <div className='mb-3 flex gap-3'>
        <Skeleton className='h-10 w-10 rounded-lg' />
        <div className='flex-1 space-y-2'>
          <Skeleton className='h-4 w-3/4' />
          <Skeleton className='h-3 w-1/2' />
        </div>
      </div>
      <Skeleton className='mb-2 h-3 w-full' />
      <Skeleton className='h-3 w-2/3' />
    </div>
  )
}
