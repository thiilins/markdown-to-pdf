'use client'
import { toast } from 'sonner'

import chroma from 'chroma-js'
import ntc from 'ntc'

/**
 * Funções Complementares
 */
export const areColorsTooSimilar = (color1: string, color2: string, threshold = 30): boolean => {
  try {
    return chroma.deltaE(color1, color2) < threshold
  } catch {
    return false
  }
}

export const generateDistinctColor = (existingColors: string[], maxAttempts = 50): string => {
  for (let i = 0; i < maxAttempts; i++) {
    const candidate = chroma.random().hex()
    const isTooSimilar = existingColors.some((existing) => areColorsTooSimilar(candidate, existing))

    if (!isTooSimilar) {
      return candidate
    }
  }
  return chroma.random().hex()
}

export const expandPaletteFn = (
  currentColors: GeneratorColor[],
  targetCount: number,
  algorithm: PaletteAlgorithm,
): GeneratorColor[] => {
  // Se o número alvo é igual ou menor, retorna o mesmo array
  if (targetCount <= currentColors.length) {
    return currentColors
  }

  const colorsToGenerate = targetCount - currentColors.length

  // ✅ Se o array está vazio, gera cores do zero
  let baseHue: number
  let baseSaturation: number
  let baseLightness: number

  if (currentColors.length === 0) {
    // Array vazio: gera base aleatória
    baseHue = Math.random() * 360
    baseSaturation = 0.5 + Math.random() * 0.4 // 50-90%
    baseLightness = 0.4 + Math.random() * 0.3 // 40-70%
  } else {
    const mostVibrant = currentColors.reduce((prev, curr) => {
      const prevSat = chroma(prev.hex).get('hsl.s') || 0
      const currSat = chroma(curr.hex).get('hsl.s') || 0
      return currSat > prevSat ? curr : prev
    })

    baseHue = chroma(mostVibrant.hex).get('hsl.h') || 0

    // Mas usa a saturação/luminosidade MÉDIA para equilíbrio
    const allSaturations = currentColors.map((c) => chroma(c.hex).get('hsl.s') || 0.7)
    const allLightnesses = currentColors.map((c) => chroma(c.hex).get('hsl.l') || 0.5)
    baseSaturation = allSaturations.reduce((sum, s) => sum + s, 0) / allSaturations.length
    baseLightness = allLightnesses.reduce((sum, l) => sum + l, 0) / allLightnesses.length
  }

  let harmonicColors: string[] = []

  switch (algorithm) {
    case 'analogous':
      // Gera mais cores análogas
      for (let i = 0; i < colorsToGenerate + 5; i++) {
        const offset = (i - 2) * 20 // -40, -20, 0, +20, +40, +60, +80...
        harmonicColors.push(
          chroma
            .hsl(
              baseHue + offset,
              baseSaturation * (0.8 + Math.random() * 0.4),
              baseLightness * (0.8 + Math.random() * 0.4),
            )
            .hex(),
        )
      }
      break

    case 'complementary':
      // Alterna entre cor base e complementar
      const complementHue = (baseHue + 180) % 360
      for (let i = 0; i < colorsToGenerate + 5; i++) {
        const useComplement = i % 2 === 1
        const hue = useComplement ? complementHue : baseHue
        harmonicColors.push(
          chroma
            .hsl(
              hue,
              baseSaturation * (0.8 + Math.random() * 0.4),
              baseLightness * (0.8 + Math.random() * 0.4),
            )
            .hex(),
        )
      }
      break

    case 'triadic':
      // Distribui entre as 3 cores tríades
      const triad1 = (baseHue + 120) % 360
      const triad2 = (baseHue + 240) % 360
      const hues = [baseHue, triad1, triad2]
      for (let i = 0; i < colorsToGenerate + 5; i++) {
        const hue = hues[i % 3]
        harmonicColors.push(
          chroma
            .hsl(
              hue,
              baseSaturation * (0.8 + Math.random() * 0.4),
              baseLightness * (0.8 + Math.random() * 0.4),
            )
            .hex(),
        )
      }
      break

    case 'random':
    default:
      // Gera cores aleatórias distintas
      for (let i = 0; i < colorsToGenerate + 5; i++) {
        harmonicColors.push(generateDistinctColor(harmonicColors))
      }
      break
  }

  // Todas as cores atuais são consideradas "travadas" para validação
  const existingHexes = currentColors.map((c) => c.hex)
  const validatedNewColors: string[] = []

  // Valida e evita cores similares às existentes E às novas
  for (const color of harmonicColors) {
    if (validatedNewColors.length >= colorsToGenerate) break

    const allExisting = [...existingHexes, ...validatedNewColors]
    const isTooSimilar = allExisting.some((existing) => areColorsTooSimilar(color, existing, 25))

    if (!isTooSimilar) {
      validatedNewColors.push(color)
    }
  }

  // Se não gerou o suficiente, completa com cores distintas
  while (validatedNewColors.length < colorsToGenerate) {
    const allExisting = [...existingHexes, ...validatedNewColors]
    validatedNewColors.push(generateDistinctColor(allExisting))
  }

  // Retorna cores originais + novas cores
  const newColors: GeneratorColor[] = validatedNewColors.map((hex, index) => ({
    ...generateColorVariation(hex),
    id: `color-${Date.now()}-${index}`,
    locked: false,
  }))

  return [...currentColors, ...newColors]
}

/**
 * Funções de Adição de Cores, Nova Paleta
 */

export const generateNewPaletteFn = (prevColors: GeneratorColor[], algorithm: PaletteAlgorithm) => {
  // Se todas estão travadas, não faz nada
  if (prevColors.length < 2) {
    return expandPaletteFn([], 5, algorithm)
  }
  const lockedColors = prevColors.filter((c) => c.locked)
  if (lockedColors.length === prevColors.length && prevColors.length >= 2) {
    toast.info('Todas as cores estão travadas!')
    return prevColors
  }
  const colorsGenerate = prevColors.length < 2 ? 5 : prevColors.length
  // ✅ Gera novas cores baseadas nas travadas
  const expandedPalette = expandPaletteFn(lockedColors, colorsGenerate, algorithm)

  // Pega apenas as cores novas (depois das travadas)
  const replacementColors = expandedPalette.slice(lockedColors.length)

  // ✅ Substitui as não-travadas mantendo posições das travadas
  let replacementIndex = 0
  return prevColors.map((color) => {
    if (color.locked) {
      return color // Mantém travada na mesma posição
    } else {
      return replacementColors[replacementIndex++] // Substitui por nova cor
    }
  })
}

export const generateColorVariation = (hex: string): Omit<ColorData, 'id' | 'locked'> => {
  return {
    hex,
    rgb: chroma(hex).rgb().toString(),
    hsl: chroma(hex).hsl().toString(),
    oklch: chroma(hex).oklch().toString(),
    lab: chroma(hex).lab().toString(),
    cmyk: chroma(hex).cmyk().toString(),
    rgba: chroma(hex).rgba().toString(),
    name: ntc.name(hex)[1],
  }
}
