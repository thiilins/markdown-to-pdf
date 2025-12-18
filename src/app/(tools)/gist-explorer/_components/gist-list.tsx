'use client'

import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useGist } from '@/shared/contexts/gistContext'
import { AlertCircle, ArchiveX } from 'lucide-react'
import { useMemo } from 'react'
import { GistItem, GistItemSkeleton } from './gist-item'

interface GistListProps {
  gists: Gist[]
  loading: boolean
  selectedGistId?: string
  onSelectGist: (gist: Gist) => void
  error?: string | null
}

export const GistList = () => {
  const { gists, loading, error } = useGist()
  const Component = useMemo(() => {
    if (loading) {
      return <LoadingGistListComponent />
    }
    if (error) {
      return <GenericCard type='error' />
    }
    if (gists.length === 0) {
      return <GenericCard type='empty' />
    }
    return <GitListWithContent />
  }, [loading, error, gists])

  return <ScrollArea className='h-full flex-1'>{Component}</ScrollArea>
}

const GitListWithContent = () => {
  const { filteredGists, selectedGistId, onSelectGist } = useGist()

  return (
    <div className='grid h-full grid-cols-1 gap-4 p-2'>
      {filteredGists.map((gist) => (
        <GistItem
          key={gist.id}
          gist={gist}
          isSelected={selectedGistId === gist.id}
          onClick={() => onSelectGist(gist)}
        />
      ))}
    </div>
  )
}

const LoadingGistListComponent = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <GistItemSkeleton key={i} />
      ))}
    </>
  )
}

const GenericCard = ({ type }: { type: 'error' | 'empty' }) => {
  const { error } = useGist()
  const options = {
    error: {
      icon: <AlertCircle className='text-destructive mb-4 h-12 w-12' />,
      title: {
        text: 'Erro ao carregar Gists',
        className: 'mb-2 font-semibold',
      },
      description: {
        text: 'Busque por um usuário ou faça login para ver seus Gists',
        className: 'text-muted-foreground text-sm',
      },
    },
    empty: {
      icon: <ArchiveX className='text-muted-foreground mb-4 h-12 w-12 opacity-50' />,
      title: {
        text: 'Nenhum Gist encontrado',
        className: 'mb-2 font-semibold',
      },
      description: {
        text: 'Busque por um usuário ou faça login para ver seus Gists',
        className: 'text-muted-foreground text-sm',
      },
    },
  }
  return (
    <Card className='flex h-full flex-col items-center justify-center p-8 text-center'>
      {options[type].icon}
      <h3 className={options[type].title.className}>{options[type].title.text}</h3>
      <p className={options[type].description.className}>{options[type].description.text}</p>
    </Card>
  )
}
