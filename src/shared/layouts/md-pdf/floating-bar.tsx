'use client'
import { FloatingPanel } from '@/components/custom-ui/floating-components/floating-panel'
import { ActionToolbar } from '@/components/layout-components/action-toolbar'

export const FloatingBar = () => {
  return (
    <FloatingPanel width='w-auto' height='h-auto' storageKey='md-pdf-floating-bar'>
      <ActionToolbar zoom printExport settings />
    </FloatingPanel>
  )
}
