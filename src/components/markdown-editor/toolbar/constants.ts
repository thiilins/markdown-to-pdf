export const TABLE = `
| Coluna 1 | Coluna 2 | Coluna 3 |
|----------|----------|----------|
| Linha 1  | Dados    | Dados    |
| Linha 2  | Dados    | Dados    |
`
export const CODE_BLOCK = `
 \`\`\`language
código aqui
\`\`\`
`

export const CHECKBOX = '- [ ] '
export const HORIZONTAL_RULE = '---\n'
export const PAGE_BREAK = '\n<div class="page-break"></div>\n\n'
export const LINK = ['[', '](url)', 'texto do link']
export const IMAGE = ['![', '](url)', 'texto alternativo']
export const BLOCKQUOTE = '> '
export const ORDERED_LIST = '1. '
export const UNORDERED_LIST = '- '
export const BOLD = ['**', '**', 'texto em negrito']
export const ITALIC = ['*', '*', 'texto em itálico']
export const STRIKETHROUGH = ['~~', '~~', 'texto riscado']
export const INLINE_CODE = ['`', '`', 'código']

// Callouts/Admonitions (GitHub Flavored)
export const CALLOUT_NOTE = `> [!NOTE]
> Informação importante aqui.
`
export const CALLOUT_TIP = `> [!TIP]
> Dica útil aqui.
`
export const CALLOUT_IMPORTANT = `> [!IMPORTANT]
> Informação importante aqui.
`
export const CALLOUT_WARNING = `> [!WARNING]
> Aviso aqui.
`
export const CALLOUT_CAUTION = `> [!CAUTION]
> Cuidado aqui.
`

// Função para gerar tabela dinâmica
export const generateTable = (rows: number, cols: number): string => {
  const header = `| ${Array.from({ length: cols }, (_, i) => `Coluna ${i + 1}`).join(' | ')} |`
  const separator = `|${Array.from({ length: cols }, () => '----------').join('|')}|`
  const tableRows = Array.from({ length: rows }, (_, i) => {
    return `| ${Array.from({ length: cols }, () => 'Dados').join(' | ')} |`
  })
  return [header, separator, ...tableRows].join('\n') + '\n'
}
