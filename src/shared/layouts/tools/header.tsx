'use client'

import { BreadCrumbsComponent } from '@/components/custom-ui/breadCrumbs'

export function ToolsHeader({ breadcrumbs }: { breadcrumbs: Breadcrumbs[] }) {
  if (breadcrumbs.length === 0) return null
  return (
    <div className='bg-primary/10 flex h-6 w-full px-4'>
      <div className='flex items-center gap-2'>
        <BreadCrumbsComponent breadcrumbs={breadcrumbs} />
      </div>
    </div>
  )
}
