'use client'
/**
 * Utilitários para geração de paletas e validação WCAG
 */

import { APCAcontrast, sRGBtoY } from 'apca-w3'
import chroma, { type Color } from 'chroma-js'
import type { ExportFormat, PaletteType } from './constants'
import { WCAG_LEVELS } from './constants'

/**
 * Gera uma paleta de cores baseada em um tipo específico
 */
export function generatePalette(baseColor: string, type: PaletteType): PaletteResult {
  try {
    const base = chroma(baseColor)
    let colors: Color[] = []

    switch (type) {
      case 'monochromatic':
        colors = generateMonochromatic(base)
        break
      case 'analogous':
        colors = generateAnalogous(base)
        break
      case 'complementary':
        colors = generateComplementary(base)
        break
      case 'triadic':
        colors = generateTriadic(base)
        break
      case 'tetradic':
        colors = generateTetradic(base)
        break
      case 'shades':
        colors = generateShades(base)
        break
      default:
        colors = [base]
    }

    return {
      colors: colors.map(colorToInfo),
      baseColor,
      type,
    }
  } catch (error) {
    console.error('Erro ao gerar paleta:', error)
    return {
      colors: [],
      baseColor,
      type,
    }
  }
}

/**
 * Gera paleta monocromática (variações de luminosidade)
 */
function generateMonochromatic(base: Color): Color[] {
  return [base.brighten(2), base.brighten(1), base, base.darken(1), base.darken(2)]
}

/**
 * Gera paleta análoga (cores adjacentes no círculo cromático)
 */
function generateAnalogous(base: Color): Color[] {
  const hue = base.get('hsl.h')
  return [
    chroma.hsl(hue - 30, base.get('hsl.s'), base.get('hsl.l')),
    chroma.hsl(hue - 15, base.get('hsl.s'), base.get('hsl.l')),
    base,
    chroma.hsl(hue + 15, base.get('hsl.s'), base.get('hsl.l')),
    chroma.hsl(hue + 30, base.get('hsl.s'), base.get('hsl.l')),
  ]
}

/**
 * Gera paleta complementar (cor oposta no círculo cromático)
 */
function generateComplementary(base: Color): Color[] {
  const hue = base.get('hsl.h')
  const complement = chroma.hsl((hue + 180) % 360, base.get('hsl.s'), base.get('hsl.l'))
  return [
    base.brighten(1),
    base,
    base.darken(1),
    complement.brighten(1),
    complement,
    complement.darken(1),
  ]
}

/**
 * Gera paleta tríade (3 cores equidistantes)
 */
function generateTriadic(base: Color): Color[] {
  const hue = base.get('hsl.h')
  const s = base.get('hsl.s')
  const l = base.get('hsl.l')
  return [base, chroma.hsl((hue + 120) % 360, s, l), chroma.hsl((hue + 240) % 360, s, l)]
}

/**
 * Gera paleta tétrade (4 cores, 2 pares complementares)
 */
function generateTetradic(base: Color): Color[] {
  const hue = base.get('hsl.h')
  const s = base.get('hsl.s')
  const l = base.get('hsl.l')
  return [
    base,
    chroma.hsl((hue + 90) % 360, s, l),
    chroma.hsl((hue + 180) % 360, s, l),
    chroma.hsl((hue + 270) % 360, s, l),
  ]
}

/**
 * Gera tons (shades) da cor base
 */
function generateShades(base: Color): Color[] {
  const colors = chroma.scale([base, 'black']).mode('lab').colors(9)
  return colors.map((c) => chroma(c))
}

/**
 * Gera nome descritivo para uma cor
 */
