'use client'

import { ChevronDown, Menu, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { IconButtonTooltip } from '@/components/custom-ui/tooltip'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

import { CONFIG_MODAL_SHOW_OPTIONS } from '@/components/settings-modal/constants'
import { Modules } from '@/shared/constants'
import { useApp } from '@/shared/contexts/appContext'
import { urlIsActive, urlIsActiveWithSubmenu } from '@/shared/utils'
import UserNav from '../auth/user-nav'

// Tipagem local
interface ModuleItem {
  label: string
  href?: string
  icon?: any
  submenu?: ModuleItem[]
}

// --- DESKTOP COMPONENTS ---

const DesktopHeaderButton = ({ label, href, icon, submenu }: ModuleItem) => {
  const pathname = usePathname()
  const Icon = icon

  // Item sem submenu
  if (!submenu || submenu.length === 0) {
    if (!href) return null
    const isActive = urlIsActive(pathname, href)

    return (
      <Button
        asChild
        variant='ghost'
        size='sm'
        className={cn(
          'relative h-9 gap-2 px-3 transition-all duration-300',
          isActive
            ? 'text-primary bg-primary/10 hover:bg-primary/15 font-medium'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/60',
        )}>
        <Link href={href}>
          {Icon && (
            <Icon
              className={cn('h-4 w-4 transition-colors', isActive ? 'text-primary' : 'opacity-70')}
            />
          )}
          <span>{label}</span>
          {isActive && (
            <span className='bg-primary absolute right-0 bottom-0 left-0 mx-auto h-[2px] w-3/4 rounded-full opacity-60' />
          )}
        </Link>
      </Button>
    )
  }

  // Item com submenu
  const isActive = urlIsActiveWithSubmenu(pathname, submenu as Modules[])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className={cn(
            'group data-[state=open]:bg-muted/50 h-9 gap-1.5 px-3 transition-all duration-200',
            isActive
              ? 'text-foreground bg-muted/40 font-medium'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/40',
          )}>
          {Icon && (
            <Icon
              className={cn('h-4 w-4 transition-colors', isActive ? 'text-primary' : 'opacity-70')}
            />
          )}
          <span>{label}</span>
          <ChevronDown className='h-3 w-3 opacity-50 transition-transform duration-300 group-data-[state=open]:rotate-180' />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align='start'
        sideOffset={8}
        className='animate-in fade-in-0 zoom-in-95 border-border/50 w-56 p-1.5 shadow-xl backdrop-blur-md'>
        {submenu.map((item) => (
          <DropdownMenuItem key={item.href} asChild>
            <Link
              href={item.href || '#'}
              className={cn(
                'focus:bg-accent flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors outline-none',
                urlIsActive(pathname, item.href || '')
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground',
              )}>
              {item.icon && <item.icon className='h-4 w-4 shrink-0' />}
              <span>{item.label}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// --- MOBILE COMPONENTS ---

export const MobileNav = () => {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant='ghost' size='icon' className='md:hidden'>
          <Menu className='h-5 w-5' />
          <span className='sr-only'>Menu</span>
        </Button>
      </SheetTrigger>
      {/* Aqui definimos o fundo branco explicitamente para o modo light */}
      <SheetContent side='left' className='w-[300px] bg-white sm:w-[400px] dark:bg-zinc-950'>
        <SheetHeader className='mb-6 text-left'>
          <SheetTitle className='flex items-center gap-2'>
            <span className='text-primary font-bold'>Menu</span>
          </SheetTitle>
        </SheetHeader>

        <div className='flex flex-col gap-1'>
          {Modules.map((module) => {
            const Icon = module.icon

            // Se não tiver submenu
            if (!module.submenu || module.submenu.length === 0) {
              const isActive = urlIsActive(pathname, module.href || '')
              return (
                <Link
                  key={module.label}
                  href={module.href || '#'}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}>
                  {Icon && <Icon className='h-5 w-5' />}
                  {module.label}
                </Link>
              )
            }

            // Se tiver submenu (Accordion)
            const isActiveParent = urlIsActiveWithSubmenu(pathname, module.submenu as Modules[])

            return (
              <Accordion
                type='single'
                collapsible
                key={module.label}
                className='w-full border-none'>
                <AccordionItem value={module.label} className='border-none'>
                  <AccordionTrigger
                    className={cn(
                      'px-3 py-3 text-sm font-medium hover:no-underline',
                      isActiveParent ? 'text-primary' : 'text-muted-foreground',
                    )}>
                    <div className='flex items-center gap-3'>
                      {Icon && <Icon className='h-5 w-5' />}
                      {module.label}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className='pb-2 pl-4'>
                    <div className='flex flex-col space-y-1 border-l pl-2'>
                      {module.submenu.map((sub) => {
                        const isSubActive = urlIsActive(pathname, sub.href || '')
                        return (
                          <Link
                            key={sub.label}
                            href={sub.href || '#'}
                            onClick={() => setOpen(false)}
                            className={cn(
                              'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                              isSubActive
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                            )}>
                            {sub.icon && <sub.icon className='h-4 w-4' />}
                            {sub.label}
                          </Link>
                        )
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )
          })}
        </div>
      </SheetContent>
    </Sheet>
  )
}

// --- MAIN EXPORT ---

export const GlobalHeaderMenu = () => {
  const pathname = usePathname()
  const { setIsConfigOpen } = useApp()
  const config = CONFIG_MODAL_SHOW_OPTIONS?.[pathname] ?? []
  const hasConfig = config.length > 0

  return (
    <div className='flex flex-1 items-center justify-end gap-2 md:justify-between md:gap-4'>
      {/* Mobile Trigger (Esquerda no mobile, oculto no desktop) */}

      {/* Navegação Desktop (Centro/Esquerda) */}
      <nav className='hidden items-center gap-1 md:flex'>
        {Modules.map((module) => (
          <DesktopHeaderButton key={module.label} {...module} />
        ))}
      </nav>

      {/* Área de Utilitários (Direita) */}
      <div className='flex items-center gap-2 pl-0 md:pl-4'>
        {hasConfig && (
          <div className='flex items-center gap-1'>
            <IconButtonTooltip
              variant='ghost'
              icon={Settings}
              onClick={() => setIsConfigOpen(true)}
              content='Configurações da Página'
              className={{
                button:
                  'text-muted-foreground hover:text-foreground hover:bg-muted h-8 w-8 rounded-full transition-all duration-300 hover:rotate-45',
                icon: 'h-4 w-4',
              }}
            />
            <Separator orientation='vertical' className='bg-border/40 mx-2 h-5' />
          </div>
        )}

        <UserNav />
      </div>
    </div>
  )
}
