'use client'
import { PrintExportButtons } from './print-export-button'
import { ZoomButtonsComponent } from './zoom-buttons'
export const ActionToolbar = ({ zoom, printExport }: EnableTools) => {
  return (
    <>
      {zoom && <ZoomButtonsComponent />}
      {printExport && <PrintExportButtons />}
    </>
  )
}
