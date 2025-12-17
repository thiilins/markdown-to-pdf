'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useGist } from '@/shared/contexts/gistContext'
import { FileCode, FileText } from 'lucide-react'
import { GistContent } from './gist-content'
export const GistPreviewComponent = () => {
  const { selectedGist, selectedFile, fileContents } = useGist()
  if (!selectedGist || !selectedFile) return null
  if (selectedGist.files.length > 1) {
    return (
      <Tabs
        value={selectedFile?.filename || undefined}
        className='flex flex-1 flex-col overflow-hidden'>
        <div className='border-b px-4'>
          <TabsList className='h-auto w-full justify-start bg-transparent p-0'>
            <TabsTriggerMultipleFiles gist={selectedGist} />
            <TabsContentMultipleFiles gist={selectedGist} fileContents={fileContents} />
          </TabsList>
        </div>
      </Tabs>
    )
  }
  return <GistContent selectedFile={selectedFile} fileContents={fileContents} />
}

const TabsTriggerMultipleFiles = ({ gist }: { gist: Gist }) => {
  const { handleSelectFile } = useGist()
  const IconFile = ({
    language,
    className = 'mr-2 h-4 w-4',
  }: {
    language: string | null
    className?: string
  }) => {
    return language ? <FileCode className={className} /> : <FileText className={className} />
  }
  return gist.files.map((file: GistFile) => (
    <TabsTrigger
      key={file.filename}
      value={file.filename}
      onClick={() => handleSelectFile(file.filename)}
      className='data-[state=active]:bg-background data-[state=active]:shadow-sm'>
      <IconFile language={file.language} />
      {file.filename}
    </TabsTrigger>
  ))
}

const TabsContentMultipleFiles = ({
  gist,
  fileContents,
}: {
  gist: Gist
  fileContents: Record<string, string>
}) => {
  return gist.files.map((file: GistFile) => (
    <TabsContent key={file.filename} value={file.filename} className='m-0 flex-1 overflow-auto p-6'>
      <GistContent selectedFile={file} fileContents={fileContents} />
    </TabsContent>
  ))
}
