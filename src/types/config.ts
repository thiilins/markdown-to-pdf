export type PageSize = 'a4' | 'letter' | 'legal' | 'a3' | 'custom'

export type Orientation = 'portrait' | 'landscape'

export interface PageConfig {
  size: PageSize
  width: string
  height: string
  orientation: Orientation
  padding: string
  margin: {
    top: string
    right: string
    bottom: string
    left: string
  }
}

export interface TypographyConfig {
  headings: string
  body: string
  code: string
  quote: string
  baseSize: number
  h1Size: number
  h2Size: number
  h3Size: number
  lineHeight: number
}

export interface EditorConfig {
  theme: 'light' | 'dark' | 'auto'
  fontSize: number
  wordWrap: 'on' | 'off' | 'wordWrapColumn' | 'bounded'
  minimap: boolean
  lineNumbers: 'on' | 'off' | 'relative' | 'interval'
}

export interface AppConfig {
  page: PageConfig
  typography: TypographyConfig
  editor: EditorConfig
  theme?: ThemeConfig
}

export interface ThemeConfig {
  name: string
  background: string
  textColor: string
  headingColor: string
  codeBackground: string
  codeTextColor: string
  linkColor: string
  borderColor: string
  blockquoteColor: string
}

export type MarginPreset = 'normal' | 'narrow' | 'wide' | 'minimal' | 'custom'

export type ThemePreset = 'classic' | 'modern' | 'dark' | 'minimal' | 'warm' | 'cool' | 'custom'

