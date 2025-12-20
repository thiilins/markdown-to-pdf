type PageSize = 'a4' | 'a5' | 'letter' | 'legal' | 'a3' | 'custom'
type Unit = 'mm' | 'cm' | 'px'
type PositionDirection = 'left' | 'center' | 'right'
type Position = 'left' | 'right' | 'top' | 'bottom'
type Orientation = 'portrait' | 'landscape'
type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading'
interface PageMargin {
  top: string
  bottom: string
  left: string
  right: string
}
interface PageConfig {
  size: PageSize
  width: string
  height: string
  orientation: Orientation
  padding: string
  margin: PageMargin
}
interface HeaderFooterSlotItemConfig {
  enabled: boolean
  title?: string
  author?: string
  left?: string
  center?: string
  right?: string
  logo?: {
    url: string
    position: PositionDirection
    size: { width: string; height: string }
  }
  fullImage?: string // base64 - imagem completa do header/footer (timbrado)
  height?: string
  border?: boolean
  padding?: Record<Position, string>
  fontSize?: number // Tamanho da fonte em pixels
}
interface HeaderFooterConfig {
  header: HeaderFooterSlotItemConfig
  footer: HeaderFooterSlotItemConfig
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
  headerFooter?: HeaderFooterConfig
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
}

type IChildren = React.ReactNode | React.ReactNode[]
