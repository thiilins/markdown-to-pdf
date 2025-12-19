'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ENVIROMENT } from '@/env'
import { useGist } from '@/shared/contexts/gistContext'
import { useMDToPdf } from '@/shared/contexts/mdToPdfContext'
import { isMarkdownFile, wrapContentInMarkdown } from '@/shared/utils/gist-tools'
import { Download, ExternalLink, FileEdit, FileOutput, FileText, Printer } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useReactToPrint } from 'react-to-print'
import { toast } from 'sonner'
import { FileSelector } from './file-selector'

export function GistPreviewHeader() {
  const {
    selectedGist,
    selectedFile,
    fileContents,
    onDownloadOriginal,
    onDownloadPackageMD,
    handleDownloadPDF,
    isLoading,
    contentRef,
  } = useGist()
  const { setMarkdown } = useMDToPdf()
  const router = useRouter()
  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    documentTitle: selectedFile?.filename || 'gist-document',
  })

  // document.getElementById('gist-render-area') as HTMLDivElement
  if (!selectedGist || !selectedFile) return null
  const isMD = isMarkdownFile(selectedFile.filename)
  const currentContent = fileContents[selectedFile.filename] || ''

  return (
    <header className='bg-background/95 sticky top-0 z-10 flex h-[60px] w-full items-center justify-between border-b px-4 backdrop-blur-sm'>
      <div className='flex flex-col overflow-hidden'>
        <h3 className='truncate text-sm font-medium'>{selectedFile.filename}</h3>
        <span className='text-muted-foreground text-[10px] font-bold uppercase'>
          {selectedFile.language || 'Plain Text'}
        </span>
      </div>
      <FileSelector />
      <div className='flex items-center gap-2'>
        <div className='flex items-center gap-1.5'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => window.open(selectedGist.html_url, '_blank')}>
            <ExternalLink className='h-4 w-4' />
          </Button>

          <Separator orientation='vertical' className='mx-1 h-6' />

          <Button
            variant='secondary'
            size='sm'
            onClick={() => {
              if (currentContent) {
                setMarkdown(wrapContentInMarkdown(selectedFile.filename, currentContent))
                toast.success('Carregado no editor!')
                router.push('/md-to-pdf')
              }
            }}>
            <FileEdit className='mr-1 h-4 w-4' /> Editar
          </Button>

          <Button variant='outline' size='sm' onClick={onDownloadOriginal}>
            <FileOutput className='mr-1 h-4 w-4' /> Original
          </Button>
        </div>

        <Separator orientation='vertical' className='mx-1 h-6' />

        <div className='flex items-center gap-2'>
          <Button variant='outline' size='sm' onClick={onDownloadPackageMD}>
            <FileText className='mr-1 h-4 w-4' /> Pacote .MD
          </Button>

          {/* Imprimir - usa impressão nativa do navegador (texto selecionável) */}
          <Button variant='outline' size='sm' onClick={handlePrint} disabled={!isMD}>
            <Printer className='mr-1 h-4 w-4' /> Imprimir
          </Button>

          {/* Download via API - gera PDF no servidor (texto selecionável) */}
          <Button
            size='sm'
            onClick={handleDownloadPDF}
            className='bg-blue-600 font-bold text-white hover:bg-blue-700'
            disabled={!isMD || isLoading || !ENVIROMENT.ENABLE_EXPORT}>
            <Download className='mr-1 h-4 w-4' /> {isLoading ? 'Gerando...' : 'Baixar PDF'}
          </Button>
        </div>
      </div>
    </header>
  )
}
