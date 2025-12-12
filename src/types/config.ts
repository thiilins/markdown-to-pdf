export type PageSize = 'a4' | 'a5' | 'letter' | 'legal' | 'a3' | 'custom'

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
  description: string
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

export type ThemePreset =
  | 'classic'
  | 'modern'
  | 'dark'
  | 'minimal'
  | 'warm'
  | 'cool'
  | 'dracula'
  | 'omni'
  | 'nord'
  | 'solarizedLight'
  | 'solarizedDark'
  | 'monokai'
  | 'githubLight'
  | 'githubDark'
  | 'sepia'
  | 'newspaper'
  | 'gruvbox'
  | 'cyberpunk'
  | 'lavender'
  | 'midnight'
  | 'forest'
  | 'obsidian'
  | 'highContrast'
  | 'custom'

export const PAGE_SIZES: Record<PageSize, { width: string; height: string; name: string }> = {
  a4: { width: '210mm', height: '297mm', name: 'A4' },
  a5: { width: '148mm', height: '210mm', name: 'A5' },
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

export const THEME_PRESETS: Record<ThemePreset, ThemeConfig> = {
  // --- Clássicos Refinados ---
  classic: {
    name: 'Clássico',
    description: 'Tema tradicional de alto contraste com fundo branco puro',
    background: '#ffffff',
    textColor: '#111111',
    headingColor: '#000000',
    codeBackground: '#f0f0f0',
    codeTextColor: '#d01040',
    linkColor: '#0969da',
    borderColor: '#d0d7de',
    blockquoteColor: '#57606a',
  },
  modern: {
    name: 'Moderno',
    description: 'Estilo clean com cinzas suaves e tipografia nítida',
    background: '#f9fafb',
    textColor: '#374151',
    headingColor: '#111827',
    codeBackground: '#e5e7eb',
    codeTextColor: '#be185d',
    linkColor: '#2563eb',
    borderColor: '#e5e7eb',
    blockquoteColor: '#6b7280',
  },
  dark: {
    name: 'Escuro Suave',
    description: 'Tema escuro balanceado para evitar fadiga ocular',
    background: '#1e1e1e',
    textColor: '#d4d4d4',
    headingColor: '#ffffff',
    codeBackground: '#2d2d2d',
    codeTextColor: '#9cdcfe',
    linkColor: '#3794ff',
    borderColor: '#404040',
    blockquoteColor: '#a0a0a0',
  },
  minimal: {
    name: 'Minimalista',
    description: 'Foco total no conteúdo, sem distrações visuais',
    background: '#ffffff',
    textColor: '#333333',
    headingColor: '#222222',
    codeBackground: '#f8f9fa',
    codeTextColor: '#444444',
    linkColor: '#222222', // Links pretos sublinhados (estilo editorial)
    borderColor: '#eeeeee',
    blockquoteColor: '#666666',
  },

  // --- Tons e Temperaturas ---
  warm: {
    name: 'Café',
    description: 'Tons terrosos e quentes, confortável para leitura longa',
    background: '#fcf6f0',
    textColor: '#4a3b32',
    headingColor: '#2c1810',
    codeBackground: '#efebe9',
    codeTextColor: '#8d6e63',
    linkColor: '#d84315',
    borderColor: '#e7ded9',
    blockquoteColor: '#795548',
  },
  cool: {
    name: 'Gelo',
    description: 'Tons azulados frios para um visual profissional e técnico',
    background: '#f0f9ff',
    textColor: '#0f172a',
    headingColor: '#0c4a6e',
    codeBackground: '#e0f2fe',
    codeTextColor: '#0369a1',
    linkColor: '#0284c7',
    borderColor: '#bae6fd',
    blockquoteColor: '#475569',
  },

  // --- Populares / Dev Themes ---
  dracula: {
    name: 'Dracula',
    description: 'O famoso tema escuro com alto contraste e cores vibrantes',
    background: '#282a36',
    textColor: '#f8f8f2',
    headingColor: '#bd93f9', // Purple
    codeBackground: '#44475a',
    codeTextColor: '#ff79c6', // Pink
    linkColor: '#8be9fd', // Cyan
    borderColor: '#6272a4',
    blockquoteColor: '#f1fa8c', // Yellowish
  },
  omni: {
    name: 'Omni',
    description: 'Tema escuro moderno com tons de roxo e preto profundo',
    background: '#191622',
    textColor: '#E1E1E6',
    headingColor: '#FF79C6', // Pink do Omni
    codeBackground: '#2A2139', // Um tom levemente mais claro que o fundo
    codeTextColor: '#EFFA78', // Yellow do Omni para destaque
    linkColor: '#BD93F9', // Blue/Purple do Omni
    borderColor: '#41414D',
    blockquoteColor: '#8D79BA', // Cyan/Purple muted
  },
  nord: {
    name: 'Nord',
    description: 'Paleta ártica, azul-acinzentada, fria e elegante',
    background: '#2e3440',
    textColor: '#d8dee9',
    headingColor: '#88c0d0',
    codeBackground: '#3b4252',
    codeTextColor: '#a3be8c',
    linkColor: '#81a1c1',
    borderColor: '#434c5e',
    blockquoteColor: '#eceff4',
  },
  monokai: {
    name: 'Monokai',
    description: 'Clássico dos editores de código, fundo escuro e cores vivas',
    background: '#272822',
    textColor: '#f8f8f2',
    headingColor: '#a6e22e', // Green
    codeBackground: '#3e3d32',
    codeTextColor: '#fd971f', // Orange
    linkColor: '#66d9ef', // Blue
    borderColor: '#75715e',
    blockquoteColor: '#e6db74',
  },

  // --- Solarized ---
  solarizedLight: {
    name: 'Solarized Light',
    description: 'Cores calibradas com precisão para baixo contraste confortável',
    background: '#fdf6e3',
    textColor: '#657b83',
    headingColor: '#586e75',
    codeBackground: '#eee8d5',
    codeTextColor: '#b58900',
    linkColor: '#268bd2',
    borderColor: '#93a1a1',
    blockquoteColor: '#859900',
  },
  solarizedDark: {
    name: 'Solarized Dark',
    description: 'Versão escura do Solarized, tons de ciano profundo',
    background: '#002b36',
    textColor: '#839496',
    headingColor: '#93a1a1',
    codeBackground: '#073642',
    codeTextColor: '#cb4b16',
    linkColor: '#268bd2',
    borderColor: '#586e75',
    blockquoteColor: '#2aa198',
  },

  // --- GitHub Inspired ---
  githubLight: {
    name: 'GitHub Light',
    description: 'Inspirado na interface clara do GitHub',
    background: '#ffffff',
    textColor: '#24292f',
    headingColor: '#1F2328',
    codeBackground: '#f6f8fa',
    codeTextColor: '#24292f',
    linkColor: '#0969da',
    borderColor: '#d0d7de',
    blockquoteColor: '#57606a',
  },
  githubDark: {
    name: 'GitHub Dark',
    description: 'Inspirado na interface escura do GitHub (Dimmed)',
    background: '#0d1117',
    textColor: '#c9d1d9',
    headingColor: '#e6edf3',
    codeBackground: '#161b22',
    codeTextColor: '#e6edf3',
    linkColor: '#58a6ff',
    borderColor: '#30363d',
    blockquoteColor: '#8b949e',
  },

  // --- Leitura & Papel ---
  sepia: {
    name: 'Sépia',
    description: 'Estilo livro antigo, excelente para leituras longas',
    background: '#f4ecd8',
    textColor: '#5b4636',
    headingColor: '#433422',
    codeBackground: '#eaddcf',
    codeTextColor: '#8a6a4b',
    linkColor: '#a65626',
    borderColor: '#dcc6a8',
    blockquoteColor: '#7a624f',
  },
  newspaper: {
    name: 'Jornal',
    description: 'Alto contraste acromático similar a papel de jornal',
    background: '#f3f2ea',
    textColor: '#1a1a1a',
    headingColor: '#000000',
    codeBackground: '#e6e6e6',
    codeTextColor: '#333333',
    linkColor: '#0056b3',
    borderColor: '#a6a6a6',
    blockquoteColor: '#404040',
  },
  gruvbox: {
    name: 'Gruvbox Dark',
    description: 'Tema retro com contraste "médio" e cores pastéis quentes',
    background: '#282828',
    textColor: '#ebdbb2',
    headingColor: '#fabd2f', // Yellow
    codeBackground: '#3c3836',
    codeTextColor: '#fb4934', // Red
    linkColor: '#83a598', // Blue
    borderColor: '#504945',
    blockquoteColor: '#d3869b', // Purple
  },

  // --- Temas Criativos ---
  cyberpunk: {
    name: 'Cyberpunk',
    description: 'Futurista, fundo preto e cores neon vibrantes',
    background: '#050505',
    textColor: '#00ff9f',
    headingColor: '#f0f', // Magenta
    codeBackground: '#121212',
    codeTextColor: '#0ff', // Cyan
    linkColor: '#ffff00', // Yellow
    borderColor: '#333',
    blockquoteColor: '#b300b3',
  },
  lavender: {
    name: 'Lavanda',
    description: 'Tema claro com tons suaves de roxo e lilás',
    background: '#fcfaff',
    textColor: '#2e2a36',
    headingColor: '#4c1d95',
    codeBackground: '#f3e8ff',
    codeTextColor: '#6b21a8',
    linkColor: '#7c3aed',
    borderColor: '#e9d5ff',
    blockquoteColor: '#5b21b6',
  },
  midnight: {
    name: 'Meia-noite',
    description: 'Azul marinho profundo, elegante e relaxante',
    background: '#0f172a',
    textColor: '#cbd5e1',
    headingColor: '#f1f5f9',
    codeBackground: '#1e293b',
    codeTextColor: '#93c5fd',
    linkColor: '#60a5fa',
    borderColor: '#334155',
    blockquoteColor: '#94a3b8',
  },
  forest: {
    name: 'Floresta',
    description: 'Tons de verde e natureza, orgânico e fresco',
    background: '#f2f8f5',
    textColor: '#1b4d3e',
    headingColor: '#064e3b',
    codeBackground: '#d1fae5',
    codeTextColor: '#065f46',
    linkColor: '#059669',
    borderColor: '#a7f3d0',
    blockquoteColor: '#047857',
  },
  obsidian: {
    name: 'Obsidiana',
    description: 'Preto quase absoluto com texto prata, simulando o app Obsidian',
    background: '#161616',
    textColor: '#dcddde',
    headingColor: '#c586c0',
    codeBackground: '#202020',
    codeTextColor: '#ce9178',
    linkColor: '#4ec9b0',
    borderColor: '#333333',
    blockquoteColor: '#858585',
  },

  // --- Acessibilidade ---
  highContrast: {
    name: 'Alto Contraste',
    description: 'Maximiza a legibilidade com preto puro e branco puro',
    background: '#000000',
    textColor: '#ffffff',
    headingColor: '#ffff00', // Amarelo para destaque máximo
    codeBackground: '#000000', // Sem fundo distinto, usa borda
    codeTextColor: '#00ff00', // Verde terminal
    linkColor: '#66ccff',
    borderColor: '#ffffff',
    blockquoteColor: '#ffffff',
  },

  // --- Customizado ---
  custom: {
    name: 'Personalizado',
    description: 'Base para customização do usuário',
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
