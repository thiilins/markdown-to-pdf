'use client'

import { Settings } from 'lucide-react'
import { usePathname } from 'next/navigation'

import { IconButtonTooltip } from '@/components/custom-ui/tooltip'
import { Separator } from '@/components/ui/separator'

import { CONFIG_MODAL_SHOW_OPTIONS } from '@/components/settings-modal/constants'
import { useApp } from '@/shared/contexts/appContext'
import UserNav from '../auth/user-nav'
import { HeaderNavigator } from './header-navigator'

// Tipagem local
interface ModuleItem {
  label: string
  href?: string
  icon?: any
  submenu?: ModuleItem[]
}

export const GlobalHeaderMenu = () => {
  const pathname = usePathname()
  const { setIsConfigOpen } = useApp()
  const config = CONFIG_MODAL_SHOW_OPTIONS?.[pathname] ?? []
  const hasConfig = config.length > 0

  return (
    <div className='flex items-center gap-2 pl-0 md:pl-4'>
      <HeaderNavigator />
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
  )
}
