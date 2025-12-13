'use client'

import { TooltipProvider } from '@/components/ui/tooltip'

import {
  BlocksToolbar,
  FormatDocumentToolbar,
  FormatPageToolbar,
  HeadingsToolbar,
  UndoRedoToolbar,
} from './actions'
import type { MarkdownToolbarProps } from './type'
import { useToolbarActions } from './useToolbarActions'

export function MarkdownToolbar({ editor }: MarkdownToolbarProps) {
  const { actions } = useToolbarActions(editor)
  // const [moreOpen, setMoreOpen] = useState(false)
  return (
    <TooltipProvider>
      <div className='border-border bg-muted/30 flex flex-wrap gap-1 border-b p-2'>
        <div className='flex flex-1 items-center justify-start gap-2'>
          {/* <MoreOptionsToolbar moreOpen={moreOpen} setMoreOpen={setMoreOpen} /> */}
          <HeadingsToolbar actions={actions} />
          <FormatDocumentToolbar actions={actions} />
          <BlocksToolbar actions={actions} />
          <UndoRedoToolbar actions={actions} />
          <FormatPageToolbar actions={actions} />
        </div>
      </div>
    </TooltipProvider>
  )
}
