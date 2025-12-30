'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ENVIROMENT } from '@/env'
import { useGist } from '@/shared/contexts/gistContext'
import { useMDToPdf } from '@/shared/contexts/mdToPdfContext'
import { isMarkdownFile, wrapContentInMarkdown } from '@/shared/utils/gist-tools'
import {
  Download,
  ExternalLink,
  FileEdit,
  FileOutput,
  FileText,
  Pencil,
  Printer,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import { toast } from 'sonner'
import { GistEditModal } from '../gist-edit-modal'
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
    onUpdateGist,
  } = useGist()
  const { data: session } = useSession()
  const { setMarkdown } = useMDToPdf()
  const router = useRouter()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentUserLogin, setCurrentUserLogin] = useState<string | null>(null)
  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    documentTitle: selectedFile?.filename || 'gist-document',
  })

  // Busca o username do GitHub quando a sessão está disponível
  useEffect(() => {
    if (session?.accessToken && !currentUserLogin) {
      fetch('/api/user')
        .then((res) => res.json())
        .then((data) => {
          if (data.login) {
            setCurrentUserLogin(data.login)
          }
        })
        .catch(() => {
          // Silenciosamente falha se não conseguir buscar
        })
    }
  }, [session?.accessToken, currentUserLogin])

  // document.getElementById('gist-render-area') as HTMLDivElement
  if (!selectedGist || !selectedFile) return null
  const isMD = isMarkdownFile(selectedFile.filename)
  const currentContent = fileContents[selectedFile.filename] || ''

  // Verifica se o usuário é dono do gist
  // Compara o login do owner com o login do usuário atual
  const isOwner =
    currentUserLogin &&
    selectedGist.owner?.login &&
    currentUserLogin.toLowerCase() === selectedGist.owner.login.toLowerCase()
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

          {isOwner && (
            <Button variant='outline' size='sm' onClick={() => setIsEditModalOpen(true)}>
              <Pencil className='mr-1 h-4 w-4' /> Descrição
            </Button>
          )}

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
      <GistEditModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        gist={selectedGist}
        onSave={onUpdateGist}
      />
    </header>
  )
}
