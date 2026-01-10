'use client'

import { IconButtonTooltip } from '@/components/custom-ui/tooltip'
import { cn } from '@/lib/utils'
import chroma from 'chroma-js'
import { AnimatePresence, Reorder, motion } from 'framer-motion'
import {
  Download,
  GripVertical,
  Info,
  Lock,
  LockOpen,
  Palette,
  Plus,
  Trash2,
  X,
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { ColorPicker } from '../../_shared/components/ColorPicker'
import { useColorStudio } from '../../_shared/contexts/ColorStudioContext'
import { generateColorObjectByHex } from '../../_shared/utils'
import { getBestTextColor } from '../../_shared/utils/color-algorithms'
import { ColorInfoModal } from './color-info-modal'
import { ExportModal } from './export-modal'

export function GeneratorView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isClient, setIsClient] = useState(false)
  const {
    algorithm,
    onSetAlgorithm,
    colors,
    onSetColors,
    syncColorsToURL,
    onGenerateNewPalette,
    onAddColor,
    onRemoveColor,
    onUpdateColor,
    onToggleLock,
    syncTimeoutRef,
  } = useColorStudio()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const generateNewPalette = useCallback(() => {
    const newColors = onGenerateNewPalette()
    syncColorsToURL(newColors, true)
  }, [syncColorsToURL, onGenerateNewPalette])

  const addColor = useCallback(
    (index: number) => {
      const colors = onAddColor(index)
      syncColorsToURL(colors, true)
      return colors
    },
    [onAddColor, syncColorsToURL],
  )

  const removeColor = useCallback(
    (id: string) => {
      const updatedColors = onRemoveColor(id)
      syncColorsToURL(updatedColors, true)
      return updatedColors
    },
    [onRemoveColor, syncColorsToURL],
  )

  const updateColorHex = useCallback(
    (id: string, newHex: string) => {
      const updatedColors = onUpdateColor(id, newHex)
      syncColorsToURL(updatedColors, true)
    },
    [onUpdateColor, syncColorsToURL],
  )

  useEffect(() => {
    const colorsParam = searchParams.get('colors')
    if (colorsParam) {
      const hexList = colorsParam.split('-')
      const initialColors = generateColorObjectByHex(hexList)
      onSetColors(initialColors)
      syncColorsToURL(initialColors, true)
    } else {
      const initialColors = onGenerateNewPalette()
      syncColorsToURL(initialColors, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Cleanup do timeout ao desmontar
  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        clearTimeout(syncTimeoutRef.current)
      }
    }
  }, [syncTimeoutRef])

  if (!isClient || colors.length === 0) return null

  return (
    <div className='relative flex h-[calc(100vh-4rem)] w-full flex-col bg-white md:flex-row dark:bg-neutral-950'>
      <Reorder.Group
        axis={typeof window !== 'undefined' && window.innerWidth >= 768 ? 'x' : 'y'}
        values={colors}
        onReorder={(newOrder) => {
          onSetColors(newOrder)
          syncColorsToURL(newOrder, true) // immediate = true para reordenação
        }}
        className='flex h-full w-full flex-col overflow-y-auto md:flex-row md:overflow-hidden'>
        {colors.map((color, index) => (
          <ColorColumn
            key={color.id}
            color={color}
            index={index}
            total={colors.length}
            onLock={onToggleLock}
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
  const [showPicker, setShowPicker] = useState(false)
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

  // Fecha o picker ao clicar fora
  useEffect(() => {
    if (!showPicker) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.color-picker-container')) {
        setShowPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showPicker])

  return (
    <>
      <Reorder.Item
        value={color}
        id={color.id}
        className='group relative flex min-h-[200px] w-full flex-1 flex-col justify-between md:h-full md:min-h-0 md:w-auto'
        style={{ backgroundColor: color.hex }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileDrag={{ zIndex: 50, scale: 1.02 }}
        dragListener={!showPicker && !showShades && !showInfo}>
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
              <div className='flex flex-1 flex-col'>
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
                        className='group/shade relative flex flex-1 cursor-pointer items-center justify-center px-4 transition-all hover:z-10 hover:brightness-110'
                        style={{ backgroundColor: shade }}
                        title={shade}>
                        <span
                          className='text-md font-mono font-semibold opacity-0 transition-opacity group-hover/shade:opacity-100'
                          style={{ color: shadeTextColor }}>
                          {shade.toUpperCase()}
                        </span>
                      </button>
                    )
                  })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Conteúdo Normal da Coluna */}
        <div className='flex h-full w-full flex-col items-center justify-between p-4'>
          {/* Toolbar Superior (Remove / Drag) */}
          <div
            className={`flex flex-row items-center gap-2 transition-opacity duration-200 md:flex-col ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
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

          {/* Centro: HEX, Nome e Ações */}
          <div className='flex flex-col items-center justify-center gap-4'>
            {/* HEX e Nome */}
            <div className='flex flex-col items-center gap-2'>
              <div className='relative'>
                <button
                  onClick={() => setShowPicker(!showPicker)}
                  className='text-3xl font-black tracking-tight transition-transform active:scale-95 md:text-4xl lg:text-5xl'
                  style={{ color: textColor }}
                  title='Escolher cor'>
                  {color.hex.replace('#', '').toUpperCase()}
                </button>

                {/* Color Picker Personalizado */}
                {showPicker && (
                  <div
                    className='color-picker-container absolute top-full left-1/2 z-50 mt-2 -translate-x-1/2'
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}>
                    <ColorPicker
                      color={color.hex}
                      onChange={(newHex) => {
                        onUpdateHex(color.id, newHex)
                      }}
                      onClose={() => setShowPicker(false)}
                    />
                  </div>
                )}
              </div>

              <button
                onClick={handleCopy}
                className='text-sm font-semibold opacity-60 transition-opacity hover:opacity-100 md:text-base'
                style={{ color: textColor }}
                title='Copiar nome'>
                {copied ? '✓ COPIADO!' : color.name}
              </button>
            </div>

            {/* Toolbar de Ações - Sempre horizontal abaixo do nome */}
            <div
              className={`flex flex-row items-center gap-3 transition-all duration-200 ${isHovered || color.locked ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              {/* Botão de Info */}
              <button
                onClick={() => setShowInfo(true)}
                className={cn(btnClass, 'cursor-pointer')}
                title='Informações da cor'>
                <Info size={20} />
              </button>

              {/* Botão de View Shades */}
              <button
                onClick={() => setShowShades(true)}
                className={cn(btnClass, 'cursor-pointer')}
                title='Ver variações'>
                <Palette size={20} />
              </button>

              {/* Botão de Lock (Destaque maior) */}
              <button
                onClick={() => onLock(color.id)}
                className={`cursor-pointer transition-transform hover:scale-110 ${color.locked ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                title={color.locked ? 'Desbloquear' : 'Bloquear'}
                style={{ color: textColor }}>
                {color.locked ? <Lock size={24} strokeWidth={2.5} /> : <LockOpen size={24} />}
              </button>
            </div>
          </div>

          {/* Espaço vazio para balancear */}
          <div className='h-10' />
        </div>

        {/* Botão ADICIONAR (+) na divisória */}
        {showAddButton && total < 10 && (
          <div className='absolute top-0 -right-4 z-30 hidden h-full w-8 items-center justify-center md:flex'>
            <div className='group/add relative flex h-full w-full items-center justify-center'>
              <button
                className='flex h-8 w-8 scale-0 items-center justify-center rounded-full bg-white text-black shadow-lg transition-all duration-200 group-hover/add:scale-100 hover:scale-110! dark:bg-black dark:text-white'
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

interface HeaderGeneratorViewProps {
  colors: GeneratorColor[]
}

const HeaderGeneratorView = ({ colors }: HeaderGeneratorViewProps) => {
  const [showExportModal, setShowExportModal] = useState(false)

  return (
    <>
      <div className='flex h-14 items-center justify-between border-b px-4'>
        <h1 className='text-sm font-bold'>Gerador de Paletas</h1>
        <IconButtonTooltip
          onClick={() => setShowExportModal(true)}
          variant='outline'
          className={{ button: 'gap-2' }}
          icon={Download}
          content='Exportar'
        />
      </div>
      <ExportModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        colors={colors.map((c) => ({ id: c.id, hex: c.hex, name: c.name, locked: c.locked }))}
      />
    </>
  )
}
