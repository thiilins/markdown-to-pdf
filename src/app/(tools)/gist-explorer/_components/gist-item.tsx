'use client'

import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import { Calendar, Globe, Lock } from 'lucide-react'

export const GistItem = ({ gist, isSelected = false, onClick }: GistItemProps) => {
  const firstFile = gist.files[0]
  const fileCount = gist.files.length
  const createdDate = new Date(gist.created_at)
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true, locale: ptBR })

  return (
    <div
      onClick={onClick}
      className={cn(
        'group bg-card hover:border-primary/50 h-full cursor-pointer rounded-lg border p-4 transition-all hover:shadow-sm',
        isSelected && 'border-primary bg-accent/50',
      )}>
      <GistItemCardHeader
        filename={firstFile?.filename || 'Sem nome'}
        fileCount={fileCount}
        isPublic={gist.public}
      />
      {/* Description */}
      {gist.description && (
        <p className='text-muted-foreground mb-3 line-clamp-2 text-xs leading-relaxed text-wrap text-ellipsis'>
          {gist.description}
        </p>
      )}

      {/* Metadata */}
      <div className='text-muted-foreground mb-3 flex items-center gap-2 text-xs'>
        <Calendar className='h-3 w-3' />
        <span>{timeAgo}</span>
        {gist.owner?.login && (
          <>
            <span>•</span>
            <span className='truncate'>{gist.owner.login}</span>
          </>
        )}
      </div>

      {/* Languages */}
      <div className='flex flex-wrap gap-1.5'>
        {gist.files.slice(0, 3).map((file) => (
          <Badge
            key={file.filename}
            variant='secondary'
            className='px-1.5 py-0.5 text-[10px] font-medium'>
            {file.language || 'Text'}
          </Badge>
        ))}
        {gist.files.length > 3 && (
          <Badge variant='secondary' className='px-1.5 py-0.5 text-[10px] font-medium'>
            +{gist.files.length - 3}
          </Badge>
        )}
      </div>
    </div>
  )
}
const GistItemCardHeader = ({
  filename,
  fileCount,
  isPublic,
}: {
  filename: string
  fileCount: number
  isPublic: boolean
}) => {
  return (
    <div className='mb-2 flex items-start justify-between gap-2'>
      <div className='min-w-0 flex-1'>
        <h3 className='text-foreground truncate text-sm font-semibold'>{filename || 'Sem nome'}</h3>
        {fileCount > 1 && (
          <p className='text-muted-foreground text-xs'>+{fileCount - 1} arquivo(s)</p>
        )}
      </div>
      {<StatusIcon isPublic={isPublic} />}
    </div>
  )
}
export const GistItemSkeleton = () => {
  return (
    <div className='bg-card rounded-lg border p-4'>
      <div className='mb-2 flex items-start justify-between'>
        <Skeleton className='h-4 w-32' />
        <Skeleton className='h-4 w-4 rounded-full' />
      </div>
      <Skeleton className='mb-3 h-3 w-full' />
      <Skeleton className='mb-3 h-3 w-2/3' />
      <div className='mb-3 flex gap-2'>
        <Skeleton className='h-3 w-16' />
        <Skeleton className='h-3 w-20' />
      </div>
      <div className='flex gap-1.5'>
        <Skeleton className='h-5 w-16 rounded-full' />
        <Skeleton className='h-5 w-20 rounded-full' />
        <Skeleton className='h-5 w-14 rounded-full' />
      </div>
    </div>
  )
}

const StatusIcon = ({ isPublic }: { isPublic: boolean }) => {
  const Icon = isPublic ? Globe : Lock
  return (
    <div className='flex shrink-0 items-center gap-1'>
      <Icon className={cn('h-4 w-4', isPublic ? 'text-muted-foreground' : 'text-amber-500')} />
      <span className={cn('text-[13px]', isPublic ? 'text-muted-foreground' : 'text-amber-500')}>
        {isPublic ? 'Público' : 'Privado'}
      </span>
    </div>
  )
}
