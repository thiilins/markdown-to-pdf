'use client'

import { useGist } from '@/shared/contexts/gistContext'
import { Archive } from 'lucide-react'
import { IoLogoGithub } from 'react-icons/io5'
import { GistList } from './gist-list'
import { GistSearch } from './gist-search'

export const GistSidebar = () => {
  return (
    <div className='bg-background flex w-[420px] flex-col border-r'>
      <div className='flex items-center gap-2 border-b p-4'>
        <IoLogoGithub className='text-primary h-5 w-5' />
        <h2 className='font-bold'>Gist Explorer</h2>
      </div>
      <GistSearch />
      <GistLisSidebarHeader />
      <GistList />
    </div>
  )
}

const GistLisSidebarHeader = () => {
  const { gists } = useGist()
  return gists?.length ? (
    <div className='text-muted-foreground bg-primary/10 flex h-10 w-full items-center justify-center border-b p-2 text-sm'>
      <Archive className='mr-3 h-4 w-4' /> Encontrados {gists.length} Gists
    </div>
  ) : null
}
