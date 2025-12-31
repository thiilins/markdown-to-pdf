'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Box, Command, Layers, Search } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

// Imports locais (ajuste conforme seu projeto)
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Modules_Front } from '@/shared/constants/modules'

// --- Variantes de Animação (Framer Motion) ---

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 15,
      mass: 0.8,
    },
  },
}

const cardHoverVariants = {
  rest: { scale: 1, y: 0, rotateY: 0 },
  hover: {
    scale: 1.03,
    y: -8,
    rotateY: 3,
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 17,
    },
  },
}

const iconVariants = {
  rest: { scale: 1, rotate: 0 },
  hover: {
    scale: 1.1,
    rotate: [0, -5, 5, -5, 0],
    transition: {
      duration: 0.5,
      ease: 'easeInOut' as const,
    },
  },
}

// --- Componentes ---

const BackgroundEffects = () => (
  <div className='pointer-events-none fixed inset-0 -z-10 overflow-hidden'>
    {/* Gradiente Mesh Sutil com Animação */}
    <motion.div
      animate={{
        x: [0, 100, 0],
        y: [0, 50, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className='bg-primary/20 absolute -top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full opacity-40 mix-blend-screen blur-[120px]'
    />
    <motion.div
      animate={{
        x: [0, -80, 0],
        y: [0, -40, 0],
        scale: [1, 1.15, 1],
      }}
      transition={{
        duration: 25,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: 2,
      }}
      className='absolute top-[10%] -right-[10%] h-[400px] w-[400px] rounded-full bg-purple-500/20 opacity-40 mix-blend-screen blur-[120px]'
    />

    {/* Grid Pattern com Animação Sutil */}
    <motion.div
      animate={{
        opacity: [0.03, 0.05, 0.03],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className='absolute inset-0 bg-[url(/grid.svg)] invert dark:invert-0'
    />
    <div className='from-background via-background/90 to-background absolute inset-0 bg-gradient-to-b' />
  </div>
)

const ModuleCard = ({ module, index }: { module: any; index: number }) => {
  const ModuleIcon = module.icon

  return (
    <motion.div
      variants={itemVariants}
      layout
      initial='rest'
      whileHover='hover'
      whileTap={{ scale: 0.97 }}
      custom={index}>
      <Link href={module.href} className='group relative block h-full'>
        {/* Glow Effect Multi-layer com animação */}
        <motion.div
          variants={{
            rest: { opacity: 0, scale: 1 },
            hover: { opacity: 1, scale: 1.08 },
          }}
          transition={{ duration: 0.4 }}
          className='from-primary/60 absolute -inset-1 rounded-2xl bg-gradient-to-br via-purple-500/40 to-blue-500/60 blur-xl'
        />
        <motion.div
          variants={{
            rest: { opacity: 0, scale: 1 },
            hover: { opacity: 0.8, scale: 1.05 },
          }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className='from-primary/40 absolute -inset-0.5 rounded-2xl bg-gradient-to-r to-purple-500/40 blur-md'
        />

        {/* Background Pattern Sutil */}
        <motion.div
          animate={{
            opacity: [0.02, 0.05, 0.02],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.1,
          }}
          className='absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]'
        />

        <motion.div
          variants={cardHoverVariants}
          className='border-border/60 bg-card/60 hover:border-primary/30 hover:bg-card/90 relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border p-6 shadow-lg backdrop-blur-xl transition-all duration-500'>
          {/* Shine Effect no hover */}
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            whileHover={{ x: '200%', opacity: [0, 0.5, 0] }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className='absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent'
          />

          {/* Header do Card */}
          <div className='relative mb-4 flex items-start justify-between'>
            <motion.div variants={iconVariants} className='group/icon relative'>
              {/* Glow do ícone */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: index * 0.15,
                }}
                className='bg-primary/30 absolute -inset-2 rounded-xl blur-md'
              />
              <motion.div
                whileHover={{
                  scale: 1.15,
                  rotate: [0, -10, 10, -5, 0],
                }}
                transition={{
                  duration: 0.5,
                  ease: 'easeInOut' as const,
                }}
                className='from-primary/20 via-primary/10 text-primary group-hover:from-primary group-hover:text-primary-foreground relative rounded-xl bg-gradient-to-br to-purple-500/20 p-3 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:to-purple-600'>
                <ModuleIcon size={24} strokeWidth={2} />
              </motion.div>
            </motion.div>
            {module.beta && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: 'spring' as const,
                  stiffness: 200,
                  damping: 15,
                  delay: index * 0.05,
                }}>
                <Badge
                  variant='secondary'
                  className='h-5 border-purple-500/30 bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-2 text-[10px] font-semibold text-purple-600 shadow-sm dark:text-purple-400'>
                  Beta
                </Badge>
              </motion.div>
            )}
          </div>

          {/* Conteúdo */}
          <div className='relative space-y-3'>
            <motion.h3
              whileHover={{ x: 3 }}
              transition={{ type: 'spring' as const, stiffness: 400, damping: 17 }}
              className='from-foreground to-foreground/80 group-hover:from-primary bg-gradient-to-r bg-clip-text text-lg font-bold tracking-tight text-transparent transition-all duration-300 group-hover:to-purple-600'>
              {module.label}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0.8 }}
              whileHover={{ opacity: 1 }}
              className='text-muted-foreground line-clamp-2 text-sm leading-relaxed transition-opacity duration-300'>
              {module.description}
            </motion.p>
          </div>

          {/* Footer / CTA */}
          <motion.div
            whileHover={{ x: 6 }}
            transition={{ type: 'spring' as const, stiffness: 400, damping: 17 }}
            className='relative mt-6 flex items-center'>
            <motion.span className='from-primary bg-gradient-to-r to-purple-600 bg-clip-text text-xs font-semibold text-transparent opacity-70 transition-all duration-300 group-hover:opacity-100'>
              Acessar
            </motion.span>
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: index * 0.1,
              }}
              className='ml-2'>
              <ArrowRight className='text-primary h-4 w-4' strokeWidth={2.5} />
            </motion.div>
            {/* Linha decorativa */}
            <motion.div
              initial={{ width: 0 }}
              whileHover={{ width: '100%' }}
              transition={{ duration: 0.3 }}
              className='from-primary/50 absolute bottom-0 left-0 h-0.5 rounded-full bg-gradient-to-r to-purple-500/50'
            />
          </motion.div>

          {/* Corner Accent */}
          <motion.div
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.2,
            }}
            className='from-primary/20 absolute -top-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br to-purple-500/20 blur-2xl'
          />
        </motion.div>
      </Link>
    </motion.div>
  )
}

