'use client'

import { SidebarProvider } from '@/components/custom-ui/sidebar'
import { GistExplorerSidebar } from './_components/gist-sidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      defaultOpen
      style={
        {
          '--sidebar-width': '400px !important',
          '--sidebar-width-mobile': '300px',
        } as unknown as React.CSSProperties
      }>
      <GistExplorerSidebar />
      <main className='flex-1'>{children}</main>
    </SidebarProvider>
  )
}
