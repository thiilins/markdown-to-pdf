'use client'

import { cn } from '@/lib/utils'
import React from 'react'

interface MarkdownTableProps {
  children: React.ReactNode
  className?: string
}

interface MarkdownTableCellProps {
  children: React.ReactNode
  className?: string
  isHeader?: boolean
  align?: 'left' | 'center' | 'right'
}

/**
 * Container da Tabela com Scroll Horizontal
 */
export function MarkdownTable({ children, className }: MarkdownTableProps) {
  return (
    <div className={cn('my-6 overflow-x-auto', className)}>
      <table className='w-full border-collapse text-sm'>{children}</table>
    </div>
  )
}

/**
 * Cabeçalho da Tabela (thead)
 */
export function MarkdownTableHead({ children, className }: MarkdownTableProps) {
  return (
    <thead className={cn('border-b-2 border-slate-200 bg-slate-50', className)}>{children}</thead>
  )
}

/**
 * Corpo da Tabela (tbody)
 */
export function MarkdownTableBody({ children, className }: MarkdownTableProps) {
  return <tbody className={cn('divide-y divide-slate-100', className)}>{children}</tbody>
}

/**
 * Linha da Tabela (tr)
 */
export function MarkdownTableRow({ children, className }: MarkdownTableProps) {
  return <tr className={cn('border-b border-slate-100 last:border-0', className)}>{children}</tr>
}

/**
 * Célula de Cabeçalho (th)
 */
export function MarkdownTableHeaderCell({
  children,
  className,
  align = 'left',
}: MarkdownTableCellProps) {
  return (
    <th
      className={cn(
        'px-4 py-2 text-sm font-bold text-slate-700',
        align === 'left' && 'text-left',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        className,
      )}>
      {children}
    </th>
  )
}

/**
 * Célula de Dados (td)
 */
export function MarkdownTableCell({ children, className, align = 'left' }: MarkdownTableCellProps) {
  return (
    <td
      className={cn(
        'px-4 py-2 text-sm text-slate-600',
        align === 'left' && 'text-left',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        className,
      )}>
      {children}
    </td>
  )
}
