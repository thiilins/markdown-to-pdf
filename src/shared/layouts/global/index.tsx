'use client'
import { SettingsDialog } from '@/components/settings-modal'
import { ConfigProvider } from '@/shared/contexts/configContext'
import { MDToPdfProvider } from '@/shared/contexts/mdToPdfContext'
import { ZoomProvider } from '@/shared/contexts/zoomContext'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'sonner'
import { GlobalHeaderComponent } from './header'

export const GlobalLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <ConfigProvider>
        <MDToPdfProvider>
          <ZoomProvider>
            <div className='bg-background text-foreground flex h-screen w-screen flex-col overflow-hidden font-sans'>
              <GlobalHeaderComponent />
              <Toaster />
              <SettingsDialog />
              {children}
            </div>
          </ZoomProvider>
        </MDToPdfProvider>
      </ConfigProvider>
    </SessionProvider>
  )
}
