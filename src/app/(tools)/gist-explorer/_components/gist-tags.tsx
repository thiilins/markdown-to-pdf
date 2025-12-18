'use client'

import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useGist } from '@/shared/contexts/gistContext'
import { Hash } from 'lucide-react'

export const GistTags = () => {
  const { allTags, selectedTags, toggleTag } = useGist()

  if (allTags.length === 0) return null

  return (
    <div className='bg-background/95 supports-[backdrop-filter]:bg-background/60 border-b py-2 backdrop-blur'>
      <div className='px-4 pb-2'>
        <p className='text-muted-foreground flex items-center gap-1 text-[10px] font-medium tracking-wider uppercase'>
          <Hash className='h-3 w-3' /> Filtros Inteligentes
        </p>
      </div>
      <ScrollArea className='w-full px-4 whitespace-nowrap'>
        <div className='flex w-max space-x-2 pb-2'>
          {allTags.map((tag) => {
            const isSelected = selectedTags.includes(tag)
            return (
              <Badge
                key={tag}
                variant={isSelected ? 'default' : 'secondary'}
                className={cn(
                  'cursor-pointer transition-all hover:opacity-80',
                  isSelected ? 'bg-primary' : 'bg-muted text-muted-foreground hover:bg-muted/80',
                )}
                onClick={() => toggleTag(tag)}>
                {tag}
              </Badge>
            )
          })}
        </div>
        <ScrollBar orientation='horizontal' className='h-2' />
      </ScrollArea>
    </div>
  )
}
