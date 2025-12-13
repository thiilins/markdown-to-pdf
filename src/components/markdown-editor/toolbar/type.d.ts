export interface IToolbarActions {
  insertTable: () => void
  insertTableDynamic: (rows: number, cols: number) => void
  insertHeading: (level: number) => void
  insertCodeBlock: () => void
  insertCheckbox: () => void
  insertBold: () => void
  insertItalic: () => void
  insertStrikethrough: () => void
  insertInlineCode: () => void
  insertHorizontalRule: () => void
  insertPageBreak: () => void
  insertLink: () => void
  insertImage: () => void
  insertBlockquote: () => void
  insertOrderedList: () => void
  insertUnorderedList: () => void
  insertCallout: (type: 'NOTE' | 'TIP' | 'IMPORTANT' | 'WARNING' | 'CAUTION') => void
  openFind: () => void
  undo: () => void
  redo: () => void
  formatDocument: () => Promise<void>
}
export type ToolbarOption = {
  type: 'action'
  icon: React.ElementType
  tooltip: string
  onClick: () => void | Promise<void>
}
export interface MarkdownToolbarProps {
  editor: any // Monaco editor instance
}
