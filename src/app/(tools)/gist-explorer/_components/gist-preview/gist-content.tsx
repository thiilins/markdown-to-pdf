import { useGist } from '@/shared/contexts/gistContext'

import { isMarkdownFile } from '@/shared/utils'
import { AlertCircle, FileText } from 'lucide-react'
import { useMemo } from 'react'
import { LoadingPreviewComponent } from './additional-components'

const NoContentComponent = () => {
  return (
    <div className='flex items-center justify-center py-12'>
      <div className='text-center'>
        <AlertCircle className='text-muted-foreground mx-auto mb-2 h-8 w-8' />
        <p className='text-muted-foreground text-sm'>Conteúdo não disponível</p>
      </div>
    </div>
  )
}

const FileContentDisplay = ({ filename, content, language }: FileContentDisplayProps) => {
  return !content ? (
    <NoContentComponent />
  ) : (
    <ContentComponent filename={filename} content={content} language={language} />
  )
}

const ContentComponent = ({ filename, content, language }: FileContentDisplayProps) => {
  return (
    <div className='space-y-4'>
      <div className='text-muted-foreground flex items-center gap-2 text-sm'>
        <FileText className='h-4 w-4' />
        <span className='font-mono'>{filename}</span>
        {language && (
          <>
            <span>•</span>
            <span>{language}</span>
          </>
        )}
      </div>
      {isMarkdownFile(filename) ? (
        <div className='prose prose-sm dark:prose-invert max-w-none'>
          <pre className='bg-muted text-foreground rounded-md p-4 font-mono text-sm wrap-break-word whitespace-pre-wrap'>
            {content}
          </pre>
        </div>
      ) : (
        <pre className='bg-muted text-foreground overflow-x-auto rounded-md p-4 font-mono text-sm'>
          <code className='text-foreground'>{content}</code>
        </pre>
      )}
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
  const { loadingFiles } = useGist()

  const RenderComponent = useMemo(() => {
    const isLoading = loadingFiles[selectedFile?.filename || '']
    const content = fileContents[selectedFile?.filename || '']
    if (isLoading) {
      return <LoadingPreviewComponent />
    } else if (!isLoading && !content) {
      return <NoContentComponent />
    }
    return (
      <ContentComponent
        filename={selectedFile?.filename || ''}
        content={content}
        language={selectedFile?.language || null}
      />
    )
  }, [loadingFiles, selectedFile, fileContents])

  return <div className='p-6'>{RenderComponent}</div>
}
