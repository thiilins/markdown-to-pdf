'use client'

import { ChevronDown, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { IconButtonTooltip } from '@/components/custom-ui/tooltip'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

import { CONFIG_MODAL_SHOW_OPTIONS } from '@/components/settings-modal/constants'
import { Modules } from '@/shared/constants'
import { useApp } from '@/shared/contexts/appContext'
import { urlIsActive, urlIsActiveWithSubmenu } from '@/shared/utils'
import UserNav from '../auth/user-nav'

// Tipagem local para auxiliar (se não estiver importada globalmente)
interface ModuleItem {
  label: string
  href?: string
  icon?: any
  submenu?: ModuleItem[]
}

/**
 * Botão de Navegação Principal
 * Design: Minimalista com indicador de "Ativo" sutil.
 */
const GlobalHeaderButton = ({ label, href, icon, submenu }: ModuleItem) => {
  const pathname = usePathname()
  const Icon = icon

  // --- Lógica para item SEM submenu ---
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
          {/* Indicador inferior (opcional para dar um toque "app") */}
          {isActive && (
            <span className='bg-primary absolute right-0 bottom-0 left-0 mx-auto h-[2px] w-3/4 rounded-full opacity-60' />
          )}
        </Link>
      </Button>
    )
  }

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
          <GlobalHeaderButtonSubmenu key={item.href} {...item} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/**
 * Item do Submenu
 */
const GlobalHeaderButtonSubmenu = ({ label, href, icon }: ModuleItem) => {
  const pathname = usePathname()
  const isActive = urlIsActive(pathname, href || '')
  const Icon = icon

  return (
    <DropdownMenuItem asChild>
      <Link
        href={href || '#'}
        className={cn(
          'focus:bg-accent flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors outline-none',
          isActive
            ? 'bg-primary/10 text-primary font-medium'
            : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground',
        )}>
        {Icon && <Icon className='h-4 w-4 shrink-0' />}
        <span>{label}</span>
      </Link>
    </DropdownMenuItem>
  )
}

/**
 * Container do Menu
 * (Agora é apenas uma DIV flexível, não um HEADER)
 */
export const GlobalHeaderMenu = () => {
  const pathname = usePathname()
  const { setIsConfigOpen } = useApp()
  const config = CONFIG_MODAL_SHOW_OPTIONS?.[pathname] ?? []
  const hasConfig = config.length > 0

  return (
    <div className='flex flex-1 items-center justify-between gap-4'>
      {/* Navegação Principal (Esquerda/Centro) */}
      <nav className='hidden items-center gap-1 md:flex'>
        {Modules.map((module) => (
          <GlobalHeaderButton key={module.label} {...module} />
        ))}
      </nav>

      {/* Área de Utilitários (Direita) */}
      <div className='ml-auto flex items-center gap-2 pl-4'>
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
