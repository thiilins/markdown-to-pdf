'use client'

import React from 'react'
import {
  AlertCircle,
  Info,
  Lightbulb,
  ShieldAlert,
  TriangleAlert,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type AdmonitionType = 'note' | 'tip' | 'important' | 'warning' | 'caution'

interface AdmonitionProps {
  type: AdmonitionType
  children: React.ReactNode
  className?: string
}

interface AdmonitionStyle {
  icon: LucideIcon
  label: string
  containerClass: string
  iconWrapperClass: string
  iconClass: string
  titleClass: string
  contentClass: string
}

const admonitionStyles: Record<AdmonitionType, AdmonitionStyle> = {
  note: {
    icon: Info,
    label: 'Nota',
    containerClass: 'bg-blue-50/50 border-blue-500/50 text-blue-900',
    iconWrapperClass: 'bg-blue-100 text-blue-600',
    iconClass: 'text-blue-600',
    titleClass: 'text-blue-800',
    contentClass: 'text-blue-800/80',
  },
  tip: {
    icon: Lightbulb,
    label: 'Dica',
    containerClass: 'bg-emerald-50/50 border-emerald-500/50 text-emerald-900',
    iconWrapperClass: 'bg-emerald-100 text-emerald-600',
    iconClass: 'text-emerald-600',
    titleClass: 'text-emerald-800',
    contentClass: 'text-emerald-800/80',
  },
  important: {
    icon: AlertCircle,
    label: 'Importante',
    containerClass: 'bg-violet-50/50 border-violet-500/50 text-violet-900',
    iconWrapperClass: 'bg-violet-100 text-violet-600',
    iconClass: 'text-violet-600',
    titleClass: 'text-violet-800',
    contentClass: 'text-violet-800/80',
  },
  warning: {
    icon: TriangleAlert,
    label: 'Aviso',
    containerClass: 'bg-amber-50/50 border-amber-500/50 text-amber-900',
    iconWrapperClass: 'bg-amber-100 text-amber-600',
    iconClass: 'text-amber-600',
    titleClass: 'text-amber-800',
    contentClass: 'text-amber-800/80',
  },
  caution: {
    icon: ShieldAlert,
    label: 'Cuidado',
    containerClass: 'bg-rose-50/50 border-rose-500/50 text-rose-900',
    iconWrapperClass: 'bg-rose-100 text-rose-600',
    iconClass: 'text-rose-600',
    titleClass: 'text-rose-800',
    contentClass: 'text-rose-800/80',
  },
}

export function Admonition({ type, children, className }: AdmonitionProps) {
  const style = admonitionStyles[type]
  const Icon = style.icon

  return (
    <div
      className={cn(
        'my-6 flex gap-4 rounded-xl border-l-4 p-4 shadow-sm backdrop-blur-sm transition-all',
        style.containerClass,
        className,
      )}>
      {/* Icon Wrapper */}
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg shadow-sm',
          style.iconWrapperClass,
        )}>
        <Icon className='h-5 w-5' />
      </div>

      <div className='flex flex-col gap-1'>
        {/* Label/Title */}
        <span className={cn('text-[11px] font-black tracking-[0.1em] uppercase', style.titleClass)}>
          {style.label}
        </span>

        {/* Content */}
        <div className={cn('text-sm leading-relaxed font-medium', style.contentClass)}>
          {children}
        </div>
      </div>
    </div>
  )
}
