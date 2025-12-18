import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

export const TooltipComponent = ({
  children,
  content,
  className,
  side = 'top',
  align = 'center',
  sideOffset = 2,
}: {
  children: React.ReactNode
  content: string
  className?: {
    trigger?: string
    content?: string
  }
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild className={className?.trigger}>
        {children}
      </TooltipTrigger>
      <TooltipContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        className={cn('bg-primary max-w-xs text-[12px]! text-white', className?.content)}>
        {content}
      </TooltipContent>
    </Tooltip>
  )
}
