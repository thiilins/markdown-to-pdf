'use client'

import { mdToPdfBreadcrumbs } from '@/shared/constants/breadcrumbs'
import { ToolsLayoutComponent } from '@/shared/layouts/tools'

export default function MDToPdfLayout({ children }: { children: React.ReactNode }) {
  return <ToolsLayoutComponent breadcrumbs={mdToPdfBreadcrumbs}>{children}</ToolsLayoutComponent>
}
