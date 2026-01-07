/**
 * Utilitários para detecção e processamento de diffs (git diff format)
 */

export interface DiffLine {
  type: 'added' | 'removed' | 'context' | 'header'
  content: string
  lineNumber?: number
  originalLineNumber?: number
}

export interface ParsedDiff {
  isDiff: boolean
  lines: DiffLine[]
  originalCode?: string
}

/**
 * Detecta se o código é um diff (git diff format)
 */
export function isDiffCode(code: string): boolean {
  if (!code.trim()) return false

  const lines = code.split('\n')
  // Verifica padrões comuns de diff:
  // - Linhas começando com +++, ---, @@
  // - Linhas começando com + ou - (mas não apenas espaços)
  const hasDiffMarkers =
    lines.some(
      (line) => line.startsWith('+++') || line.startsWith('---') || line.startsWith('@@'),
    ) ||
    lines.some((line) => {
      const trimmed = line.trim()
      return (trimmed.startsWith('+') || trimmed.startsWith('-')) && trimmed.length > 1
    })

  return hasDiffMarkers
}

/**
 * Parseia um diff e retorna linhas classificadas
 */
export function parseDiff(code: string): ParsedDiff {
  if (!isDiffCode(code)) {
    return { isDiff: false, lines: [] }
  }

  const lines = code.split('\n')
  const parsedLines: DiffLine[] = []
  let currentLineNumber = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    // Headers do diff (+++, ---, @@)
    if (line.startsWith('+++') || line.startsWith('---')) {
      parsedLines.push({
        type: 'header',
        content: line,
      })
      continue
    }

    // Hunk headers (@@ ... @@)
    if (line.startsWith('@@')) {
      parsedLines.push({
        type: 'header',
        content: line,
      })
      // Reset line number no início de cada hunk
      currentLineNumber = 0
      continue
    }

    // Linhas adicionadas
    if (trimmed.startsWith('+') && trimmed.length > 1) {
      currentLineNumber++
      parsedLines.push({
        type: 'added',
        content: line.substring(1), // Remove o +
        lineNumber: currentLineNumber,
      })
      continue
    }

    // Linhas removidas
    if (trimmed.startsWith('-') && trimmed.length > 1) {
      parsedLines.push({
        type: 'removed',
        content: line.substring(1), // Remove o -
        originalLineNumber: currentLineNumber,
      })
      continue
    }

    // Linhas de contexto (sem modificação)
    if (trimmed.startsWith(' ') || trimmed === '') {
      currentLineNumber++
      parsedLines.push({
        type: 'context',
        content: line.startsWith(' ') ? line.substring(1) : line,
        lineNumber: currentLineNumber,
      })
      continue
    }

    // Linha não classificada (mantém como contexto)
    currentLineNumber++
    parsedLines.push({
      type: 'context',
      content: line,
      lineNumber: currentLineNumber,
    })
  }

  return {
    isDiff: true,
    lines: parsedLines,
  }
}

/**
 * Extrai apenas o código (sem marcadores de diff) para syntax highlighting
 */
export function extractCodeFromDiff(parsedDiff: ParsedDiff): string {
  if (!parsedDiff.isDiff) return ''

  return parsedDiff.lines
    .filter((line) => line.type !== 'header')
    .map((line) => line.content)
    .join('\n')
}
