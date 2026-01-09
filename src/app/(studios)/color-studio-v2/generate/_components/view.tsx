'use client'

import chroma from 'chroma-js'
import { AnimatePresence, Reorder, motion } from 'framer-motion'
import { GripVertical, Info, Lock, LockOpen, Palette, Plus, Trash2, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import ntc from 'ntc'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { getBestTextColor } from '../../_shared/utils/color-algorithms'
import { ColorInfoModal } from './color-info-modal'

// --- Tipos ---
interface GeneratorColor {
  id: string
  hex: string
  name: string
  locked: boolean
}

// --- Componente Principal ---
export function GeneratorView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [colors, setColors] = useState<GeneratorColor[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // --- Lógica de Cores ---
  const generateRandomColor = () => {
    const hex = chroma.random().hex()
    const colorName = ntc.name(hex)[1]
    return { hex, name: colorName }
  }

  const generateNewPalette = useCallback(() => {
    setColors((prevColors) => {
      const newColors = prevColors.map((color) => {
        if (color.locked) return color
        const { hex, name } = generateRandomColor()
        return { ...color, hex, name }
      })
      syncToURL(newColors)
      return newColors
    })
  }, [])

  const addColor = (index: number) => {
    if (colors.length >= 10) {
      toast.error('Máximo de 10 cores atingido')
      return
    }

    const newColors = [...colors]
    const { hex, name } = generateRandomColor()

    const newColor: GeneratorColor = {
      id: `color-${Date.now()}-${Math.random()}`,
      hex,
      name,
      locked: false,
    }

    newColors.splice(index, 0, newColor)
    setColors(newColors)
    syncToURL(newColors)
  }

  const removeColor = (id: string) => {
    if (colors.length <= 2) {
      toast.error('Mínimo de 2 cores necessário')
      return
    }

    // Remove a cor
    const filteredColors = colors.filter((c) => c.id !== id)

    // Se ficou com menos de 5 cores, adiciona novas até completar 5
    const updatedColors = [...filteredColors]
    while (updatedColors.length < 5) {
      const { hex, name } = generateRandomColor()
      updatedColors.push({
        id: `color-${Date.now()}-${Math.random()}`,
        hex,
        name,
        locked: false,
      })
    }

    setColors(updatedColors)
    syncToURL(updatedColors)
  }

  const updateColorHex = (id: string, newHex: string) => {
    if (chroma.valid(newHex)) {
      const colorName = ntc.name(newHex)[1]
      setColors((prev) => {
        const updated = prev.map((c) => (c.id === id ? { ...c, hex: newHex, name: colorName } : c))
        syncToURL(updated)
        return updated
      })
    }
  }

  const toggleLock = (id: string) => {
    setColors((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, locked: !c.locked } : c))
      syncToURL(updated)
      return updated
    })
  }

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

  useEffect(() => {
    const colorsParam = searchParams.get('colors')
    const lockedParam = searchParams.get('locked')

    if (colorsParam) {
      const hexList = colorsParam.split('-')
      const lockedIndices = lockedParam ? lockedParam.split(',').map(Number) : []

      const initialColors = hexList.map((hex, i) => {
        const fullHex = `#${hex}`
        const colorName = ntc.name(fullHex)[1]
        return {
          id: `color-${i}`,
          hex: fullHex,
          name: colorName,
          locked: lockedIndices.includes(i),
        }
      })
      setColors(initialColors)
    } else {
      const initialColors = Array.from({ length: 5 }).map((_, i) => {
        const { hex, name } = generateRandomColor()
        return { id: `color-${i}`, hex, name, locked: false }
      })
      setColors(initialColors)
      syncToURL(initialColors)
    }
  }, [])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return
      if (e.code === 'Space') {
        e.preventDefault()
        generateNewPalette()
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [generateNewPalette])

  if (!isClient || colors.length === 0) return null

  return (
    <div className='relative flex h-[calc(100vh-4rem)] w-full flex-col bg-white md:flex-row dark:bg-neutral-950'>
      <Reorder.Group
        axis={typeof window !== 'undefined' && window.innerWidth >= 768 ? 'x' : 'y'}
        values={colors}
        onReorder={(newOrder) => {
          setColors(newOrder)
          syncToURL(newOrder)
        }}
        className='flex h-full w-full flex-col overflow-y-auto md:flex-row md:overflow-hidden'>
        {colors.map((color, index) => (
          <ColorColumn
            key={color.id}
            color={color}
            index={index}
            total={colors.length}
            onLock={toggleLock}
            onRemove={removeColor}
            onUpdateHex={updateColorHex}
            onAddAfter={() => addColor(index + 1)}
            showAddButton={index < colors.length - 1}
          />
        ))}
      </Reorder.Group>

      {/* Floating Toolbar */}
      <div className='fixed bottom-10 left-1/2 z-50 -translate-x-1/2 transform'>
        <div className='flex items-center gap-4 rounded-full border border-black/5 bg-white p-2 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-black/80'>
          <span className='hidden px-4 text-xs font-medium text-neutral-500 sm:block dark:text-neutral-400'>
            Pressione Espaço para gerar
          </span>
          <div className='hidden h-4 w-px bg-neutral-200 sm:block dark:bg-neutral-800' />
          <button
            onClick={generateNewPalette}
            className='flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:scale-105 hover:bg-blue-700 active:scale-95'>
            Gerar
          </button>
        </div>
      </div>
    </div>
  )
}

