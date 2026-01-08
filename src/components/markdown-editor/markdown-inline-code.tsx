'use client'

import { cn } from '@/lib/utils'
import React from 'react'

interface MarkdownInlineCodeProps {
  children: React.ReactNode
  className?: string
}

/**
 * Componente para código inline (backticks simples)
 * Ex: `const foo = 'bar'`
 */
export function MarkdownInlineCode({ children, className }: MarkdownInlineCodeProps) {
  return (
    <code
      className={cn(
        'relative rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[0.875em] font-semibold text-slate-800',
        'before:absolute before:inset-0 before:rounded-md before:bg-indigo-500/5',
        'dark:bg-slate-800 dark:text-slate-200',
        className,
      )}>
      {children}
    </code>
  )
}
