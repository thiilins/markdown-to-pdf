'use client'

import { Button } from '@/components/ui/button'
import { useMDToPdf } from '@/shared/contexts/mdToPdfContext'
import { CloudDownload, Loader2, Printer, Settings } from 'lucide-react'

export const PrintExportButtons = ({ handleOpen }: { handleOpen: () => void }) => {
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
        <Button
          variant='default'
          onClick={onDownloadPDF}
          className='flex h-8 w-10 cursor-pointer items-center justify-center'
          disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className='h-4 w-4 animate-spin' />
            </>
          ) : (
            <>
              <CloudDownload className='h-4 w-4' />
            </>
          )}
        </Button>
      )}
      <Button
        variant='outline'
        onClick={handleOpen}
        className='flex h-8 w-10 cursor-pointer items-center justify-center'>
        <Settings className='h-4 w-4' />
      </Button>
    </div>
  )
}
