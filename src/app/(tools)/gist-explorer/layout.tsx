'use client'

import { GistProvider } from '@/shared/contexts/gistContext'

export default function GistExplorerLayout({ children }: { children: React.ReactNode }) {
  return <GistProvider>{children}</GistProvider>
}
