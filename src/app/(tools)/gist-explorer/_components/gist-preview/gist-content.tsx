'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useApp } from '@/shared/contexts/appContext'
import { useGist } from '@/shared/contexts/gistContext'
import { isImageFile, isMarkdownFile, mapLanguage } from '@/shared/utils'
import { AlertCircle, ImageIcon } from 'lucide-react'
import { ReactNode, useMemo } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'

import { vs2015 } from 'react-syntax-highlighter/dist/cjs/styles/hljs'
import { MdPreview } from './md-preview'
interface StandardPreviewWrapperProps {
  children: ReactNode
  className?: string
  classNameContainer?: string
  contentRef?: any
}

const StandardPreviewWrapper = ({
  children,
  className,
  classNameContainer,
  contentRef,
}: StandardPreviewWrapperProps) => {
  return (
    <div
      className={cn(
        'bg-muted/10 relative flex min-h-full w-full flex-col items-center py-8 md:py-12',
        classNameContainer,
      )}>
      <div className='pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-50 dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]' />
      <div
        ref={contentRef}
        className={cn(
          'print-content relative z-10 mx-auto flex w-full max-w-full flex-col overflow-hidden transition-all duration-300',
          'ring-border/50 bg-white text-left shadow-sm ring-1 dark:bg-zinc-950 dark:ring-white/10',
          'md:rounded-xl md:shadow-md',
          className,
        )}
        style={{
          maxWidth: 'min(310mm, 100%)', // Largura A4 máxima, mas nunca mais que 100% do container
          minHeight: 'max(297mm, 100%)', // Altura A4 mínima
          width: '100%', // Garante que ocupe toda a largura disponível
        }}>
        {children}
      </div>

      {/* Footer Visual Sutil */}
      <div className='text-muted-foreground mt-8 font-mono text-[10px] tracking-widest uppercase opacity-40'>
        Fim do arquivo
      </div>
    </div>
  )
}

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
    // Markdown usa o StaticPreview que já tem seu próprio layout
    // Passamos o contentRef para ele
    if (isMd) {
      return <ContentMdPreview content={content} />
    }
    if (isImage) {
      return <ContentImagePreview selectedFile={selectedFile} />
    }
    return <ContentCodePreview content={content} language={language} filename={filename} />
  }, [isMd, isImage, content, language, selectedFile, filename])

  return <div className='animate-in fade-in h-full w-full duration-300'>{RenderedView}</div>
}

const ContentMdPreview = ({ content }: { content: string }) => {
  const { config } = useApp()
  const { contentRef } = useGist()
  return (
    <div className='h-full w-full'>
      <MdPreview
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
  filename,
}: {
  filename?: string
  content: string
  language?: string | null
}) => {
  const { contentRef } = useGist()

  return (
    <StandardPreviewWrapper
      contentRef={contentRef}
      className='bg-[#2b2b2b] dark:bg-[#2b2b2b]'
      classNameContainer='p-2 rounded-lg!'>
      <div className='flex shrink-0 items-center justify-between border-b border-white/10 bg-white/5 px-3 py-2.5 sm:px-6 sm:py-3'>
        <div className='flex items-center gap-2 sm:gap-4'>
          <div className='flex gap-1 sm:gap-1.5'>
            <div className='h-2.5 w-2.5 rounded-full bg-red-500/80 shadow-sm sm:h-3 sm:w-3' />
            <div className='h-2.5 w-2.5 rounded-full bg-yellow-500/80 shadow-sm sm:h-3 sm:w-3' />
            <div className='h-2.5 w-2.5 rounded-full bg-green-500/80 shadow-sm sm:h-3 sm:w-3' />
          </div>
        </div>

        <span className='max-w-[120px] truncate font-mono text-[10px] font-medium tracking-wider text-white opacity-60 sm:max-w-none sm:text-xs'>
          {filename || 'code.js'}
        </span>
        <span className='max-w-[120px] truncate font-mono text-[10px] font-medium tracking-wider text-white uppercase opacity-60 sm:max-w-none sm:text-xs'>
          {language || 'text'}
        </span>
      </div>

      <div className='flex-1 overflow-x-auto'>
        <SyntaxHighlighter
          language={mapLanguage(language)}
          style={vs2015}
          showLineNumbers={true}
          wrapLines={true}
          wrapLongLines={true}
          lineNumberStyle={{
            minWidth: '3.5em',
            paddingRight: '1.5em',
            color: '#606366',
            textAlign: 'right',
            borderRight: '1px solid rgba(255,255,255,0.05)',
            marginRight: '1.5em',
            display: 'inline-block',
          }}
          customStyle={{
            margin: 0,
            padding: '1rem',
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
            fontSize: '13px',
            lineHeight: '1.6',
            fontFamily: 'var(--font-mono)',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
            maxWidth: '100%',
          }}
          PreTag={({ children, ...props }: any) => (
            <pre
              {...props}
              style={{
                ...props.style,
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
                maxWidth: '100%',
                overflow: 'visible',
              }}>
              {children}
            </pre>
          )}
          CodeTag={({ children, ...props }: any) => (
            <code
              {...props}
              style={{
                ...props.style,
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
                maxWidth: '100%',
              }}>
              {children}
            </code>
          )}>
          {content}
        </SyntaxHighlighter>
      </div>
    </StandardPreviewWrapper>
  )
}