function getColorName(hex: string): string {
  try {
    // Usando ntc (Name That Color) para gerar nomes
    const ntc = require('ntc')
    const result = ntc.name(hex)
    return result[1] // Nome da cor
  } catch {
    // Fallback: gera nome baseado em HSL
    const color = chroma(hex)
    const [h, s, l] = color.hsl()

    // Determina saturação
    let saturation = ''
    if (s < 0.1) saturation = 'Cinza'
    else if (s < 0.3) saturation = 'Pálido'
    else if (s > 0.8) saturation = 'Vibrante'

    // Determina luminosidade
    let lightness = ''
    if (l < 0.2) lightness = 'Escuro'
    else if (l < 0.4) lightness = 'Profundo'
    else if (l > 0.8) lightness = 'Claro'
    else if (l > 0.6) lightness = 'Suave'

    // Determina matiz
    let hue = 'Cor'
    if (isNaN(h)) hue = 'Neutro'
    else if (h < 15) hue = 'Vermelho'
    else if (h < 45) hue = 'Laranja'
    else if (h < 75) hue = 'Amarelo'
    else if (h < 150) hue = 'Verde'
    else if (h < 200) hue = 'Ciano'
    else if (h < 260) hue = 'Azul'
    else if (h < 330) hue = 'Roxo'
    else hue = 'Vermelho'

    return `${lightness} ${saturation} ${hue}`.trim().replace(/\s+/g, ' ')
  }
}

/**
 * Converte Color para ColorInfo
 */
function colorToInfo(color: Color): ColorInfo {
  const hex = color.hex()
  return {
    hex,
    rgb: color.css(),
    hsl: color.css('hsl'),
    name: getColorName(hex),
  }
}

/**
 * Calcula o contraste WCAG entre duas cores
 */
export function calculateWCAG(foreground: string, background: string): WCAGResult {
  try {
    const fg = chroma(foreground)
    const bg = chroma(background)
    const ratio = chroma.contrast(fg, bg)

    const aa = {
      normal: ratio >= WCAG_LEVELS.AA_NORMAL,
      large: ratio >= WCAG_LEVELS.AA_LARGE,
    }

    const aaa = {
      normal: ratio >= WCAG_LEVELS.AAA_NORMAL,
      large: ratio >= WCAG_LEVELS.AAA_LARGE,
    }

    let grade: 'AAA' | 'AA' | 'Fail' = 'Fail'
    if (aaa.normal) grade = 'AAA'
    else if (aa.normal) grade = 'AA'

    return { ratio, aa, aaa, grade }
  } catch (error) {
    console.error('Erro ao calcular WCAG:', error)
    return {
      ratio: 0,
      aa: { normal: false, large: false },
      aaa: { normal: false, large: false },
      grade: 'Fail',
    }
  }
}

/**
 * Calcula o contraste APCA (WCAG 3.0) entre duas cores
 * APCA é mais preciso que WCAG 2.1 e considera a direção do contraste
 */
export function calculateAPCA(foreground: string, background: string): APCAResult {
  try {
    const fg = chroma(foreground).rgb()
    const bg = chroma(background).rgb()

    // Converte RGB para formato hexadecimal esperado pela biblioteca
    // Calcula o contraste APCA (Lc value)
    const contrast = APCAcontrast(sRGBtoY(fg), sRGBtoY(bg))
    const absContrast = Math.abs(Number(contrast))

    // Determina legibilidade baseado nos níveis APCA
    // Lc 90+: Texto pequeno (12-14px) com qualquer peso
    // Lc 75+: Texto normal (16-18px) com peso normal
    // Lc 60+: Texto grande (24px+) ou peso bold
    // Lc 45+: Texto muito grande (36px+) ou decorativo
    // Lc <45: Não recomendado para texto

    let level: APCAResult['level']
    let minFontSize: number
    let minFontWeight: number
    let description: string
    let isReadable: boolean

    if (absContrast >= 90) {
      level = 'Excellent'
      minFontSize = 12
      minFontWeight = 400
      description = 'Excelente para qualquer tamanho de texto'
      isReadable = true
    } else if (absContrast >= 75) {
      level = 'Good'
      minFontSize = 16
      minFontWeight = 400
      description = 'Ótimo para texto normal e acima'
      isReadable = true
    } else if (absContrast >= 60) {
      level = 'Acceptable'
      minFontSize = 18
      minFontWeight = 700
      description = 'Aceitável para texto grande ou negrito'
      isReadable = true
    } else if (absContrast >= 45) {
      level = 'Poor'
      minFontSize = 24
      minFontWeight = 700
      description = 'Apenas para texto muito grande'
      isReadable = false
    } else {
      level = 'Fail'
      minFontSize = 0
      minFontWeight = 0
      description = 'Contraste insuficiente para texto'
      isReadable = false
    }

    return {
      contrast: Number(contrast),
      isReadable,
      minFontSize,
      minFontWeight,
      level,
      description,
    }
  } catch (error) {
    console.error('Erro ao calcular APCA:', error)
    return {
      contrast: 0,
      isReadable: false,
      minFontSize: 0,
      minFontWeight: 0,
      level: 'Fail',
      description: 'Erro ao calcular contraste',
    }
  }
}

