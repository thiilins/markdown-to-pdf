'use client'

import { cn } from '@/lib/utils'
import { AlertTriangle, Bug, Lock, Package, RefreshCw, Sparkles, Trash2 } from 'lucide-react'
import React from 'react'
import type { Components } from 'react-markdown'

/**
 * CONFIGURAÇÃO DE ESTILOS POR CATEGORIA
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
      'mb-10 border-b border-white/10 pb-6 text-3xl font-black tracking-tight text-white lg:text-4xl',
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
      // FIX 1: Alterado de 'md:items-baseline' para 'md:items-center'
      <div className='group relative mt-12 mb-6 flex flex-col gap-3 border-b border-white/5 pb-4 pl-0 md:flex-row md:items-center md:pl-8'>
        {/* FIX 2: Alterado de 'top-2' para 'top-0' para alinhar com o line-height do texto */}
        <div className='absolute top-0 -left-[13px] hidden h-7 w-7 items-center justify-center rounded-full bg-[#0B0C15] ring-2 ring-purple-500/50 transition-all duration-300 group-hover:scale-110 group-hover:ring-purple-400 md:flex'>
          <div className='h-2.5 w-2.5 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.8)]' />
        </div>

        <div className='flex items-center gap-4'>
          <span className='font-mono text-xl font-bold tracking-tight text-white'>v{version}</span>
          <span className='rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-400'>
            {date}
          </span>
        </div>
      </div>
    )
  }
  return <h2 className='mt-8 mb-4 text-xl font-bold text-white'>{children}</h2>
}

const ChangelogH3: Components['h3'] = ({ children }) => {
  const textRaw = children?.toString() || ''
  const textKey = textRaw.toLowerCase().trim()
  const style =
    Object.entries(CATEGORY_STYLES).find(([key]) => textKey.includes(key))?.[1] ||
    CATEGORY_STYLES.padrao
  const Icon = style.icon

  return (
    <div className='mt-6 mb-3 pl-0 md:pl-8'>
      <div
        className={cn(
          'inline-flex items-center gap-2 rounded-md border px-3 py-1 text-xs font-semibold tracking-wider uppercase backdrop-blur-md transition-all',
          style.bg,
          style.border,
          style.color,
        )}>
        <Icon className='h-3.5 w-3.5' />
        {children}
      </div>
    </div>
  )
}

const ChangelogUl: Components['ul'] = ({ children }) => (
  // MUDANÇA: Removi `space-y-1` e `my-4`. Agora é `my-2` para ser mais compacto.
  <ul className='relative my-2 pl-0 md:pl-8'>
    <div className='absolute top-2 bottom-2 left-[-10px] hidden w-px bg-white/5 md:block' />
    {children}
  </ul>
)

const ChangelogLi: Components['li'] = ({ children }) => {
  // Sua lógica de detecção de título (mantida como você pediu)
  const hasStrongTitle = React.Children.toArray(children).some(
    (child) => React.isValidElement(child) && child.type === 'strong',
  )

  if (hasStrongTitle) {
    // MUDANÇA: Reduzi margem bottom para `mb-1` para colar mais na lista abaixo
    return (
      <li className='mt-4 mb-1 pl-0 first:mt-0'>
        <div className='text-base leading-relaxed font-bold text-white'>{children}</div>
      </li>
    )
  }

  // MUDANÇA CRÍTICA AQUI:
  // 1. Removi `px-3` e bordas para limpar o visual.
  // 2. Mudei `py-2` para `py-0.5` (Redução drástica de espaço).
  // 3. O Bullet agora usa `absolute` para não empurrar o texto e alinhar perfeito.
  return (
    <li className='group relative flex items-start py-0.5 pl-4'>
      {/* Bullet Posicionado Absolutamente */}
      {/* top-[0.6rem] alinha matematicamente com a primeira linha de texto (font-size 15px) */}
      <div className='absolute top-[0.6rem] left-[-5px] h-1.5 w-1.5 rounded-full bg-slate-600 transition-colors group-hover:bg-purple-400' />

      <div className='text-[15px] leading-relaxed text-slate-300 group-hover:text-slate-200'>
        {children}
      </div>
    </li>
  )
}

const ChangelogCode: Components['code'] = ({ children, className }) => (
  <code
    className={cn(
      'mx-1 rounded-md border border-purple-500/20 bg-purple-500/10 px-1.5 py-0.5 font-mono text-[13px] text-purple-200 shadow-[0_0_10px_-3px_rgba(168,85,247,0.1)]',
      className,
    )}>
    {children}
  </code>
)

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
    // MUDANÇA IMPORTANTE:
    // Troquei <p> por <span> com block.
    // O <p> padrão do markdown adiciona margem inferior (mb-4) que cria buracos na lista.
    // Isso remove o espaço extra entre os itens da lista.
    p: ({ children }) => (
      <span className='mb-1 block leading-relaxed text-slate-400 last:mb-0'>{children}</span>
    ),
  }
}
