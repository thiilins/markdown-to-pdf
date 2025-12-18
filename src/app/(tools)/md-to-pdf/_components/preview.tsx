'use client'
import { PreviewPanelWithPages } from '@/components/preview-panel/with-pages'
import { cn } from '@/lib/utils'
import { FloatingBar } from '@/shared/layouts/md-pdf/floating-bar'

export const MDToPdfPreview = ({ width = 'w-[50%]' }: { width?: string }) => {
  return (
    <div className={cn('flex h-full w-[50%] flex-col', width)}>
      <FloatingBar />
      <div className='min-h-0 flex-1'>
        <PreviewPanelWithPages />
      </div>
    </div>
  )
}