export const PAGE_SIZES: Record<PageSize, { width: string; height: string; name: string }> = {
  a4: { width: '210mm', height: '297mm', name: 'A4' },
  letter: { width: '215.9mm', height: '279.4mm', name: 'Carta (US Letter)' },
  legal: { width: '215.9mm', height: '355.6mm', name: 'Legal' },
  a3: { width: '297mm', height: '420mm', name: 'A3' },
  custom: { width: '210mm', height: '297mm', name: 'Personalizado' },
}
export const GOOGLE_FONTS = [
  // --- Originais (mantidas) ---
  { name: 'Inter', value: 'Inter', type: 'sans-serif' },
  { name: 'Roboto', value: 'Roboto', type: 'sans-serif' },
  { name: 'Merriweather', value: 'Merriweather', type: 'serif' },
  { name: 'Fira Code', value: 'Fira Code', type: 'monospace' },
  { name: 'Montserrat', value: 'Montserrat', type: 'sans-serif' },
  { name: 'Open Sans', value: 'Open Sans', type: 'sans-serif' },
  { name: 'Lato', value: 'Lato', type: 'sans-serif' },
  { name: 'Source Sans Pro', value: 'Source Sans Pro', type: 'sans-serif' },

  { name: 'Poppins', value: 'Poppins', type: 'sans-serif' },
  { name: 'Nunito', value: 'Nunito', type: 'sans-serif' },
  { name: 'Raleway', value: 'Raleway', type: 'sans-serif' },
  { name: 'Ubuntu', value: 'Ubuntu', type: 'sans-serif' },
  { name: 'PT Sans', value: 'PT Sans', type: 'sans-serif' },
  { name: 'Karla', value: 'Karla', type: 'sans-serif' },
  { name: 'Nunito Sans', value: 'Nunito Sans', type: 'sans-serif' },
  { name: 'Work Sans', value: 'Work Sans', type: 'sans-serif' },
  { name: 'Space Grotesk', value: 'Space Grotesk', type: 'sans-serif' },
  { name: 'Syne', value: 'Syne', type: 'sans-serif' },
  { name: 'Fahkwang', value: 'Fahkwang', type: 'sans-serif' },
  { name: 'Droid Sans', value: 'Droid Sans', type: 'sans-serif' },

  { name: 'Playfair Display', value: 'Playfair Display', type: 'serif' },
  { name: 'Lora', value: 'Lora', type: 'serif' },
  { name: 'Source Serif Pro', value: 'Source Serif Pro', type: 'serif' },
  { name: 'Libre Baskerville', value: 'Libre Baskerville', type: 'serif' },
  { name: 'Noto Serif', value: 'Noto Serif', type: 'serif' },
  { name: 'Josefin Slab', value: 'Josefin Slab', type: 'serif' },
  { name: 'Arvo', value: 'Arvo', type: 'serif' },
  { name: 'Vollkorn', value: 'Vollkorn', type: 'serif' },
  { name: 'PT Serif', value: 'PT Serif', type: 'serif' },
  { name: 'Old Standard TT', value: 'Old Standard TT', type: 'serif' },

  { name: 'Fira Code', value: 'Fira Code', type: 'monospace' },
  { name: 'Inconsolata', value: 'Inconsolata', type: 'monospace' },
  { name: 'JetBrains Mono', value: 'JetBrains Mono', type: 'monospace' },
  { name: 'Ubuntu Mono', value: 'Ubuntu Mono', type: 'monospace' },
  { name: 'Syne Mono', value: 'Syne Mono', type: 'monospace' },

  { name: 'Oswald', value: 'Oswald', type: 'display' },
  { name: 'Bebas Neue', value: 'Bebas Neue', type: 'display' },
  { name: 'Lobster', value: 'Lobster', type: 'display' },
  { name: 'Anton', value: 'Anton', type: 'display' },
  { name: 'Abril Fatface', value: 'Abril Fatface', type: 'display' },
  { name: 'Cinzel', value: 'Cinzel', type: 'display' },
  { name: 'Righteous', value: 'Righteous', type: 'display' },
  { name: 'Pacifico', value: 'Pacifico', type: 'handwriting' },
  { name: 'Caveat', value: 'Caveat', type: 'handwriting' },
  { name: 'Dancing Script', value: 'Dancing Script', type: 'handwriting' },
  { name: 'Shadows Into Light', value: 'Shadows Into Light', type: 'handwriting' },

  // --- Sans-serif adicionais (bem usados) ---
  { name: 'Noto Sans', value: 'Noto Sans', type: 'sans-serif' },
  { name: 'Noto Sans JP', value: 'Noto Sans JP', type: 'sans-serif' },
  { name: 'Noto Sans KR', value: 'Noto Sans KR', type: 'sans-serif' },
  { name: 'Noto Sans SC', value: 'Noto Sans SC', type: 'sans-serif' },
  { name: 'Noto Sans TC', value: 'Noto Sans TC', type: 'sans-serif' },
  { name: 'Roboto Condensed', value: 'Roboto Condensed', type: 'sans-serif' },
  { name: 'Roboto Flex', value: 'Roboto Flex', type: 'sans-serif' },
  { name: 'Manrope', value: 'Manrope', type: 'sans-serif' },
  { name: 'Barlow', value: 'Barlow', type: 'sans-serif' },
  { name: 'Barlow Condensed', value: 'Barlow Condensed', type: 'sans-serif' },
  { name: 'Archivo', value: 'Archivo', type: 'sans-serif' },
  { name: 'Archivo Narrow', value: 'Archivo Narrow', type: 'sans-serif' },
  { name: 'Heebo', value: 'Heebo', type: 'sans-serif' },
  { name: 'Mukta', value: 'Mukta', type: 'sans-serif' },
  { name: 'Mulish', value: 'Mulish', type: 'sans-serif' },
  { name: 'Titillium Web', value: 'Titillium Web', type: 'sans-serif' },
  { name: 'Hind', value: 'Hind', type: 'sans-serif' },
  { name: 'Hind Siliguri', value: 'Hind Siliguri', type: 'sans-serif' },
  { name: 'IBM Plex Sans', value: 'IBM Plex Sans', type: 'sans-serif' },
  { name: 'IBM Plex Sans Condensed', value: 'IBM Plex Sans Condensed', type: 'sans-serif' },
  { name: 'IBM Plex Sans Arabic', value: 'IBM Plex Sans Arabic', type: 'sans-serif' },
  { name: 'IBM Plex Sans Thai', value: 'IBM Plex Sans Thai', type: 'sans-serif' },
  { name: 'IBM Plex Sans Devanagari', value: 'IBM Plex Sans Devanagari', type: 'sans-serif' },
  { name: 'Plus Jakarta Sans', value: 'Plus Jakarta Sans', type: 'sans-serif' },
  { name: 'Quicksand', value: 'Quicksand', type: 'sans-serif' },
  { name: 'Muli', value: 'Muli', type: 'sans-serif' },
  { name: 'Asap', value: 'Asap', type: 'sans-serif' },
  { name: 'Asap Condensed', value: 'Asap Condensed', type: 'sans-serif' },
  { name: 'Cabin', value: 'Cabin', type: 'sans-serif' },
  { name: 'Fjalla One', value: 'Fjalla One', type: 'sans-serif' },
  { name: 'Domine', value: 'Domine', type: 'serif' }, // muito usada em texto, mas já deixo aqui
  { name: 'Maven Pro', value: 'Maven Pro', type: 'sans-serif' },
  { name: 'Exo 2', value: 'Exo 2', type: 'sans-serif' },
  { name: 'Baloo 2', value: 'Baloo 2', type: 'sans-serif' },
  { name: 'Spoqa Han Sans Neo', value: 'Spoqa Han Sans Neo', type: 'sans-serif' }, // similar a Noto, popular em interfaces
  { name: 'Jost', value: 'Jost', type: 'sans-serif' },
  { name: 'Urbanist', value: 'Urbanist', type: 'sans-serif' },
  { name: 'Outfit', value: 'Outfit', type: 'sans-serif' },
  { name: 'Lexend', value: 'Lexend', type: 'sans-serif' },
  { name: 'Lexend Deca', value: 'Lexend Deca', type: 'sans-serif' },
  { name: 'Prompt', value: 'Prompt', type: 'sans-serif' },
  { name: 'Sarala', value: 'Sarala', type: 'sans-serif' },
  { name: 'Public Sans', value: 'Public Sans', type: 'sans-serif' },
  { name: 'Red Hat Display', value: 'Red Hat Display', type: 'sans-serif' },
  { name: 'Red Hat Text', value: 'Red Hat Text', type: 'sans-serif' },
  { name: 'DM Sans', value: 'DM Sans', type: 'sans-serif' },
  { name: 'DM Mono', value: 'DM Mono', type: 'monospace' },

  // --- Serif adicionais ---
  { name: 'Roboto Slab', value: 'Roboto Slab', type: 'serif' },
  { name: 'Merriweather Sans', value: 'Merriweather Sans', type: 'sans-serif' },
  { name: 'Crimson Text', value: 'Crimson Text', type: 'serif' },
  { name: 'Crimson Pro', value: 'Crimson Pro', type: 'serif' },
  { name: 'Cormorant Garamond', value: 'Cormorant Garamond', type: 'serif' },
  { name: 'Cormorant', value: 'Cormorant', type: 'serif' },
  { name: 'Cormorant Infant', value: 'Cormorant Infant', type: 'serif' },
  { name: 'EB Garamond', value: 'EB Garamond', type: 'serif' },
  { name: 'Cardo', value: 'Cardo', type: 'serif' },
  { name: 'Georgia Pro', value: 'Georgia Pro', type: 'serif' }, // similar, não é exatamente Google Fonts mas muitos usam equivalente
  { name: 'Alegreya', value: 'Alegreya', type: 'serif' },
  { name: 'Alegreya SC', value: 'Alegreya SC', type: 'serif' },
  { name: 'Alegreya Sans', value: 'Alegreya Sans', type: 'sans-serif' },
  { name: 'Bitter', value: 'Bitter', type: 'serif' },
  { name: 'Spectral', value: 'Spectral', type: 'serif' },
  { name: 'Georgia', value: 'Georgia', type: 'serif' }, // fallback de sistema
  { name: 'Prata', value: 'Prata', type: 'serif' },
  { name: 'DM Serif Display', value: 'DM Serif Display', type: 'serif' },
  { name: 'DM Serif Text', value: 'DM Serif Text', type: 'serif' },
  { name: 'Rosario', value: 'Rosario', type: 'serif' },

  // --- Monospace adicionais ---
  { name: 'Roboto Mono', value: 'Roboto Mono', type: 'monospace' },
  { name: 'Source Code Pro', value: 'Source Code Pro', type: 'monospace' },
  { name: 'Cascadia Code', value: 'Cascadia Code', type: 'monospace' }, // não é Google Fonts, mas muito usada
  { name: 'Courier Prime', value: 'Courier Prime', type: 'monospace' },
  { name: 'Space Mono', value: 'Space Mono', type: 'monospace' },
  { name: 'Anonymous Pro', value: 'Anonymous Pro', type: 'monospace' },

  // --- Display / Handwriting extras ---
  { name: 'Josefin Sans', value: 'Josefin Sans', type: 'display' },
  { name: 'Playfair Display SC', value: 'Playfair Display SC', type: 'display' },
  { name: 'Amatic SC', value: 'Amatic SC', type: 'display' },
  { name: 'Alfa Slab One', value: 'Alfa Slab One', type: 'display' },
  { name: 'Poiret One', value: 'Poiret One', type: 'display' },
  { name: 'Bangers', value: 'Bangers', type: 'display' },
  { name: 'Fredoka', value: 'Fredoka', type: 'display' },
  { name: 'Yanone Kaffeesatz', value: 'Yanone Kaffeesatz', type: 'display' },
  { name: 'Chewy', value: 'Chewy', type: 'display' },
  { name: 'Ga Maamli', value: 'Ga Maamli', type: 'display' },
  { name: 'Great Vibes', value: 'Great Vibes', type: 'handwriting' },
  { name: 'Satisfy', value: 'Satisfy', type: 'handwriting' },
  { name: 'Gloria Hallelujah', value: 'Gloria Hallelujah', type: 'handwriting' },
  { name: 'Indie Flower', value: 'Indie Flower', type: 'handwriting' },
  { name: 'Patrick Hand', value: 'Patrick Hand', type: 'handwriting' },
  { name: 'Amiri', value: 'Amiri', type: 'serif' }, // árabe + latino
  { name: 'Tajawal', value: 'Tajawal', type: 'sans-serif' }, // árabe
  { name: 'Cairo', value: 'Cairo', type: 'sans-serif' },
  { name: 'Kufam', value: 'Kufam', type: 'sans-serif' },
]

