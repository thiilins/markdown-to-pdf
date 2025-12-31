'use client'

import { IconButtonTooltip } from '@/components/custom-ui/tooltip'
import { ZoomButtonsComponent } from '@/components/layout-components/zoom-buttons'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ENVIROMENT } from '@/env'
import { cn } from '@/lib/utils'
import { useApp } from '@/shared/contexts/appContext'
import { useMarkdown } from '@/shared/contexts/markdownContext'
import {
  CloudDownload,
  Edit,
  FileDown,
  Github,
  Loader2,
  Maximize2,
  Plus,
  Printer,
  RefreshCcw,
  Save,
  Trash,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useMemo } from 'react'
import { FaGithub } from 'react-icons/fa'
import { FilesManager } from './editor-files-manager'
import { HeaderFooterBtns } from './header-footer-btns'
import { CreateMetaModal } from './modals/create-meta-modal'
import { DeleteDocumentModal } from './modals/delete-document-modal'
import { DownloadDocumentModal } from './modals/download-document-modal'
import { EditMetaModal } from './modals/edit-meta-modal'
import { ImportUrlButton } from './modals/import-url-modal'

interface EnableTools {
  additional?: { component: React.ReactNode }[]
  headerFooter?: boolean
}

export const ActionToolbar = ({ additional, headerFooter }: EnableTools) => {
  const { onResetZoom, onPrint, onDownloadPDF, isLoading, disabledDownload } = useApp()
  const { data: session, status: sessionStatus } = useSession()
  const {
    onResetMarkdown,
    setOpenCreateMeta,
    setOpenEditMeta,
    setOpenDeleteDocument,
    setOpenDownloadDocument,
    isGistMode,
    canSaveGist,
    currentGistId,
    gistMetadataMap,
    onUpdateGist,
    onSaveAsGist,
  } = useMarkdown()

  const isAuthenticated = sessionStatus === 'authenticated'

  const gistName = useMemo(() => {
    if (!isGistMode || !currentGistId) return null
    const metadata = Object.values(gistMetadataMap).find((meta) => meta.gistId === currentGistId)
    return metadata?.description || currentGistId.slice(0, 8)
  }, [isGistMode, currentGistId, gistMetadataMap])

  // Estilo padrão garantindo que o ícone não encolha (shrink-0)
  const btnClass =
    'h-9 w-9 p-0 flex items-center justify-center shrink-0 transition-all hover:bg-accent hover:text-accent-foreground'

  return (
    <div className='bg-background/95 sticky top-0 z-10 flex w-full flex-col border-b backdrop-blur-md'>
      {/* Status Bar do Gist - Agora com tratamento de overflow lateral */}
      {isGistMode && (
        <div className='bg-primary/5 animate-in fade-in slide-in-from-top-1 no-scrollbar flex h-9 w-full items-center justify-between overflow-x-auto border-b px-4'>
          <div className='flex shrink-0 items-center gap-2'>
            <Badge
              variant='outline'
              className='bg-background border-primary/20 gap-1.5 py-1 font-normal whitespace-nowrap'>
              <FaGithub className='text-primary h-3.5 w-3.5' />
              <span className='text-[11px]'>
                Editando Gist: <strong className='font-semibold'>{gistName}</strong>
              </span>
              {!canSaveGist && (
                <span className='text-muted-foreground ml-1 text-[10px]'>(View Mode)</span>
              )}
            </Badge>
          </div>

          <div className='flex shrink-0 items-center pl-4'>
            <IconButtonTooltip
              variant='ghost'
              icon={Save}
              onClick={onUpdateGist}
              content={canSaveGist ? 'Atualizar Gist no GitHub' : 'Salvar como Novo Gist'}
              className={{ button: cn(btnClass, 'text-primary hover:bg-primary/10 h-7 w-9') }}
            />
          </div>
        </div>
      )}

      {/* Toolbar Principal com Scroll Horizontal */}
      <div className='no-scrollbar flex h-14 w-full touch-pan-x items-center gap-2 overflow-x-auto scroll-smooth px-3'>
        {/* Grupo: Arquivos */}
        <div className='flex shrink-0 items-center gap-1'>
          <IconButtonTooltip
            variant='ghost'
            icon={Plus}
            onClick={() => setOpenCreateMeta(true)}
            content='Novo arquivo'
            className={{ button: btnClass }}
          />
          {/* FilesManager com largura mínima controlada no mobile */}
          <div className='xs:w-48 w-40 shrink-0 sm:w-64'>
            <FilesManager />
          </div>
          <IconButtonTooltip
            variant='ghost'
            icon={Edit}
            onClick={() => setOpenEditMeta(true)}
            content='Renomear/Editar'
            className={{ button: btnClass }}
          />
          <IconButtonTooltip
            variant='ghost'
            icon={Trash}
            onClick={() => setOpenDeleteDocument(true)}
            content='Deletar'
            className={{
              button: cn(
                btnClass,
                'text-destructive hover:bg-destructive/10 hover:text-destructive',
              ),
            }}
          />
        </div>

        <Separator orientation='vertical' className='mx-1 h-7 shrink-0' />

        {/* Grupo: Visualização */}
        <div className='flex shrink-0 items-center gap-1'>
          <ZoomButtonsComponent />
          <IconButtonTooltip
            variant='ghost'
            icon={Maximize2}
            onClick={onResetZoom}
            content='Resetar Zoom'
            className={{ button: btnClass }}
          />
        </div>

        <Separator orientation='vertical' className='mx-1 h-7 shrink-0' />

        {/* Grupo: Exportação */}
        <div className='flex shrink-0 items-center gap-1'>
          <IconButtonTooltip
            variant='ghost'
            icon={FileDown}
            onClick={() => setOpenDownloadDocument(true)}
            content='Exportar como...'
            className={{ button: btnClass }}
          />
          <IconButtonTooltip
            variant='ghost'
            icon={Printer}
            onClick={() => onPrint()}
            content='Imprimir'
            className={{ button: btnClass }}
          />
          <IconButtonTooltip
            variant='ghost'
            onClick={onDownloadPDF}
            content='Gerar PDF'
            className={{
              button: btnClass,
              icon: isLoading ? 'animate-spin' : '',
            }}
            icon={isLoading ? Loader2 : CloudDownload}
            hide={!ENVIROMENT.ENABLE_EXPORT || disabledDownload}
            disabled={isLoading || disabledDownload}
          />
          <div className='shrink-0'>
            <ImportUrlButton />
          </div>
        </div>

        <Separator orientation='vertical' className='mx-1 h-7 shrink-0' />

        {/* Grupo: Sincronização & Reset */}
        <div className='flex shrink-0 items-center gap-1'>
          {isAuthenticated && (
            <IconButtonTooltip
              variant='ghost'
              icon={Github}
              onClick={onSaveAsGist}
              content='Sincronizar Gist'
              className={{ button: cn(btnClass, 'hover:text-primary') }}
            />
          )}
          <IconButtonTooltip
            variant='ghost'
            icon={RefreshCcw}
            content='Limpar Editor'
            onClick={onResetMarkdown}
            className={{ button: btnClass }}
          />

          {headerFooter && (
            <>
              <Separator orientation='vertical' className='mx-1 h-7 shrink-0' />
              <div className='shrink-0'>
                <HeaderFooterBtns />
              </div>
            </>
          )}

          {/* Componentes Adicionais */}
          {additional && additional.length > 0 && (
            <div className='ml-1 flex shrink-0 items-center gap-2 border-l pl-2'>
              {additional.map((item, idx) => (
                <div key={`additional-${idx}`} className='shrink-0'>
                  {item.component}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modais */}
      <div className='hidden'>
        <DeleteDocumentModal />
        <DownloadDocumentModal />
        <EditMetaModal />
        <CreateMetaModal />
      </div>
    </div>
  )
}
