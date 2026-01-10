import chroma from 'chroma-js'
import ntc from 'ntc'
import { colorToData } from '../../_shared/utils/color-algorithms'

/**
 * Extrai cores dominantes de uma imagem usando ColorThief
 */
export async function extractColorsFromImage(imageFile: File): Promise<ColorData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new Image()
      img.onload = async () => {
        try {
          // Dynamic import para evitar SSR
          const ColorThief = (await import('colorthief')).default
          const colorThief = new ColorThief()

          // Extrai 8 cores dominantes
          const palette = colorThief.getPalette(img, 8)
          const colors: ColorData[] = palette.map((rgb: number[]) => {
            const hex = chroma(rgb[0], rgb[1], rgb[2]).hex()
            return colorToData(chroma(hex))
          })

          resolve(colors)
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
 * Extrai cor de um pixel específico da imagem
 */
export function getPixelColor(imageElement: HTMLImageElement, x: number, y: number): string | null {
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    canvas.width = imageElement.width
    canvas.height = imageElement.height
    ctx.drawImage(imageElement, 0, 0)

    const imageData = ctx.getImageData(x, y, 1, 1)
    const [r, g, b] = imageData.data
    return chroma(r, g, b).hex()
  } catch {
    return null
  }
}

/**
 * Gera paletas sugeridas baseadas na imagem
 */
export function generateSuggestedPalettes(colors: ColorData[]): {
  dominant: ColorData[]
  vibrant: ColorData[]
  muted: ColorData[]
  dark: ColorData[]
} {
  // Dominante: as 5 cores mais presentes (já ordenadas pelo ColorThief)
  const dominant = colors.slice(0, 5)

  // Vibrante: cores com maior saturação
  const vibrant = [...colors]
    .sort((a, b) => {
      const satA = chroma(a.hex).get('hsl.s')
      const satB = chroma(b.hex).get('hsl.s')
      return satB - satA
    })
    .slice(0, 5)

  // Muted: cores dessaturadas (pastéis)
  const muted = [...colors]
    .sort((a, b) => {
      const satA = chroma(a.hex).get('hsl.s')
      const satB = chroma(b.hex).get('hsl.s')
      return satA - satB
    })
    .slice(0, 5)

  // Dark: cores mais escuras
  const dark = [...colors]
    .sort((a, b) => {
      const lightA = chroma(a.hex).get('hsl.l')
      const lightB = chroma(b.hex).get('hsl.l')
      return lightA - lightB
    })
    .slice(0, 5)

  return { dominant, vibrant, muted, dark }
}
