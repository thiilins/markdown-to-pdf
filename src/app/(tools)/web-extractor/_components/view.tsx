'use client'

import { PreviewPanel } from './preview-panel'
import { UrlInputWithHistory } from './url-input-with-history'

export const WebExtractorViewComponent = () => {
  return (
    <main className='relative flex h-full w-full flex-col overflow-hidden bg-zinc-50 dark:bg-zinc-950'>
      {/* Background Decorativo */}
      <div className='pointer-events-none absolute inset-0 flex justify-center'>
        <div className='absolute inset-0 h-full w-full bg-linear-to-b from-blue-50 to-transparent dark:from-blue-950/20' />
        <div className='absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]' />
      </div>

      <div className='z-10 flex h-full min-h-0 flex-1 flex-col items-center justify-center p-4 md:p-8'>
        <PreviewPanel />
      </div>
    </main>
  )
}

export const WebExtractorSearchComponent = UrlInputWithHistory
