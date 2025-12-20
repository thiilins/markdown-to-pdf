import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useZoom } from '@/shared/contexts/zoomContext'
import { ZoomIn, ZoomOut } from 'lucide-react'

export const ZoomButtonsComponent = () => {
  const { zoom, onZoomIn, onZoomOut, onResetZoom } = useZoom()
  return (
    <div className='flex max-w-[180px] flex-1 items-center gap-1 rounded-md bg-blue-500/20 p-1'>
      <div className='flex w-full items-center gap-1 rounded-md bg-white'>
        <Button
          variant='ghost'
          onClick={onZoomOut}
          disabled={zoom <= 0.3}
          className='bg-background flex h-8 w-8 cursor-pointer items-center justify-center rounded-md p-0'>
          <ZoomOut className='h-4 w-4' />
        </Button>
        <span
          className={cn(
            'text-muted-foreground w-full rounded-md border-2 p-0.5 px-2 text-center text-sm',
            'min-w-12!',
          )}>
          {Math.round(zoom * 100)}%
        </span>
        <Button
          variant='ghost'
          onClick={onZoomIn}
          disabled={zoom >= 1.5}
          className='bg-background flex h-8 w-8 cursor-pointer items-center justify-center rounded-md p-0'>
          <ZoomIn className='h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}
