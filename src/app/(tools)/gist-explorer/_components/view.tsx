'use client'

import { GistPreview } from './gist-preview'
import { GistSidebar } from './gist-sidebar'

export const GistExplorerViewComponent = () => {
  return (
    <div className='flex min-h-full w-full flex-1 overflow-hidden'>
      <GistSidebar />
      <GistPreview />
    </div>
  )
}
