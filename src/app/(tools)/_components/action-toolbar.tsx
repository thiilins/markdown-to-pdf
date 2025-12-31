'use client'
import { IconButtonTooltip } from '@/components/custom-ui/tooltip'
import { ZoomButtonsComponent } from '@/components/layout-components/zoom-buttons'
import { ENVIROMENT } from '@/env'
import { useApp } from '@/shared/contexts/appContext'
import { useMarkdown } from '@/shared/contexts/markdownContext'
import { CloudDownload, Edit, Loader2, Plus, Printer, RefreshCcw } from 'lucide-react'
import { FaExpand } from 'react-icons/fa'
import { ImportUrlButton } from './modals/import-url-modal'
import { FilesManager } from './editor-files-manager'
import { HeaderFooterBtns } from './header-footer-btns'
import { CreateMetaModal } from './modals/create-meta-modal'
import { EditMetaModal } from './modals/edit-meta-modal'
export const ActionToolbar = ({ additional, headerFooter }: EnableTools) => {
  const { onResetZoom, onPrint, onDownloadPDF, isLoading, disabledDownload } = useApp()
  const { onResetMarkdown, setOpenCreateMeta, setOpenEditMeta } = useMarkdown()
  return (
    <div className='bg-primary/10 flex w-full! items-center justify-center! gap-2 py-1'>
      <IconButtonTooltip
        variant='outline'
        icon={Plus}
        onClick={() => setOpenCreateMeta(true)}
        content='Novo arquivo'
        className={{
          button: 'flex h-8 w-10 cursor-pointer items-center justify-center',
        }}
      />
      <div className='flex w-[250px] items-center gap-1 rounded'>
        <FilesManager />
      </div>
      <IconButtonTooltip
        variant='outline'
        icon={Edit}
        onClick={() => setOpenEditMeta(true)}
        content='Editar arquivo'
        className={{
          button: 'flex h-8 w-10 cursor-pointer items-center justify-center',
        }}
      />
      <ZoomButtonsComponent />
      <IconButtonTooltip
        key='reset-zoom'
        onClick={onResetZoom}
        content='Resetar zoom'
        className={{
          button: 'flex h-8 w-10 cursor-pointer items-center justify-center',
        }}
        icon={FaExpand}
      />
      <IconButtonTooltip
        content='Imprimir'
        onClick={() => onPrint()}
        className={{
          button: 'flex h-8 w-10 cursor-pointer items-center justify-center',
        }}
        icon={Printer}
      />
      <IconButtonTooltip
        onClick={onDownloadPDF}
        content='Exportar PDF'
        className={{
          button: 'flex h-8 w-10 cursor-pointer items-center justify-center',
          icon: isLoading ? 'animate-spin' : '',
        }}
        icon={isLoading ? Loader2 : CloudDownload}
        hide={!ENVIROMENT.ENABLE_EXPORT || disabledDownload}
        disabled={isLoading || disabledDownload || isLoading}
      />
      <ImportUrlButton />

      <IconButtonTooltip
        icon={RefreshCcw}
        key='reset-editor-data'
        content='Resetar Markdown'
        onClick={onResetMarkdown}
      />
      {headerFooter && <HeaderFooterBtns key='header-footer' />}
      <div className='flex items-center gap-1 rounded-md'>
        {additional?.map((additional) => {
          return additional.component
        })}
      </div>
      <EditMetaModal />
      <CreateMetaModal />
    </div>
  )
}
