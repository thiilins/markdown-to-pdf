'use client'

import { MarkdownEditor } from '@/components/markdown-editor/editor'
import { ConversionOptions } from './conversion-options'

interface MarkdownEditorWithOptionsProps {
  options: {
    breaks: boolean
    gfm: boolean
    sanitize: boolean
  }
  onOptionsChange: (options: { breaks: boolean; gfm: boolean; sanitize: boolean }) => void
  onScroll?: (percentage: number) => void
  onResetMarkdown?: () => void
}

export function MarkdownEditorWithOptions({
  options,
  onOptionsChange,
  onScroll,
  onResetMarkdown,
}: MarkdownEditorWithOptionsProps) {
  return (
    <div className='flex h-full flex-col'>
      <ConversionOptions
        breaks={options.breaks}
        gfm={options.gfm}
        sanitize={options.sanitize}
        onBreaksChange={(checked) => onOptionsChange({ ...options, breaks: checked })}
        onGfmChange={(checked) => onOptionsChange({ ...options, gfm: checked })}
        onSanitizeChange={(checked) => onOptionsChange({ ...options, sanitize: checked })}
      />
      <div className='min-h-0 flex-1'>
        <MarkdownEditor onScroll={onScroll} onResetMarkdown={onResetMarkdown} />
      </div>
    </div>
  )
}
