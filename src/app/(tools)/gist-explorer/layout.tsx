'use client'

import { GistProvider } from '@/shared/contexts/gistContext'
import { ToolsLayoutComponent } from '@/shared/layouts/tools'

export default function GistExplorerLayout({ children }: { children: React.ReactNode }) {
  return (
    <GistProvider>
      <ToolsLayoutComponent>{children}</ToolsLayoutComponent>
    </GistProvider>
  )
}
