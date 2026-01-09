'use client'

import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import React from 'react'

interface MarkdownListProps {
  children: React.ReactNode
  className?: string
  ordered?: boolean
  start?: number
}

interface MarkdownListItemProps {
  children: React.ReactNode
  className?: string
  checked?: boolean | null
}

/**
 * Container para Listas Não Ordenadas
 */
export function MarkdownUnorderedList({ children, className }: MarkdownListProps) {
  return (
    <ul
      className={cn(
        'space-y-1 bg-white/50 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/50',
        className,
      )}>
      {children}
    </ul>
  )
}

/**
 * Container para Listas Ordenadas
 */
export function MarkdownOrderedList({ children, className, start = 1 }: MarkdownListProps) {
  return (
    <ol
      start={start}
      style={{ counterReset: `list-counter ${start - 1}` } as React.CSSProperties}
      className={cn(
        'list-none space-y-1 bg-white/50 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/50',
        className,
      )}>
      {children}
    </ol>
  )
}

/**
 * Item de Lista com Lógica de "Checkbox vs Bullet"
 */
export function MarkdownListItem({ children, className, checked }: MarkdownListItemProps) {
  const isTask = checked !== null && checked !== undefined

  return (
    <li
      style={
        {
          counterIncrement: !isTask ? 'list-counter' : 'none',
        } as React.CSSProperties
      }
      className={cn(
        // Base comum
        'relative flex items-start gap-2 text-sm leading-relaxed font-medium transition-all duration-200',

        // CORES DO TEXTO
        checked ? 'text-slate-400' : 'text-slate-700 dark:text-slate-300',

        // LÓGICA DE MARCADORES (Só aplica se NÃO for uma Task)
        !isTask && [
          // Estilo para LISTA ORDENADA
          'in-[ol]:before:flex in-[ol]:before:h-6 in-[ol]:before:w-6 in-[ol]:before:shrink-0 in-[ol]:before:items-center in-[ol]:before:justify-center in-[ol]:before:rounded-full in-[ol]:before:bg-indigo-600 in-[ol]:before:text-[10px] in-[ol]:before:font-black in-[ol]:before:text-white in-[ol]:before:shadow-md in-[ol]:before:shadow-indigo-200 in-[ol]:before:content-[counter(list-counter)] dark:in-[ol]:before:shadow-indigo-900/20',

          // Estilo para LISTA NÃO ORDENADA (O ponto azul da sua imagem)
          'in-[ul]:before:mt-[0.6rem] in-[ul]:before:h-2 in-[ul]:before:w-2 in-[ul]:before:shrink-0 in-[ul]:before:rounded-full in-[ul]:before:bg-indigo-500 in-[ul]:before:ring-4 in-[ul]:before:ring-indigo-100 in-[ul]:before:content-[""] dark:in-[ul]:before:ring-indigo-900/30',
        ],

        className,
      )}>
      {/* RENDERIZAÇÃO DA CHECKBOX (Apenas se for Task) */}
      {isTask && (
        <div
          className={cn(
            'mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-300',
            checked
              ? 'border-emerald-600 bg-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
              : 'border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900',
          )}>
          {checked && (
            <Check
              className='animate-in zoom-in-50 h-3.5 w-3.5 text-white duration-200'
              strokeWidth={4}
            />
          )}
        </div>
      )}

      {/* CONTEÚDO (Texto + Emojis) */}
      <span className={cn('flex-1 py-0.5', checked && 'line-through decoration-emerald-500/30')}>
        {children}
      </span>
    </li>
  )
}
/**
 * Componente unificado que detecta o tipo de lista
 */
export function MarkdownList({ children, ordered, ...props }: MarkdownListProps) {
  return ordered ? (
    <MarkdownOrderedList {...props}>{children}</MarkdownOrderedList>
  ) : (
    <MarkdownUnorderedList {...props}>{children}</MarkdownUnorderedList>
  )
}
