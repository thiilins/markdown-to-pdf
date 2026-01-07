interface SnapshotConfig {
  language: string
  theme: string // Nome do tema do SyntaxHighlighter (ex: 'vscDarkPlus', 'dracula', 'oneDark')
  background: string
  padding: number
  showLineNumbers: boolean
  windowTheme: WindowThemeType
  fontFamily: string
  fontSize: number
  scale: number
  borderRadius: number
  shadowIntensity: number
  fontLigatures: boolean
  widthOffset: number // Largura adicional ao padrão (em pixels) - usado apenas em modo custom
  wordWrap: boolean
  showHeaderTitle: boolean // Mostrar título no header
  showHeaderLanguage: boolean // Mostrar linguagem no header (deprecated - usar languagePosition)
  headerTitle: string // Título customizável do header
  presetSize: string // ID do tamanho pré-definido selecionado
  // Footer
  showFooter: boolean // Mostrar footer
  footerOptions: string[] // Até 3 opções para o footer (ex: ['linhas', 'caracteres', 'linguagem', 'texto'])
  footerCustomText: string // Texto customizado para o footer
  languagePosition: LanguagePosition // Onde mostrar a linguagem (header ou footer)
  footerPosition: FooterPosition // Posição do conteúdo do footer (left, center, right)
  // Posicionamento do Conteúdo
  contentVerticalAlign: ContentVerticalAlign // Alinhamento vertical do conteúdo quando não cabe (top, center, bottom)
  // Diff Mode
  diffMode: boolean // Ativar modo diff (split vertical)
  diffOriginalCode: string // Código original para comparação no diff
  // Line Highlights
  highlightedLines: number[] // Array de linhas destacadas
  highlightColor: string // Cor do highlight (hex)
  highlightOpacity: number // Opacidade do highlight (0.1 a 0.5)
  // Code Annotations
  annotations: CodeAnnotation[] // Anotações flutuantes (setas e notas) sobre o código
  annotationMode: boolean // Modo para adicionar anotações (clique no código)
}
type BackgroundType = 'solid' | 'gradient' | 'image'
type WindowThemeType = 'mac' | 'windows' | 'linux' | 'chrome' | 'vscode' | 'retro' | 'none'
type FooterPosition = 'left' | 'center' | 'right'
type LanguagePosition = 'header' | 'footer'
type ContentVerticalAlign = 'top' | 'center' | 'bottom'

// Tamanhos pré-definidos para redes sociais e documentos
interface PresetSize {
  id: string
  name: string
  width: number
  height: number
  description?: string
}

// Anotação flutuante sobre o código
interface CodeAnnotation {
  id: string
  type: 'arrow' | 'note' // Tipo de anotação
  x: number // Posição X em pixels relativos ao código
  y: number // Posição Y em pixels relativos ao código
  text?: string // Texto da nota (opcional para setas)
  targetLine?: number // Linha alvo (para setas apontando para linhas específicas)
  color?: string // Cor da anotação (padrão: amarelo)
  fontSize?: number // Tamanho da fonte (padrão: 14)
  opacity?: number // Opacidade (0-1, padrão: 1)
  style?: 'badge' | 'card' | 'minimal' // Estilo visual da anotação
  icon?: AnnotationIconType // Ícone da anotação
}

// Tipos de ícones disponíveis para anotações
type AnnotationIconType =
  | 'message'
  | 'info'
  | 'alert'
  | 'check'
  | 'star'
  | 'heart'
  | 'lightbulb'
  | 'bug'
  | 'code'
  | 'zap'
