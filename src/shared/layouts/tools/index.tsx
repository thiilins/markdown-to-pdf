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
  // <div className={cn('flex min-h-screen flex-col items-center justify-center bg-linear-to-br p-4 md:p-8')}>

  return (
    <div
      className={cn(
        'from-background via-background to-muted/20 text-foreground flex h-full flex-col overflow-hidden bg-linear-to-br font-sans',
        className,
      )}>
      {children}
      {floatingComponent}
    </div>
  )
}
