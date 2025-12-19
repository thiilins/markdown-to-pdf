'use client'

import { webToMarkdownBreadcrumbs } from '@/shared/constants/breadcrumbs'
import { WebExtractorProvider } from '@/shared/contexts/webExtractorContext'
import { ToolsLayoutComponent } from '@/shared/layouts/tools'

export default function WebToMarkdownLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToolsLayoutComponent breadcrumbs={webToMarkdownBreadcrumbs}>
      <WebExtractorProvider>{children}</WebExtractorProvider>
    </ToolsLayoutComponent>
  )
}
