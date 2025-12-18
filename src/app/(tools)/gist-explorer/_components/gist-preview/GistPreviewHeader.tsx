'use client'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { generatePDF } from '@/lib/pdf-utils'
import { useConfig } from '@/shared/contexts/configContext'
import { useGist } from '@/shared/contexts/gistContext'
import { useMDToPdf } from '@/shared/contexts/mdToPdfContext'
import { downloadMarkdownFile, triggerDownload } from '@/shared/utils/download-helpers'
import { isMarkdownFile, mergeGistFiles, wrapContentInMarkdown } from '@/shared/utils/gist-tools'
import { Download, FileEdit, FileOutput, FileText } from 'lucide-react'
import { toast } from 'sonner'

export function GistPreviewHeader() {
  const { selectedGist, selectedFile, fileContents } = useGist()
  const { config } = useConfig()
  const { setMarkdown } = useMDToPdf()
  const isMD = isMarkdownFile(selectedFile?.filename)
  if (!selectedGist || !selectedFile) return null

  // AÇÃO: Baixar o arquivo que está na tela no formato original (.json, .sh, .py, etc)
  const handleDownloadOriginal = () => {
    const content = fileContents[selectedFile.filename]
    if (!content) return toast.error('Conteúdo não carregado.')

    // Usa o nome real do arquivo vindo do GitHub
    triggerDownload(content, selectedFile.filename, 'text/plain')
    toast.success(`Arquivo original baixado: ${selectedFile.filename}`)
  }

  // AÇÃO: Baixar todos os arquivos do Gist mesclados em um único arquivo .md
  const handleDownloadPackageMD = () => {
    const mergedMarkdown = mergeGistFiles(selectedGist.files, fileContents)
    const filename = `${selectedGist.description?.slice(0, 20) || 'gist-completo'}.md`
    downloadMarkdownFile(mergedMarkdown, filename)
    toast.success('Pacote Markdown baixado!')
  }

  // AÇÃO: Exportar para PDF usando a função do navegador (jsPDF + html2canvas)
  const handleExportPDF = async () => {
    const element = document.getElementById('gist-render-area')
    if (!element) return toast.error('Elemento de visualização não encontrado.')

    const toastId = toast.loading('Gerando PDF (Múltiplas Páginas)...')

    try {
      const filename = `${selectedGist.description?.slice(0, 25) || 'documento'}.pdf`

      // Chamada da sua função que lida com zoom e quebra de página
      await generatePDF(element, config.page, filename, config.theme)

      toast.success('PDF exportado com sucesso!', { id: toastId })
    } catch (error) {
      toast.error('Erro na geração do PDF.')
      console.error(error)
    }
  }

  return (
    <header className='bg-background/95 sticky top-0 z-10 flex h-[60px] w-full items-center justify-between border-b px-4 backdrop-blur-sm'>
      {/* Esquerda: Info do Arquivo */}
      <div className='flex flex-col overflow-hidden'>
        <h3 className='truncate text-sm font-medium' title={selectedFile.filename}>
          {selectedFile.filename}
        </h3>
        <span className='text-muted-foreground text-[10px] font-bold uppercase'>
          {selectedFile.language || 'Plain Text'}
        </span>
      </div>

      {/* Direita: Botões Componentizados */}
      <div className='flex items-center gap-2'>
        <div className='flex items-center gap-1.5'>
          <Button
            variant='secondary'
            size='sm'
            onClick={() => {
              const content = fileContents[selectedFile.filename]
              if (content) {
                setMarkdown(wrapContentInMarkdown(selectedFile.filename, content))
                toast.success('Enviado para o editor!')
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

          <Button
            size='sm'
            onClick={handleExportPDF}
            className='bg-blue-600 text-white hover:bg-blue-700'
            disabled={!isMD}>
            <Download className='mr-1 h-4 w-4' /> Exportar PDF
          </Button>
        </div>
      </div>
    </header>
  )
}
