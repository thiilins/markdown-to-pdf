import { Button } from '@/components/ui/button'
import { useGist } from '@/shared/contexts/gistContext'
import { ExternalLink } from 'lucide-react'

export const GistPreviewHeader = () => {
  const { selectedFile } = useGist()
  if (!selectedFile) return null
  return (
    <div className='bg-muted/30 border-b p-4'>
      <div className='mb-2 flex items-start justify-between gap-4'>
        <div className='min-w-0 flex-1'>
          <h2 className='mb-1 truncate text-lg font-semibold'>
            {selectedFile?.filename || 'Gist sem nome'}
          </h2>
          {selectedFile?.description && (
            <p className='text-muted-foreground line-clamp-2 text-sm'>
              {selectedFile?.description}
            </p>
          )}
        </div>
        <Button variant='outline' size='sm' asChild className='shrink-0'>
          <a href={selectedFile?.html_url} target='_blank' rel='noopener noreferrer'>
            <ExternalLink className='mr-2 h-4 w-4' />
            Ver no GitHub
          </a>
        </Button>
      </div>
    </div>
  )
}
