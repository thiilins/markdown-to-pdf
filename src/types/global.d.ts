type PageSize = 'a4' | 'a5' | 'letter' | 'legal' | 'a3' | 'custom'
type Unit = 'mm' | 'cm' | 'px'
type Orientation = 'portrait' | 'landscape'

interface PageConfig {
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

interface TypographyConfig {
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

interface EditorConfig {
  theme: 'light' | 'dark' | 'auto'
  fontSize: number
  wordWrap: 'on' | 'off' | 'wordWrapColumn' | 'bounded'
  minimap: boolean
  lineNumbers: 'on' | 'off' | 'relative' | 'interval'
}

interface AppConfig {
  page: PageConfig
  typography: TypographyConfig
  editor: EditorConfig
  theme?: ThemeConfig
}

interface ThemeConfig {
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

type MarginPreset = 'normal' | 'narrow' | 'wide' | 'minimal' | 'custom'

type ThemePreset =
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

interface Breadcrumbs {
  order?: number
  label: string
  href?: string
}

interface Modules {
  label: string
  href: string
  description: string
  icon: React.ElementType
}
interface ModuleItem {
  label: string
  href?: string
  description?: string
  icon: React.ElementType
  submenu?: Modules[]
}

interface EnableTools {
  zoom: boolean
  printExport: boolean
  settings: boolean
}
