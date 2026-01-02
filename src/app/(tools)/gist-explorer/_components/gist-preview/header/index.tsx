'use client'

import { IconButtonTooltip } from '@/components/custom-ui/tooltip'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useGist } from '@/shared/contexts/gistContext'
import { useMarkdown } from '@/shared/contexts/markdownContext'
import { isMarkdownFile } from '@/shared/utils/gist-tools'
import {
  ChevronRight,
  CloudDownload,
  Copy,
  ExternalLink,
  FileEdit,
  FileText,
  Globe,
  Loader2,
  Lock,
  MoreVertical,
  PencilLine,
  Printer,
  Trash,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { FaMarkdown } from 'react-icons/fa'
import { FaFilePdf } from 'react-icons/fa6'
import { useReactToPrint } from 'react-to-print'
import { toast } from 'sonner'
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

  const { onLoadGistFromExplorer } = useMarkdown()
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

  useEffect(() => {
    if (session?.accessToken && !currentUserLogin) {
      fetch('/api/user')
        .then((res) => res.json())
        .then((data) => {
          if (data.login) setCurrentUserLogin(data.login)
        })
        .catch(() => {})
    }
  }, [session?.accessToken, currentUserLogin])

  const handleOpenInEditor = useCallback(async () => {
    if (!selectedGist || !fileContents) {
      toast.error('Gist ou conteúdo não encontrado')
      return
    }
    try {
      await onLoadGistFromExplorer(selectedGist, fileContents)
      router.push('/md-editor')
    } catch (error) {
      toast.error('Erro ao carregar gist no editor')
    }
  }, [selectedGist, fileContents, onLoadGistFromExplorer, router])

  if (!selectedGist || !selectedFile) return null

  const isMD = isMarkdownFile(selectedFile.filename)
  const isOwner =
    currentUserLogin &&
    selectedGist.owner?.login &&
    currentUserLogin.toLowerCase() === selectedGist.owner.login.toLowerCase()

  const actionBtnClass =
    'h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors'

  return (
    <header className='bg-background/80 sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b px-4 backdrop-blur-xl transition-all sm:px-6'>
      {/* Esquerda: Breadcrumbs e Info */}
      <div className='flex items-center gap-4 overflow-hidden'>
        <div className='flex items-center gap-2 overflow-hidden'>
          {/* Ícone decorativo - Oculto em telas muito pequenas */}
          <div className='bg-muted/20 hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border sm:flex'>
            <FileText className='text-primary h-4 w-4' />
          </div>

          <div className='flex flex-col overflow-hidden'>
            {/* Caminho: User > Arquivo */}
            <div className='text-muted-foreground flex items-center gap-1.5 text-xs'>
              <span className='hover:text-foreground cursor-default font-medium transition-colors'>
                {selectedGist.owner?.login}
              </span>
              <ChevronRight className='h-3 w-3 opacity-40' />
            </div>

            <div className='flex items-center gap-2 overflow-hidden'>
              <h3 className='text-foreground truncate text-sm font-semibold tracking-tight'>
                {selectedFile.filename}
              </h3>

              {/* Badge de Privacidade */}
              <div
                className={cn(
                  'flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wide uppercase ring-1 ring-inset',
                  selectedGist.public
                    ? 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 dark:text-emerald-400'
                    : 'bg-amber-500/10 text-amber-600 ring-amber-500/20 dark:text-amber-400',
                )}>
                {selectedGist.public ? (
                  <Globe className='h-2.5 w-2.5' />
                ) : (
                  <Lock className='h-2.5 w-2.5' />
                )}
                <span className='xs:inline hidden'>
                  {selectedGist.public ? 'Public' : 'Private'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Centro: Seletor de Arquivos (Apenas Desktop Grande) */}
      <div className='hidden flex-1 justify-center px-4 lg:flex'>
        <div className='w-full max-w-sm'>
          <FileSelector />
        </div>
      </div>

      {/* Direita: Toolbar de Ações */}
      <div className='flex items-center gap-2 sm:gap-3'>
        {/* === MODO DESKTOP (MD+) === */}
        <div className='hidden items-center gap-3 md:flex'>
          <div className='bg-background/50 flex items-center gap-1 rounded-md border p-1 shadow-sm'>
            <IconButtonTooltip
              content='Ver no GitHub'
              onClick={() => window.open(selectedGist.html_url, '_blank')}
              icon={ExternalLink}
              className={{ button: actionBtnClass }}
            />

            {/* Ações do Dono */}
            {isOwner && (
              <>
                <IconButtonTooltip
                  content='Editar Detalhes'
                  onClick={() => setIsEditModalOpen(true)}
                  icon={PencilLine}
                  className={{ button: actionBtnClass }}
                />
                <IconButtonTooltip
                  content='Deletar Gist'
                  onClick={() => setIsDeleteModalOpen(true)}
                  icon={Trash}
                  className={{
                    button: cn(actionBtnClass, 'hover:text-destructive hover:bg-destructive/10'),
                  }}
                />
              </>
            )}

            {sessionStatus === 'authenticated' && (
              <IconButtonTooltip
                content='Duplicar Gist'
                onClick={() => setIsDuplicateModalOpen(true)}
                icon={Copy}
                className={{ button: actionBtnClass }}
              />
            )}
          </div>

          <Separator orientation='vertical' className='h-6' />

          {/* Download Buttons Component */}
          <DownloadGistButtons
            onDownloadOriginal={onDownloadOriginal}
            onDownloadPackageMD={onDownloadPackageMD}
            handleDownloadPDF={handleDownloadPDF}
            isMD={isMD}
            isLoading={isLoading}
            handlePrint={handlePrint}
          />

          <Separator orientation='vertical' className='h-6' />

          <Button
            size='sm'
            onClick={handleOpenInEditor}
            className='bg-primary text-primary-foreground hover:bg-primary/90 hidden h-9 items-center gap-2 px-4 font-semibold shadow transition-all hover:shadow-md active:scale-95 sm:flex'>
            <FileEdit className='h-4 w-4' />
            Editor
          </Button>
        </div>

        {/* === MODO MOBILE (< MD) === */}
        <div className='flex md:hidden'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='icon' className='h-8 w-8'>
                <MoreVertical className='h-4 w-4' />
                <span className='sr-only'>Ações</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56'>
              <FileSelector />
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Ações do Arquivo</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleOpenInEditor}>
                  <FileEdit className='mr-2 h-4 w-4' />
                  <span>Abrir no Editor</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.open(selectedGist.html_url, '_blank')}>
                  <ExternalLink className='mr-2 h-4 w-4' />
                  <span>Ver no GitHub</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel className='text-muted-foreground text-xs font-normal'>
                  Downloads
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={onDownloadOriginal}>
                  <CloudDownload className='mr-2 h-4 w-4' />
                  <span>Baixar Original</span>
                </DropdownMenuItem>

                {isMD && (
                  <DropdownMenuItem onClick={onDownloadPackageMD}>
                    <FaMarkdown className='mr-2 h-4 w-4' />
                    <span>Baixar Markdown</span>
                  </DropdownMenuItem>
                )}

                {isMD && (
                  <DropdownMenuItem
                    onClick={handleDownloadPDF}
                    disabled={isLoading}
                    className={cn(isLoading && 'opacity-50')}>
                    {isLoading ? (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    ) : (
                      <FaFilePdf className='mr-2 h-4 w-4' />
                    )}
                    <span>Exportar PDF</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handlePrint} disabled={isLoading}>
                  <Printer className='mr-2 h-4 w-4' />
                  <span>Imprimir</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              {(isOwner || sessionStatus === 'authenticated') && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className='text-muted-foreground text-xs font-normal'>
                      Gerenciar
                    </DropdownMenuLabel>
                    {sessionStatus === 'authenticated' && (
                      <DropdownMenuItem onClick={() => setIsDuplicateModalOpen(true)}>
                        <Copy className='mr-2 h-4 w-4' />
                        <span>Duplicar</span>
                      </DropdownMenuItem>
                    )}

                    {isOwner && (
                      <>
                        <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                          <PencilLine className='mr-2 h-4 w-4' />
                          <span>Editar Detalhes</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setIsDeleteModalOpen(true)}
                          className='text-destructive focus:text-destructive focus:bg-destructive/10'>
                          <Trash className='mr-2 h-4 w-4' />
                          <span>Deletar</span>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuGroup>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Modais */}
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
