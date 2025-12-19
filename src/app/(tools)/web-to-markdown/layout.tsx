'use client'

import { webToMarkdownBreadcrumbs } from '@/shared/constants/breadcrumbs'
import { ToolsLayoutComponent } from '@/shared/layouts/tools'

export default function WebToMarkdownLayout({ children }: { children: React.ReactNode }) {
  return <ToolsLayoutComponent breadcrumbs={webToMarkdownBreadcrumbs}>{children}</ToolsLayoutComponent>
}

