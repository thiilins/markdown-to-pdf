'use client'

import { cn } from '@/lib/utils'

interface MarkdownHrProps {
  className?: string
}

/**
 * Componente Separador Horizontal Premium (---)
 * Design com gradiente vibrante e profundidade visual
 */
export function MarkdownHr({ className }: MarkdownHrProps) {
  return (
    <div className={cn('relative my-12 flex items-center justify-center', className)}>
      {/* Camadas de Linha */}
      <div className='absolute inset-0 flex items-center' aria-hidden='true'>
        {/* Linha de Brilho (Glow) - Sutil */}
        <div className='absolute h-[2px] w-full bg-linear-to-r from-transparent via-indigo-500/20 to-transparent blur-sm' />

        {/* Linha Principal */}
        <div className='middle:via-indigo-400 dark:middle:via-indigo-500 h-px w-full bg-linear-to-r from-transparent via-slate-200 to-transparent dark:via-slate-800' />
      </div>
    </div>
  )
}
