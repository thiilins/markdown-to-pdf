import Papa from 'papaparse'
import * as XLSX from 'xlsx'

/**
 * Converte CSV para Markdown
 */
export function csvToMarkdown(csvContent: string, options?: ConversionOptions): ConversionResult {
  const parsed = Papa.parse(csvContent, {
    skipEmptyLines: true,
    header: false,
  })

  if (parsed.errors.length > 0) {
    throw new Error(`Erro ao processar CSV: ${parsed.errors[0].message}`)
  }

  let data = parsed.data as string[][]

  if (data.length === 0) {
    throw new Error('CSV vazio')
  }

  let headers = data[0]
  let rows = data.slice(1)

  // Remove colunas vazias se solicitado
  if (options?.removeEmptyColumns) {
    const result = removeEmptyColumns(headers, rows)
    headers = result.headers
    rows = result.rows
  }

  const markdown = generateTable(headers, rows, options)

  return {
    markdown,
    rowCount: rows.length,
    columnCount: headers.length,
    headers,
    data: rows,
  }
}

/**
 * Converte arquivo Excel para Markdown
 */
export function excelToMarkdown(
  file: File,
  options?: ConversionOptions,
): Promise<ConversionResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })

        // Pega a primeira planilha
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]

        // Converte para array de arrays
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: '',
        }) as string[][]

        if (jsonData.length === 0) {
          reject(new Error('Planilha vazia'))
          return
        }

        let headers = jsonData[0]
        let rows = jsonData.slice(1)

        if (options?.removeEmptyColumns) {
          const result = removeEmptyColumns(headers, rows)
          headers = result.headers
          rows = result.rows
        }

        const markdown = generateTable(headers, rows, options)

        resolve({
          markdown,
          rowCount: rows.length,
          columnCount: headers.length,
          headers,
          data: rows,
        })
      } catch (error: any) {
        reject(new Error(`Erro ao processar Excel: ${error.message}`))
      }
    }

    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'))
    }

    reader.readAsArrayBuffer(file)
  })
}

/**
 * Converte array de objetos JSON para Markdown
 */
export function jsonToMarkdown(jsonContent: string, options?: ConversionOptions): ConversionResult {
  try {
    const data = JSON.parse(jsonContent)

    if (!Array.isArray(data)) {
      throw new Error('JSON deve ser um array de objetos')
    }

    if (data.length === 0) {
      throw new Error('Array vazio')
    }

    // Extrai headers do primeiro objeto
    const firstItem = data[0]
    if (typeof firstItem !== 'object' || firstItem === null) {
      throw new Error('Cada item do array deve ser um objeto')
    }

    let headers = Object.keys(firstItem)

    // Converte objetos para arrays de valores
    let rows = data.map((item) => {
      return headers.map((header) => {
        const value = item[header]
        if (value === null || value === undefined) return ''
        if (typeof value === 'object') return JSON.stringify(value)
        return String(value)
      })
    })

    if (options?.removeEmptyColumns) {
      const result = removeEmptyColumns(headers, rows)
      headers = result.headers
      rows = result.rows
    }

    const markdown = generateTable(headers, rows, options)

    return {
      markdown,
      rowCount: rows.length,
      columnCount: headers.length,
      headers,
      data: rows,
    }
  } catch (error: any) {
    throw new Error(`Erro ao processar JSON: ${error.message}`)
  }
}

/**
 * Valida input CSV
 */
