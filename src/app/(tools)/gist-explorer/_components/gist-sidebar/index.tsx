'use client'

import { BadgeMultiSelector } from '@/components/custom-ui/badge-multi-selector'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useGist } from '@/shared/contexts/gistContext'
import { AnimatePresence, motion } from 'framer-motion'
import { Code, Eraser, Filter, Layers, Search, Tag } from 'lucide-react'
import { useState } from 'react'
import { IoLogoGithub } from 'react-icons/io5'
import { GistList } from './gist-list'
import { GistSearch } from './gist-search'

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
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className='bg-background/80 flex h-full w-[400px] shrink-0 flex-col border-r backdrop-blur-xl transition-all'>
      {/* Header - Fixed */}
      <div className='flex h-16 shrink-0 items-center justify-between border-b px-4 py-3'>
        <div className='flex items-center gap-3'>
          <div className='bg-background flex h-8 w-8 items-center justify-center rounded-lg border shadow-sm'>
            <IoLogoGithub className='text-primary h-5 w-5' />
          </div>
          <div className='flex flex-col'>
            <h2 className='text-sm leading-none font-bold tracking-tight'>Gist Explorer</h2>
            <span className='text-muted-foreground text-[10px] font-medium'>
              GitHub Integration
            </span>
          </div>
        </div>

        {filteredGists?.length > 0 && (
          <Badge
            variant='outline'
            className='border-primary/10 bg-primary/5 text-primary gap-1.5 px-2 py-0.5 text-[10px]'>
            <Layers className='h-3 w-3' />
            <span>{filteredGists.length}</span>
          </Badge>
        )}
      </div>

      {/* Global Search Area */}
      <div className='bg-muted/5 shrink-0 p-4 pb-2'>
        <GistSearch />
      </div>

      {/* Local Filter - Sticky styling */}
      <div className='px-4 pb-2'>
        <LocalFilterComponent />
      </div>

      <Separator />

      {/* Filters & List - Scrollable */}
      <div className='flex min-h-0 flex-1 flex-col overflow-hidden'>
        {/* Active Filters Section */}
        <AnimatePresence>
          {(allLanguages.length > 0 || allTags.length > 0) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className='shrink-0 overflow-hidden'>
              <div className='bg-muted/5 space-y-3 border-b px-4 py-3'>
                <div className='text-muted-foreground flex items-center gap-2 text-xs font-semibold'>
                  <Filter className='h-3 w-3' />
                  <span>Filtros Disponíveis</span>
                </div>
                <FiltersComponent />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* List Section */}
        <div className='bg-background min-h-0 flex-1 overflow-hidden'>
          <GistList />
        </div>
      </div>
    </motion.div>
  )
}
const FiltersComponent = () => {
  const { allLanguages, selectedLanguages, toggleLanguage, allTags, selectedTags, toggleTag } =
    useGist()

  const [show, setShow] = useState<'languages' | 'tags' | undefined>(undefined)
  return (
    <div className='flex flex-col gap-2'>
      <div className='bg-primary grid w-full grid-cols-2 items-center justify-center text-white'>
        <Button
          variant='ghost'
          onClick={() => setShow('languages')}
          className={cn(
            'hover:text-primary hover:border-primary w-full rounded-none border hover:bg-white',
            show === 'languages' && 'text-primary border-primary border bg-white',
          )}
          disabled={allLanguages.length === 0}>
          <Code className='h-3 w-3' /> Linguagens
        </Button>
        <Button
          variant='ghost'
          onClick={() => setShow('tags')}
          className='hover:text-primary w-full rounded-none hover:bg-white'
          disabled={allTags.length === 0}>
          <Tag className='h-3 w-3' /> Tags
        </Button>
      </div>
      {show === 'languages' && allLanguages.length > 0 && (
        <BadgeMultiSelector
          options={allLanguages}
          selected={selectedLanguages}
          onSelect={toggleLanguage}
        />
      )}
      {show === 'tags' && allTags.length > 0 && (
        <BadgeMultiSelector options={allTags} selected={selectedTags} onSelect={toggleTag} />
      )}
    </div>
  )
}

const LocalFilterComponent = () => {
  const { searchValue, setSearchValue, gists } = useGist()

  if (!gists || gists.length === 0) return null

  return (
    <div className='relative mt-2'>
      <Search className='text-muted-foreground group-focus-within:text-primary absolute top-2.5 left-2.5 h-3.5 w-3.5 transition-colors' />
      <Input
        placeholder='Filtrar na lista...'
        value={searchValue}
        className='border-muted bg-muted/20 placeholder:text-muted-foreground/50 focus-visible:bg-background focus-visible:ring-primary/20 h-8 pl-8 text-xs shadow-none transition-all focus-visible:ring-1'
        onChange={(e) => setSearchValue(e.target.value)}
      />
      {searchValue && (
        <Button
          variant='ghost'
          size='icon'
          className='hover:bg-background absolute top-0.5 right-0.5 h-7 w-7'
          onClick={() => setSearchValue('')}>
          <Eraser className='text-muted-foreground hover:text-destructive h-3 w-3' />
        </Button>
      )}
    </div>
  )
}
