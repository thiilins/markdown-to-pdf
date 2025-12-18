import { StaticStylePreview } from '@/components/preview-panel/static-style'
import { useGist } from '@/shared/contexts/gistContext'
import { useMDToPdf } from '@/shared/contexts/mdToPdfContext'
import { isMarkdownFile } from '@/shared/utils'
import { AlertCircle } from 'lucide-react'
import { useMemo } from 'react'
import { LoadingPreviewComponent } from './additional-components'

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

const ContentComponent = ({ filename, content, language }: FileContentDisplayProps) => {
  const isMd = isMarkdownFile(filename)
  const { config } = useMDToPdf()
  return (
    <div className='h-full space-y-4'>
      {isMd ? (
        <div className='h-full'>
          <StaticStylePreview
            markdown={content}
            typographyConfig={config.typography}
            themeConfig={config.theme}
          />
        </div>
      ) : (
        <div className='relative'>
          <pre className='bg-muted text-foreground border-border overflow-x-auto rounded-md border p-4 font-mono text-sm'>
            <code>{content}</code>
          </pre>
        </div>
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
    if (!selectedFile) return null

    const isLoading = loadingFiles[selectedFile.filename]
    const content = fileContents[selectedFile.filename]

    if (isLoading) {
      return <LoadingPreviewComponent />
    } else if (!isLoading && !content) {
      return <NoContentComponent />
    }

    return (
      <ContentComponent
        filename={selectedFile.filename}
        content={content}
        language={selectedFile.language || null}
      />
    )
  }, [loadingFiles, selectedFile, fileContents])

  return <div className='p-6'>{RenderComponent}</div>
}
