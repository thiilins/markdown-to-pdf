'use client'
import { ZoomProvider } from '@/shared/contexts/zoomContext'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'sonner'
import { GlobalHeaderComponent } from './header'

export const GlobalLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <ZoomProvider>
        <div className='bg-background text-foreground flex h-screen w-screen flex-col overflow-hidden font-sans'>
          <GlobalHeaderComponent />
          <Toaster />
          {children}
        </div>
      </ZoomProvider>
    </SessionProvider>
  )
}
