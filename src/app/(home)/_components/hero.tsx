'use client'

import { Button } from '@/components/ui/button'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Sparkles, Zap } from 'lucide-react'
import { HERO_VIDEO } from './constants'
import { scrollToSection } from './utils'

export const HeroSectionComponent = () => {
  const { scrollY } = useScroll()
  const yContent = useTransform(scrollY, [0, 500], [0, 150])
  const opacityContent = useTransform(scrollY, [0, 300], [1, 0])
  const scaleVideo = useTransform(scrollY, [0, 1000], [1, 1.2])

  return (
    <section className='relative h-screen w-full overflow-hidden bg-slate-950'>
      {/* Background Video Layer */}
      <motion.div style={{ scale: scaleVideo }} className='absolute inset-0 z-0'>
        <div className='absolute inset-0 z-10 bg-slate-950/70' />
        <div className='absolute inset-0 z-10 bg-linear-to-t from-slate-950 via-slate-950/20 to-slate-950/60' />
        <video
          autoPlay
          loop
          muted
          playsInline
          className='h-full w-full object-cover opacity-60 grayscale-[0.2]'>
          <source src={HERO_VIDEO} type='video/mp4' />
        </video>
      </motion.div>

      {/* Hero Content */}
      <div className='relative z-20 flex h-full items-center justify-center px-4'>
        <motion.div
          style={{ y: yContent, opacity: opacityContent }}
          className='flex max-w-5xl flex-col items-center text-center'>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className='mb-8'>
            <div className='relative inline-flex overflow-hidden rounded-full p-px focus:outline-none'>
              <span className='absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#7C3AED_50%,#E2CBFF_100%)]' />
              <span className='inline-flex h-full w-full cursor-default items-center justify-center rounded-full bg-slate-950/90 px-6 py-2 text-sm font-medium text-white backdrop-blur-3xl'>
                <Sparkles className='mr-2 h-4 w-4 text-purple-400' />
                MD Tools Suite v2.0
              </span>
            </div>
          </motion.div>

          <h1 className='text-6xl font-black tracking-tighter text-white sm:text-7xl md:text-8xl lg:text-9xl'>
            Potência & <br />
            <span className='animate-pulse bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent'>
              Produtividade
            </span>
          </h1>

          <p className='mt-8 max-w-2xl text-lg font-light tracking-wide text-slate-300 md:text-xl'>
            Conversão, formatação e organização de arquivos em um só lugar. Otimize seu fluxo de
            trabalho com nossas ferramentas avançadas.
          </p>

          <div className='mt-12 flex flex-col items-center gap-6 sm:flex-row'>
            <Button
              onClick={() => scrollToSection('tools')}
              className='group relative h-14 w-full min-w-[200px] overflow-hidden rounded-full bg-white px-8 text-black transition-all hover:scale-105 hover:bg-slate-200 sm:w-auto'>
              <div className='absolute inset-0 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 transition-opacity group-hover:opacity-10' />
              <span className='relative flex items-center justify-center gap-2 text-base font-bold tracking-wide uppercase'>
                <Zap fill='currentColor' className='h-4 w-4' /> Acessar Ferramentas
              </span>
            </Button>
          </div>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className='absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50'>
        <div className='flex flex-col items-center gap-2'>
          <span className='text-[10px] tracking-widest uppercase'>Scroll</span>
          <div className='h-10 w-px bg-linear-to-b from-white/0 via-white to-white/0' />
        </div>
      </motion.div>
    </section>
  )
}
