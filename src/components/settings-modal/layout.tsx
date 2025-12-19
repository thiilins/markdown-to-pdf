import { cn } from '@/lib/utils'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import { CONFIG_MODAL_COLORS } from './constants'

export const SettingsCard = ({
  children,
  type,
  className,
  footer,
}: {
  children: React.ReactNode
  type: SettingsModalTabsOptions
  className?: {
    content?: string
    footer?: string
  }
  footer?: React.ReactNode
}) => {
  const config = CONFIG_MODAL_COLORS[type]
  return (
    <Card>
      <HeaderCard {...config} />
      <CardContent className={cn('flex flex-col gap-3', className?.content)}>
        {children}
      </CardContent>
      {footer && <CardFooter className={cn('flex gap-3', className?.footer)}>{footer}</CardFooter>}
    </Card>
  )
}

export const HeaderCard = ({ color, description, title, icon }: HeaderCardProps) => {
  const Icon = icon
  return (
    <CardHeader className={cn('bg-background/80 border-background rounded-md border py-3')}>
      <div className='flex items-center gap-2'>
        <div
          className={cn(
            'rounded-lg bg-linear-to-br p-2 text-white',
            color.icon.from,
            color.icon.to,
          )}>
          <Icon className='h-8 w-8' />
        </div>
        <div>
          <h3 className='text-foreground text-sm font-semibold'>{title}</h3>
          <p className='text-muted-foreground text-xs'>{description}</p>
        </div>
      </div>
    </CardHeader>
  )
}
