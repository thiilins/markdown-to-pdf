'use client'

import { Button } from '@/components/ui/button'
import { useMDToPdf } from '@/shared/contexts/mdToPdfContext'
import { CloudDownload, Loader2, Printer } from 'lucide-react'
import { IconButtonTooltip } from '../custom-ui/tooltip'

export const PrintExportButtons = () => {
  const { onPrint, onDownloadPDF, isLoading, disabledDownload } = useMDToPdf()
  return (
    <div className='flex flex-1 items-center gap-2 rounded-md bg-blue-500/20 p-1'>
      <Button
        variant='outline'
        onClick={onPrint}
        className='flex h-8 w-10 cursor-pointer items-center justify-center'>
        <Printer className='h-4 w-4' />
      </Button>
      {!disabledDownload && (
        <IconButtonTooltip
          onClick={onDownloadPDF}
          content='Exportar PDF'
          className={{
            button: 'flex h-8 w-10 cursor-pointer items-center justify-center',
            icon: isLoading ? 'animate-spin' : '',
          }}
          icon={isLoading ? Loader2 : CloudDownload}
          disabled={isLoading}
        />
      )}
    </div>
  )
}
