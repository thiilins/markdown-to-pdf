import { cn } from '@/lib/utils'

export const SectionBox = ({
  title,
  icon: Icon,
  children,
  className,
  additionalContent,
}: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
  className?: string
  additionalContent?: React.ReactNode
}) => {
  return (
    <div className={cn('bg-card rounded-lg border p-2 shadow-sm', className)}>
      <header className='mb-4 flex items-center justify-between'>
        <div className='flex items-center gap-2 text-sm font-semibold'>
          <Icon className='text-primary h-4 w-4' />
          {title}
        </div>
        {additionalContent && <div className='flex items-center gap-2'>{additionalContent}</div>}
      </header>
      {children}
    </div>
  )
}
