'use client'
import { ConfigProvider } from '@/shared/contexts/configContext'
import { MDToPdfProvider } from '@/shared/contexts/mdToPdfContext'

export const GlobalToolLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ConfigProvider>
      <MDToPdfProvider>{children}</MDToPdfProvider>
    </ConfigProvider>
  )
}
