'use client'

import { Button } from '@/components/ui/button'
import { Eye, Image, Palette, Pipette, ShieldCheck, Wand2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const tools = [
  {
    name: 'Palette Generator',
    description: 'Create unique color palettes quickly and effortlessly.',
    href: '/color-studio-v2/generate',
    icon: Wand2,
    color: 'text-cyan-500',
  },
  {
    name: 'Image Picker',
    description: 'Extract beautiful colors from any image with ease.',
    href: '/color-studio-v2/image-picker',
    icon: Image,
    color: 'text-purple-500',
  },
  {
    name: 'Palette Visualizer',
    description: 'Check your colors on real designs in real-time.',
    href: '/color-studio-v2/visualizer',
    icon: Eye,
    color: 'text-red-500',
  },
  {
    name: 'Contrast Checker',
    description: 'Ensure your designs meet accessibility standards.',
    href: '/color-studio-v2/contrast-checker',
    icon: ShieldCheck,
    color: 'text-pink-500',
  },
  {
    name: 'Tailwind Colors',
    description: 'Create and preview your tailwind palettes on real UI designs.',
    href: '/color-studio-v2/tailwind-colors',
    icon: Palette,
    color: 'text-yellow-500',
  },
  {
    name: 'Color Picker',
    description: 'Get useful info about any color like meaning, variations and accessibility.',
    href: '/color-studio-v2/color-picker',
    icon: Pipette,
    color: 'text-orange-500',
  },
]

export function StudioHeader() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className='sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-slate-800 dark:bg-slate-950/95'>
      <div className='container mx-auto flex h-16 items-center justify-between px-4'>
        {/* Logo */}
        <Link
          href='/color-studio-v2'
          className='flex items-center gap-2 transition-opacity hover:opacity-80'>
          <svg
            className='h-7 w-7'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'>
            <rect x='3' y='3' width='7' height='7' rx='1' fill='#3B82F6' />
            <rect x='14' y='3' width='7' height='7' rx='1' fill='#8B5CF6' />
            <rect x='3' y='14' width='7' height='7' rx='1' fill='#EC4899' />
            <rect x='14' y='14' width='7' height='7' rx='1' fill='#F59E0B' />
          </svg>
          <span className='text-xl font-bold text-slate-900 dark:text-white'>Palettes</span>
        </Link>

        {/* Navigation */}
        <div className='flex items-center gap-4'>
          {/* Tools Button with Mega Menu */}
          <div
            className='relative'
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}>
            <button className='flex items-center gap-1 px-4 py-2 font-medium text-slate-700 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100'>
              Tools
              <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 9l-7 7-7-7'
                />
              </svg>
            </button>

            {/* Mega Menu Dropdown */}
            {isOpen && (
              <div className='absolute top-full left-0 pt-2'>
                <div className='w-[800px] rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-950'>
                  <div className='grid grid-cols-2 gap-8'>
                    {/* Coluna Esquerda */}
                    <div className='space-y-1'>
                      {tools.slice(0, 3).map((tool) => {
                        const Icon = tool.icon
                        return (
                          <Link
                            key={tool.href}
                            href={tool.href}
                            className='block rounded-lg p-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900'>
                            <div className='flex items-start gap-3'>
                              <div className={`mt-0.5 ${tool.color}`}>
                                <Icon className='h-5 w-5' strokeWidth={2} />
                              </div>
                              <div className='flex-1'>
                                <div className='mb-1 font-semibold text-slate-900 dark:text-slate-100'>
                                  {tool.name}
                                </div>
                                <div className='text-xs leading-relaxed text-slate-500 dark:text-slate-400'>
                                  {tool.description}
                                </div>
                              </div>
                            </div>
                          </Link>
                        )
                      })}
                    </div>

                    {/* Coluna Direita */}
                    <div className='space-y-1'>
                      {tools.slice(3, 6).map((tool) => {
                        const Icon = tool.icon
                        return (
                          <Link
                            key={tool.href}
                            href={tool.href}
                            className='block rounded-lg p-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900'>
                            <div className='flex items-start gap-3'>
                              <div className={`mt-0.5 ${tool.color}`}>
                                <Icon className='h-5 w-5' strokeWidth={2} />
                              </div>
                              <div className='flex-1'>
                                <div className='mb-1 font-semibold text-slate-900 dark:text-slate-100'>
                                  {tool.name}
                                </div>
                                <div className='text-xs leading-relaxed text-slate-500 dark:text-slate-400'>
                                  {tool.description}
                                </div>
                              </div>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Go Pro Button */}
          <Button
            variant='ghost'
            className='font-semibold text-pink-600 hover:bg-pink-50 hover:text-pink-700 dark:text-pink-400 dark:hover:bg-pink-950/30'>
            Go Pro
          </Button>
        </div>
      </div>
    </header>
  )
}