// Presets de Margens
export const MARGIN_PRESETS: Record<
  MarginPreset,
  { name: string; margin: { top: string; right: string; bottom: string; left: string } }
> = {
  minimal: {
    name: 'Mínima',
    margin: { top: '5mm', right: '5mm', bottom: '5mm', left: '5mm' },
  },
  narrow: {
    name: 'Estreita',
    margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
  },
  normal: {
    name: 'Normal',
    margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
  },
  wide: {
    name: 'Larga',
    margin: { top: '30mm', right: '30mm', bottom: '30mm', left: '30mm' },
  },
  custom: {
    name: 'Personalizada',
    margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
  },
}

// Presets de Temas
export const THEME_PRESETS: Record<ThemePreset, ThemeConfig & { description: string }> = {
  classic: {
    name: 'Clássico',
    description: 'Tema tradicional com fundo branco e texto preto',
    background: '#ffffff',
    textColor: '#000000',
    headingColor: '#1a1a1a',
    codeBackground: '#f5f5f5',
    codeTextColor: '#333333',
    linkColor: '#0066cc',
    borderColor: '#e0e0e0',
    blockquoteColor: '#4a5568',
  },
  modern: {
    name: 'Moderno',
    description: 'Tema contemporâneo com cores suaves',
    background: '#fafafa',
    textColor: '#1f2937',
    headingColor: '#111827',
    codeBackground: '#1e1e1e',
    codeTextColor: '#d4d4d4',
    linkColor: '#3b82f6',
    borderColor: '#e5e7eb',
    blockquoteColor: '#4b5563',
  },
  dark: {
    name: 'Escuro',
    description: 'Tema escuro para leitura noturna',
    background: '#1a1a1a',
    textColor: '#e5e5e5',
    headingColor: '#ffffff',
    codeBackground: '#2d2d2d',
    codeTextColor: '#d4d4d4',
    linkColor: '#60a5fa',
    borderColor: '#404040',
    blockquoteColor: '#a0a0a0',
  },
  minimal: {
    name: 'Minimalista',
    description: 'Tema limpo e minimalista',
    background: '#ffffff',
    textColor: '#2d3748',
    headingColor: '#1a202c',
    codeBackground: '#f7fafc',
    codeTextColor: '#2d3748',
    linkColor: '#3182ce',
    borderColor: '#cbd5e0',
    blockquoteColor: '#4a5568',
  },
  warm: {
    name: 'Quente',
    description: 'Tema com tons quentes e acolhedores',
    background: '#fef9f3',
    textColor: '#3d2817',
    headingColor: '#1a0f05',
    codeBackground: '#2d1b0e',
    codeTextColor: '#f4e6d7',
    linkColor: '#c05621',
    borderColor: '#e8d5c4',
    blockquoteColor: '#6b4423',
  },
  cool: {
    name: 'Frio',
    description: 'Tema com tons frios e profissionais',
    background: '#f0f4f8',
    textColor: '#1a365d',
    headingColor: '#0d2438',
    codeBackground: '#1a365d',
    codeTextColor: '#bee3f8',
    linkColor: '#2b6cb0',
    borderColor: '#cbd5e0',
    blockquoteColor: '#4a5568',
  },
  custom: {
    name: 'Personalizado',
    description: 'Tema personalizado',
    background: '#ffffff',
    textColor: '#000000',
    headingColor: '#1a1a1a',
    codeBackground: '#f5f5f5',
    codeTextColor: '#333333',
    linkColor: '#0066cc',
    borderColor: '#e0e0e0',
    blockquoteColor: '#4a5568',
  },
}
