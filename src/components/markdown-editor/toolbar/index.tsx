'use client'

import { TooltipProvider } from '@/components/ui/tooltip'

import type { MarkdownToolbarProps } from '../../../shared/@types/markdown-toolbar'
import {
  BlocksToolbar,
  FormatDocumentToolbar,
  FormatPageToolbar,
  HeadingsToolbar,
  UndoRedoToolbar,
} from './actions'
import { useToolbarActions } from './useToolbarActions'

export function MarkdownToolbar({
  editor,
  onResetEditorData,
  onResetMarkdown,
}: MarkdownToolbarProps) {
  const { actions } = useToolbarActions(editor)
  return (
    <TooltipProvider>
      <div className='border-border bg-muted/30 flex flex-wrap gap-1 border-b p-2'>
        <div className='flex flex-1 items-center justify-start gap-2'>
          {/* <MoreOptionsToolbar moreOpen={moreOpen} setMoreOpen={setMoreOpen} /> */}
          <HeadingsToolbar actions={actions} />
          <FormatDocumentToolbar actions={actions} />
          <BlocksToolbar actions={actions} />
          <UndoRedoToolbar actions={actions} />
          <FormatPageToolbar
            actions={actions}
            onResetEditorData={onResetEditorData}
            onResetMarkdown={onResetMarkdown}
          />
        </div>
      </div>
    </TooltipProvider>
  )
}
