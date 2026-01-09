'use client'

import { AnimatePresence, motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import { Calendar, GitCommit, Package, Zap } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { getChangelogComponents } from './changelog-components'

// --- Otimização: Noise via CSS puro ou SVG memoizado ---
const NoiseTexture = () => (
  <div
    className='pointer-events-none fixed inset-0 z-40 h-full w-full opacity-[0.04] mix-blend-overlay'
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    }}
  />
)

// --- Otimização: Spotlight usando MotionValues para não re-renderizar o componente ---
const SpotlightOverlay = () => {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <motion.div
      className='pointer-events-none fixed inset-0 z-30 transition-opacity duration-300'
      style={{
        background: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(139, 92, 246, 0.08), transparent 80%)`,
      }}
    />
  )
}

const GlowCard = ({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0B0C15]/80 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-purple-500/30 ${className}`}>
      {/* Spotlight interno do card */}
      <motion.div
        className='pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100'
        style={{
          background: useMotionTemplate`radial-gradient(500px circle at ${mouseX}px ${mouseY}px, rgba(139, 92, 246, 0.12), transparent 40%)`,
        }}
      />
      <div className='relative h-full'>{children}</div>
    </div>
  )
}

// --- Skeleton com animação mais fluida ---
function ChangelogSkeleton() {
  return (
    <div className='space-y-12 p-8 md:p-12'>
      {[1, 2].map((i) => (
        <div key={i} className='space-y-6'>
          <div className='flex items-center gap-4'>
            <div className='h-8 w-32 animate-pulse rounded-lg bg-slate-800' />
            <div className='h-6 w-24 animate-pulse rounded-full bg-slate-800/50' />
          </div>
          <div className='space-y-3 pl-4'>
            <div className='h-4 w-3/4 animate-pulse rounded bg-slate-800/40' />
            <div className='h-4 w-1/2 animate-pulse rounded bg-slate-800/40' />
            <div className='h-4 w-full animate-pulse rounded bg-slate-800/40' />
          </div>
        </div>
      ))}
    </div>
  )
}

export function ChangelogView() {
  const [changelog, setChangelog] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [currentVersion, setCurrentVersion] = useState('0.0.0')

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('/api/changelog')
        if (!res.ok) throw new Error('Falha ao carregar')
        const text = await res.text()
        setChangelog(text)

        // Regex robusto para pegar a primeira versão definida
        const versionMatch = text.match(/##\s*\[(\d+\.\d+\.\d+)\]/)
        if (versionMatch) setCurrentVersion(versionMatch[1])
      } catch (err) {
        console.error('Erro ao carregar changelog:', err)
        setChangelog('# Erro\nNão foi possível carregar o histórico de mudanças.')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <div className='relative min-h-screen bg-[#05060A] text-slate-200 selection:bg-purple-500/30 selection:text-purple-100'>
      <SpotlightOverlay />
      <NoiseTexture />

      {/* Background Orbs Ambientais (Estáticos para performance) */}
      <div className='pointer-events-none fixed inset-0 overflow-hidden'>
        <div className='absolute -top-[20%] -left-[10%] h-[800px] w-[800px] rounded-full bg-purple-900/10 blur-[120px]' />
        <div className='absolute top-[20%] -right-[10%] h-[600px] w-[600px] rounded-full bg-blue-900/10 blur-[120px]' />
      </div>

      {/* Header */}
      <header className='relative z-10'>
        <div className='mx-auto max-w-5xl px-6 pt-24 pb-16 text-center'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}>
            {/* Badge de Versão Mais Recente */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className='mb-8 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-900/10 px-4 py-1.5 backdrop-blur-md'>
              <span className='relative flex h-2 w-2'>
                <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75'></span>
                <span className='relative inline-flex h-2 w-2 rounded-full bg-purple-500'></span>
              </span>
              <span className='text-xs font-bold tracking-widest text-purple-200 uppercase'>
                v{currentVersion} Disponível
              </span>
            </motion.div>

            <h1 className='mb-6 text-5xl font-black tracking-tight text-white md:text-7xl'>
              <span className='bg-gradient-to-b from-white via-white to-slate-400 bg-clip-text text-transparent'>
                Changelog
              </span>
            </h1>

            <p className='mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-slate-400'>
              A evolução contínua do SuperTOOLS. Explore as novas funcionalidades, melhorias de
              performance e correções que implementamos.
            </p>

            {/* Stats Cards */}
            <div className='flex flex-wrap items-center justify-center gap-4'>
              <StatsCard
                icon={Package}
                label='Versão Atual'
                value={`v${currentVersion}`}
                color='text-purple-400'
                bg='bg-purple-500/10'
              />
              <StatsCard
                icon={Calendar}
                label='Último Update'
                value='Hoje'
                color='text-blue-400'
                bg='bg-blue-500/10'
              />
              <StatsCard
                icon={Zap}
                label='Status'
                value='Estável'
                color='text-emerald-400'
                bg='bg-emerald-500/10'
              />
            </div>
          </motion.div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className='relative z-10 mx-auto max-w-4xl px-4 pb-32'>
        <AnimatePresence mode='wait'>
          {loading ? (
            <motion.div key='loading' exit={{ opacity: 0 }}>
              <GlowCard>
                <ChangelogSkeleton />
              </GlowCard>
            </motion.div>
          ) : (
            <motion.div
              key='content'
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}>
              <GlowCard className='p-8 md:p-12'>
                {/* Linha vertical contínua da timeline (Desktop) */}
                <div className='absolute top-0 bottom-0 left-[47px] hidden w-px bg-gradient-to-b from-transparent via-white/10 to-transparent md:block' />

                <article className='prose prose-invert max-w-none'>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw, rehypeSlug]}
                    components={getChangelogComponents()}>
                    {changelog}
                  </ReactMarkdown>
                </article>
              </GlowCard>
            </motion.div>
          )}
        </AnimatePresence>

        <Footer />
      </main>
    </div>
  )
}

// Subcomponente de Stats para limpar o código principal
const StatsCard = ({ icon: Icon, label, value, color, bg }: any) => (
  <div className='flex items-center gap-3 rounded-2xl border border-white/5 bg-[#0B0C15]/50 px-5 py-3 backdrop-blur-sm transition-all hover:bg-white/5'>
    <div className={`rounded-lg p-2 ${bg}`}>
      <Icon className={`h-4 w-4 ${color}`} />
    </div>
    <div className='text-left'>
      <div className='text-[10px] font-bold tracking-wider text-slate-500 uppercase'>{label}</div>
      <div className='text-sm font-bold text-slate-200'>{value}</div>
    </div>
  </div>
)

const Footer = () => (
  <motion.footer
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.8 }}
    className='mt-20 flex flex-col items-center justify-center gap-4 border-t border-white/5 pt-10 text-center'>
    <div className='flex items-center gap-2 rounded-full bg-white/5 px-4 py-2'>
      <GitCommit className='h-4 w-4 text-purple-400' />
      <span className='text-sm font-medium text-slate-400'>SuperTOOLS Engineering</span>
    </div>
    <p className='text-xs text-slate-600'>
      © {new Date().getFullYear()} Construído para alta produtividade.
    </p>
  </motion.footer>
)
