'use client'
import { mdToPdfBreadcrumbs } from '@/shared/constants/breadcrumbs'
import { ConfigProvider } from '@/shared/contexts/configContext'
import { MDToPdfProvider } from '@/shared/contexts/mdToPdfContext'
import { ToolsLayout } from '../tools'

const MdPdfLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  return <ToolsLayout breadcrumbs={mdToPdfBreadcrumbs}>{children}</ToolsLayout>
}

export const MdPdfLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ConfigProvider>
      <MDToPdfProvider>
        <MdPdfLayoutWrapper>{children}</MdPdfLayoutWrapper>
      </MDToPdfProvider>
    </ConfigProvider>
  )
}
