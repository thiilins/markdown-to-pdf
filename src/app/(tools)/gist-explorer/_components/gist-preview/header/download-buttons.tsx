'use client'
import { FaMarkdown } from 'react-icons/fa'

import { IconButtonTooltip } from '@/components/custom-ui/tooltip'
import { ENVIROMENT } from '@/env'
import { CloudDownload, Loader2, Printer } from 'lucide-react'
import { FaFilePdf } from 'react-icons/fa6'

export const DownloadGistButtons = ({
  onDownloadOriginal,
  onDownloadPackageMD,
  handleDownloadPDF,
  isMD,
  isLoading,
  handlePrint,
}: {
  onDownloadOriginal: () => void
  onDownloadPackageMD: () => void
  handleDownloadPDF: () => void
  isMD: boolean
  isLoading: boolean
  handlePrint: () => void
}) => {
  return (
    <div className='bg-primary/20 flex items-center gap-1 rounded-md p-1'>
      <IconButtonTooltip
        content='Baixar Original'
        onClick={onDownloadOriginal}
        icon={CloudDownload}
        className={{
          button: 'flex h-8 w-10 cursor-pointer items-center justify-center',
        }}
      />
      <IconButtonTooltip
        content='Baixar Original'
        onClick={onDownloadPackageMD}
        icon={FaMarkdown}
        className={{
          button: 'flex h-8 w-10 cursor-pointer items-center justify-center',
        }}
      />
      <IconButtonTooltip
        onClick={handleDownloadPDF}
        content='Exportar PDF'
        className={{
          button:
            'flex h-8 w-10 cursor-pointer items-center justify-center bg-blue-600 font-bold text-white hover:bg-blue-700',
        }}
        icon={isLoading ? Loader2 : FaFilePdf}
        disabled={!isMD || isLoading || !ENVIROMENT.ENABLE_EXPORT}
        hide={!ENVIROMENT.ENABLE_EXPORT || !isMD}
      />
      <IconButtonTooltip
        onClick={handlePrint}
        content='Imprimir'
        icon={Printer}
        className={{
          button: 'flex h-8 w-10 cursor-pointer items-center justify-center',
        }}
        hide={!isMD}
        disabled={!isMD}
      />
    </div>
  )
}