export function validateCSV(csvContent: string): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (!csvContent.trim()) {
    errors.push('Conteúdo vazio')
    return { isValid: false, errors, warnings }
  }

  const parsed = Papa.parse(csvContent, {
    skipEmptyLines: true,
    header: false,
  })

  if (parsed.errors.length > 0) {
    errors.push(...parsed.errors.map((e) => e.message))
  }

  const data = parsed.data as string[][]

  if (data.length === 0) {
    errors.push('Nenhuma linha encontrada')
  } else if (data.length === 1) {
    warnings.push('Apenas headers encontrados, sem dados')
  }

  // Verifica se todas as linhas têm o mesmo número de colunas
  if (data.length > 0) {
    const columnCount = data[0].length
    const inconsistentRows = data.filter((row) => row.length !== columnCount)
    if (inconsistentRows.length > 0) {
      warnings.push(`${inconsistentRows.length} linha(s) com número de colunas diferente`)
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Valida input JSON
 */
export function validateJSON(jsonContent: string): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (!jsonContent.trim()) {
    errors.push('Conteúdo vazio')
    return { isValid: false, errors, warnings }
  }

  try {
    const data = JSON.parse(jsonContent)

    if (!Array.isArray(data)) {
      errors.push('JSON deve ser um array de objetos')
      return { isValid: false, errors, warnings }
    }

    if (data.length === 0) {
      errors.push('Array vazio')
      return { isValid: false, errors, warnings }
    }

    // Verifica se todos os itens são objetos
    const nonObjects = data.filter(
      (item) => typeof item !== 'object' || item === null || Array.isArray(item),
    )
    if (nonObjects.length > 0) {
      errors.push('Todos os itens do array devem ser objetos')
      return { isValid: false, errors, warnings }
    }

    // Verifica consistência de propriedades
    const firstKeys = Object.keys(data[0])
    const inconsistentItems = data.filter((item) => {
      const keys = Object.keys(item)
      return keys.length !== firstKeys.length || !keys.every((k) => firstKeys.includes(k))
    })

    if (inconsistentItems.length > 0) {
      warnings.push(`${inconsistentItems.length} objeto(s) com propriedades diferentes`)
    }
  } catch (error: any) {
    errors.push(`JSON inválido: ${error.message}`)
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

// ============================================================================
// FUNÇÕES AUXILIARES AVANÇADAS
// ============================================================================

/**
 * Gera tabela com opções avançadas (alinhamento, formato, etc.)
 */
function generateTable(headers: string[], rows: string[][], options?: ConversionOptions): string {
  const format = options?.format || 'markdown'

  switch (format) {
    case 'html':
      return generateHTMLTable(headers, rows)
    case 'latex':
      return generateLaTeXTable(headers, rows)
    case 'ascii':
      return generateASCIITable(headers, rows)
    default:
      return generateMarkdownTableWithAlignment(
        headers,
        rows,
        options?.alignments,
        options?.escapeSpecialChars,
        options?.compact, // Passa a opção compact
      )
  }
}

/**
 * Gera tabela Markdown com suporte a alinhamento e modo compacto
 */
function generateMarkdownTableWithAlignment(
  headers: string[],
  rows: string[][],
  alignments?: XlsMDColumnAlignment[],
  escapeChars?: boolean,
  compact?: boolean,
): string {
  const processCell = (cell: string) => {
    let processed = String(cell || '')
    if (escapeChars) {
      processed = processed.replace(/\|/g, '\\|').replace(/\\/g, '\\\\')
    }
    return processed.trim() // Importante dar trim
  }

  const processedHeaders = headers.map(processCell)
  const processedRows = rows.map((row) => row.map(processCell))

  // Se for compacto, não calculamos largura para preenchimento (padding)
  // Se não for compacto, calculamos para ficar bonito visualmente
  const columnWidths = processedHeaders.map((header, colIndex) => {
    if (compact) return 0 // No padding

    const headerLength = header.length
    const maxRowLength = Math.max(...processedRows.map((row) => (row[colIndex] || '').length), 0)
    return Math.max(headerLength, maxRowLength, 3)
  })

  // Função para criar célula (com padding ou sem)
  const createCell = (text: string, width: number) => {
    return compact ? ` ${text} ` : ` ${text.padEnd(width)} `
  }

  const headerLine = processedHeaders
    .map((header, i) => createCell(header, columnWidths[i]))
    .join('|')

  const separatorLine = processedHeaders // Usamos o tamanho do header como base se compact
    .map((_, i) => {
      const align = alignments?.[i] || 'left'
      // No modo compacto usamos minímo de 3 dashes, ou o tamanho do header se quiser alinhar minimamente,
      // mas markdown exige pelo menos 3 dashes normalmente para ser válido em alguns parsers.
      const width = compact ? 3 : columnWidths[i]
      const dashes = '-'.repeat(width)

      switch (align) {
        case 'center':
          return `:${dashes}:`
        case 'right':
          return `${dashes}:`
        default:
          return `${dashes}` // Left é o default (sem dois pontos ou dois pontos na esquerda opcional)
      }
    })
    .join('|')

  const dataLines = processedRows.map((row) => {
    return row.map((cell, i) => createCell(cell, columnWidths[i])).join('|')
  })

  return `|${headerLine}|\n|${separatorLine}|\n${dataLines.map((line) => `|${line}|`).join('\n')}`
}

/**
 * Gera tabela HTML
 */
function generateHTMLTable(headers: string[], rows: string[][]): string {
  const headerCells = headers.map((h) => `    <th>${escapeHTML(h)}</th>`).join('\n')
  const bodyRows = rows
    .map((row) => {
      const cells = row.map((cell) => `      <td>${escapeHTML(cell)}</td>`).join('\n')
      return `    <tr>\n${cells}\n    </tr>`
    })
    .join('\n')

  return `<table>
  <thead>
    <tr>
${headerCells}
    </tr>
  </thead>
  <tbody>
${bodyRows}
  </tbody>
</table>`
}

/**
 * Gera tabela LaTeX
 */
function generateLaTeXTable(headers: string[], rows: string[][]): string {
  const columnSpec = 'l'.repeat(headers.length)
  const headerLine = headers.map(escapeLaTeX).join(' & ')
  const bodyLines = rows.map((row) => row.map(escapeLaTeX).join(' & ') + ' \\\\').join('\n')

  return `\\begin{tabular}{${columnSpec}}
\\hline
${headerLine} \\\\
\\hline
${bodyLines}
\\hline
\\end{tabular}`
}

/**
 * Gera tabela ASCII
 */
function generateASCIITable(headers: string[], rows: string[][]): string {
  const columnWidths = headers.map((header, colIndex) => {
    const headerLength = String(header).length
    const maxRowLength = Math.max(...rows.map((row) => String(row[colIndex] || '').length), 0)
    return Math.max(headerLength, maxRowLength, 3)
  })

  const separator = '+' + columnWidths.map((w) => '-'.repeat(w + 2)).join('+') + '+'
  const headerLine =
    '|' + headers.map((h, i) => ` ${String(h).padEnd(columnWidths[i])} `).join('|') + '|'
  const dataLines = rows.map((row) => {
    return (
      '|' + row.map((cell, i) => ` ${String(cell || '').padEnd(columnWidths[i])} `).join('|') + '|'
    )
  })

  return `${separator}\n${headerLine}\n${separator}\n${dataLines.join('\n')}\n${separator}`
}

/**
 * Transpõe a tabela (inverte linhas e colunas)
 */
export function transposeTable(
  headers: string[],
  rows: string[][],
): { headers: string[]; rows: string[][] } {
  const allData = [headers, ...rows]
  const transposed: string[][] = []

  for (let col = 0; col < allData[0].length; col++) {
    const newRow: string[] = []
    for (let row = 0; row < allData.length; row++) {
      newRow.push(allData[row][col] || '')
    }
    transposed.push(newRow)
  }

  return {
    headers: transposed[0],
    rows: transposed.slice(1),
  }
}

/**
 * Remove colunas vazias
 */
export function removeEmptyColumns(
  headers: string[],
  rows: string[][],
): { headers: string[]; rows: string[][] } {
  const nonEmptyColumns: number[] = []

  headers.forEach((_, colIndex) => {
    const hasData = rows.some((row) => row[colIndex] && String(row[colIndex]).trim() !== '')
    if (hasData) {
      nonEmptyColumns.push(colIndex)
    }
  })

  const newHeaders = nonEmptyColumns.map((i) => headers[i])
  const newRows = rows.map((row) => nonEmptyColumns.map((i) => row[i]))

  return { headers: newHeaders, rows: newRows }
}

/**
 * Ordena tabela por coluna
 */
export function sortByColumn(
  headers: string[],
  rows: string[][],
  columnIndex: number,
  direction: 'asc' | 'desc' = 'asc',
): string[][] {
  const sorted = [...rows].sort((a, b) => {
    const aVal = a[columnIndex] || ''
    const bVal = b[columnIndex] || ''

    const aNum = parseFloat(aVal)
    const bNum = parseFloat(bVal)

    if (!isNaN(aNum) && !isNaN(bNum)) {
      return direction === 'asc' ? aNum - bNum : bNum - aNum
    }

    return direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
  })

  return sorted
}

/**
 * Filtra linhas por valor de coluna
 */
export function filterByColumn(
  rows: string[][],
  columnIndex: number,
  filterValue: string,
): string[][] {
  if (!filterValue.trim()) return rows

  return rows.filter((row) => {
    const cellValue = String(row[columnIndex] || '').toLowerCase()
    return cellValue.includes(filterValue.toLowerCase())
  })
}

/**
 * Calcula estatísticas de uma coluna
 */
export function getColumnStats(
  headers: string[],
  rows: string[][],
  columnIndex: number,
): ColumnStats {
  const columnName = headers[columnIndex]
  const values = rows.map((row) => row[columnIndex] || '')

  const nonEmptyValues = values.filter((v) => v.trim() !== '')
  const uniqueValues = new Set(nonEmptyValues).size
  const emptyCount = values.length - nonEmptyValues.length

  const numericValues = nonEmptyValues.map((v) => parseFloat(v)).filter((n) => !isNaN(n))
  const isNumeric = numericValues.length === nonEmptyValues.length && nonEmptyValues.length > 0

  let type: 'string' | 'number' | 'boolean' | 'mixed' = 'string'
  if (isNumeric) {
    type = 'number'
  } else if (nonEmptyValues.every((v) => v === 'true' || v === 'false')) {
    type = 'boolean'
  } else if (numericValues.length > 0) {
    type = 'mixed'
  }

  const stats: ColumnStats = {
    name: columnName,
    type,
    uniqueValues,
    emptyCount,
  }

  if (isNumeric && numericValues.length > 0) {
    stats.min = Math.min(...numericValues)
    stats.max = Math.max(...numericValues)
    stats.avg = numericValues.reduce((a, b) => a + b, 0) / numericValues.length
  }

  return stats
}

/**
 * Calcula estatísticas de todas as colunas
 */
export function getAllColumnStats(headers: string[], rows: string[][]): ColumnStats[] {
  return headers.map((_, index) => getColumnStats(headers, rows, index))
}

// Funções auxiliares de escape
function escapeHTML(text: string): string {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function escapeLaTeX(text: string): string {
  return String(text)
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/[&%$#_{}]/g, '\\$&')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}')
}