// --- Componente: Coluna de Cor ---
function ColorColumn({
  color,
  index,
  total,
  onLock,
  onRemove,
  onUpdateHex,
  onAddAfter,
  showAddButton,
}: {
  color: GeneratorColor
  index: number
  total: number
  onLock: (id: string) => void
  onRemove: (id: string) => void
  onUpdateHex: (id: string, hex: string) => void
  onAddAfter: () => void
  showAddButton: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [showShades, setShowShades] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [copied, setCopied] = useState(false)

  const textColor = getBestTextColor(color.hex)
  const isDarkText = textColor === 'black'

  // Classes de botões para manter consistência
  const btnClass = `
    p-2 rounded-lg transition-all duration-200
    ${
      isDarkText
        ? 'text-black/40 hover:text-black hover:bg-black/5'
        : 'text-white/40 hover:text-white hover:bg-white/10'
    }
  `

  const handleCopy = () => {
    navigator.clipboard.writeText(color.hex.toUpperCase())
    setCopied(true)
    toast.success('Cor copiada!')
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <>
      <Reorder.Item
        value={color}
        id={color.id}
        className='group relative flex min-h-[200px] w-full flex-1 flex-col justify-between md:h-full md:min-h-0 md:w-auto'
        style={{ backgroundColor: color.hex }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileDrag={{ zIndex: 50, scale: 1.02 }}>
        {/* SHADES OVERLAY - Ocupa a coluna inteira quando ativo */}
        <AnimatePresence>
          {showShades && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='absolute inset-0 z-40 flex flex-col bg-white dark:bg-neutral-950'>
              {/* Header do Shades */}
              <div
                className='flex items-center justify-between p-3'
                style={{ backgroundColor: color.hex }}>
                <span
                  className={`text-xs font-bold tracking-wide uppercase ${isDarkText ? 'text-black/60' : 'text-white/70'}`}>
                  Variações
                </span>
                <button
                  onClick={() => setShowShades(false)}
                  className={`rounded-lg p-1.5 transition-colors ${isDarkText ? 'text-black hover:bg-black/10' : 'text-white hover:bg-white/10'}`}>
                  <X size={18} />
                </button>
              </div>

              {/* Lista de Shades Vertical - Melhorada */}
              <div className='flex flex-1 flex-col overflow-y-auto'>
                {chroma
                  .scale(['#ffffff', color.hex, '#000000'])
                  .mode('oklch')
                  .colors(21)
                  .map((shade, idx) => {
                    const shadeTextColor = getBestTextColor(shade)
                    const isCurrentShade = chroma.deltaE(shade, color.hex) < 5

                    return (
                      <button
                        key={`${shade}-${idx}`}
                        onClick={() => {
                          onUpdateHex(color.id, shade)
                          setShowShades(false)
                          toast.success('Cor atualizada!')
                        }}
                        className='group/shade relative flex flex-1 items-center justify-between px-4 transition-all hover:z-10 hover:scale-x-[1.05] hover:shadow-lg'
                        style={{ backgroundColor: shade }}
                        title={shade}>
                        <span
                          className={`font-mono text-xs font-semibold opacity-0 transition-opacity group-hover/shade:opacity-100`}
                          style={{ color: shadeTextColor }}>
                          {shade.toUpperCase()}
                        </span>

                        {isCurrentShade && (
                          <div
                            className='rounded-full bg-black/20 px-2 py-0.5 text-xs font-bold backdrop-blur-sm'
                            style={{ color: shadeTextColor }}>
                            Atual
                          </div>
                        )}
                      </button>
                    )
                  })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Conteúdo Normal da Coluna */}
        <div className='flex h-full w-full flex-col items-center justify-center p-4'>
          {/* Toolbar Superior (Remove / Drag) */}
          <div
            className={`flex flex-col items-center gap-2 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            {total > 2 && (
              <button onClick={() => onRemove(color.id)} className={btnClass} title='Remover cor'>
                <Trash2 size={18} />
              </button>
            )}
            <div
              className={`cursor-grab active:cursor-grabbing ${btnClass} hidden md:block`}
              title='Arrastar'>
              <GripVertical size={18} />
            </div>
          </div>

          {/* Centro: HEX e Nome */}
          <div className='flex flex-1 flex-col items-center justify-center gap-2'>
            <button
              onClick={handleCopy}
              className='text-3xl font-black tracking-tight transition-transform active:scale-95 md:text-4xl lg:text-5xl'
              style={{ color: textColor }}
              title='Copiar HEX'>
              {color.hex.replace('#', '').toUpperCase()}
            </button>

            <span
              className='text-sm font-semibold opacity-60 md:text-base'
              style={{ color: textColor }}>
              {copied ? '✓ COPIADO!' : color.name}
            </span>
          </div>

          {/* Toolbar Inferior (Ações) - Sempre horizontal */}
          <div
            className={`flex flex-row items-center gap-3 transition-all duration-200 ${isHovered || color.locked ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            {/* Botão de Info */}
            <button
              onClick={() => setShowInfo(true)}
              className={btnClass}
              title='Informações da cor'>
              <Info size={20} />
            </button>

            {/* Botão de View Shades */}
            <button onClick={() => setShowShades(true)} className={btnClass} title='Ver variações'>
              <Palette size={20} />
            </button>

            {/* Botão de Lock (Destaque maior) */}
            <button
              onClick={() => onLock(color.id)}
              className={`transition-transform hover:scale-110 ${color.locked ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
              title={color.locked ? 'Desbloquear' : 'Bloquear'}
              style={{ color: textColor }}>
              {color.locked ? <Lock size={24} strokeWidth={2.5} /> : <LockOpen size={24} />}
            </button>
          </div>
        </div>

        {/* Botão ADICIONAR (+) na divisória */}
        {showAddButton && total < 10 && (
          <div className='absolute top-0 -right-4 z-30 hidden h-full w-8 items-center justify-center md:flex'>
            <div className='group/add relative flex h-full w-full items-center justify-center'>
              <button
                className='flex h-8 w-8 scale-0 items-center justify-center rounded-full bg-white text-black shadow-lg transition-all duration-200 group-hover/add:scale-100 hover:!scale-110 dark:bg-black dark:text-white'
                title='Inserir cor aqui'
                onClick={(e) => {
                  e.stopPropagation()
                  onAddAfter()
                }}>
                <Plus size={16} strokeWidth={3} />
              </button>
            </div>
          </div>
        )}
      </Reorder.Item>

      {/* Modais */}
      <ColorInfoModal
        hex={color.hex}
        name={color.name}
        isOpen={showInfo}
        onClose={() => setShowInfo(false)}
      />
    </>
  )
}
