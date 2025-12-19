import { cn } from '@/lib/utils'
export const ToolsLayoutComponent = ({
  children,
  className,
  floatingComponent = null,
}: {
  children: React.ReactNode
  className?: string
  breadcrumbs?: Breadcrumbs[]
  floatingComponent?: React.ReactNode
}) => {
  return (
    <div
      className={cn(
        'bg-background text-foreground flex h-full flex-col overflow-hidden font-sans',
        className,
      )}>
      {children}
      {floatingComponent}
    </div>
  )
}
