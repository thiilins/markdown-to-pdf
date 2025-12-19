'use client'

import { CheckCircle2, Cpu, FileText } from 'lucide-react'
import { useMemo } from 'react'

interface MarkdownStatusBarProps {
  value: string
}

export function MarkdownStatusBar({ value }: MarkdownStatusBarProps) {
  const stats = useMemo(() => {
    const text = value || ''
    const chars = text.length
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length
    return { chars, words }
  }, [value])

  return (
    <div className='bg-muted/50 text-muted-foreground flex h-8 w-full items-center justify-between border-t px-3 text-[11px] select-none'>
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-1.5'>
          <FileText className='size-3.5' />
          <span>{stats.words} palavras</span>
        </div>
        <div className='flex items-center gap-1.5'>
          <span>{stats.chars} caracteres</span>
        </div>
      </div>

      <div className='flex items-center gap-4'>
        <div className='text-success flex items-center gap-1.5'>
          <CheckCircle2 className='size-3.5 text-emerald-500' />
          <span className='font-medium text-emerald-500'>Salvo localmente</span>
        </div>

        <div className='flex items-center gap-1.5 border-l pl-4'>
          <Cpu className='size-3.5' />
          <span>API: Online</span>
        </div>
      </div>
    </div>
  )
}
