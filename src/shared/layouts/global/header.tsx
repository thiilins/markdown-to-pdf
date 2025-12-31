'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { IoLogoMarkdown } from 'react-icons/io5'
import { GlobalHeaderMenu } from './header-menu'

export const GlobalHeaderComponent = () => {
  return (
    <header className='border-primary/10 bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-lg'>
      <div className='mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
        {/* Lado Esquerdo: Logo e Branding */}
        <div className='flex items-center gap-8'>
          <Link href='/' className='group flex items-center gap-3 outline-none'>
            {/* Logo Container - Mais robusto e profissional */}
            <div className='border-primary/20 bg-primary/5 group-hover:border-primary/40 group-hover:bg-primary/10 relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border transition-all duration-300 group-active:scale-95'>
              {/* Brilho interno sutil */}
              <div className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary),0.1),transparent_70%)] opacity-0 transition-opacity group-hover:opacity-100' />

              <IoLogoMarkdown className='text-primary relative z-10 h-6 w-6 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-[8deg]' />
            </div>

            {/* Texto do Logo */}
            <div className='flex flex-col select-none'>
              <div className='flex items-center gap-2'>
                <span className='text-foreground text-base font-bold tracking-tighter sm:text-lg'>
                  MD Tools <span className='text-primary'>Pro</span>
                </span>

                {/* Badge de Versão - Visual de Software moderno */}
                <span className='border-primary/20 bg-primary/5 text-primary hidden rounded-full border px-1.5 py-0.5 font-mono text-[9px] font-bold sm:block'>
                  V2.0
                </span>
              </div>
              <span className='text-muted-foreground/60 text-[10px] font-medium tracking-widest uppercase'>
                Developer Ecosystem
              </span>
            </div>
          </Link>

          {/* Divisor Vertical sutil (Opcional, opte por isso se tiver itens de menu fixos antes do GlobalHeaderMenu) */}
          <div className='bg-border/60 hidden h-6 w-px lg:block' />
        </div>

        {/* Lado Direito: Menu e Ações */}
        <div className='flex items-center gap-4'>
          <GlobalHeaderMenu />

          {/* Aqui você poderia adicionar um botão de Login ou Theme Switcher no futuro */}
        </div>
      </div>
    </header>
  )
}
