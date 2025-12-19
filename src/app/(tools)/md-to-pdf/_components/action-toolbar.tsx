'use client'
import { PrintExportButtons } from '@/components/layout-components/print-export-button'
import { ZoomButtonsComponent } from '@/components/layout-components/zoom-buttons'
import { ImportUrlButton } from './import-url-modal'
export const ActionToolbar = ({ zoom, printExport }: EnableTools) => {
  return (
    <>
      {zoom && <ZoomButtonsComponent />}
      {printExport && <PrintExportButtons />}
      <ImportUrlButton />
    </>
  )
}
