'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useGist } from '@/shared/contexts/gistContext'
import { extractGistTags } from '@/shared/utils/gist-tools'
import { Archive, Eraser, Hash, Search } from 'lucide-react'
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
      <div className='bg-muted/20 border-b'>
        <GistSearch />
      </div>
      <SearchComboComponent />
      <GistTags />
      <GistLanguageFilters />
      <div className='flex-1 overflow-hidden'>
        <GistList />
      </div>
    </div>
  )
}
export function GistLanguageFilters() {
  const { allLanguages, selectedLanguages, toggleLanguage } = useGist()

  if (allLanguages.length === 0) return null

  return (
    <div className='border-b px-4 py-2'>
      <p className='text-muted-foreground mb-2 text-[10px] font-bold uppercase'>Linguagens</p>
      <div className='flex flex-wrap gap-1.5'>
        {allLanguages.map((lang) => {
          const isActive = selectedLanguages.includes(lang)
          return (
            <Badge
              key={lang}
              variant={isActive ? 'default' : 'outline'}
              className={cn(
                'h-5 cursor-pointer px-2 py-0 text-[10px] font-normal transition-all',
                !isActive && 'hover:bg-muted',
              )}
              onClick={() => toggleLanguage(lang)}>
              {lang}
            </Badge>
          )
        })}
      </div>
    </div>
  )
}
const GistCountHeader = () => {
  const { filteredGists, loading } = useGist()
  if (loading) return <span className='text-muted-foreground text-xs'>Carregando...</span>

  return (
    <Badge
      variant='outline'
      className='bg-primary/10 text-primary flex items-center gap-2 rounded-md px-2 py-1 text-xs'>
      <Archive className='text-primary h-3 w-3' />
      <span>{filteredGists?.length || 0} Gists</span>
    </Badge>
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

export function GistTags() {
  const { gists, toggleTag } = useGist()
  const tags = extractGistTags(gists.map((gist) => gist.description).join('\n'))

  if (tags.length === 0) return null

  return (
    <div className='mt-2 flex flex-wrap gap-2'>
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant='secondary'
          className='hover:bg-primary/20 h-6 cursor-pointer px-2 py-0.5 text-xs transition-colors'
          onClick={(e) => {
            e.stopPropagation() // Evita abrir o gist ao clicar na tag
            toggleTag?.(tag)
          }}>
          <Hash className='mr-1 h-3 w-3 opacity-50' />
          {tag}
        </Badge>
      ))}
    </div>
  )
}
