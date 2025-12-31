'use client'
import { SettingsDialog } from '@/components/settings-modal'
import { AppProvider } from '@/shared/contexts/appContext'
import { GistProvider } from '@/shared/contexts/gistContext'
import { HeaderFooterProvider } from '@/shared/contexts/headerFooterContext'
import { MarkdownProvider } from '@/shared/contexts/markdownContext'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'sonner'
import { GlobalHeaderComponent } from './header'
export const GlobalLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <MarkdownProvider>
        <AppProvider>
          <HeaderFooterProvider>
            <GistProvider>
              <main className='bg-background flex h-screen w-screen flex-1 flex-col overflow-hidden bg-[url(https://picsum.photos/1920/1080)] bg-cover bg-center font-sans'>
                <GlobalHeaderComponent />
                <Toaster />
                <SettingsDialog />
                {children}
              </main>
            </GistProvider>
          </HeaderFooterProvider>
        </AppProvider>
      </MarkdownProvider>
    </SessionProvider>
  )
}
