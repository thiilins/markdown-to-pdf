'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import Link from 'next/link'
import * as React from 'react'

export const BreadCrumbsComponent = ({ breadcrumbs }: { breadcrumbs: Breadcrumbs[] }) => {
  // Ordena os breadcrumbs pelo campo order (se existir)
  const sortedBreadcrumbs = [...breadcrumbs].sort((a, b) => {
    if (a.order && b.order) return a.order - b.order
    if (a.order) return -1
    if (b.order) return 1
    return 0
  })

  if (sortedBreadcrumbs.length === 0) return null

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {sortedBreadcrumbs.map((crumb, index) => {
          const isLast = index === sortedBreadcrumbs.length - 1

          return (
            <React.Fragment key={index}>
              {isLast ? (
                <BreadcrumbItem>
                  <BreadcrumbPage className='text-muted-foreground text-[12px]'>
                    {crumb.label}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                <>
                  <BreadcrumbItem>
                    {crumb.href ? (
                      <BreadcrumbLink asChild>
                        <Link
                          href={crumb.href}
                          className='hover:text-foreground text-muted-foreground text-[12px] transition-colors'>
                          {crumb.label}
                        </Link>
                      </BreadcrumbLink>
                    ) : (
                      <span className='text-muted-foreground text-[12px]'>{crumb.label}</span>
                    )}
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              )}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
