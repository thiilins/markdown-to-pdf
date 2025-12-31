import { cn } from '@/lib/utils'
import { Button, ButtonProps } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
interface TooltipComponentProps {
  children: React.ReactNode
  content: string
  className?: {
    trigger?: string
    content?: string
  }
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  disabled?: boolean
}
export const TooltipComponent = ({
  children,
  content,
  className,
  side = 'top',
  align = 'center',
  sideOffset = 2,
  disabled = false,
}: TooltipComponentProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild disabled={disabled} className={className?.trigger}>
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
interface IconButtonTooltipProps extends Omit<
  TooltipComponentProps,
  'children' | 'content' | 'className'
> {
  icon: React.ElementType
  onClick?: () => void
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  variant?: ButtonProps['variant']
  sideOffset?: number
  content: string
  hide?: boolean
  disabled?: boolean
  className?: {
    trigger?: string
    content?: string
    button?: string
    icon?: string
  }
}
export const IconButtonTooltip = ({
  icon,
  onClick,
  className,
  hide = false,
  content,
  disabled = false,
  variant = 'outline',
  ...props
}: IconButtonTooltipProps) => {
  const Icon = icon
  if (hide) return null
  return (
    <TooltipComponent content={content} className={className} disabled={disabled} {...props}>
      <Button
        disabled={disabled}
        variant={variant}
        onClick={onClick}
        className={cn(
          'flex h-8 w-10 cursor-pointer items-center justify-center',
          className?.button,
        )}>
        <Icon className={cn('h-4 w-4', className?.icon)} />
      </Button>
    </TooltipComponent>
  )
}
