'use client'

import { StaticPreview } from '@/components/preview-panel/static-pages'
import { Skeleton } from '@/components/ui/skeleton'
import { useApp } from '@/shared/contexts/appContext'
import { useGist } from '@/shared/contexts/gistContext'
import { isImageFile, isMarkdownFile, mapLanguage } from '@/shared/utils'
import { AlertCircle } from 'lucide-react'
import { useMemo } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs'

const ContentComponent = ({
  filename,
  content,
  language,
}: {
  filename: string
  content: string
  language?: string | null
}) => {
  const { selectedFile } = useGist()
  const isMd = isMarkdownFile(filename)
  const isImage = isImageFile(selectedFile?.filename)

  const RenderedView = useMemo(() => {
    if (isMd) {
      return <ContentMdPreview content={content} />
    }
    if (isImage) {
      return <ContentImagePreview selectedFile={selectedFile} />
    }
    return <ContentCodePreview content={content} language={language} />
  }, [isMd, isImage, content, language, selectedFile])

  return <div className='h-full w-full'>{RenderedView}</div>
}

const ContentMdPreview = ({ content }: { content: string }) => {
  const { config } = useApp()
  const { contentRef } = useGist()
  return (
    <div className='h-full w-full'>
      <StaticPreview
        markdown={content}
        typographyConfig={config.typography}
        themeConfig={config.theme}
        contentRef={contentRef}
      />
    </div>
  )
}

const ContentCodePreview = ({
  content,
  language,
}: {
  content: string
  language?: string | null
}) => {
  return (
    <div className='h-full w-full overflow-hidden font-mono text-sm'>
      <SyntaxHighlighter
        language={mapLanguage(language)}
        style={darcula}
        className='rounded-md'
        showLineNumbers={true}
        lineNumberStyle={{ minWidth: '3em', paddingRight: '1em', color: '#888' }}
        customStyle={{
          margin: 0,
          padding: '2rem',
          width: '100%',
          backgroundColor: '#010101',
        }}>
        {content}
      </SyntaxHighlighter>
    </div>
  )
}

const ContentImagePreview = ({ selectedFile }: { selectedFile?: any | null }) => {
  return (
    <div className='flex min-h-full flex-col items-center justify-center bg-slate-50 p-8 dark:bg-slate-900/20'>
      <div className='relative overflow-hidden rounded-lg border bg-white shadow-2xl dark:bg-slate-950'>
        <img
          src={selectedFile?.raw_url}
          alt={selectedFile?.filename}
          className='max-h-[75vh] max-w-full object-contain'
        />
      </div>
      <div className='text-muted-foreground mt-4 font-mono text-[10px] uppercase'>
        {selectedFile?.filename}
      </div>
    </div>
  )
}
export const GistContent = ({
  selectedFile,
  fileContents,
}: {
  selectedFile: GistFile
  fileContents: Record<string, string>
}) => {
  const { loadingFiles, contentRef } = useGist()

  const RenderComponent = useMemo(() => {
    if (!selectedFile) return null
    const isLoading = loadingFiles[selectedFile.filename]
    const content = fileContents[selectedFile.filename]

    if (isLoading) return <LoadingPreviewComponent />
    if (!isLoading && !content) return <NoContentComponent />

    // Seus componentes ContentMdPreview, ContentCodePreview, etc.
    return (
      <ContentComponent
        filename={selectedFile.filename}
        content={content}
        language={selectedFile.language || null}
      />
    )
  }, [loadingFiles, selectedFile, fileContents])

  return (
    // ID fixo para impressão e exportação PDF
    <div
      id='gist-render-area'
      ref={contentRef}
      className='prose min-h-full w-full max-w-none overflow-visible bg-white p-8 dark:bg-slate-950'>
      {RenderComponent}
    </div>
  )
}

const NoContentComponent = () => {
  return (
    <div className='flex items-center justify-center py-12'>
      <div className='text-muted-foreground text-center'>
        <AlertCircle className='mx-auto mb-2 h-8 w-8' />
        <p className='text-sm'>Conteúdo não disponível</p>
      </div>
    </div>
  )
}
export const LoadingPreviewComponent = () => {
  return (
    <div className='bg-muted/10 flex flex-1 items-center justify-center'>
      <div className='w-full max-w-2xl space-y-4 p-8'>
        <Skeleton className='h-8 w-48' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-3/4' />
        <Skeleton className='h-64 w-full' />
      </div>
    </div>
  )
}
