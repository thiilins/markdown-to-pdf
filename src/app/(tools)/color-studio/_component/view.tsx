'use client'

import usePersistedStateInDB from '@/hooks/use-persisted-in-db'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { DEFAULT_COLOR, MOOD_TYPES, type MoodType, type PaletteType } from './constants'
import { usePaletteHistory } from './hooks/use-palette-history'
import { usePaletteURL } from './hooks/use-palette-url'
import { PaletteInput } from './input'
import { PaletteOutput } from './output'
import { applyMoodToPalette, generatePalette, isValidColor } from './palette-utils'

export function PalleteGeneratorViewComponent() {
  const [baseColor, setBaseColor] = useState(DEFAULT_COLOR)
  const [paletteType, setPaletteType] = useState<PaletteType>('monochromatic')
  const [mood, setMood] = useState<MoodType | null>(null)

  // Cores geradas (padrão) e cores editadas (customizadas pelo usuário)
  const [generatedColors, setGeneratedColors] = useState<ColorInfo[]>([])
  const [editedColors, setEditedColors, editedColorsLoaded] = usePersistedStateInDB<
    ColorInfo[] | null
  >('color-studio-edited-palette', null)

  // Cores finais (editadas ou geradas)
  const colors = editedColors || generatedColors
  const isPaletteEdited = editedColors !== null && editedColors.length > 0

  // Ref para rastrear mudanças na cor base
  const previousBaseColor = useRef(baseColor)

  // Hooks de histórico e URL (agora com IndexDB)
  const { history, favorites, addToHistory, toggleFavorite, removeFromHistory, clearHistory } =
    usePaletteHistory()

  const { isReady, readFromURL, writeToURL, getShareableLink } = usePaletteURL()

  // Carrega estado da URL na inicialização
  useEffect(() => {
    if (!isReady) return

    const urlState = readFromURL()
    if (urlState) {
      if (urlState.base) {
        setBaseColor(`#${urlState.base}`)
      }
      if (urlState.type) {
        setPaletteType(urlState.type)
      }
      toast.success('Paleta carregada do link!')
    }
  }, [isReady, readFromURL])

  // Reset automático quando a cor base muda
  useEffect(() => {
    if (previousBaseColor.current !== baseColor && editedColorsLoaded) {
      // Cor base mudou, resetar paleta editada
      if (isPaletteEdited) {
        setEditedColors(null)
        toast.info('Paleta resetada para a nova cor base')
      }
      previousBaseColor.current = baseColor
    }
  }, [baseColor, isPaletteEdited, setEditedColors, editedColorsLoaded])

  // Lógica de geração (apenas gera, não sobrescreve editadas)
  useEffect(() => {
    if (isValidColor(baseColor)) {
      let result = generatePalette(baseColor, paletteType)

      // Aplica mood se selecionado
      if (mood) {
        const moodConfig = MOOD_TYPES.find((m) => m.value === mood)
        if (moodConfig) {
          result.colors = applyMoodToPalette(result.colors, moodConfig.adjustments)
        }
      }

      setGeneratedColors(result.colors)

      // Adiciona ao histórico (apenas se tiver cores)
      if (result.colors.length > 0) {
        addToHistory(result.colors, paletteType, baseColor)
        // Atualiza URL
        writeToURL(result.colors, paletteType, baseColor)
      }
    }
  }, [baseColor, paletteType, mood, addToHistory, writeToURL])

  const handleColorsExtracted = useCallback((extractedColors: string[]) => {
    if (extractedColors.length > 0) {
      setBaseColor(extractedColors[0])
      // Em uma implementação real, poderíamos setar a paleta inteira aqui
    }
  }, [])

  // Editar cor individual da paleta
  const handleColorEdit = useCallback(
    (index: number, newHex: string) => {
      const currentColors = editedColors || generatedColors
      const updatedColors = [...currentColors]

      // Atualizar a cor mantendo outras propriedades
      updatedColors[index] = {
        ...updatedColors[index],
        hex: newHex,
      }

      setEditedColors(updatedColors)
      toast.success('Cor atualizada!')
    },
    [editedColors, generatedColors, setEditedColors],
  )

  // Resetar paleta para o padrão gerado
  const handleResetPalette = useCallback(() => {
    setEditedColors(null)
    toast.success('Paleta resetada para o padrão!')
  }, [setEditedColors])

  // Restaura paleta do histórico
  const handleRestorePalette = useCallback(
    (restoredColors: ColorInfo[], type: PaletteType, base: string) => {
      setBaseColor(base)
      setPaletteType(type)
      setEditedColors(restoredColors) // Restaura como editada
      writeToURL(restoredColors, type, base)
    },
    [writeToURL, setEditedColors],
  )

  // Compartilha paleta do histórico
  const handleSharePaletteFromHistory = useCallback(
    (item: { colors: ColorInfo[]; type: PaletteType; baseColor: string }) => {
      const link = getShareableLink(item.colors, item.type, item.baseColor)
      navigator.clipboard.writeText(link)
    },
    [getShareableLink],
  )

  // Compartilha paleta atual
  const handleShareCurrentPalette = useCallback(() => {
    const link = getShareableLink(colors, paletteType, baseColor)
    navigator.clipboard.writeText(link)
    toast.success('Link copiado para a área de transferência!')
  }, [colors, paletteType, baseColor, getShareableLink])

  return (
    <div className='min-h-screen overflow-auto bg-slate-50/50 font-sans antialiased dark:bg-slate-950/50'>
      {/* Header Minimalista */}
      <header className='bg-background/80 sticky top-0 z-30 border-b px-6 py-3 backdrop-blur-md'>
        <div className='flex items-center gap-2'>
          <div className='h-6 w-6 rounded-lg bg-linear-to-br from-blue-500 to-violet-500 shadow-sm' />
          <h1 className='text-sm font-semibold tracking-wide'>COLOR STUDIO</h1>
        </div>
      </header>

      <main className='container mx-auto max-w-[1800px] p-4 lg:p-6'>
        <div className='grid items-start gap-6 lg:grid-cols-[340px_1fr]'>
          {/* Sidebar de Configuração */}
          <aside className='space-y-6 lg:sticky lg:top-20'>
            <PaletteInput
              baseColor={baseColor}
              onBaseColorChange={setBaseColor}
              paletteType={paletteType}
              onPaletteTypeChange={setPaletteType}
              mood={mood}
              onMoodChange={setMood}
              onColorsExtracted={handleColorsExtracted}
              history={history}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onRemoveFromHistory={removeFromHistory}
              onClearHistory={clearHistory}
              onRestorePalette={handleRestorePalette}
              onSharePalette={handleSharePaletteFromHistory}
            />
          </aside>

          {/* Área Principal (Canvas) */}
          <PaletteOutput
            colors={colors}
            onColorEdit={handleColorEdit}
            onResetPalette={handleResetPalette}
            onSharePalette={handleShareCurrentPalette}
            isPaletteEdited={isPaletteEdited}
          />
        </div>
      </main>
    </div>
  )
}
