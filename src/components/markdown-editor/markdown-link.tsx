'use client'

import { cn } from '@/lib/utils'
import { ExternalLink, Link as LinkIcon, Mail } from 'lucide-react'
import React from 'react'

interface MarkdownLinkProps {
  href?: string
  children: React.ReactNode
  className?: string
  title?: string
}

export function MarkdownLink({ href, children, className, title }: MarkdownLinkProps) {
  if (!href) {
    return <span className='text-slate-500 dark:text-slate-400'>{children}</span>
  }

  // Identificação de tipos de link
  const isExternal = /^https?:\/\//.test(href)
  const isAnchor = href.startsWith('#')
  const isMailto = href.startsWith('mailto:')
  const isInternal = !isExternal && !isAnchor && !isMailto

  return (
    <a
      href={href}
      title={title}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={cn(
        // Base: Alinhamento baseline é crucial para links dentro de parágrafos
        'inline-flex items-baseline gap-1 font-semibold transition-all duration-200',
        'underline decoration-transparent decoration-2 underline-offset-4 hover:decoration-current',

        // Estilo: Externo (Indigo)
        isExternal &&
          'text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300',

        // Estilo: Âncora (Violet)
        isAnchor &&
          'text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300',

        // Estilo: E-mail (Emerald)
        isMailto &&
          'text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300',

        // Estilo: Interno / Relativo (Slate/Principal)
        isInternal &&
          'text-slate-900 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-400',

        className,
      )}>
      <span className='relative'>{children}</span>

      {/* Ícones com ajuste de posição para não "saltar" na linha */}
      <span className='inline-flex self-center'>
        {isExternal && (
          <ExternalLink className='h-3 w-3 translate-y-px opacity-50 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100' />
        )}
        {isAnchor && (
          <LinkIcon className='h-3 w-3 translate-y-px opacity-50 transition-all group-hover:rotate-12 group-hover:opacity-100' />
        )}
        {isMailto && (
          <Mail className='h-3 w-3 translate-y-px opacity-50 transition-all group-hover:scale-110 group-hover:opacity-100' />
        )}
      </span>
    </a>
  )
}
