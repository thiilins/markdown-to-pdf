'use client'

import { IconButtonTooltip } from '@/components/custom-ui/tooltip'
import { cn } from '@/lib/utils'
import { useGist } from '@/shared/contexts/gistContext'
import { isMarkdownFile } from '@/shared/utils/gist-tools'
import { Copy, ExternalLink, Globe, Lock, Pencil, PencilLine, Trash } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import { FileSelector } from '../file-selector'
import { GistDeleteModal } from '../modals/gist-delete-modal'
import { GistDuplicateModal } from '../modals/gist-duplicate-modal'
import { GistEditModal } from '../modals/gist-edit-modal'
import { DownloadGistButtons } from './download-buttons'

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
    onDuplicateGist,
    onDeleteGist,
    onConvertPublicToPrivate,
  } = useGist()
  const { data: session, status: sessionStatus } = useSession()
  const router = useRouter()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
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

  const handleDeleteClick = useCallback(() => {
    setIsDeleteModalOpen(true)
  }, [])

  if (!selectedGist || !selectedFile) return null

  const isMD = isMarkdownFile(selectedFile.filename)
  const currentContent = fileContents[selectedFile.filename] || ''

  const isOwner =
    currentUserLogin &&
    selectedGist.owner?.login &&
    currentUserLogin.toLowerCase() === selectedGist.owner.login.toLowerCase()

  const canDuplicate = sessionStatus === 'authenticated'
  return (
    <header className='bg-background/95 sticky top-0 z-10 flex h-[60px] w-full items-center justify-between border-b px-4 backdrop-blur-sm'>
      <div className='flex items-center gap-3 overflow-hidden'>
        <div className='flex flex-col overflow-hidden'>
          <h3 className='truncate text-sm font-medium'>{selectedFile.filename}</h3>
          <span className='text-muted-foreground text-[10px] font-bold uppercase'>
            {selectedFile.language || 'Plain Text'}
          </span>
        </div>
        {/* Badge de visibilidade */}
        <div
          className={cn(
            'flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium',
            selectedGist.public
              ? 'bg-emerald-500/10 text-emerald-600'
              : 'bg-amber-500/10 text-amber-600',
          )}>
          {selectedGist.public ? <Globe className='h-3 w-3' /> : <Lock className='h-3 w-3' />}
          <span>{selectedGist.public ? 'Público' : 'Privado'}</span>
        </div>
      </div>
      <FileSelector />
      <div className='flex items-center gap-2'>
        <div className='bg-primary/20 flex items-center gap-1 rounded-md p-1'>
          <IconButtonTooltip
            content='Abrir em Nova Aba'
            onClick={() => window.open(selectedGist.html_url, '_blank')}
            icon={ExternalLink}
            className={{
              button: 'flex h-8 w-10 cursor-pointer items-center justify-center',
            }}
          />
          {isOwner && (
            <>
              <IconButtonTooltip
                content='Editar Detalhes'
                onClick={() => setIsEditModalOpen(true)}
                icon={PencilLine}
                className={{
                  button: 'flex h-8 w-10 cursor-pointer items-center justify-center',
                }}
              />
              <IconButtonTooltip
                content='Deletar Gist'
                onClick={handleDeleteClick}
                icon={Trash}
                className={{
                  button:
                    'text-destructive hover:text-destructive flex h-8 w-10 cursor-pointer items-center justify-center',
                }}
              />
            </>
          )}
          {canDuplicate && (
            <IconButtonTooltip
              content='Duplicar Gist'
              onClick={() => setIsDuplicateModalOpen(true)}
              icon={Copy}
              className={{
                button: 'flex h-8 w-10 cursor-pointer items-center justify-center',
              }}
            />
          )}
          {/* !! Refatorar para usar o novo editor */}
          {/* <Button
            variant='secondary'
            size='sm'
            onClick={() => {
              if (currentContent) {
                setMarkdown(wrapContentInMarkdown(selectedFile.filename, currentContent))
                toast.success('Carregado no editor!')
                // Se o usuário estiver logado e for o dono, passa o gist ID para edição
                if (isOwner && selectedGist) {
                  router.push(`/md-editor?gist=${selectedGist.id}`)
                } else {
                  router.push('/md-editor')
                }
              }
            }}>
            <FileEdit className='mr-1 h-4 w-4' />
          </Button> */}
        </div>
        <DownloadGistButtons
          onDownloadOriginal={onDownloadOriginal}
          onDownloadPackageMD={onDownloadPackageMD}
          handleDownloadPDF={handleDownloadPDF}
          isMD={isMD}
          isLoading={isLoading}
          handlePrint={handlePrint}
        />
      </div>
      <GistEditModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        gist={selectedGist}
        onSave={onUpdateGist}
        onConvertPublicToPrivate={onConvertPublicToPrivate}
      />
      <GistDuplicateModal
        open={isDuplicateModalOpen}
        onOpenChange={setIsDuplicateModalOpen}
        gist={selectedGist}
        onDuplicate={onDuplicateGist}
      />
      <GistDeleteModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        gist={selectedGist}
        onDelete={onDeleteGist}
      />
    </header>
  )
}
