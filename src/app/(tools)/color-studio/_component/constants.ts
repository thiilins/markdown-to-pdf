/**
 * Constantes e valores padrão para o Palette Generator
 */

export const DEFAULT_COLOR = '#3B82F6' // Blue-500

export const EXAMPLE_COLORS = [
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#EF4444', // Red
  '#F59E0B', // Amber
  '#10B981', // Emerald
]

export const WCAG_LEVELS = {
  AA_NORMAL: 4.5,
  AA_LARGE: 3,
  AAA_NORMAL: 7,
  AAA_LARGE: 4.5,
} as const

export const PALETTE_TYPES = [
  { value: 'monochromatic', label: 'Monocromática' },
  { value: 'analogous', label: 'Análoga' },
  { value: 'complementary', label: 'Complementar' },
  { value: 'triadic', label: 'Tríade' },
  { value: 'tetradic', label: 'Tétrade' },
  { value: 'shades', label: 'Tons' },
] as const

export const MOOD_TYPES = [
  {
    value: 'corporate',
    label: 'Corporativo',
    description: 'Profissional, confiável e sério',
    adjustments: { saturation: -0.2, lightness: -0.1 },
  },
  {
    value: 'energetic',
    label: 'Enérgico',
    description: 'Vibrante, dinâmico e ousado',
    adjustments: { saturation: 0.3, lightness: 0.1 },
  },
  {
    value: 'calm',
    label: 'Calmo',
    description: 'Sereno, relaxante e suave',
    adjustments: { saturation: -0.3, lightness: 0.2 },
  },
  {
    value: 'luxury',
    label: 'Luxuoso',
    description: 'Elegante, sofisticado e premium',
    adjustments: { saturation: 0.1, lightness: -0.3 },
  },
  {
    value: 'playful',
    label: 'Divertido',
    description: 'Alegre, criativo e jovial',
    adjustments: { saturation: 0.4, lightness: 0.15 },
  },
  {
    value: 'minimal',
    label: 'Minimalista',
    description: 'Limpo, simples e neutro',
    adjustments: { saturation: -0.4, lightness: 0.05 },
  },
] as const

export type MoodType = (typeof MOOD_TYPES)[number]['value']

// Ícones e cores para os moods (para uso no MoodSelector)
import {
  Briefcase as BriefcaseIcon,
  Crown as CrownIcon,
  Minimize2 as Minimize2Icon,
  Smile as SmileIcon,
  Sparkles as SparklesIcon,
  Waves as WavesIcon,
  type LucideIcon,
} from 'lucide-react'

export const MOOD_ICONS: Record<string, LucideIcon> = {
  corporate: BriefcaseIcon,
  energetic: SparklesIcon,
  calm: WavesIcon,
  luxury: CrownIcon,
  playful: SmileIcon,
  minimal: Minimize2Icon,
}

export const EXPORT_FORMATS = [
  { value: 'shadcn', label: 'Shadcn Theme (OKLCH)' },
  { value: 'css', label: 'CSS Variables' },
  { value: 'scss', label: 'SCSS Variables' },
  { value: 'tailwind', label: 'Tailwind Config' },
  { value: 'figma', label: 'Figma Tokens' },
  { value: 'json', label: 'JSON' },
  { value: 'swift', label: 'Swift (iOS)' },
  { value: 'xml', label: 'XML (Android)' },
] as const

export type PaletteType = (typeof PALETTE_TYPES)[number]['value']
export type ColorStudioExportFormat = (typeof EXPORT_FORMATS)[number]['value']

export const MOOD_COLORS = {
  corporate: 'from-blue-500 to-slate-700',
  energetic: 'from-orange-500 to-pink-500',
  calm: 'from-blue-300 to-green-300',
  luxury: 'from-purple-900 to-amber-600',
  playful: 'from-yellow-400 to-pink-400',
  minimal: 'from-slate-300 to-slate-500',
}
