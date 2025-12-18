'use client'

import { generatePDF } from '@/app/actions/pdf'
import { Download, ExternalLink, FileEdit, FileOutput, FileText, Printer } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import { ENVIROMENT } from '@/env'
import { useConfig } from '@/shared/contexts/configContext'
import { useGist } from '@/shared/contexts/gistContext'
import { useMDToPdf } from '@/shared/contexts/mdToPdfContext'

import { downloadMarkdownFile, triggerDownload } from '@/shared/utils/download-helpers'
import { isMarkdownFile, mergeGistFiles, wrapContentInMarkdown } from '@/shared/utils/gist-tools'
import { FileSelector } from './file-selector'

export function GistPreviewHeader() {
  const { selectedGist, selectedFile, fileContents } = useGist()
  const { config } = useConfig()
  const { setMarkdown } = useMDToPdf()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Impressão nativa do navegador (texto selecionável)
  const handlePrint = useReactToPrint({
    contentRef: { current: document.getElementById('gist-render-area') as HTMLDivElement },
    documentTitle: selectedFile?.filename || 'gist-document',
  })

  if (!selectedGist || !selectedFile) return null

  const isMD = isMarkdownFile(selectedFile.filename)
  const currentContent = fileContents[selectedFile.filename] || ''
  const canDownloadViaAPI = ENVIROMENT.ENABLE_EXPORT

  // Download do arquivo bruto
  const handleDownloadOriginal = () => {
    if (!currentContent) return toast.error('Conteúdo não carregado.')
    triggerDownload(currentContent, selectedFile.filename, 'text/plain')
    toast.success(`Download iniciado: ${selectedFile.filename}`)
  }

  // Baixar todos do Gist em .md
  const handleDownloadPackageMD = () => {
    const mergedMarkdown = mergeGistFiles(selectedGist.files, fileContents)
    const filename = `${selectedGist.description?.slice(0, 20) || 'gist-completo'}.md`
    downloadMarkdownFile(mergedMarkdown, filename)
    toast.success('Pacote Markdown gerado!')
  }

  // Download PDF via API (servidor - texto selecionável)
  const handleDownloadPDF = async () => {
    if (!canDownloadViaAPI) {
      toast.error('Exportação via API não disponível.')
      return
    }

    const element = document.getElementById('gist-render-area')
    if (!element) return toast.error('Área de conteúdo não encontrada.')

    const toastId = toast.loading('Gerando PDF via servidor...')
    setIsLoading(true)

    try {
      const htmlContent = element.innerHTML
      const result = await generatePDF(htmlContent, config)

      if (!result.success) {
        throw new Error('Erro na geração do PDF')
      }

      // Converte base64 para blob e faz download
      const binaryString = window.atob(result.data)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      const blob = new Blob([bytes], { type: result.contentType || 'application/pdf' })

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${selectedFile.filename}.pdf`
      document.body.appendChild(a)
      a.click()

      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success('PDF gerado com sucesso!', { id: toastId })
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao gerar PDF. Verifique o console.', { id: toastId })
    } finally {
      setIsLoading(false)
    }
  }

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

          <Button variant='outline' size='sm' onClick={handleDownloadOriginal}>
            <FileOutput className='mr-1 h-4 w-4' /> Original
          </Button>
        </div>

        <Separator orientation='vertical' className='mx-1 h-6' />

        <div className='flex items-center gap-2'>
          <Button variant='outline' size='sm' onClick={handleDownloadPackageMD}>
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
            disabled={!isMD || isLoading || !canDownloadViaAPI}>
            <Download className='mr-1 h-4 w-4' /> {isLoading ? 'Gerando...' : 'Baixar PDF'}
          </Button>
        </div>
      </div>
    </header>
  )
}
