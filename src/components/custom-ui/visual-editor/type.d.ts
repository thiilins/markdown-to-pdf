interface Variables {
  label: string
  value: string
  icon: React.ElementType
  key: string
}

type ViewMode = 'visual' | 'html'

type PresetEditorVisualConfig = 'minimal' | 'complete' | 'custom'
type VisualEditorConfigOptions =
  | 'undo-redo'
  | 'vertical'
  | 'typography'
  | 'font-size'
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikethrough'
  | 'text-color'
  | 'text-highlight'
  | 'text-align'
  | 'bullet-list'
  | 'ordered-list'
  | 'task-list'
  | 'link'
  | 'table'
  | 'image'
  | 'horizontal-rule'
  | 'variables'

interface VisualEditorCustom {
  key: string
  order: number
  component: VisualEditorConfigOptions
}
interface VisualEditorCustomConfig {
  preset: PresetEditorVisualConfig
  custom?: VisualEditorCustom[]
  bubbleMenu?: boolean
}
interface EditorConfigProps {
  placeholder?: string
  textAlignConfigure?: string[]
  imageClass?: string
  linkClass?: string
  immediatelyRender?: boolean
  taskItemNested?: boolean
  tableResizable?: boolean
  highlightMulticolor?: boolean
  linkOpenOnClick?: boolean
}
interface VisualEditorProviderProps {
  children: IChildren
  placeholders: Variables[]
  config: VisualEditorCustomConfig
  editorConfig?: EditorConfigProps
  initialValue?: string
  updateEditorValue?: (value: string) => void
}
interface VisualEditorContextType {
  viewMode: ViewMode
  setViewMode: Dispatch<SetStateAction<ViewMode>>
  fontSizeValue: string
  setFontSizeValue: Dispatch<SetStateAction<string>>
  placeholders: Variables[]
  FontSize: Mark<TextStyleOptions, any>
  config: VisualEditorCustomConfig
  editorValue: string
  handleUpdateEditorValue: (value: string) => void
  editor: Editor | null
}

type VisualEditorComponentProps = Omit<VisualEditorProviderProps, 'children'> & {
  className?: string
}
