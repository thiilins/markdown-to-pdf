'use client'

import { IconButtonTooltip } from '@/components/custom-ui/tooltip'
import { CONFIG_MODAL_SHOW_OPTIONS } from '@/components/settings-modal/constants'
import { cn } from '@/lib/utils'
import { useApp } from '@/shared/contexts/appContext'
import { AnimatePresence, motion } from 'framer-motion'
import { Github, History, Moon, Settings, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { usePathname, useRouter } from 'next/navigation'
import * as React from 'react'
import UserNav from './user-nav'

export const GlobalHeaderMenu = () => {
  const pathname = usePathname()
  const { setIsConfigOpen } = useApp()
  const hasConfig = (CONFIG_MODAL_SHOW_OPTIONS?.[pathname] ?? []).length > 0
  const [isLocalhost, setIsLocalhost] = React.useState(false)

  React.useEffect(() => {
    setIsLocalhost(
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
    )
  }, [])

  const router = useRouter()

  return (
    <div className='flex items-center gap-1'>
      {/* Ações */}
      <div className='flex items-center'>
        {/* Theme Toggle - só em localhost */}
        {isLocalhost && <ThemeToggle />}

        {/* GitHub */}
        <IconButtonTooltip
          variant='ghost'
          icon={Github}
          content='GitHub'
          onClick={() => window.open('https://github.com/thiilins', '_blank')}
          className={{
            button: cn(
              'h-9 w-9 rounded-xl text-zinc-400',
              'hover:bg-zinc-100 hover:text-zinc-700',
              'dark:hover:bg-zinc-800 dark:hover:text-zinc-200',
              'transition-colors',
            ),
            icon: 'h-[18px] w-[18px]',
          }}
        />

        {/* Settings */}
        {hasConfig && (
          <IconButtonTooltip
            variant='ghost'
            icon={Settings}
            onClick={() => setIsConfigOpen(true)}
            content='Configurações'
            className={{
              button: cn(
                'h-9 w-9 rounded-xl text-zinc-400',
                'hover:bg-primary/10 hover:text-primary',
                'transition-all duration-300 hover:rotate-90',
              ),
              icon: 'h-[18px] w-[18px]',
            }}
          />
        )}

        <IconButtonTooltip
          variant='ghost'
          icon={History}
          onClick={() => router.push('/changelog')}
          content='Changelog'
          className={{
            button: cn(
              'h-9 w-9 rounded-xl text-zinc-400',
              'hover:bg-primary/10 hover:text-primary',
              'transition-all duration-300 hover:rotate-90',
            ),
            icon: 'h-[18px] w-[18px]',
          }}
        />
      </div>

      {/* Separador */}
      <div className='mx-2 h-7 w-px bg-zinc-200 dark:bg-zinc-800' />

      {/* User */}
      <UserNav />
    </div>
  )
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className='flex h-9 w-9 items-center justify-center rounded-xl'>
        <div className='h-[18px] w-[18px] animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-700' />
      </div>
    )
  }

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'group relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl transition-all',
        'text-zinc-400',
        isDark
          ? 'hover:bg-amber-500/10 hover:text-amber-500'
          : 'hover:bg-indigo-500/10 hover:text-indigo-600',
      )}
      aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}>
      <AnimatePresence mode='wait' initial={false}>
        <motion.div
          key={isDark ? 'dark' : 'light'}
          initial={{ scale: 0, rotate: -90, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0, rotate: 90, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}>
          {isDark ? <Sun className='h-[18px] w-[18px]' /> : <Moon className='h-[18px] w-[18px]' />}
        </motion.div>
      </AnimatePresence>
    </button>
  )
}
