'use client'

import { cn } from '@/lib/utils'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import { MouseEvent, useRef } from 'react'
import { useMousePosition } from './utils'

interface GlowCardProps {
  children: React.ReactNode
  className?: string
}

export const SectionWrapper = ({
  children,
  id,
  className,
}: {
  children: React.ReactNode
  id?: string
  className?: string
}) => {
  return (
    <section
      id={id}
      className={cn(
        'bg-slate-950 text-slate-200 selection:bg-purple-500/30 selection:text-purple-200',
        className,
      )}>
      <div className='mx-auto max-w-screen-2xl'>{children}</div>
    </section>
  )
}

export const GlowCard = ({ children, className }: GlowCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80 backdrop-blur-xl transition-all duration-500',
        'hover:border-primary/50 hover:shadow-[0_0_40px_rgba(var(--primary-rgb),0.15)]',
        className,
      )}>
      <motion.div
        className='pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100'
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(124, 58, 237, 0.15),
              transparent 40%
            )
          `,
        }}
      />
      {children}
    </motion.div>
  )
}
export const SpotlightOverlay = () => {
  const { mouseX, mouseY } = useMousePosition()
  return (
    <motion.div
      className='pointer-events-none fixed inset-0 z-30 transition-opacity duration-300'
      style={{
        background: useMotionTemplate`
          radial-gradient(
            600px circle at ${mouseX}px ${mouseY}px,
            rgba(120, 119, 198, 0.08),
            transparent 90%
          )
        `,
      }}
    />
  )
}
export const NoiseTexture = () => (
  <div
    className='pointer-events-none fixed inset-0 z-40 h-full w-full opacity-[0.03] mix-blend-overlay'
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    }}
  />
)
