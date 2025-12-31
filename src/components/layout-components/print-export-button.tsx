'use client'

import { Button } from '@/components/ui/button'
import { ENVIROMENT } from '@/env'
import { CloudDownload, Loader2, Printer } from 'lucide-react'
import { IconButtonTooltip } from '../custom-ui/tooltip'
import { useApp } from '@/shared/contexts/appContext'

export const PrintExportButtons = () => {
  const { onPrint, onDownloadPDF, isLoading, disabledDownload } = useApp()
  return <div className='flex items-center gap-1 rounded-md'></div>
}
