'use client'

import Link from 'next/link'
import * as React from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { Modules } from '@/shared/constants'
import { urlIsActive } from '@/shared/utils'
import { ChevronDownIcon, Toolbox } from 'lucide-react'
import { usePathname } from 'next/navigation'

export function HeaderNavigator() {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)

  const toolsIsActive =
    Modules.filter((module) => urlIsActive(pathname, module.href ?? '')).length > 0

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className={cn(
          'inline-flex h-9 cursor-pointer items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-all duration-300',
          'md:px-4',
          'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          'disabled:pointer-events-none disabled:opacity-50',
          toolsIsActive
            ? 'bg-primary hover:bg-primary/90 text-white'
            : 'bg-background text-primary hover:bg-primary/10',
        )}>
        <Toolbox className='h-4 w-4 md:mr-2' />
        <span className='hidden sm:inline'>Ferramentas</span>
        <ChevronDownIcon
          className={cn(
            'h-3 w-3 transition-transform duration-300',
            'ml-1 hidden sm:block',
            open && 'rotate-180',
          )}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='start'
        sideOffset={8}
        collisionPadding={16}
        className={cn('w-[calc(100vw-2rem)] max-w-[420px] p-3', 'md:p-3')}
        style={{
          maxWidth: 'min(420px, calc(100vw - 2rem))',
        }}>
        <div className='grid gap-1.5'>
          {Modules.map((module) => {
            const Icon = module.icon
            return (
              <MenuItem
                key={module.label}
                title={module.label}
                href={module.href || ''}
                icon={Icon}
                description={module.description}
                onSelect={() => setOpen(false)}
              />
            )
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function MenuItem({
  title,
  description,
  href,
  icon: Icon,
  onSelect,
}: {
  href: string
  icon?: React.ElementType
  description?: string
  title: string
  onSelect: () => void
}) {
  const pathname = usePathname()
  const isActive = urlIsActive(pathname, href)

  return (
    <DropdownMenuItem asChild>
      <Link
        href={href}
        onClick={onSelect}
        className={cn(
          'group flex items-start gap-2 rounded-lg p-2.5 transition-all',
          'md:gap-3 md:p-3',
          'hover:bg-accent hover:text-accent-foreground',
          'focus:bg-accent focus:text-accent-foreground',
          'active:bg-accent/80',
          'cursor-pointer outline-none',
          isActive && 'bg-accent text-accent-foreground',
        )}>
        {Icon && (
          <Icon
            className={cn(
              'mt-0.5 h-4 w-4 shrink-0 transition-colors',
              'md:h-5 md:w-5',
              isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground',
            )}
          />
        )}
        <div className='min-w-0 flex-1 space-y-0.5'>
          <div
            className={cn(
              'text-sm leading-none font-medium',
              isActive ? 'text-primary' : 'text-foreground',
            )}>
            {title}
          </div>
          {description && (
            <p className='text-muted-foreground line-clamp-2 text-xs leading-snug'>{description}</p>
          )}
        </div>
      </Link>
    </DropdownMenuItem>
  )
}
