'use client'
import { MarkdownEditor } from '@/components/markdown-editor/editor'
import { cn } from '@/lib/utils'
import { useConfig } from '@/shared/contexts/configContext'
import { useMDToPdf } from '@/shared/contexts/mdToPdfContext'

export const MDToPdfEditor = ({ width = 'w-[50%]' }: { width?: string }) => {
  const { markdown, setMarkdown } = useMDToPdf()
  const { config } = useConfig()
  return (
    <div className={cn('flex h-full w-[50%] flex-col border-r', width)}>
      <div className='min-h-0 flex-1'>
        <MarkdownEditor
          value={markdown}
          onChange={(value) => setMarkdown(value || '')}
          config={config.editor}
        />
      </div>
    </div>
  )
}
