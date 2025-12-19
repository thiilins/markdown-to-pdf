'use client'

import { BadgeMultiSelector } from '@/components/custom-ui/badge-multi-selector'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useGist } from '@/shared/contexts/gistContext'
import { Archive, Eraser, Search } from 'lucide-react'
import { IoLogoGithub } from 'react-icons/io5'
import { GistSearch } from './gist-search'
import { GistList } from './gist-list'

export const GistSidebar = () => {
  const {
    allLanguages,
    selectedLanguages,
    toggleLanguage,
    allTags,
    selectedTags,
    toggleTag,
    filteredGists,
  } = useGist()
  return (
    <div className='bg-background flex w-[420px] flex-col border-r'>
      <div className='flex items-center justify-between gap-2 border-b p-4'>
        <div className='flex items-center gap-2'>
          <IoLogoGithub className='text-primary h-5 w-5' />
          <h2 className='font-bold'>Gist Explorer</h2>
        </div>
        {/*  Badge de contagem de gists */}
        {filteredGists?.length > 0 && (
          <Badge
            variant='outline'
            className='bg-primary/10 text-primary flex items-center gap-2 rounded-md px-2 py-1 text-xs'>
            <Archive className='text-primary h-3 w-3' />
            <span>{filteredGists?.length || 0} Gists</span>
          </Badge>
        )}
      </div>
      <div className='bg-muted/20 border-b'>
        <GistSearch />
      </div>
      <SearchComboComponent />
      {/* Linguagens */}
      {allLanguages.length > 0 && (
        <BadgeMultiSelector
          label='Linguagens'
          options={allLanguages}
          selected={selectedLanguages}
          onSelect={toggleLanguage}
        />
      )}
      {/* Tags */}
      {allTags.length > 0 && (
        <BadgeMultiSelector
          label='Tags'
          options={allTags}
          selected={selectedTags}
          onSelect={toggleTag}
        />
      )}
      <div className='flex-1 overflow-hidden'>
        <GistList />
      </div>
    </div>
  )
}

const SearchComboComponent = () => {
  const { searchValue, setSearchValue, gists } = useGist()

  // Só mostra se houver gists carregados
  if (!gists || gists.length === 0) return null

  return (
    <div className='space-y-2 border-b p-3'>
      <div className='relative'>
        <Search className='text-muted-foreground absolute top-2.5 left-2 h-4 w-4' />
        <Input
          placeholder='Filtrar gists carregados...'
          value={searchValue}
          className='h-9 pl-8'
          onChange={(e) => setSearchValue(e.target.value)}
        />
        {searchValue && (
          <Button
            variant='ghost'
            size='icon'
            className='absolute top-0 right-0 h-9 w-9 hover:bg-transparent'
            onClick={() => setSearchValue('')}>
            <Eraser className='text-muted-foreground hover:text-foreground h-4 w-4' />
          </Button>
        )}
      </div>
    </div>
  )
}
