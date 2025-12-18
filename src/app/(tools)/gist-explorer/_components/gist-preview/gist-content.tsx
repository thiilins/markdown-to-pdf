import { useGist } from '@/shared/contexts/gistContext'
import { isMarkdownFile } from '@/shared/utils'
import { AlertCircle, FileText } from 'lucide-react'
import { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
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

  return (
    <div className='space-y-4'>
      <div className='text-muted-foreground flex items-center gap-2 border-b pb-2 text-sm'>
        <FileText className='h-4 w-4' />
        <span className='font-mono font-medium'>{filename}</span>
        {language && (
          <>
            <span className='opacity-50'>•</span>
            <span className='text-xs uppercase'>{language}</span>
          </>
        )}
      </div>

      {isMd ? (
        // ADICIONADO: dark:prose-invert para corrigir cores no modo escuro
        <div className='prose prose-sm dark:prose-invert max-w-none p-1'>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              img: ({ node, ...props }) => (
                <img
                  {...props}
                  style={{ maxWidth: '100%', height: 'auto' }}
                  alt={props.alt || ''}
                />
              ),
              // ADICIONADO: text-foreground para garantir contraste alto
              pre: ({ node, ...props }) => (
                <pre
                  {...props}
                  className='bg-muted text-foreground border-border overflow-x-auto rounded-md border p-4'
                />
              ),
              code: ({ node, ...props }) => (
                <code
                  {...props}
                  className='bg-muted/50 text-foreground rounded px-1 py-0.5 font-mono'
                />
              ),
            }}>
            {content}
          </ReactMarkdown>
        </div>
      ) : (
        // ADICIONADO: Classes explícitas de cor para código puro
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
