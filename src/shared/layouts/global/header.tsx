'use client'

import { cn } from '@/lib/utils'
import { Command } from 'lucide-react'
import Link from 'next/link'
import { GlobalHeaderMenu } from './header-menu'
import { HeaderNavigator } from './header-navigator'

export const GlobalHeaderComponent = () => {
  return (
    <header className='sticky top-0 z-50 w-full'>
      {/* Barra primary no topo */}
      <div className='bg-primary h-1' />

      <nav className='border-b border-zinc-200/60 bg-white/95 backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-950/95'>
        <div className='mx-auto flex h-14 max-w-screen-2xl items-center justify-between gap-4 px-4 sm:px-6'>
          {/* Esquerda: Logo */}
          <GlobalLogoComponent />

          {/* Centro: Menu de Ferramentas (destaque) */}
          <div className='flex flex-1 items-center justify-center'>
            <HeaderNavigator />
          </div>

          {/* Direita: Ações */}
          <GlobalHeaderMenu />
        </div>
      </nav>
    </header>
  )
}

const GlobalLogoComponent = () => {
  return (
    <Link href='/' className='group flex shrink-0 items-center gap-2.5 outline-none'>
      {/* Ícone */}
      <div
        className={cn(
          'relative flex h-9 w-9 items-center justify-center rounded-lg',
          'bg-primary text-white',
          'shadow-primary/30 shadow-md',
          'transition-transform duration-200',
          'group-hover:scale-105 group-active:scale-95',
        )}>
        <Command className='h-4.5 w-4.5' strokeWidth={2.5} />
      </div>

      {/* Texto */}
      <div className='hidden flex-col select-none sm:flex'>
        <span className='text-sm leading-none font-black tracking-tight text-zinc-900 dark:text-white'>
          Super<span className='text-primary'>TOOLS</span>
        </span>
        <span className='text-primary/70 mt-0.5 text-[9px] leading-none font-semibold tracking-widest uppercase'>
          Dev Kit
        </span>
      </div>
    </Link>
  )
}
