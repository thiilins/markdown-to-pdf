'use client'

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { HtmlCodeViewer } from './html-code-viewer'
import { HtmlPreview } from './html-preview'

interface HtmlOutputViewerProps {
  html: string
  viewMode: 'split' | 'preview' | 'code'
  onCopy?: () => void
  onCopyFormatted?: () => void
  onDownload?: () => void
}

export function HtmlOutputViewer({
  html,
  viewMode,
  onCopy,
  onCopyFormatted,
  onDownload,
}: HtmlOutputViewerProps) {
  if (viewMode === 'split') {
    return (
      <ResizablePanelGroup direction='vertical' className='h-full'>
        <ResizablePanel defaultSize={50} minSize={30} className='bg-background'>
          <HtmlPreview html={html} onCopy={onCopy} />
        </ResizablePanel>
        <ResizableHandle className='bg-border hover:bg-primary/50 h-px transition-colors' />
        <ResizablePanel defaultSize={50} minSize={30} className='bg-[#2b2b2b]'>
          <HtmlCodeViewer
            html={html}
            onCopy={onCopy}
            onCopyFormatted={onCopyFormatted}
            showDownload={false}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    )
  }

  if (viewMode === 'preview') {
    return <HtmlPreview html={html} onCopy={onCopy} />
  }

  return (
    <HtmlCodeViewer
      html={html}
      onCopy={onCopy}
      onCopyFormatted={onCopyFormatted}
      onDownload={onDownload}
      showDownload={true}
    />
  )
}
