import chroma from 'chroma-js'

/**
 * Gera escala de cores do Tailwind (50-950) baseada em uma cor central
 */
export function generateTailwindScale(baseColor: string): Record<string, string> {
  const color = chroma(baseColor)
  const scale: Record<string, string> = {}

  // Gera escala usando OKLCH para uniformidade perceptual
  const stops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

  // Cria uma escala de branco -> cor -> preto
  const scaleColors = chroma
    .scale(['#ffffff', baseColor, '#000000'])
    .mode('oklch')
    .colors(11)

  stops.forEach((stop, index) => {
    scale[stop] = scaleColors[index]
  })

  return scale
}

/**
 * Cores padrão do Tailwind CSS
 */
export const TAILWIND_COLORS = {
  slate: '#64748b',
  gray: '#6b7280',
  zinc: '#71717a',
  neutral: '#737373',
  stone: '#78716c',
  red: '#ef4444',
  orange: '#f97316',
  amber: '#f59e0b',
  yellow: '#eab308',
  lime: '#84cc16',
  green: '#22c55e',
  emerald: '#10b981',
  teal: '#14b8a6',
  cyan: '#06b6d4',
  sky: '#0ea5e9',
  blue: '#3b82f6',
  indigo: '#6366f1',
  violet: '#8b5cf6',
  purple: '#a855f7',
  fuchsia: '#d946ef',
  pink: '#ec4899',
  rose: '#f43f5e',
} as const

/**
 * Gera todas as escalas padrão do Tailwind
 */
export function generateAllTailwindScales(): Record<string, Record<string, string>> {
  const scales: Record<string, Record<string, string>> = {}

  Object.entries(TAILWIND_COLORS).forEach(([name, color]) => {
    scales[name] = generateTailwindScale(color)
  })

  return scales
}

/**
 * Exporta configuração do Tailwind v3
 */
export function exportTailwindV3Config(
  colorName: string,
  scale: Record<string, string>,
): string {
  return JSON.stringify(
    {
      [colorName]: scale,
    },
    null,
    2,
  )
}

/**
 * Exporta variáveis CSS para Tailwind v4
 */
export function exportTailwindV4CSS(
  colorName: string,
  scale: Record<string, string>,
): string {
  let css = `/* Tailwind v4 CSS Variables */\n`
  Object.entries(scale).forEach(([stop, hex]) => {
    css += `--color-${colorName}-${stop}: ${hex};\n`
  })
  return css
}
