/**
 * Tipos compartilhados do Color Studio v2
 */

export interface ColorData {
  id: string
  hex: string
  rgb: string
  hsl: string
  oklch: string
  name: string
  locked: boolean
}

export type PaletteAlgorithm =
  | 'random'
  | 'monochromatic'
  | 'analogous'
  | 'complementary'
  | 'triadic'
  | 'tetradic'
  | 'shades'

export interface PaletteState {
  colors: ColorData[]
  algorithm: PaletteAlgorithm
  baseColor?: string
}

export interface PaletteHistory {
  id: string
  colors: ColorData[]
  algorithm: PaletteAlgorithm
  timestamp: number
  isFavorite: boolean
}

export type ExportFormat =
  | 'css'
  | 'scss'
  | 'tailwind'
  | 'shadcn'
  | 'json'
  | 'figma'
  | 'swift'
  | 'android'

export interface ColorStudioContextType {
  // Estado da paleta atual
  palette: PaletteState
  setPalette: (palette: PaletteState) => void

  // Gerar nova paleta
  generatePalette: (algorithm?: PaletteAlgorithm) => void

  // Lock/Unlock cores
  toggleLock: (colorId: string) => void

  // Adicionar/Remover cores
  addColor: (color?: ColorData) => void
  removeColor: (colorId: string) => void

  // Reordenar cores
  reorderColors: (startIndex: number, endIndex: number) => void

  // Histórico
  history: PaletteHistory[]
  addToHistory: () => void
  restoreFromHistory: (historyId: string) => void
  toggleFavorite: (historyId: string) => void
  clearHistory: () => void

  // Export
  exportPalette: (format: ExportFormat) => string

  // URL State
  syncToURL: () => void
  loadFromURL: () => void

  // Undo/Redo
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
}