const ContentImagePreview = ({ selectedFile }: { selectedFile?: any | null }) => {
  const { contentRef } = useGist()

  return (
    <StandardPreviewWrapper contentRef={contentRef} className='justify-center'>
      <div className='flex h-full w-full flex-col items-center justify-center p-12'>
        <div className='relative overflow-hidden rounded-lg border shadow-sm ring-1 ring-black/5'>
          <div
            className='absolute inset-0 z-0 opacity-50'
            style={{
              backgroundImage:
                'linear-gradient(45deg, #e5e5e5 25%, transparent 25%), linear-gradient(-45deg, #e5e5e5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e5e5 75%), linear-gradient(-45deg, transparent 75%, #e5e5e5 75%)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
              backgroundColor: '#fff',
            }}
          />

          <img
            src={selectedFile?.raw_url}
            alt={selectedFile?.filename}
            className='relative z-10 max-h-[600px] max-w-full object-contain'
          />
        </div>

        {/* Legenda */}
        <div className='bg-muted/30 text-muted-foreground mt-6 flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs backdrop-blur-sm'>
          <ImageIcon className='h-3.5 w-3.5' />
          <span className='font-medium'>{selectedFile?.filename}</span>
        </div>
      </div>
    </StandardPreviewWrapper>
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

    if (isLoading) return <LoadingPreviewComponent />
    if (!isLoading && !content) return <NoContentComponent />

    return (
      <ContentComponent
        filename={selectedFile.filename}
        content={content}
        language={selectedFile.language || null}
      />
    )
  }, [loadingFiles, selectedFile, fileContents])

  return (
    <div id='gist-render-area' className='min-h-full w-full'>
      {RenderComponent}
    </div>
  )
}

const NoContentComponent = () => {
  return (
    <div className='bg-muted/10 flex min-h-[calc(100vh-8rem)] items-center justify-center p-8'>
      <div className='bg-background/50 flex max-w-md flex-col items-center gap-3 rounded-xl border border-dashed p-12 text-center'>
        <div className='bg-muted rounded-full p-3'>
          <AlertCircle className='text-muted-foreground h-6 w-6' />
        </div>
        <div>
          <h3 className='font-semibold'>Conteúdo indisponível</h3>
          <p className='text-muted-foreground text-sm'>Não foi possível renderizar este arquivo.</p>
        </div>
      </div>
    </div>
  )
}

export const LoadingPreviewComponent = () => {
  return (
    <div className='bg-muted/10 relative flex min-h-full w-full flex-col items-center py-12'>
      {/* Background Skeleton */}
      <div className='pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-50' />

      {/* Paper Skeleton */}
      <div
        className='bg-background relative z-10 w-full space-y-6 rounded-xl border p-8 shadow-sm md:p-12'
        style={{ maxWidth: '210mm', minHeight: '297mm' }}>
        <div className='flex items-center gap-4 border-b pb-6'>
          <Skeleton className='h-12 w-12 rounded-lg' />
          <div className='space-y-2'>
            <Skeleton className='h-5 w-48' />
            <Skeleton className='h-3 w-32' />
          </div>
        </div>
        <div className='space-y-4 pt-4'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-[90%]' />
          <Skeleton className='h-4 w-[95%]' />
          <Skeleton className='h-4 w-[80%]' />
        </div>
        <Skeleton className='bg-muted/50 mt-8 h-[400px] w-full rounded-xl' />
      </div>
    </div>
  )
}
