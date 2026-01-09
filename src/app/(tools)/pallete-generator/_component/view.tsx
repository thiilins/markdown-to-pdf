'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { DEFAULT_COLOR, MOOD_TYPES, type MoodType, type PaletteType } from './constants'
import { usePaletteHistory } from './hooks/use-palette-history'
import { usePaletteURL } from './hooks/use-palette-url'
import { PaletteInput } from './input'
import { PaletteOutput } from './output' // Agora importamos o Output real

import { applyMoodToPalette, generatePalette, isValidColor } from './palette-utils'

export function PalleteGeneratorViewComponent() {
  const [baseColor, setBaseColor] = useState(DEFAULT_COLOR)
  const [paletteType, setPaletteType] = useState<PaletteType>('monochromatic')
  const [mood, setMood] = useState<MoodType | null>(null)
  const [colors, setColors] = useState<ColorInfo[]>([])

  // Hooks de histórico e URL
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

  // Lógica de geração
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

      setColors(result.colors)

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

  // Restaura paleta do histórico
  const handleRestorePalette = useCallback(
    (restoredColors: ColorInfo[], type: PaletteType, base: string) => {
      setBaseColor(base)
      setPaletteType(type)
      setColors(restoredColors)
      writeToURL(restoredColors, type, base)
    },
    [writeToURL],
  )

  // Compartilha paleta
  const handleSharePalette = useCallback(
    (item: { colors: ColorInfo[]; type: PaletteType; baseColor: string }) => {
      const link = getShareableLink(item.colors, item.type, item.baseColor)
      navigator.clipboard.writeText(link)
    },
    [getShareableLink],
  )

  return (
    <div className='min-h-screen overflow-auto bg-slate-50/50 font-sans antialiased dark:bg-slate-950/50'>
      {/* Header Minimalista */}
      <header className='bg-background/80 sticky top-0 z-30 border-b px-6 py-3 backdrop-blur-md'>
        <div className='flex items-center gap-2'>
          <div className='h-6 w-6 rounded-lg bg-linear-to-br from-blue-500 to-violet-500 shadow-sm' />
          <h1 className='text-sm font-semibold tracking-wide'>PALETTE STUDIO</h1>
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
              onSharePalette={handleSharePalette}
            />
          </aside>

          {/* Área Principal (Canvas) */}
          <PaletteOutput colors={colors} />
        </div>
      </main>
    </div>
  )
}
