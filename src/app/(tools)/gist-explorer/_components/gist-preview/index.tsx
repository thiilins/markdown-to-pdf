'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { useGist } from '@/shared/contexts/gistContext'
import { useMemo } from 'react'
import { GistPreviewHeader } from './GistPreviewHeader'
import { LoadingPreviewComponent, NoGistSelectedComponent } from './additional-components'
import { GistPreviewComponent } from './gist-preview-component'

export const GistPreview = () => {
  const { selectedGist, loading } = useGist()
  const RenderComponent = useMemo(() => {
    if (loading) {
      return <LoadingPreviewComponent />
    }
    if (!selectedGist) {
      return <NoGistSelectedComponent />
    }
    return <GistPreviewComponent />
  }, [loading, selectedGist])
  return (
    <div className='bg-background flex flex-1 flex-col overflow-hidden'>
      <GistPreviewHeader />
      <div className='flex h-full flex-1 flex-col overflow-hidden'>
        <ScrollArea className='h-full w-full flex-1 overflow-y-auto'>{RenderComponent}</ScrollArea>
      </div>
    </div>
  )
}
