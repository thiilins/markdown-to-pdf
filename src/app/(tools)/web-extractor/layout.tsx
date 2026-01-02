'use client'

import { WebExtractorProvider } from '@/shared/contexts/webExtractorContext'

export default function WebToMarkdownLayout({ children }: { children: React.ReactNode }) {
  return <WebExtractorProvider>{children}</WebExtractorProvider>
}
