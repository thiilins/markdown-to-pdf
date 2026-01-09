'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { ArrowRight, Eye, Image, Palette, Pipette, ShieldCheck, Wand2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

// Paletas animadas para o hero
const heroPalettes = [
  ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'],
  ['#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16'],
  ['#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1', '#8B5CF6'],
  ['#EC4899', '#F472B6', '#FB923C', '#FBBF24', '#FCD34D'],
  ['#14B8A6', '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1'],
]

const tools = [
  {
    title: 'Palette Generator',
    description: 'Press the spacebar to generate color palettes',
    icon: Wand2,
    href: '/color-studio-v2/generate',
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'],
  },
  {
    title: 'Image Picker',
    description: 'Extract colors from your images',
    icon: Image,
    href: '/color-studio-v2/image-picker',
    colors: ['#E74C3C', '#F39C12', '#F1C40F', '#2ECC71', '#3498DB'],
  },
  {
    title: 'Visualizer',
    description: 'Visualize your palettes on real designs',
    icon: Eye,
    href: '/color-studio-v2/visualizer',
    colors: ['#9B59B6', '#8E44AD', '#2C3E50', '#34495E', '#95A5A6'],
  },
  {
    title: 'Contrast Checker',
    description: 'Check WCAG compliance',
    icon: ShieldCheck,
    href: '/color-studio-v2/contrast-checker',
    colors: ['#1ABC9C', '#16A085', '#27AE60', '#229954', '#D5F4E6'],
  },
  {
    title: 'Tailwind Colors',
    description: 'Generate Tailwind color scales',
    icon: Palette,
    href: '/color-studio-v2/tailwind-colors',
    colors: ['#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE', '#EFF6FF'],
  },
  {
    title: 'Color Picker',
    description: 'Convert and explore color codes',
    icon: Pipette,
    href: '/color-studio-v2/color-picker',
    colors: ['#EC4899', '#F472B6', '#FBCFE8', '#FCE7F3', '#FDF2F8'],
  },
]

const companies = [
  'Airbnb',
  'Dropbox',
  'Microsoft',
  'Netflix',
  'GitHub',
  'Slack',
  'Apple',
  'Disney',
]

