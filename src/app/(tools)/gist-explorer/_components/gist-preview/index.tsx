'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { useGist } from '@/shared/contexts/gistContext'
import { FileCode } from 'lucide-react' // Adicionei Github icon para compor o visual
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
        <div className='bg-muted/5 flex h-full min-h-[calc(100vh-3rem)] flex-1 flex-col items-center justify-center p-8 text-center'>
          {/* Padrão de fundo sutil */}
          <div className='absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-25 dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]' />

          <div className='bg-background/50 relative z-10 flex max-w-md flex-col items-center gap-4 rounded-2xl border p-12 shadow-sm backdrop-blur-sm'>
            <div className='bg-muted ring-border rounded-full p-4 ring-1'>
              <FileCode className='text-muted-foreground/60 h-10 w-10' />
            </div>
            <div className='space-y-2'>
              <h3 className='text-lg font-semibold tracking-tight'>Nenhum Gist selecionado</h3>
              <p className='text-muted-foreground text-sm'>
                Selecione um arquivo na barra lateral para visualizar seu conteúdo, código ou
                documentação.
              </p>
            </div>
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
    <div className='bg-background flex h-full min-h-0 flex-1 flex-col overflow-hidden'>
      <GistPreviewHeader />
      <div className='relative flex min-h-0 flex-1 flex-col overflow-hidden'>
        <ScrollArea className='h-full w-full flex-1'>{RenderComponent}</ScrollArea>
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

  // Wrapper simples para garantir flexibilidade futura
  return (
    <div className='flex min-h-full flex-col'>
      <GistContent selectedFile={selectedFile} fileContents={fileContents} />
    </div>
  )
}