export const HomeViewComponent = () => {
  const [search, setSearch] = useState('')

  // Lógica de Filtro Refatorada (Funcionalidade)
  const filteredData = useMemo(() => {
    const searchTerm = search.trim().toLowerCase()

    // Se não há busca, retorna todos os módulos
    if (!searchTerm) {
      return Modules_Front.filter((category) => category.submenu && category.submenu.length > 0)
    }

    // Filtra os módulos baseado na busca
    const filtered = Modules_Front.map((category) => {
      if (!category.submenu) return null

      const filteredSubmenu = category.submenu.filter(
        (item) =>
          item.label.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm),
      )

      // Retorna a categoria apenas se tiver submenu filtrado
      if (filteredSubmenu.length === 0) return null

      return {
        ...category,
        submenu: filteredSubmenu,
      }
    }).filter((category) => category !== null) as typeof Modules_Front

    return filtered
  }, [search])

  const totalTools = Modules_Front.reduce((acc, cat) => acc + (cat.submenu?.length || 0), 0)
  const hasResults =
    filteredData.length > 0 && filteredData.some((cat) => (cat.submenu?.length || 0) > 0)

  return (
    <div className='selection:bg-primary/20 relative min-h-full w-full'>
      <BackgroundEffects />

      <main className='relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
        {/* --- Hero Section --- */}
        <div className='flex flex-col items-center text-center'>
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 0,
            }}
            transition={{
              type: 'spring' as const,
              stiffness: 200,
              damping: 20,
              duration: 0.6,
            }}
            className='relative mb-8'>
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className='bg-primary/20 absolute inset-0 rounded-full blur-xl'
            />
            <motion.div
              whileHover={{
                scale: 1.1,
                rotate: [0, -5, 5, -5, 0],
              }}
              transition={{
                duration: 0.5,
                ease: 'easeInOut' as const,
              }}
              className='relative flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-linear-to-b from-white/5 to-white/0 shadow-2xl backdrop-blur-xl'>
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}>
                <Box className='text-primary h-10 w-10' strokeWidth={1.5} />
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: 'spring' as const,
              stiffness: 100,
              damping: 15,
              delay: 0.2,
            }}
            className='from-foreground to-foreground/50 max-w-4xl bg-linear-to-br bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl md:text-7xl'>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}>
              MD Tools{' '}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: 'spring' as const,
                stiffness: 200,
                damping: 15,
                delay: 0.5,
              }}
              className='text-primary'>
              Pro
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: 'spring' as const,
              stiffness: 100,
              damping: 15,
              delay: 0.3,
            }}
            className='text-muted-foreground mt-6 max-w-2xl text-lg'>
            Suíte completa de ferramentas para desenvolvedores.
            <span className='hidden sm:inline'>
              {' '}
              Edite, converta e otimize seu fluxo de trabalho Markdown.
            </span>
          </motion.p>

          {/* --- Barra de Pesquisa (Funcionalidade) --- */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              type: 'spring' as const,
              stiffness: 100,
              damping: 15,
              delay: 0.4,
            }}
            className='mt-10 w-full max-w-md'>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileFocus={{ scale: 1.02 }}
              className='group relative'>
              <motion.div
                animate={{
                  opacity: [0.3, 0.5, 0.3],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className='from-primary/30 absolute -inset-0.5 rounded-full bg-linear-to-r to-purple-500/30 blur'
              />
              <motion.div
                whileHover={{ scale: 1.01 }}
                className='bg-background/80 relative flex items-center rounded-full shadow-xl backdrop-blur-xl'>
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}>
                  <Search className='text-muted-foreground ml-4 h-5 w-5' />
                </motion.div>
                <Input
                  type='text'
                  placeholder={`Buscar entre ${totalTools} ferramentas...`}
                  className='placeholder:text-muted-foreground/70 border-0 border-none bg-transparent py-6 pr-4 pl-3 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className='bg-muted text-muted-foreground mr-2 hidden items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-medium sm:flex'>
                  <Command className='h-3 w-3' /> K
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* --- Listagem de Módulos --- */}
        <div className='mt-24 space-y-20'>
          <AnimatePresence mode='wait' key={search}>
            {hasResults ? (
              <motion.div
                key='results'
                initial='hidden'
                animate='visible'
                exit='hidden'
                variants={containerVariants}
                className='space-y-20'>
                {filteredData.map((category) => {
                  const CategoryIcon = category.icon || Layers

                  return (
                    <motion.section key={category.label} variants={itemVariants} layout>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          type: 'spring' as const,
                          stiffness: 100,
                          damping: 15,
                        }}
                        className='mb-8 flex items-center gap-4'>
                        <motion.div
                          whileHover={{
                            scale: 1.1,
                            rotate: [0, -5, 5, 0],
                          }}
                          transition={{
                            duration: 0.5,
                            ease: 'easeInOut' as const,
                          }}
                          className='bg-card border-border/50 flex h-12 w-12 items-center justify-center rounded-2xl border shadow-sm'>
                          <motion.div
                            animate={{
                              rotate: [0, 5, -5, 0],
                            }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              ease: 'easeInOut',
                              delay: filteredData.indexOf(category) * 0.2,
                            }}>
                            <CategoryIcon className='text-primary h-6 w-6' />
                          </motion.div>
                        </motion.div>
                        <div>
                          <motion.h2
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className='text-2xl font-bold tracking-tight'>
                            {category.label}
                          </motion.h2>
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className='text-muted-foreground text-sm'>
                            {category.submenu?.length || 0} ferramenta
                            {category.submenu?.length !== 1 ? 's' : ''} disponível
                            {category.submenu?.length !== 1 ? 'eis' : ''}
                            {search && (
                              <span className='text-muted-foreground/70'>
                                {' '}
                                (filtrado{category.submenu?.length !== 1 ? 's' : ''})
                              </span>
                            )}
                          </motion.p>
                        </div>
                      </motion.div>

                      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                        {category.submenu?.map((module, idx) => (
                          <ModuleCard key={module.href} module={module} index={idx} />
                        ))}
                      </div>
                    </motion.section>
                  )
                })}
              </motion.div>
            ) : (
              <motion.div
                key='no-results'
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{
                  type: 'spring' as const,
                  stiffness: 100,
                  damping: 15,
                }}
                className='flex flex-col items-center justify-center py-20 text-center'>
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className='bg-muted/50 rounded-full p-6'>
                  <Search className='text-muted-foreground h-10 w-10' />
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className='mt-4 text-xl font-semibold'>
                  Nenhum resultado encontrado
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className='text-muted-foreground mt-2'>
                  {search
                    ? `Não encontramos nenhuma ferramenta para "${search}".`
                    : 'Nenhuma ferramenta disponível no momento.'}
                </motion.p>
                {search && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSearch('')}
                    className='text-primary hover:text-primary/80 mt-4 text-sm font-medium transition-colors hover:underline'>
                    Limpar busca
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
