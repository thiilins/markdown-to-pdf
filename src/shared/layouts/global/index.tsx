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
            <main className='bg-background flex h-screen w-screen flex-1 flex-col overflow-hidden bg-[url(https://picsum.photos/1920/1080)] bg-cover bg-center font-sans'>
              <GlobalHeaderComponent />
              <Toaster />
              <SettingsDialog />
              {children}
            </main>
          </ZoomProvider>
        </MDToPdfProvider>
      </ConfigProvider>
    </SessionProvider>
  )
}
