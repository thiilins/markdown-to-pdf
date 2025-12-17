'use client'
import { mdToPdfBreadcrumbs } from '@/shared/constants/breadcrumbs'
import { ToolsLayout } from '../tools'

const MdPdfLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  return <ToolsLayout breadcrumbs={mdToPdfBreadcrumbs}>{children}</ToolsLayout>
}

export const MdPdfLayout = ({ children }: { children: React.ReactNode }) => {
  return <MdPdfLayoutWrapper>{children}</MdPdfLayoutWrapper>
}
