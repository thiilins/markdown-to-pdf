'use client'
import { SettingsDialog } from '@/components/settings-modal'
import { useCallback, useState } from 'react'
import { PrintExportButtons } from './print-export-button'
import { ZoomButtonsComponent } from './zoom-buttons'
export const ActionToolbar = ({ zoom, printExport, settings }: EnableTools) => {
  const [open, setOpen] = useState(false)
  const handleOpen = useCallback(() => {
    setOpen(true)
  }, [])
  return (
    <>
      {zoom && <ZoomButtonsComponent />}
      {printExport && <PrintExportButtons handleOpen={handleOpen} />}
      {settings && <SettingsDialog open={open} setOpen={setOpen} />}
    </>
  )
}
