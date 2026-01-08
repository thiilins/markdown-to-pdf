'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Modules_Front } from '@/shared/constants/modules'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { GlowCard, SectionWrapper } from './global'

export const ToolsShowcaseComponent = () => {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filteredData = useMemo(() => {
    let data = Modules_Front

    if (activeCategory) {
      data = data.filter((cat) => cat.label === activeCategory)
    }

    if (search.trim()) {
      const term = search.toLowerCase()
      data = data
        .map((cat) => ({
          ...cat,
          submenu: cat.submenu?.filter(
            (item) =>
              item.label.toLowerCase().includes(term) ||
              item.description?.toLowerCase().includes(term),
          ),
        }))
        .filter((cat) => cat.submenu && cat.submenu.length > 0)
    }

    return data
  }, [search, activeCategory])

  return (
    <SectionWrapper id='tools' className='relative overflow-hidden py-32'>
      <div className='relative z-10 container mx-auto px-4'>
        {/* Header */}
        <div className='mx-auto mb-16 max-w-3xl text-center'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>
            <Badge className='mb-4 border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20'>
              +20 Ferramentas Integradas
            </Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className='mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl'>
            Sua Caixa de Ferramentas Definitiva
          </motion.h2>
        </div>

        {/* Search Bar */}
        <div className='mx-auto mb-12 max-w-2xl'>
          <div className='group relative'>
            <div className='absolute -inset-0.5 rounded-2xl bg-linear-to-r from-pink-600 to-purple-600 opacity-30 blur transition duration-500 group-hover:opacity-60' />
            <input
              type='text'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='O que você precisa hoje? (ex: PDF, Converter...)'
              className='relative h-14 w-full rounded-2xl border border-zinc-700 bg-zinc-900/90 pr-6 pl-14 text-lg text-white placeholder-zinc-500 backdrop-blur-xl transition-all focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none'
            />
            <div className='absolute top-1/2 left-5 -translate-y-1/2 text-zinc-500'>
              <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
              </svg>
            </div>
          </div>

          {/* Filter Pills */}
          <div className='mt-6 flex flex-wrap justify-center gap-2'>
            <button
              onClick={() => setActiveCategory(null)}
              className={cn(
                'rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300',
                !activeCategory
                  ? 'bg-linear-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white',
              )}>
              Todas
            </button>
            {Modules_Front.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(activeCategory === cat.label ? null : cat.label)}
                className={cn(
                  'rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300',
                  activeCategory === cat.label
                    ? 'bg-linear-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white',
                )}>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className='mx-auto max-w-7xl'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={activeCategory || 'all'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {filteredData.flatMap((category) =>
                category.submenu?.map((tool) => (
                  <Link key={tool.href} href={tool.href} className='block h-full'>
                    <GlowCard className='h-full p-6'>
                      <div className='mb-6 flex items-start justify-between'>
                        <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-zinc-800 to-zinc-900 text-purple-400 shadow-inner ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-110 group-hover:text-purple-300'>
                          <tool.icon className='h-6 w-6' />
                        </div>
                        <div className='rounded-full border border-white/5 bg-white/5 p-1'>
                          <ArrowRight className='h-3 w-3 -rotate-45 text-zinc-500 transition-transform duration-300 group-hover:rotate-0 group-hover:text-white' />
                        </div>
                      </div>

                      <h3 className='mb-2 text-lg font-bold text-white transition-colors group-hover:text-purple-300'>
                        {tool.label}
                      </h3>
                      <p className='line-clamp-2 text-sm leading-relaxed text-zinc-400 group-hover:text-zinc-300'>
                        {tool.description}
                      </p>
                    </GlowCard>
                  </Link>
                )),
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </SectionWrapper>
  )
}
