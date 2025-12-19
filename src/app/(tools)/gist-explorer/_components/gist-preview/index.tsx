'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { useGist } from '@/shared/contexts/gistContext'
import { FileCode } from 'lucide-react'
import { useMemo } from 'react'
import { GistContent, LoadingPreviewComponent } from './gist-content'
import { GistPreviewHeader } from './header'

export const GistPreview = () => {
  const { selectedGist, isLoading, selectedFile, fileContents } = useGist()
  const RenderComponent = useMemo(() => {
    if (isLoading) {
      return <LoadingPreviewComponent />
    }
    if (!selectedGist) {
      return (
        <div className='bg-muted/10 flex h-full! min-h-[calc(100vh-3rem)] flex-1 items-center justify-center'>
          <div className='text-muted-foreground text-center'>
            <FileCode className='mx-auto mb-4 h-16 w-16 opacity-20' />
            <p className='font-medium'>Selecione um Gist para visualizar</p>
            <p className='text-muted-foreground mt-2 text-sm'>
              Escolha um Gist da lista ao lado para ver seu conteúdo
            </p>
          </div>
        </div>
      )
    }
    return (
      <GistPreviewComponent
        selectedGist={selectedGist}
        selectedFile={selectedFile as GistFile}
        fileContents={fileContents}
      />
    )
  }, [isLoading, selectedGist, selectedFile, fileContents])
  return (
    <div className='bg-background flex flex-1 flex-col overflow-hidden'>
      <GistPreviewHeader />
      <div className='flex h-full flex-1 flex-col overflow-hidden'>
        <ScrollArea className='h-full w-full flex-1 overflow-y-auto'>{RenderComponent}</ScrollArea>
      </div>
    </div>
  )
}

const GistPreviewComponent = ({
  selectedGist,
  selectedFile,
  fileContents,
}: {
  selectedGist: Gist
  selectedFile: GistFile
  fileContents: Record<string, string>
}) => {
  if (!selectedGist || !selectedFile) return null

  if (selectedGist.files.length > 1) {
    return (
      <div className='flex flex-1 flex-col overflow-hidden'>
        <div className='flex-1 overflow-auto'>
          <GistContent selectedFile={selectedFile} fileContents={fileContents} />
        </div>
      </div>
    )
  }
  return <GistContent selectedFile={selectedFile} fileContents={fileContents} />
}
