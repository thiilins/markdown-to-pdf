'use client'

import { Badge } from '@/components/ui/badge'
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Modules, Modules_Front } from '@/shared/constants'
import { urlIsActive } from '@/shared/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { Command, Search, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'

export function HeaderNavigator() {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Filtra módulos baseado na busca
  const filteredModules = React.useMemo(() => {
    if (!search.trim()) return Modules_Front

    const query = search.toLowerCase()
    return Modules_Front.map((category) => ({
      ...category,
      submenu: category.submenu?.filter(
        (item) =>
          item.label.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query),
      ),
    })).filter((category) => category.submenu && category.submenu.length > 0)
  }, [search])

  // Total de ferramentas
  const totalTools = React.useMemo(
    () => filteredModules.reduce((acc, cat) => acc + (cat.submenu?.length || 0), 0),
    [filteredModules],
  )

  // Limpa busca ao fechar
  React.useEffect(() => {
    if (!open) setSearch('')
  }, [open])

  // Atalho Cmd+K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
        inputRef.current?.focus()
      }
      if (e.key === 'Escape' && open) {
        setOpen(false)
        inputRef.current?.blur()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            'relative flex h-9 w-full max-w-sm items-center rounded-lg border transition-all',
            'border-zinc-200 bg-zinc-50/80',
            'hover:border-primary/40 hover:bg-white',
            'dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:bg-zinc-800',
            open && 'border-primary/50 ring-primary/10 bg-white ring-2',
          )}>
          <Search className='ml-3 h-4 w-4 shrink-0 text-zinc-400' />

          <PlaceholdersAndVanishInput
            placeholders={['Buscar ferramentas...', ...Modules.map((module: any) => module.label)]}
            onChange={(e) => setSearch(e.target.value)}
            className='h-full flex-1 bg-transparent px-2.5 text-sm text-zinc-700 placeholder-zinc-400 outline-none dark:text-zinc-200'
          />
          {search ? (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setSearch('')
                inputRef.current?.focus()
              }}
              className='mr-2 rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-700'>
              <X className='h-3.5 w-3.5' />
            </button>
          ) : (
            <kbd className='mr-2.5 hidden rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 sm:flex dark:border-zinc-700 dark:bg-zinc-800'>
              <Command className='mr-0.5 h-2.5 w-2.5' />K
            </kbd>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent
        align='start'
        sideOffset={8}
        onOpenAutoFocus={(e) => e.preventDefault()}
        className='w-[680px] overflow-hidden rounded-xl border-zinc-200 p-0 shadow-xl dark:border-zinc-800'>
        {/* Header */}
        <div className='flex items-center justify-between border-b border-zinc-100 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900'>
          <div className='flex items-center gap-2'>
            <Search className='text-primary h-4 w-4' />
            <span className='text-xs font-semibold text-zinc-600 dark:text-zinc-300'>
              {search ? `Resultados para "${search}"` : 'Explorar Ferramentas'}
            </span>
          </div>
          <Badge variant='secondary' className='h-5 px-2 text-[10px]'>
            {totalTools} disponíveis
          </Badge>
        </div>

        {/* Grid de Categorias */}
        <div className='custom-scrollbar max-h-[420px] overflow-y-auto'>
          <AnimatePresence mode='wait'>
            {filteredModules.length > 0 ? (
              <motion.div
                key='results'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='grid grid-cols-2'>
                {filteredModules.map((category, idx) => (
                  <CategorySection
                    key={category.label}
                    category={category}
                    onSelect={() => {
                      setOpen(false)
                      setSearch('')
                    }}
                    search={search}
                    isLast={idx === filteredModules.length - 1}
                    isOdd={idx % 2 === 0}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key='empty'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='flex flex-col items-center py-12 text-center'>
                <div className='mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800'>
                  <Search className='h-5 w-5 text-zinc-400' />
                </div>
                <p className='text-sm font-semibold text-zinc-600 dark:text-zinc-300'>
                  Nenhuma ferramenta encontrada
                </p>
                <p className='mt-1 text-xs text-zinc-400'>Tente buscar com outros termos</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function CategorySection({
  category,
  onSelect,
  search,
  isLast,
  isOdd,
}: {
  category: ModuleItem
  onSelect: () => void
  search: string
  isLast: boolean
  isOdd: boolean
}) {
  const Icon = category.icon

  return (
    <div
      className={cn(
        'border-b border-zinc-100 p-4 dark:border-zinc-800',
        isOdd && 'border-r',
        isLast && 'border-b-0',
      )}>
      {/* Category Header */}
      <div className='mb-3 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 dark:bg-zinc-800'>
            <Icon className='h-4 w-4' />
          </div>
          <h3 className='text-[10px] font-black tracking-widest text-zinc-400 uppercase'>
            {category.label}
          </h3>
        </div>
        <Badge variant='outline' className='h-5 px-1.5 text-[9px]'>
          {category.submenu?.length}
        </Badge>
      </div>

      {/* Tools */}
      <ul className='space-y-1'>
        {category.submenu?.map((item, idx) => (
          <ToolItem key={item.label} item={item} onSelect={onSelect} index={idx} search={search} />
        ))}
      </ul>
    </div>
  )
}

function ToolItem({
  item,
  onSelect,
  index,
  search,
}: {
  item: ModuleItem
  onSelect: () => void
  index: number
  search: string
}) {
  const pathname = usePathname()
  const active = urlIsActive(pathname, item.href || '')
  const Icon = item.icon

  const highlightText = (text: string) => {
    if (!search.trim()) return text
    const regex = new RegExp(`(${search})`, 'gi')
    const parts = text.split(regex)
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className='rounded bg-yellow-200 px-0.5 dark:bg-yellow-500/30'>
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  return (
    <motion.li
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.02 }}>
      <Link
        href={item.href || '#'}
        onClick={onSelect}
        className={cn(
          'group flex items-center gap-3 rounded-xl p-2.5 transition-all',
          active ? 'bg-primary text-white shadow-sm' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50',
        )}>
        <div
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all',
            active
              ? 'bg-white/20'
              : 'group-hover:border-primary/30 group-hover:text-primary border border-zinc-200 bg-white text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800',
          )}>
          <Icon className='h-4 w-4' />
        </div>
        <div className='min-w-0 flex-1'>
          <span
            className={cn(
              'block truncate text-[12px] font-bold',
              active ? 'text-white' : 'text-zinc-700 dark:text-zinc-200',
            )}>
            {highlightText(item.label)}
          </span>
          {item.description && (
            <span
              className={cn(
                'block truncate text-[10px]',
                active ? 'text-white/70' : 'text-zinc-400',
              )}>
              {highlightText(item.description)}
            </span>
          )}
        </div>
        {active && <div className='h-2 w-2 rounded-full bg-white' />}
      </Link>
    </motion.li>
  )
}
