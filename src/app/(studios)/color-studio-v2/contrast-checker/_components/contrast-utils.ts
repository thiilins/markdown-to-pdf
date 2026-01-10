import { APCAcontrast, sRGBtoY } from 'apca-w3'
import chroma from 'chroma-js'

export const WCAG_LEVELS = {
  AA_NORMAL: 4.5,
  AA_LARGE: 3.0,
  AAA_NORMAL: 7.0,
  AAA_LARGE: 4.5,
}

export interface WCAGResult {
  ratio: number
  aa: {
    normal: boolean
    large: boolean
  }
  aaa: {
    normal: boolean
    large: boolean
  }
  grade: 'AAA' | 'AA' | 'Fail'
}

export interface APCAResult {
  contrast: number // Valor Lc (pode ser negativo)
  isReadable: boolean
  minFontSize: number
  minFontWeight: number
  level: 'Excellent' | 'Good' | 'Acceptable' | 'Poor' | 'Fail'
  description: string
}

/**
 * Calcula o contraste WCAG 2.1 entre duas cores
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
 */
export function calculateAPCA(foreground: string, background: string): APCAResult {
  try {
    const fg = chroma(foreground).rgb()
    const bg = chroma(background).rgb()

    const contrast = APCAcontrast(sRGBtoY(fg), sRGBtoY(bg))
    const absContrast = Math.abs(Number(contrast))

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
