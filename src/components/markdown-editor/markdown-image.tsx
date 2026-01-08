'use client'

import { cn } from '@/lib/utils'
import { useState } from 'react'

interface MarkdownImageProps {
  src?: string
  alt?: string
  title?: string
  className?: string
}

export function MarkdownImage({ src, alt, title, className }: MarkdownImageProps) {
  const [hasError, setHasError] = useState(false)

  if (!src || hasError) {
    return null
  }

  return (
    <figure className={cn('my-6 flex flex-col', className)}>
      <img
        src={src}
        alt={alt || ''}
        title={title}
        onError={() => setHasError(true)}
        className='mx-auto my-0 mb-0 h-auto max-w-full rounded-lg! border border-slate-200 shadow-sm!'
      />
      {alt && (
        <figcaption className='m-0! text-center text-[10px] text-slate-600'>{alt}</figcaption>
      )}
    </figure>
  )
}
