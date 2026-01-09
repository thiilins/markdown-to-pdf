'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Bug,
  CheckCircle2,
  FileText,
  Lock,
  Package,
  RefreshCw,
  Sparkles,
  Trash2,
} from 'lucide-react'
import type { Components } from 'react-markdown'
import React from 'react'

/**
 * CONFIGURAÇÃO DE ESTILOS POR CATEGORIA
 * Centraliza a lógica de cores e ícones para facilitar manutenção.
 */
const CATEGORY_STYLES: Record<
  string,
  {
    color: string
    bg: string
    border: string
    icon: React.ElementType
    label: string
  }
> = {
  adicionado: {
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    icon: Sparkles,
    label: 'Novo',
  },
  added: {
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    icon: Sparkles,
    label: 'New',
  },

  modificado: {
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    icon: RefreshCw,
    label: 'Alteração',
  },
  changed: {
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    icon: RefreshCw,
    label: 'Changed',
  },

  corrigido: {
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    icon: Bug,
    label: 'Correção',
  },
  fixed: {
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    icon: Bug,
    label: 'Fixed',
  },

  removido: {
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    icon: Trash2,
    label: 'Removido',
  },
  removed: {
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    icon: Trash2,
    label: 'Removed',
  },

  segurança: {
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    icon: Lock,
    label: 'Segurança',
  },
  security: {
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    icon: Lock,
    label: 'Security',
  },

  depreciado: {
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    icon: AlertTriangle,
    label: 'Depreciado',
  },
  deprecated: {
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    icon: AlertTriangle,
    label: 'Deprecated',
  },

  padrao: {
    color: 'text-slate-300',
    bg: 'bg-slate-800/50',
    border: 'border-slate-700',
    icon: Package,
    label: 'Outros',
  },
}

// --- Componentes ---

const ChangelogH1: Components['h1'] = ({ children, className, ...props }) => (
  <h1
    className={cn(
      'mb-16 border-b border-white/10 pb-8 text-4xl font-black tracking-tight text-white lg:text-5xl',
      className,
    )}
    {...props}>
    {children}
  </h1>
)

const ChangelogH2: Components['h2'] = ({ children }) => {
  const text = children?.toString() || ''
  const match = text.match(/\[(.*?)\]\s*-\s*(.*)/)

  if (match) {
    const [_, version, date] = match
    return (
      <div className='group relative mt-20 mb-10 flex flex-col gap-4 border-b border-white/5 pb-8 pl-0 md:flex-row md:items-baseline md:pl-8'>
        {/* Marcador da Timeline */}
        <div className='absolute top-2 -left-[13px] hidden h-7 w-7 items-center justify-center rounded-full bg-[#0B0C15] ring-2 ring-purple-500/50 transition-all duration-300 group-hover:scale-110 group-hover:ring-purple-400 md:flex'>
          <div className='h-2.5 w-2.5 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.8)]' />
        </div>

        <div className='flex items-center gap-4'>
          <span className='font-mono text-2xl font-bold tracking-tight text-white'>v{version}</span>
          <span className='rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-400'>
            {date}
          </span>
        </div>
      </div>
    )
  }

  return <h2 className='mt-12 mb-6 text-2xl font-bold text-white'>{children}</h2>
}

const ChangelogH3: Components['h3'] = ({ children, className }) => {
  const textRaw = children?.toString() || ''
  const textKey = textRaw.toLowerCase().trim()

  // Busca o estilo ou usa o padrão
  const style =
    Object.entries(CATEGORY_STYLES).find(([key]) => textKey.includes(key))?.[1] ||
    CATEGORY_STYLES.padrao
  const Icon = style.icon

  return (
    <div className='mt-8 mb-6 pl-0 md:pl-8'>
      <div
        className={cn(
          'inline-flex items-center gap-2.5 rounded-lg border px-4 py-1.5 text-sm font-semibold tracking-wider uppercase backdrop-blur-md transition-all',
          style.bg,
          style.border,
          style.color,
        )}>
        <Icon className='h-4 w-4' />
        {children}
      </div>
    </div>
  )
}

const ChangelogUl: Components['ul'] = ({ children }) => (
  <ul className='relative my-4 space-y-1 pl-0 md:pl-8'>
    {/* Linha conectora vertical sutil para a lista */}
    <div className='absolute top-2 bottom-2 left-[-10px] hidden w-px bg-white/5 md:block' />
    {children}
  </ul>
)

const ChangelogLi: Components['li'] = ({ children }) => (
  <li className='group relative flex items-start gap-3 rounded-lg border border-transparent px-3 py-2 transition-colors hover:border-white/5 hover:bg-white/[0.02]'>
    <div className='mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-600 transition-colors group-hover:bg-purple-400' />
    <div className='text-[15px] leading-relaxed text-slate-300 group-hover:text-slate-200'>
      {children}
    </div>
  </li>
)

const ChangelogCode: Components['code'] = ({ children, className }) => (
  <code
    className={cn(
      'mx-1 rounded-md border border-purple-500/20 bg-purple-500/10 px-1.5 py-0.5 font-mono text-[13px] text-purple-200 shadow-[0_0_10px_-3px_rgba(168,85,247,0.1)]',
      className,
    )}>
    {children}
  </code>
)

// ... Manter os outros componentes (Link, Table, Pre) similares, apenas limpando classes se necessário
// Exemplo de Link otimizado:
const ChangelogLink: Components['a'] = ({ children, href, ...props }) => (
  <a
    href={href}
    className='font-medium text-purple-400 decoration-purple-500/30 underline-offset-4 transition-all hover:text-purple-300 hover:underline'
    {...props}>
    {children}
  </a>
)

export function getChangelogComponents(): Components {
  return {
    h1: ChangelogH1,
    h2: ChangelogH2,
    h3: ChangelogH3,
    ul: ChangelogUl,
    li: ChangelogLi,
    code: ChangelogCode,
    a: ChangelogLink,
    // Mapeie os demais componentes simples aqui se desejar (p, pre, table, etc) ou use tags padrão estilizadas globalmente
    p: ({ children }) => (
      <p className='mb-4 pl-0 leading-relaxed text-slate-400 md:pl-8'>{children}</p>
    ),
  }
}
