export interface SnapshotConfig {
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
  diffMode: boolean // Ativar modo diff (detecção automática)
  // Line Highlights
  lineHighlights: Record<number, { comment?: string; highlighted?: boolean }> // Comentários e highlights por linha
  // Code Annotations
  annotations: CodeAnnotation[] // Anotações flutuantes (setas e notas) sobre o código
  annotationMode: boolean // Modo para adicionar anotações (clique no código)
  // Live Edit Mode
  liveEditMode: boolean // Permitir editar código diretamente no preview
}
type BackgroundType = 'solid' | 'gradient' | 'image'
type WindowThemeType = 'mac' | 'windows' | 'linux' | 'chrome' | 'vscode' | 'retro' | 'none'
type FooterPosition = 'left' | 'center' | 'right'
type LanguagePosition = 'header' | 'footer'
type ContentVerticalAlign = 'top' | 'center' | 'bottom'

// Tamanhos pré-definidos para redes sociais e documentos
export interface PresetSize {
  id: string
  name: string
  width: number
  height: number
  description?: string
}

// Anotação flutuante sobre o código
export interface CodeAnnotation {
  id: string
  type: 'arrow' | 'note' // Tipo de anotação
  x: number // Posição X em pixels relativos ao código
  y: number // Posição Y em pixels relativos ao código
  text?: string // Texto da nota (opcional para setas)
  targetLine?: number // Linha alvo (para setas apontando para linhas específicas)
  color?: string // Cor da anotação (padrão: amarelo)
}
