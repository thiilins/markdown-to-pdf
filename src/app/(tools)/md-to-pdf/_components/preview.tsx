'use client'
import { PreviewPanelWithPages } from '@/components/preview-panel/with-pages'
import { cn } from '@/lib/utils'
import { useMDToPdf } from '@/shared/contexts/mdToPdfContext'
import { useZoom } from '@/shared/contexts/zoomContext'
import { FloatingBar } from '@/shared/layouts/md-pdf/floating-bar'

export const MDToPdfPreview = ({ width = 'w-[50%]' }: { width?: string }) => {
  const { config, contentRef, markdown } = useMDToPdf()
  const { zoom } = useZoom()
  return (
    <div className={cn('flex h-full w-[50%] flex-col', width)}>
      <FloatingBar />
      <div className='min-h-0 flex-1'>
        <PreviewPanelWithPages
          markdown={markdown}
          pageConfig={config.page}
          typographyConfig={config.typography}
          themeConfig={config.theme}
          zoom={zoom}
          contentRef={contentRef}
        />
      </div>
    </div>
  )
}
