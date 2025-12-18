// src/app/(tools)/gist-explorer/_components/gist-preview/gist-content.tsx
import { StaticStylePreview } from '@/components/preview-panel/static-style'
import { useConfig } from '@/shared/contexts/configContext'
import { useGist } from '@/shared/contexts/gistContext'
import { isImageFile, isMarkdownFile, mapLanguage } from '@/shared/utils'
import { AlertCircle } from 'lucide-react'
import { useMemo } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { LoadingPreviewComponent } from './additional-components'

// Componente para quando não há conteúdo
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

// Componente que decide o que renderizar
const ContentComponent = ({ filename, content, language }: FileContentDisplayProps) => {
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

  return <div className='h-full space-y-4'>{RenderedView}</div>
}

const ContentMdPreview = ({ content }: { content: string }) => {
  const { config } = useConfig()
  return (
    <div className='h-full'>
      <StaticStylePreview
        markdown={content}
        typographyConfig={config.typography}
        themeConfig={config.theme}
      />
    </div>
  )
}

// const ContentCodePreview = ({
//   content,
//   language,
// }: {
//   content: string
//   language?: string | null
// }) => {
//   return (
//     <div className='h-full min-h-[80dvh] w-full max-w-[76dvw] font-mono text-sm'>
//       <SyntaxHighlighter
//         language={mapLanguage(language)}
//         style={darcula}
//         className='min-h-[85dvh] max-w-[76dvw] rounded-md bg-black'
//         showLineNumbers={true}
//         lineNumberStyle={{ minWidth: '3em', paddingRight: '1em', color: '#888' }}
//         customStyle={{
//           margin: 0,
//           padding: '2rem',
//           paddingLeft: '3rem',
//           width: '100%',
//           height: '100% !important',
//           backgroundColor: '#010101',
//         }}>
//         {content}
//       </SyntaxHighlighter>
//     </div>
//   )
// }
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
          width: '100%', // Crucial para o PDF
          backgroundColor: '#010101',
        }}>
        {content}
      </SyntaxHighlighter>
    </div>
  )
}
const ContentImagePreview = ({ selectedFile }: { selectedFile?: GistFile | null }) => {
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

// export const GistContent = ({
//   selectedFile,
//   fileContents,
// }: {
//   selectedFile: GistFile
//   fileContents: Record<string, string>
// }) => {
//   const { loadingFiles } = useGist()

//   const RenderComponent = useMemo(() => {
//     if (!selectedFile) return null

//     const isLoading = loadingFiles[selectedFile.filename]
//     const content = fileContents[selectedFile.filename]

//     if (isLoading) {
//       return <LoadingPreviewComponent />
//     } else if (!isLoading && !content) {
//       return <NoContentComponent />
//     }

//     return (
//       <ContentComponent
//         filename={selectedFile.filename}
//         content={content}
//         language={selectedFile.language || null}
//       />
//     )
//   }, [loadingFiles, selectedFile, fileContents])

//   // Adicionamos o ID 'gist-render-container' para a captura do html2canvas
//   // Adicionamos 'bg-background' para garantir que o fundo seja capturado corretamente
//   return (
//     <div id='gist-render-container' className='bg-background min-h-full p-6'>
//       {RenderComponent}
//     </div>
//   )
// }
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

  // ESTE CONTAINER É O SEGREDO DO PDF:
  // 1. ID para captura: 'gist-render-area'
  // 2. background fixo: 'bg-white' ou 'bg-background' para não sair transparente no PDF
  // 3. Classe 'prose': Para sua função generatePDF encontrar o conteúdo se for Markdown
  return (
    <div
      id='gist-render-area'
      className='prose min-h-full w-full max-w-none bg-white p-8 dark:bg-slate-950'>
      {RenderComponent}
    </div>
  )
}
