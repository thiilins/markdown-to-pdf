/**
 * Algoritmos de geração de paletas de cores
 */

import chroma, { type Color } from 'chroma-js'
import ntc from 'ntc'

/**
 * Converte Color do chroma.js para ColorData
 */
export function colorToData(color: Color, locked = false): ColorData {
  const hex = color.hex()
  const rgb = color.css('rgb')
  const hsl = color.css('hsl')
  const oklch = color.oklch()
  const oklchString = `${(oklch[0] * 100).toFixed(1)}% ${oklch[1].toFixed(3)} ${oklch[2] ? oklch[2].toFixed(1) : '0'}`

  // Nome da cor usando ntc
  const colorName = ntc.name(hex)[1]

  return {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    hex,
    rgb,
    hsl,
    lab: color.lab().toString(),
    cmyk: color.cmyk().toString(),
    rgba: color.rgba().toString(),
    oklch: oklchString,
    name: colorName,
    locked,
  }
}

/**
 * Gera uma cor aleatória
 */
export function generateRandomColor(): ColorData {
  return colorToData(chroma.random())
}

/**
 * Gera paleta monocromática (variações de luminosidade)
 */
export function generateMonochromatic(baseColor: string): ColorData[] {
  const base = chroma(baseColor)
  return [
    colorToData(base.brighten(2)),
    colorToData(base.brighten(1)),
    colorToData(base),
    colorToData(base.darken(1)),
    colorToData(base.darken(2)),
  ]
}

/**
 * Gera paleta análoga (cores adjacentes no círculo cromático)
 */
export function generateAnalogous(baseColor: string): ColorData[] {
  const base = chroma(baseColor)
  const hue = base.get('hsl.h')
  const s = base.get('hsl.s')
  const l = base.get('hsl.l')

  return [
    colorToData(chroma.hsl(hue - 30, s, l)),
    colorToData(chroma.hsl(hue - 15, s, l)),
    colorToData(base),
    colorToData(chroma.hsl(hue + 15, s, l)),
    colorToData(chroma.hsl(hue + 30, s, l)),
  ]
}

/**
 * Gera paleta complementar
 */
export function generateComplementary(baseColor: string): ColorData[] {
  const base = chroma(baseColor)
  const hue = base.get('hsl.h')
  const s = base.get('hsl.s')
  const l = base.get('hsl.l')
  const complement = chroma.hsl((hue + 180) % 360, s, l)

  return [
    colorToData(base.brighten(1)),
    colorToData(base),
    colorToData(base.darken(1)),
    colorToData(complement.brighten(1)),
    colorToData(complement),
  ]
}

/**
 * Gera paleta tríade
 */
export function generateTriadic(baseColor: string): ColorData[] {
  const base = chroma(baseColor)
  const hue = base.get('hsl.h')
  const s = base.get('hsl.s')
  const l = base.get('hsl.l')

  return [
    colorToData(base),
    colorToData(chroma.hsl((hue + 120) % 360, s, l)),
    colorToData(chroma.hsl((hue + 240) % 360, s, l)),
    colorToData(base.brighten(1)),
    colorToData(base.darken(1)),
  ]
}

/**
 * Gera paleta tetrádica
 */
export function generateTetradic(baseColor: string): ColorData[] {
  const base = chroma(baseColor)
  const hue = base.get('hsl.h')
  const s = base.get('hsl.s')
  const l = base.get('hsl.l')

  return [
    colorToData(base),
    colorToData(chroma.hsl((hue + 90) % 360, s, l)),
    colorToData(chroma.hsl((hue + 180) % 360, s, l)),
    colorToData(chroma.hsl((hue + 270) % 360, s, l)),
    colorToData(base.brighten(1)),
  ]
}

/**
 * Gera paleta de tons (shades)
 */
export function generateShades(baseColor: string): ColorData[] {
  const base = chroma(baseColor)
  return [
    colorToData(base.brighten(2)),
    colorToData(base.brighten(1)),
    colorToData(base),
    colorToData(base.darken(1)),
    colorToData(base.darken(2)),
  ]
}

/**
 * Gera paleta baseada no algoritmo escolhido
 */
export function generatePaletteByAlgorithm(
  algorithm: PaletteAlgorithm,
  baseColor?: string,
  lockedColors: ColorData[] = [],
): ColorData[] {
  // Se não tem cor base, gera uma aleatória
  const base = baseColor || chroma.random().hex()

  let newColors: ColorData[] = []

  switch (algorithm) {
    case 'random':
      newColors = Array.from({ length: 5 }, () => generateRandomColor())
      break
    case 'monochromatic':
      newColors = generateMonochromatic(base)
      break
    case 'analogous':
      newColors = generateAnalogous(base)
      break
    case 'complementary':
      newColors = generateComplementary(base)
      break
    case 'triadic':
      newColors = generateTriadic(base)
      break
    case 'tetradic':
      newColors = generateTetradic(base)
      break
    case 'shades':
      newColors = generateShades(base)
      break
    default:
      newColors = Array.from({ length: 5 }, () => generateRandomColor())
  }

  // Preserva cores travadas
  if (lockedColors.length > 0) {
    return newColors.map((color, index) => {
      const locked = lockedColors.find((c, i) => i === index && c.locked)
      return locked || color
    })
  }

  return newColors
}

/**
 * Valida se uma string é uma cor válida
 */
export function isValidColor(color: string): boolean {
  try {
    chroma(color)
    return true
  } catch {
    return false
  }
}

/**
 * Calcula contraste entre duas cores
 */
export function calculateContrast(color1: string, color2: string): number {
  return chroma.contrast(color1, color2)
}

/**
 * Determina se o texto deve ser branco ou preto baseado no fundo
 */
export function getBestTextColor(backgroundColor: string): string {
  return chroma.contrast(backgroundColor, 'white') > 4.5 ? 'white' : 'black'
}
