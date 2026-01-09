'use client'

import { SettingsDialog } from '@/components/settings-modal'
import { CodeSnapshotProvider } from '@/shared/contexts/codeSnapshotContext'
import { AppProvider } from '@/shared/contexts/appContext'
import { GistProvider } from '@/shared/contexts/gistContext'
import { HeaderFooterProvider } from '@/shared/contexts/headerFooterContext'
import { MarkdownProvider } from '@/shared/contexts/markdownContext'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import { GlobalHeaderComponent } from './header'

export const GlobalLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='light'
      enableSystem={false}
      disableTransitionOnChange>
      <SessionProvider>
        <MarkdownProvider>
          <AppProvider>
            <CodeSnapshotProvider>
              <HeaderFooterProvider>
                <GistProvider>
                  <main className='bg-background flex h-screen w-screen flex-1 flex-col font-sans'>
                    <GlobalHeaderComponent />
                    <Toaster />
                    <SettingsDialog />
                    {children}
                  </main>
                </GistProvider>
              </HeaderFooterProvider>
            </CodeSnapshotProvider>
          </AppProvider>
        </MarkdownProvider>
      </SessionProvider>
    </ThemeProvider>
  )
}
