'use client'

import { cn } from '@/lib/utils'
import React from 'react'

interface MarkdownKbdProps {
  children: React.ReactNode
  className?: string
}

/**
 * Componente para renderizar teclas de atalho (Keyboard)
 * Design refinado com efeito de profundidade física (Keycap style)
 */
export function MarkdownKbd({ children, className }: MarkdownKbdProps) {
  return (
    <kbd
      className={cn(
        // Layout e Tipografia
        'inline-flex min-w-[2.2em] items-center justify-center rounded-lg px-2 py-1',
        'font-mono text-[11px] leading-none font-black tracking-tighter uppercase',

        // Cores e Efeito 3D (Light Mode)
        'border border-b-[3px] border-slate-300 bg-white text-slate-900 shadow-sm',
        'transition-all duration-75 active:translate-y-[2px] active:border-b-0',

        // Cores e Efeito 3D (Dark Mode)
        'dark:border-slate-700 dark:border-b-slate-600 dark:bg-slate-900 dark:text-white',
        'dark:shadow-indigo-500/10',

        className,
      )}>
      <span className='opacity-90'>{children}</span>
    </kbd>
  )
}
