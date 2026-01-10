type XlsMDColumnAlignment = 'left' | 'center' | 'right'
type XlsMDExportFormat = 'markdown' | 'html' | 'latex' | 'ascii'

interface ConversionResult {
  markdown: string
  rowCount: number
  columnCount: number
  headers: string[]
  data: string[][] // Dados brutos para manipulação
}

interface ConversionOptions {
  alignments?: ColumnAlignment[]
  removeEmptyColumns?: boolean
  escapeSpecialChars?: boolean
  compact?: boolean // NOVA OPÇÃO
  format?: ExportFormat
}

interface ColumnStats {
  name: string
  type: 'string' | 'number' | 'boolean' | 'mixed'
  uniqueValues: number
  emptyCount: number
  min?: number
  max?: number
  avg?: number
}

interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}
