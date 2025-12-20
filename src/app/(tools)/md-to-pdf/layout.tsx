'use client'

import { mdToPdfBreadcrumbs } from '@/shared/constants/breadcrumbs'
import { HeaderFooterProvider } from '@/shared/contexts/headerFooterContext'
import { ToolsLayoutComponent } from '@/shared/layouts/tools'

export default function MDToPdfLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToolsLayoutComponent breadcrumbs={mdToPdfBreadcrumbs}>
      <HeaderFooterProvider>{children}</HeaderFooterProvider>
    </ToolsLayoutComponent>
  )
}
