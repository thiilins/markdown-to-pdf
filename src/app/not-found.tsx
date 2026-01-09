'use client'

import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import {
  ArrowLeft,
  Code2,
  Command,
  FileWarning,
  Home,
  Search,
  Sparkles,
  Terminal,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// --- Componentes de Fundo (Visuais) ---

const NoiseTexture = () => (
  <div
    className='pointer-events-none fixed inset-0 z-40 h-full w-full opacity-[0.03] mix-blend-overlay'
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    }}
  />
)

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
        background: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(139, 92, 246, 0.06), transparent 80%)`,
      }}
    />
  )
}

const AnimatedOrb = ({ delay = 0, duration = 20, className = '' }) => (
  <motion.div
    className={`absolute rounded-full opacity-40 blur-[100px] ${className}`}
    animate={{
      x: [0, 80, -40, 0],
      y: [0, -60, 40, 0],
      scale: [1, 1.1, 0.9, 1],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: 'linear',
    }}
  />
)

// --- Efeitos de Texto ---

const GlitchText = ({ children }: { children: string }) => {
  return (
    <div className='group relative inline-block'>
      <span className='relative z-10'>{children}</span>
      <span className='absolute top-0 left-0 -z-10 h-full w-full translate-x-[2px] animate-pulse text-red-500 opacity-0 group-hover:opacity-70'>
        {children}
      </span>
      <span className='absolute top-0 left-0 -z-10 h-full w-full -translate-x-[2px] animate-pulse text-cyan-500 opacity-0 delay-75 group-hover:opacity-70'>
        {children}
      </span>
    </div>
  )
}

// --- Terminal Interativo ---

const TerminalLog = ({ requestedPath }: { requestedPath: string }) => {
  const [lines, setLines] = useState<string[]>([])

  useEffect(() => {
    const sequence = [
      { text: '> conectando ao servidor...', delay: 200 },
      { text: '> resolvendo host...', delay: 600 },
      { text: `> GET ${requestedPath}`, delay: 1200 },
      { text: '> ERRO: 404 Página Não Encontrada', delay: 1800, error: true },
      { text: '> iniciando protocolo de recuperação...', delay: 2400 },
      { text: '> redirecionando para página inicial...', delay: 3000 },
    ]

    let timeouts: NodeJS.Timeout[] = []

    sequence.forEach(({ text, delay, error }) => {
      const timeout = setTimeout(() => {
        setLines((prev) => [...prev, error ? `Error: ${text}` : text])
      }, delay)
      timeouts.push(timeout)
    })

    return () => timeouts.forEach(clearTimeout)
  }, [requestedPath])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className='w-full overflow-hidden rounded-lg border border-white/10 bg-black/60 p-4 font-mono text-xs shadow-2xl backdrop-blur-md md:text-sm'>
      <div className='mb-3 flex items-center gap-1.5 opacity-50'>
        <div className='h-2.5 w-2.5 rounded-full bg-red-500' />
        <div className='h-2.5 w-2.5 rounded-full bg-yellow-500' />
        <div className='h-2.5 w-2.5 rounded-full bg-green-500' />
        <span className='ml-2 text-[10px] tracking-wider text-slate-400 uppercase'>
          Log do Sistema
        </span>
      </div>
      <div className='flex flex-col gap-1'>
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`${line.includes('Error') ? 'font-bold text-red-400' : 'text-slate-400'}`}>
            <span className='mr-2 opacity-50'>$</span>
            {line.replace('Error: ', '')}
          </motion.div>
        ))}
        <motion.div
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className='h-4 w-2 bg-purple-500'
        />
      </div>
    </motion.div>
  )
}

// --- Ícones Flutuantes ---
const FloatingIcon = ({ icon: Icon, delay = 0, className = '' }: any) => (
  <motion.div
    animate={{
      y: [0, -15, 0],
      rotate: [0, 5, -5, 0],
      opacity: [0.2, 0.5, 0.2],
    }}
    transition={{
      duration: 5,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
    className={`pointer-events-none absolute ${className}`}>
    <Icon className='h-8 w-8 text-slate-600 sm:h-12 sm:w-12' strokeWidth={1} />
  </motion.div>
)

export default function NotFound() {
  const router = useRouter()
  const pathname = usePathname()
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (countdown <= 0) {
      router.push('/')
    }
  }, [countdown, router])

  return (
    <div className='relative min-h-screen w-full overflow-hidden bg-[#05060A] font-sans text-slate-200 selection:bg-purple-500/30'>
      <NoiseTexture />
      <SpotlightOverlay />

      {/* Orbes de Fundo (Mais suaves) */}
      <div className='pointer-events-none fixed inset-0 overflow-hidden'>
        <AnimatedOrb
          delay={0}
          duration={25}
          className='top-[-10%] left-[-10%] h-[500px] w-[500px] bg-purple-900/30'
        />
        <AnimatedOrb
          delay={5}
          duration={30}
          className='top-[40%] right-[-10%] h-[400px] w-[400px] bg-blue-900/20'
        />
        <AnimatedOrb
          delay={10}
          duration={35}
          className='bottom-[-10%] left-[20%] h-[600px] w-[600px] bg-indigo-900/20'
        />
      </div>

      {/* Ícones de Fundo */}
      <FloatingIcon icon={Code2} delay={0} className='top-[15%] left-[10%]' />
      <FloatingIcon icon={Terminal} delay={2} className='top-[25%] right-[15%]' />
      <FloatingIcon icon={Sparkles} delay={1} className='bottom-[20%] left-[15%]' />
      <FloatingIcon icon={Command} delay={3} className='right-[10%] bottom-[30%]' />

      <main className='relative z-50 flex min-h-screen flex-col items-center justify-center px-4 py-20'>
        {/* Conteúdo Central */}
        <div className='flex w-full max-w-3xl flex-col items-center text-center'>
          {/* Ícone de Erro Animado */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className='relative mb-6'>
            <div className='absolute inset-0 animate-pulse rounded-full bg-purple-500/20 blur-2xl' />
            <FileWarning className='relative h-24 w-24 text-slate-200/90' strokeWidth={1} />
          </motion.div>

          {/* 404 Glitch */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className='mb-2 bg-linear-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-8xl font-black tracking-tighter text-transparent select-none sm:text-[10rem]'>
            <GlitchText>404</GlitchText>
          </motion.h1>

          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className='mb-6 text-2xl font-bold text-white sm:text-3xl'>
            Página não encontrada no sistema
          </motion.h2>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className='mb-10 max-w-lg text-lg leading-relaxed text-slate-400'>
            Ops! 🚀 Parece que você se aventurou por um caminho inexplorado. Esta página foi movida,
            removida ou nunca existiu no nosso universo digital.
          </motion.p>

          {/* Terminal Mockup */}
          <div className='mb-12 w-full max-w-xl'>
            <TerminalLog requestedPath={pathname || '/requested-page'} />
          </div>

          {/* Botões de Ação */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className='flex w-full flex-col gap-4 sm:w-auto sm:flex-row'>
            <Link href='/' className='w-full sm:w-auto'>
              <button className='group relative w-full overflow-hidden rounded-lg bg-slate-50 px-8 py-3.5 font-bold text-slate-900 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.5)]'>
                <span className='relative z-10 flex items-center justify-center gap-2'>
                  <Home className='h-4 w-4' />
                  Voltar ao Início
                </span>
              </button>
            </Link>

            <button
              onClick={() => router.back()}
              className='group flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-8 py-3.5 font-semibold text-white transition-all duration-300 hover:border-purple-500/50 hover:bg-white/10 sm:w-auto'>
              <ArrowLeft className='h-4 w-4 transition-transform group-hover:-translate-x-1' />
              Voltar
            </button>
          </motion.div>

          {/* Sugestões (System Recovery) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className='mt-16 w-full max-w-2xl border-t border-white/5 pt-10'>
            <div className='mb-6 flex items-center justify-center gap-2 font-mono text-xs tracking-widest text-purple-400/80 uppercase'>
              <Zap className='h-3 w-3' /> Que tal explorar estas opções?
            </div>

            <div className='grid gap-4 sm:grid-cols-3'>
              {[
                { icon: Code2, label: 'Ver Ferramentas', href: '/#tools' },
                { icon: Search, label: 'Explorar Tudo', href: '/' },
                { icon: Terminal, label: 'Novidades', href: '/changelog' },
              ].map((item, index) => (
                <Link key={index} href={item.href} className='group block'>
                  <div className='relative overflow-hidden rounded-xl border border-white/5 bg-white/2 p-4 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-purple-500/30 group-hover:bg-white/5'>
                    <div className='flex flex-col items-center gap-3'>
                      <div className='rounded-lg bg-white/5 p-2 transition-colors group-hover:bg-purple-500/20'>
                        <item.icon className='h-5 w-5 text-slate-400 transition-colors group-hover:text-purple-300' />
                      </div>
                      <span className='text-sm font-medium text-slate-400 transition-colors group-hover:text-white'>
                        {item.label}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Auto Redirect Countdown */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className='mt-12 text-center'>
            <p className='text-sm text-slate-500'>
              Redirecionando para a página inicial em{' '}
              <span className='font-mono font-bold text-purple-400'>{countdown}s</span>
            </p>
            <div className='mx-auto mt-3 h-1 w-48 overflow-hidden rounded-full bg-slate-800/50'>
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 10, ease: 'linear' }}
                className='h-full bg-linear-to-r from-purple-500 to-pink-500'
              />
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
