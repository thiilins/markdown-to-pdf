'use client'

import { motion } from 'framer-motion'
import { Check, Copy, Lock, LockOpen } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { generatePaletteByAlgorithm, getBestTextColor } from '../../_shared/utils/color-algorithms'

interface GeneratorColor {
  id: string
  hex: string
  name: string
  locked: boolean
}

export function GeneratorView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [colors, setColors] = useState<GeneratorColor[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Gera nova paleta
  const generateNewPalette = useCallback(() => {
    // Preserva cores travadas
    const lockedColors = colors.filter((c) => c.locked)

    // Gera nova paleta
    const newPalette = generatePaletteByAlgorithm('random', undefined)

    // Mescla cores travadas com novas
    const formattedColors: GeneratorColor[] = newPalette.map((color, index) => {
      const lockedColor = lockedColors.find(
        (lc) => colors.findIndex((c) => c.id === lc.id) === index,
      )

      if (lockedColor) {
        return lockedColor
      }

      return {
        id: `color-${index}`,
        hex: color.hex,
        name: color.name,
        locked: false,
      }
    })

    setColors(formattedColors)
    syncToURL(formattedColors)
  }, [colors])

  // Sincroniza com URL
  const syncToURL = useCallback(
    (colorsToSync: GeneratorColor[]) => {
      const hexColors = colorsToSync.map((c) => c.hex.replace('#', '')).join('-')
      const locked = colorsToSync
        .map((c, i) => (c.locked ? i : null))
        .filter((i) => i !== null)
        .join(',')

      const params = new URLSearchParams()
      params.set('colors', hexColors)
      if (locked) params.set('locked', locked)

      router.replace(`?${params.toString()}`, { scroll: false })
    },
    [router],
  )

  // Inicializa ou carrega da URL
  useEffect(() => {
    const colorsParam = searchParams.get('colors')
    const lockedParam = searchParams.get('locked')

    if (colorsParam) {
      // Carrega da URL
      const hexColors = colorsParam.split('-')
      const lockedIndices = lockedParam ? lockedParam.split(',').map(Number) : []

      const loadedColors: GeneratorColor[] = hexColors.map((hex, index) => ({
        id: `color-${index}`,
        hex: `#${hex}`,
        name: `#${hex}`,
        locked: lockedIndices.includes(index),
      }))

      setColors(loadedColors)
    } else {
      // Gera paleta inicial
      const initialPalette = generatePaletteByAlgorithm('random', undefined)
      const initialColors: GeneratorColor[] = initialPalette.map((color, index) => ({
        id: `color-${index}`,
        hex: color.hex,
        name: color.name,
        locked: false,
      }))

      setColors(initialColors)
      syncToURL(initialColors)
    }
  }, []) // Apenas na montagem

  // Toggle lock
  const toggleLock = useCallback(
    (id: string) => {
      setColors((prev) => {
        const updated = prev.map((c) => (c.id === id ? { ...c, locked: !c.locked } : c))
        syncToURL(updated)
        return updated
      })
    },
    [syncToURL],
  )

  // Copiar HEX
  const copyHex = useCallback((hex: string, id: string) => {
    navigator.clipboard.writeText(hex)
    setCopiedId(id)
    toast.success('Color copied!')
    setTimeout(() => setCopiedId(null), 2000)
  }, [])

  // Spacebar para gerar
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault()
        generateNewPalette()
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [generateNewPalette])

  if (colors.length === 0) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-muted-foreground'>Loading...</div>
      </div>
    )
  }

  return (
    <div className='flex h-[calc(100vh-4rem)] w-full flex-col md:flex-row'>
      {/* Colunas de Cores - Tela Cheia (Desktop: vertical, Mobile: horizontal) */}
      {colors.map((color, index) => {
        const textColor = getBestTextColor(color.hex)
        const isLight = textColor === 'black'

        return (
          <motion.div
            key={color.id}
            className='group relative flex flex-1 flex-col items-center justify-center transition-all hover:flex-[1.2]'
            style={{ backgroundColor: color.hex }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}>
            {/* Hover Overlay */}
            <div className='absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5' />

            {/* Content */}
            <div className='relative z-10 flex flex-col items-center gap-4'>
              {/* Nome da Cor */}
              <div
                className='text-center'
                style={{ color: isLight ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)' }}>
                <div className='mb-2 text-sm font-medium opacity-70'>{color.name}</div>
                <div className='text-3xl font-bold tracking-tight'>{color.hex.toUpperCase()}</div>
              </div>

              {/* Actions - Aparecem no hover */}
              <div className='flex gap-2 opacity-0 transition-opacity group-hover:opacity-100'>
                {/* Lock Button */}
                <button
                  onClick={() => toggleLock(color.id)}
                  className='flex h-10 w-10 items-center justify-center rounded-lg backdrop-blur-sm transition-all hover:scale-110'
                  style={{
                    backgroundColor: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.15)',
                    color: textColor,
                  }}
                  title={color.locked ? 'Unlock' : 'Lock'}>
                  {color.locked ? <Lock className='h-5 w-5' /> : <LockOpen className='h-5 w-5' />}
                </button>

                {/* Copy Button */}
                <button
                  onClick={() => copyHex(color.hex, color.id)}
                  className='flex h-10 w-10 items-center justify-center rounded-lg backdrop-blur-sm transition-all hover:scale-110'
                  style={{
                    backgroundColor: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.15)',
                    color: textColor,
                  }}
                  title='Copy HEX'>
                  {copiedId === color.id ? (
                    <Check className='h-5 w-5' />
                  ) : (
                    <Copy className='h-5 w-5' />
                  )}
                </button>
              </div>
            </div>

            {/* Lock Indicator (quando travado) */}
            {color.locked && (
              <div
                className='absolute top-4 right-4'
                style={{ color: isLight ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.4)' }}>
                <Lock className='h-5 w-5' />
              </div>
            )}
          </motion.div>
        )
      })}

      {/* Floating Toolbar */}
      <div className='fixed bottom-8 left-1/2 z-50 -translate-x-1/2'>
        <div className='flex items-center gap-3 rounded-full border border-slate-200 bg-white/95 px-6 py-3 shadow-xl backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/95'>
          <button
            onClick={generateNewPalette}
            className='rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition-all hover:scale-105 hover:bg-blue-700'>
            Generate
          </button>
          <div className='text-muted-foreground text-sm'>or press Spacebar</div>
        </div>
      </div>
    </div>
  )
}
