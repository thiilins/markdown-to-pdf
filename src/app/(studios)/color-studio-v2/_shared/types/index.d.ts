/**
 * Tipos compartilhados do Color Studio v2
 */

interface ColorData {
  id: string
  hex: string
  rgb: string
  hsl: string
  oklch: string
  lab: string
  cmyk: string
  rgba: string
  name: string
  locked: boolean
}

type PaletteAlgorithm =
  | 'random'
  | 'monochromatic'
  | 'analogous'
  | 'complementary'
  | 'triadic'
  | 'tetradic'
  | 'shades'

interface PaletteHistory {
  id: string
  colors: ColorData[]
  algorithm: PaletteAlgorithm
  timestamp: number
  isFavorite: boolean
}

type Format = 'css' | 'scss' | 'tailwind' | 'shadcn' | 'json' | 'figma' | 'swift' | 'android'

type GeneratorColor = ColorData
interface ColorStudioContextType {
  history: PaletteHistory[]
  onAddToHistory: (colors: GeneratorColor[], algorithm: PaletteAlgorithm) => void
  onRestoreFromHistory: (historyId: string) => GeneratorColor[]
  onToggleFavorite: (historyId: string) => void
  onClearHistory: () => void
  onUndo: () => GeneratorColor[] | undefined
  onRedo: () => GeneratorColor[] | undefined
  canUndo: boolean
  canRedo: boolean
  algorithm: PaletteAlgorithm
  onSetAlgorithm: (algorithm: PaletteAlgorithm) => void
  colors: GeneratorColor[]
  onSetColors: (colors: GeneratorColor[]) => void
  syncColorsToURL: (colors: GeneratorColor[], immediate?: boolean) => void
  // Manipulação de cores
  onRemoveColor: (id: string) => GeneratorColor[]
  onAddColor: (index?: number) => GeneratorColor[]
  onUpdateColor: (id: string, hex: string) => GeneratorColor[]
  onToggleLock: (id: string) => GeneratorColor[]
  onGenerateNewPalette: () => GeneratorColor[]
  syncTimeoutRef: React.RefObject<NodeJS.Timeout | null>
  onShuffleColors: () => GeneratorColor[]
}
