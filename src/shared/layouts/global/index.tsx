import { ZoomProvider } from '@/shared/contexts/zoomContext'
import { Toaster } from 'sonner'
import { GlobalHeaderComponent } from './header'

export const GlobalLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ZoomProvider>
      <div className='bg-background text-foreground flex h-screen w-screen flex-col overflow-hidden font-sans'>
        <GlobalHeaderComponent />
        <Toaster />
        {children}
      </div>
    </ZoomProvider>
  )
}
