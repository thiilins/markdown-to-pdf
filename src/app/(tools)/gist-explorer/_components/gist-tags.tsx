import { Badge } from '@/components/ui/badge'
import { extractGistTags } from '@/shared/utils/gist-tools'
import { Hash } from 'lucide-react'

interface GistTagsProps {
  description: string | null
  onTagClick?: (tag: string) => void
}

export function GistTags({ description, onTagClick }: GistTagsProps) {
  const tags = extractGistTags(description)

  if (tags.length === 0) return null

  return (
    <div className='mt-2 flex flex-wrap gap-2'>
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant='secondary'
          className='hover:bg-primary/20 h-6 cursor-pointer px-2 py-0.5 text-xs transition-colors'
          onClick={(e) => {
            e.stopPropagation() // Evita abrir o gist ao clicar na tag
            onTagClick?.(tag)
          }}>
          <Hash className='mr-1 h-3 w-3 opacity-50' />
          {tag}
        </Badge>
      ))}
    </div>
  )
}
