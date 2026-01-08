'use client'

import { cn } from '@/lib/utils'
import React from 'react'

interface MarkdownKbdProps {
  children: React.ReactNode
  className?: string
}

/**
 * Componente para renderizar teclas de atalho (Keyboard)
 * Ex: <kbd>Ctrl</kbd> + <kbd>C</kbd>
 */
export function MarkdownKbd({ children, className }: MarkdownKbdProps) {
  return (
    <kbd
      className={cn(
        'inline-flex items-center justify-center rounded-md border border-slate-300 bg-slate-100 px-2 py-0.5 font-mono text-xs font-semibold text-slate-700 shadow-sm',
        'dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300',
        // Efeito 3D
        'shadow-[0_2px_0_0_rgb(148_163_184)] dark:shadow-[0_2px_0_0_rgb(51_65_85)]',
        className,
      )}>
      {children}
    </kbd>
  )
}
