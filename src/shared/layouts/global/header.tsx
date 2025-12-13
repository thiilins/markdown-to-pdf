'use client'
import Link from 'next/link'
import { IoLogoMarkdown } from 'react-icons/io5'
import { GlobalHeaderMenu } from './header-menu'

export const GlobalHeaderComponent = () => {
  return (
    <header className='bg-background flex h-12 w-full shrink-0 items-center justify-between border-b px-4 py-2'>
      <Link href='/' className='flex items-center gap-2'>
        <IoLogoMarkdown className='text-primary h-5 w-5' />
        <span className='text-foreground font-bold'>MD Tools Pro</span>
      </Link>
      <GlobalHeaderMenu />
    </header>
  )
}
