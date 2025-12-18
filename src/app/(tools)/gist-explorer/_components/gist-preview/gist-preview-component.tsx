'use client'

import { useGist } from '@/shared/contexts/gistContext'
import { useMemo } from 'react'
import { GistContent } from './gist-content'

export const GistPreviewComponent = () => {
  const { selectedGist, selectedFile, fileContents, handleSelectFile } = useGist()

  if (!selectedGist || !selectedFile) return null

  const fileOptions = useMemo(() => {
    return selectedGist.files.map((file) => ({
      value: file.filename,
      label: file.filename,
      language: file.language,
    }))
  }, [selectedGist.files])

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