export default function ColorStudioV2Page() {
  const [mounted, setMounted] = useState(false)
  const [currentPalette, setCurrentPalette] = useState(0)

  useEffect(() => {
    setMounted(true)

    // Rotaciona paletas a cada 3 segundos
    const interval = setInterval(() => {
      setCurrentPalette((prev) => (prev + 1) % heroPalettes.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null

  return (
    <div className='min-h-screen bg-white dark:bg-slate-950'>
      {/* Hero Section - EXATAMENTE como Coolors */}
      <section className='relative min-h-[90vh] overflow-hidden'>
        <div className='container mx-auto flex h-full min-h-[90vh] items-center px-4 py-12'>
          <div className='grid w-full items-center gap-12 lg:grid-cols-2'>
            {/* Left Side - Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className='space-y-8'>
              {/* Main Heading - GIGANTE como Coolors */}
              <h1 className='text-6xl leading-[1.1] font-black tracking-tight text-slate-900 sm:text-7xl md:text-8xl lg:text-9xl dark:text-white'>
                The super fast
                <br />
                <span className='inline-block'>color palettes</span>
                <br />
                generator!
              </h1>

              {/* Handwritten "and much more" */}
              <div className='relative'>
                <svg
                  className='absolute -top-8 -right-4 h-16 w-48 text-slate-400 dark:text-slate-600'
                  viewBox='0 0 200 60'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M10 30 Q 50 10, 100 30 T 190 30'
                    stroke='currentColor'
                    strokeWidth='2'
                    fill='none'
                  />
                  <text x='60' y='35' className='font-handwriting text-sm' fill='currentColor'>
                    and much more
                  </text>
                </svg>
              </div>

              {/* Subtitle */}
              <p className='max-w-xl text-lg text-slate-600 md:text-xl dark:text-slate-400'>
                Create the perfect palette or get inspired by thousands of beautiful color schemes.
              </p>

              {/* CTA Buttons */}
              <div className='flex flex-wrap gap-4'>
                <Button
                  asChild
                  size='lg'
                  className='h-14 rounded-full bg-blue-600 px-8 text-base font-semibold shadow-lg hover:bg-blue-700'>
                  <Link href='/color-studio-v2/generate'>Start the generator!</Link>
                </Button>
                <Button
                  asChild
                  variant='outline'
                  size='lg'
                  className='h-14 rounded-full border-2 px-8 text-base font-semibold'>
                  <Link href='#tools'>Explore 10M+ Palettes</Link>
                </Button>
              </div>
            </motion.div>

            {/* Right Side - Animated Color Grid */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className='relative hidden lg:block'>
              {/* Grid de cores animado */}
              <div className='grid grid-cols-5 gap-2'>
                {/* Linha 1 */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={`row1-${i}`}
                    className='aspect-square rounded-2xl shadow-lg'
                    style={{ backgroundColor: heroPalettes[currentPalette][i] }}
                    animate={{
                      backgroundColor: heroPalettes[currentPalette][i],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      backgroundColor: { duration: 1 },
                      scale: { duration: 2, repeat: Infinity, delay: i * 0.1 },
                    }}
                  />
                ))}

                {/* Linha 2 - Cores diferentes */}
                {[4, 3, 2, 1, 0].map((i) => (
                  <motion.div
                    key={`row2-${i}`}
                    className='aspect-square rounded-2xl shadow-lg'
                    style={{
                      backgroundColor: heroPalettes[(currentPalette + 1) % heroPalettes.length][i],
                    }}
                    animate={{
                      backgroundColor: heroPalettes[(currentPalette + 1) % heroPalettes.length][i],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      backgroundColor: { duration: 1 },
                      scale: { duration: 2, repeat: Infinity, delay: i * 0.1 + 0.5 },
                    }}
                  />
                ))}

                {/* Linha 3 */}
                {[2, 4, 0, 3, 1].map((i) => (
                  <motion.div
                    key={`row3-${i}`}
                    className='aspect-square rounded-2xl shadow-lg'
                    style={{
                      backgroundColor: heroPalettes[(currentPalette + 2) % heroPalettes.length][i],
                    }}
                    animate={{
                      backgroundColor: heroPalettes[(currentPalette + 2) % heroPalettes.length][i],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      backgroundColor: { duration: 1 },
                      scale: { duration: 2, repeat: Infinity, delay: i * 0.1 + 1 },
                    }}
                  />
                ))}

                {/* Linha 4 - Cores maiores */}
                <motion.div
                  className='aspect-2/1 col-span-2 rounded-2xl shadow-lg'
                  style={{ backgroundColor: heroPalettes[currentPalette][0] }}
                  animate={{
                    backgroundColor: heroPalettes[currentPalette][0],
                  }}
                  transition={{ duration: 1 }}
                />
                <motion.div
                  className='col-span-1 aspect-square rounded-2xl shadow-lg'
                  style={{ backgroundColor: heroPalettes[currentPalette][1] }}
                  animate={{
                    backgroundColor: heroPalettes[currentPalette][1],
                  }}
                  transition={{ duration: 1 }}
                />
                <motion.div
                  className='col-span-2 aspect-[2/1] rounded-2xl shadow-lg'
                  style={{ backgroundColor: heroPalettes[currentPalette][2] }}
                  animate={{
                    backgroundColor: heroPalettes[currentPalette][2],
                  }}
                  transition={{ duration: 1 }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className='border-y bg-slate-50 py-12 dark:bg-slate-900/50'>
        <div className='container mx-auto px-4'>
          <p className='mb-8 text-center text-sm font-medium tracking-wider text-slate-500 uppercase'>
            Trusted by 8+ million creative minds and top companies
          </p>
          <div className='flex flex-wrap items-center justify-center gap-8 md:gap-12'>
            {companies.map((company) => (
              <div
                key={company}
                className='text-xl font-bold text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-400'>
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id='tools' className='px-4 py-20'>
        <div className='mx-auto max-w-7xl'>
          {/* Section Header */}
          <div className='mb-16 text-center'>
            <h2 className='mb-4 text-4xl font-bold text-slate-900 md:text-5xl dark:text-slate-100'>
              All the tools you need
            </h2>
            <p className='text-muted-foreground mx-auto max-w-2xl text-lg'>
              Professional color tools for designers and developers
            </p>
          </div>

          {/* Tools Grid */}
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {tools.map((tool, index) => {
              const Icon = tool.icon
              return (
                <motion.div
                  key={tool.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}>
                  <Link href={tool.href}>
                    <div className='group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900'>
                      {/* Color Preview Bar */}
                      <div className='flex h-32 w-full'>
                        {tool.colors.map((color, i) => (
                          <div
                            key={i}
                            className='flex-1 transition-all group-hover:flex-[1.2]'
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>

                      {/* Content */}
                      <div className='p-6'>
                        <div className='mb-3 flex items-center gap-3'>
                          <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800'>
                            <Icon className='h-5 w-5 text-slate-700 dark:text-slate-300' />
                          </div>
                          <h3 className='text-xl font-bold text-slate-900 dark:text-slate-100'>
                            {tool.title}
                          </h3>
                        </div>
                        <p className='text-muted-foreground text-sm'>{tool.description}</p>
                      </div>

                      {/* Hover Arrow */}
                      <div className='absolute right-6 bottom-6 opacity-0 transition-opacity group-hover:opacity-100'>
                        <ArrowRight className='h-5 w-5 text-slate-400' />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='border-t border-slate-200 py-12 dark:border-slate-800'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
            <div className='flex items-center gap-2'>
              <Palette className='h-5 w-5 text-blue-600' />
              <span className='font-bold text-slate-900 dark:text-slate-100'>Color Studio v2</span>
            </div>
            <p className='text-muted-foreground text-sm'>
              Inspired by Coolors.co • Optimized for Developers
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
