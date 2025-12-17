'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { Modules } from '@/shared/constants'
import { urlIsActive, urlIsActiveWithSubmenu } from '@/shared/utils'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import UserNav from '../auth/user-nav'

const GlobalHeaderButton = ({ label, href, icon, submenu }: ModuleItem) => {
  const pathname = usePathname()
  const Icon = icon
  if (!submenu || submenu.length === 0) {
    if (!href) return null
    const isActive = urlIsActive(pathname, href)
    return (
      <Button asChild variant='outline' size='sm' className={cn('gap-2', isActive && 'bg-accent')}>
        <Link href={href} className='flex items-center gap-2'>
          {Icon && <Icon className='h-4 w-4 shrink-0' />}
          <span>{label}</span>
        </Link>
      </Button>
    )
  }

  const isActive = urlIsActiveWithSubmenu(pathname, submenu)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='sm' className={cn('gap-2', isActive && 'bg-accent')}>
          {Icon && <Icon className='h-4 w-4 shrink-0' />}
          <span>{label}</span>
          <ChevronDown className='h-3 w-3 shrink-0 opacity-50' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='min-w-[200px]'>
        {submenu.map((item) => (
          <GlobalHeaderButtonSubmenu key={item.href} {...item} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const GlobalHeaderButtonSubmenu = ({ label, href, icon }: Modules) => {
  const pathname = usePathname()
  const isActive = urlIsActive(pathname, href || '')
  const Icon = icon

  return (
    <DropdownMenuItem asChild>
      <Link
        href={href || '#'}
        className={cn(
          'flex cursor-pointer items-center gap-2',
          isActive && 'bg-accent font-medium',
        )}>
        {Icon && <Icon className='h-4 w-4 shrink-0' />}
        <span>{label}</span>
      </Link>
    </DropdownMenuItem>
  )
}
export function GlobalHeaderMenu() {
  return (
    <nav className='flex items-center justify-center gap-2 px-3'>
      {Modules.map((module) => {
        return <GlobalHeaderButton key={module.label} {...module} />
      })}
      <UserNav />
    </nav>
  )
}
