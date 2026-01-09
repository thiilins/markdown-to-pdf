interface ColorInfo {
  hex: string
  rgb: string
  hsl: string
  name: string
}

interface WCAGResult {
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

interface APCAResult {
  contrast: number // Valor Lc (pode ser negativo)
  isReadable: boolean
  minFontSize: number // Tamanho mínimo de fonte recomendado
  minFontWeight: number // Peso mínimo de fonte recomendado
  level: 'Excellent' | 'Good' | 'Acceptable' | 'Poor' | 'Fail'
  description: string
}

interface PaletteResult {
  colors: ColorInfo[]
  baseColor: string
  type: PaletteType
}
