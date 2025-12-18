'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useGist } from '@/shared/contexts/gistContext'
import { Archive, Eraser } from 'lucide-react'
import { IoLogoGithub } from 'react-icons/io5'
import { GistList } from './gist-list'
import { GistSearch } from './gist-search'

export const GistSidebar = () => {
  return (
    <div className='bg-background flex w-[420px] flex-col border-r'>
      <div className='flex items-center justify-between gap-2 border-b p-4'>
        <div className='flex items-center gap-2'>
          <IoLogoGithub className='text-primary h-5 w-5' />
          <h2 className='font-bold'>Gist Explorer</h2>
        </div>
        <GistCountHeader />
      </div>

      <GistSearch />
      <GistLisSidebarHeader />
      <GistList />
    </div>
  )
}
const GistCountHeader = () => {
  const { gists } = useGist()
  if (gists?.length === 0) return null
  return (
    <Badge
      variant='outline'
      className='bg-primary/10 text-primary flex items-center gap-2 rounded-md px-2 py-1 text-xs'>
      <Archive className='text-primary h-4 w-4' />
      <p className='text-primary text-[12px]'>{gists?.length} Gists</p>
    </Badge>
  )
}

const GistLisSidebarHeader = () => {
  const { gists } = useGist()
  return gists?.length ? (
    <div className='flex flex-col'>
      <SearchComboComponent />
    </div>
  ) : null
}

const SearchComboComponent = () => {
  const { searchValue, setSearchValue } = useGist()
  return (
    <div className='text-muted-foreground bg-primary/10 flex w-full flex-col items-center justify-center gap-2 border-b p-2 text-sm'>
      <div className='flex w-full items-center gap-2'>
        <Input
          placeholder='Pesquisar Gists...'
          value={searchValue}
          className='bg-white/50'
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <Button
          variant='outline'
          size='icon'
          className='bg-primary hover:bg-primary/20'
          onClick={() => setSearchValue('')}>
          <Eraser className='h-4 w-4 text-white' />
        </Button>
      </div>
    </div>
  )
}
