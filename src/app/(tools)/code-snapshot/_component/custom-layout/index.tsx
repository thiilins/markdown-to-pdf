'use client'
import { WindowFooter } from './footer'
import { WindowHeader } from './header'

export const PreviewCustomLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <WindowHeader />
      {children}
      <WindowFooter />
    </div>
  )
}