/**
 * Valida se uma cor é válida
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
 * Aplica ajustes de mood a uma cor
 */
export function applyMoodToColor(
  color: Color,
  adjustments: { saturation: number; lightness: number },
): Color {
  const [h, s, l] = color.hsl()

  // Aplica ajustes mantendo valores dentro dos limites
  const newS = Math.max(0, Math.min(1, s + adjustments.saturation))
  const newL = Math.max(0, Math.min(1, l + adjustments.lightness))

  return chroma.hsl(h, newS, newL)
}

/**
 * Aplica mood a uma paleta inteira
 */
export function applyMoodToPalette(
  colors: ColorInfo[],
  adjustments: { saturation: number; lightness: number },
): ColorInfo[] {
  return colors.map((colorInfo) => {
    const color = chroma(colorInfo.hex)
    const adjusted = applyMoodToColor(color, adjustments)
    return colorToInfo(adjusted)
  })
}

/**
 * Extrai cores dominantes de uma imagem
 */
export async function extractColorsFromImage(imageFile: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new Image()
      img.onload = async () => {
        try {
          // Usando ColorThief via dynamic import para evitar SSR
          const ColorThief = (await import('colorthief')).default
          const colorThief = new ColorThief()

          const palette = colorThief.getPalette(img, 6)
          const hexColors = palette.map((rgb: number[]) => chroma(rgb[0], rgb[1], rgb[2]).hex())

          resolve(hexColors)
        } catch (error) {
          reject(error)
        }
      }
      img.onerror = reject
      img.crossOrigin = 'Anonymous'
      img.src = e.target?.result as string
    }

    reader.onerror = reject
    reader.readAsDataURL(imageFile)
  })
}

/**
 * Exporta paleta em diferentes formatos
 */
export function exportPalette(
  colors: ColorInfo[],
  format: ExportFormat,
  semanticNames?: string[],
): string {
  switch (format) {
    case 'shadcn':
      return exportShadcn(colors, 'palette')
    case 'css':
      return exportCSS(colors, semanticNames)
    case 'scss':
      return exportSCSS(colors, semanticNames)
    case 'tailwind':
      return exportTailwind(colors, semanticNames)
    case 'json':
      return exportJSON(colors, semanticNames)
    case 'figma':
      return exportFigma(colors, semanticNames)
    case 'swift':
      return exportSwift(colors, semanticNames)
    case 'xml':
      return exportXML(colors, semanticNames)
    default:
      return exportJSON(colors, semanticNames)
  }
}

function exportCSS(colors: ColorInfo[], names?: string[]): string {
  let css = `:root {\n`
  colors.forEach((color, i) => {
    const varName = names?.[i] || `color-${i + 1}`
    css += `  --${varName}: ${color.hex};\n`
  })
  css += `}`
  return css
}

