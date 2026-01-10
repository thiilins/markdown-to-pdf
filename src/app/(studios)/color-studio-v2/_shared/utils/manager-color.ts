'use client'
import chroma from 'chroma-js'
import ntc from 'ntc'
import { toast } from 'sonner'
import { expandPaletteFn, generateColorVariation, generateNewPaletteFn } from '.'

export const lockColorFn = (prevColors: GeneratorColor[], id: string) => {
  return prevColors.map((color) => (color.id === id ? { ...color, locked: true } : color))
}

export const toogleColorLockFn = (prevColors: GeneratorColor[], id: string) => {
  return prevColors.map((color) => (color.id === id ? { ...color, locked: !color.locked } : color))
}
export const unlockColorFn = (prevColors: GeneratorColor[], id: string) => {
  return prevColors.map((color) => (color.id === id ? { ...color, locked: false } : color))
}

export const unlockAllColorsFn = (prevColors: GeneratorColor[]) => {
  return prevColors.map((color) => ({ ...color, locked: false }))
}

export const lockAllColorsFn = (prevColors: GeneratorColor[]) => {
  return prevColors.map((color) => ({ ...color, locked: true }))
}

export const getColorId = (): string => {
  return `color-${Date.now()}-${Math.random()}`
}

export const addRandomColorFn = (
  prevColors: GeneratorColor[],
  algorithm: PaletteAlgorithm,
  index: number,
): GeneratorColor[] => {
  if (prevColors?.length >= 10) {
    toast.error('Máximo de 10 cores atingido')
    return prevColors
  }
  const numberPalette = prevColors.length + 1
  const ExistingColorsIds = prevColors.map((c) => c.id)
  const newPallete = expandPaletteFn(prevColors, numberPalette, algorithm)
  const newColor = newPallete.filter((c) => !ExistingColorsIds.includes(c.id))[0]!

  // ✅ Cria novo array sem mutação
  const result = [...prevColors]
  result.splice(index, 0, newColor)
  return result
}

export const removeColorFn = (prevColors: GeneratorColor[], id: string) => {
  if (prevColors?.length <= 2) {
    toast.error('Mínimo de 2 cores necessário')
    return prevColors
  }
  return prevColors.filter((c) => c.id !== id)
}

export const updateColorHexFn = (prevColors: GeneratorColor[], id: string, hex: string) => {
  if (!chroma.valid(hex)) return prevColors
  const colorName = ntc.name(hex)[1]
  return prevColors.map((c) => (c.id === id ? { ...c, hex, name: colorName } : c))
}

export const generateColorObjectByHex = (colors: string[], prev?: GeneratorColor[]) => {
  const locked = prev?.filter((c) => c.locked).map((c) => c.hex)
  const invalidColors = colors.filter((hex) => !chroma.valid(hex))

  const hexColors = colors
    .filter((hex) => !invalidColors.includes(hex))
    .map((hex) => ({
      id: getColorId(),
      locked: locked?.includes(hex) || false,
      ...generateColorVariation(hex),
    }))
  if (invalidColors.length === colors.length) {
    toast.error('Nenhuma Cor válida Detectada: ' + invalidColors.join(', '))
    return generateNewPaletteFn([], 'random')
  } else if (invalidColors.length !== colors.length && invalidColors?.length > 0) {
    toast.error('Cores inválidas Detectadas: ' + invalidColors.join(', '))
  }
  return hexColors
}

export const shuffleColorsFn = (prevColors: GeneratorColor[]) => {
  const shuffled = prevColors.map((c) => c.hex)
  // Cria cópia e embaralha usando Fisher-Yates
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return generateColorObjectByHex(shuffled, prevColors)
}
