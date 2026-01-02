import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PanelLeftIcon } from 'lucide-react'

export const HeaderTools = ({
  children,
  openMobileMenu,
  setIsMobileMenuOpen,
  title,
  className,
  menuDisabled = false,
}: {
  children?: React.ReactNode
  openMobileMenu?: boolean
  menuDisabled?: boolean
  setIsMobileMenuOpen?: (open: boolean) => void
  title: string
  className?: string
}) => {
  return (
    <div
      className={cn(
        'z-20 flex h-12 w-full items-center border-b bg-white/80 px-4 py-2 backdrop-blur-sm dark:bg-zinc-950/80',
        className,
      )}>
      {!menuDisabled && (
        <Button variant='ghost' size='icon' onClick={() => setIsMobileMenuOpen?.(!openMobileMenu)}>
          <PanelLeftIcon className='h-5 w-5' />
        </Button>
      )}
      <span className='ml-2 text-sm font-medium'>{title}</span>
      {openMobileMenu && <>{children}</>}
    </div>
  )
}