function exportSCSS(colors: ColorInfo[], names?: string[]): string {
  let scss = ''
  colors.forEach((color, i) => {
    const varName = names?.[i] || `color-${i + 1}`
    scss += `$${varName}: ${color.hex};\n`
  })
  return scss
}

function exportTailwind(colors: ColorInfo[], names?: string[]): string {
  const colorObj = colors.reduce(
    (acc, color, i) => {
      const varName = names?.[i] || `${i + 1}00`
      acc[varName] = color.hex
      return acc
    },
    {} as Record<string, string>,
  )
  return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: ${JSON.stringify(colorObj, null, 8).replace(/"/g, "'")}\n    }\n  }\n}`
}

function exportJSON(colors: ColorInfo[], names?: string[]): string {
  const obj = colors.reduce(
    (acc, color, i) => {
      const varName = names?.[i] || `color-${i + 1}`
      acc[varName] = {
        hex: color.hex,
        rgb: color.rgb,
        hsl: color.hsl,
        name: color.name,
      }
      return acc
    },
    {} as Record<string, any>,
  )
  return JSON.stringify(obj, null, 2)
}

function exportSwift(colors: ColorInfo[], names?: string[]): string {
  let swift = `// Color Palette\nimport UIKit\n\nextension UIColor {\n`
  colors.forEach((color, i) => {
    const rgb = chroma(color.hex).rgb()
    const varName = names?.[i] || `color${i + 1}`
    swift += `    static let ${varName} = UIColor(red: ${(rgb[0] / 255).toFixed(3)}, green: ${(rgb[1] / 255).toFixed(3)}, blue: ${(rgb[2] / 255).toFixed(3)}, alpha: 1.0)\n`
  })
  swift += `}`
  return swift
}

function exportXML(colors: ColorInfo[], names?: string[]): string {
  let xml = `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n`
  colors.forEach((color, i) => {
    const varName = names?.[i] || `color_${i + 1}`
    xml += `    <color name="${varName}">${color.hex}</color>\n`
  })
  xml += `</resources>`
  return xml
}

function exportShadcn(colors: ColorInfo[], name: string): string {
  let css = `/* Shadcn Theme - OKLCH Color Space */\n@layer base {\n  :root {\n`

  colors.forEach((color, i) => {
    const oklch = chroma(color.hex).oklch()
    const l = (oklch[0] * 100).toFixed(2)
    const c = oklch[1].toFixed(4)
    const h = oklch[2] ? oklch[2].toFixed(2) : '0'

    css += `    --${name}-${i + 1}: ${l}% ${c} ${h}; /* ${color.hex} */\n`
  })

  css += `  }\n\n  .dark {\n`

  // Versão dark (invertendo luminosidade)
  colors.forEach((color, i) => {
    const oklch = chroma(color.hex).oklch()
    const l = (100 - oklch[0] * 100).toFixed(2)
    const c = oklch[1].toFixed(4)
    const h = oklch[2] ? oklch[2].toFixed(2) : '0'

    css += `    --${name}-${i + 1}: ${l}% ${c} ${h};\n`
  })

  css += `  }\n}`
  return css
}

function exportFigma(colors: ColorInfo[], names?: string[]): string {
  const tokens = colors.reduce(
    (acc, color, i) => {
      const oklch = chroma(color.hex).oklch()
      const varName = names?.[i] || `color-${i + 1}`
      acc[varName] = {
        value: color.hex,
        type: 'color',
        description: color.name,
        extensions: {
          'org.lukasoppermann.figmaDesignTokens': {
            mode: 'default',
            collection: 'palette',
            scopes: ['ALL_SCOPES'],
          },
        },
        oklch: {
          l: oklch[0],
          c: oklch[1],
          h: oklch[2] || 0,
        },
      }
      return acc
    },
    {} as Record<string, any>,
  )

  return JSON.stringify(tokens, null, 2)
}
