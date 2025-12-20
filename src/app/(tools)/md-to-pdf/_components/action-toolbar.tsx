'use client'
import { IconButtonTooltip } from '@/components/custom-ui/tooltip'
import { PrintExportButtons } from '@/components/layout-components/print-export-button'
import { ZoomButtonsComponent } from '@/components/layout-components/zoom-buttons'
import { useHeaderFooter } from '@/shared/contexts/headerFooterContext'
import { useZoom } from '@/shared/contexts/zoomContext'
import { BrushCleaning } from 'lucide-react'
import { FaExpand } from 'react-icons/fa'
import { HeaderFooterButton } from './header-footer-modal'
import { ImportUrlButton } from './import-url-modal'

export const ActionToolbar = ({ zoom, printExport }: EnableTools) => {
  const { onResetZoom } = useZoom()
  const { onResetHeaderFooter } = useHeaderFooter()

  return (
    <div className='rounded-nonep-1 flex items-center justify-center gap-2 px-21 py-2'>
      {zoom && <ZoomButtonsComponent />}
      <div className='flex items-center gap-1 rounded-md'>
        <IconButtonTooltip
          onClick={onResetZoom}
          content='Resetar zoom'
          className={{
            button: 'flex h-8 w-10 cursor-pointer items-center justify-center',
          }}
          icon={FaExpand}
        />
        <IconButtonTooltip
          onClick={onResetHeaderFooter}
          content='Resetar Cabeçalho e Rodapé'
          className={{
            button: 'flex h-8 w-10 cursor-pointer items-center justify-center',
          }}
          icon={BrushCleaning}
        />
        {printExport && <PrintExportButtons />}
        <ImportUrlButton />
        <HeaderFooterButton />
      </div>
    </div>
  )
}
