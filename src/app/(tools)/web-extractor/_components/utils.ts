import TurndownService from 'turndown'

/**
 * Converte string HTML para Markdown formatado.
 * Aceita um título opcional para ser inserido como H1 no topo.
 */
export const convertHtmlToMarkdown = (html: string, title?: string): string => {
  if (!html) return ''

  const turndownService = new TurndownService({
    headingStyle: 'atx', // Usa # para títulos
    codeBlockStyle: 'fenced', // Usa ``` para código
    emDelimiter: '*', // Usa * para itálico
    bulletListMarker: '-', // Usa - para listas
    hr: '---', // Separador horizontal
  })

  // Regra para manter imagens limpas e com quebra de linha
  turndownService.addRule('images', {
    filter: 'img',
    replacement: function (content, node) {
      const img = node as HTMLImageElement
      const alt = img.getAttribute('alt') || ''
      const src = img.getAttribute('src') || ''
      const titleAttr = img.getAttribute('title') || ''
      const titlePart = titleAttr ? ' "' + titleAttr + '"' : ''

      // Retorna formato markdown padrão de imagem com quebras de linha
      return src ? `\n\n![${alt}](${src}${titlePart})\n\n` : ''
    },
  })

  // Regra para links (garante que links relativos não quebrem se sobrarem)
  turndownService.addRule('links', {
    filter: 'a',
    replacement: function (content, node) {
      const a = node as HTMLAnchorElement
      const href = a.getAttribute('href') || ''
      // Se não tiver href ou for âncora interna, retorna só o texto
      if (!href || href.startsWith('#')) return content
      return `[${content}](${href})`
    },
  })

  // Regra para tabelas HTML → Markdown GFM (GitHub Flavored Markdown)
  turndownService.addRule('tables', {
    filter: 'table',
    replacement: function (content, node) {
      const table = node as HTMLTableElement
      const rows: string[][] = []
      let hasHeader = false

      // Processa thead (cabeçalho)
      const thead = table.querySelector('thead')
      if (thead) {
        hasHeader = true
        const headerRows = thead.querySelectorAll('tr')
        headerRows.forEach((tr) => {
          const cells: string[] = []
          tr.querySelectorAll('th, td').forEach((cell) => {
            cells.push(cell.textContent?.trim() || '')
          })
          if (cells.length > 0) rows.push(cells)
        })
      }

      // Processa tbody (corpo)
      const tbody = table.querySelector('tbody') || table
      const bodyRows = tbody.querySelectorAll('tr')
      bodyRows.forEach((tr, idx) => {
        // Se não tem thead, primeira linha vira header
        if (!hasHeader && idx === 0) {
          hasHeader = true
          const cells: string[] = []
          tr.querySelectorAll('th, td').forEach((cell) => {
            cells.push(cell.textContent?.trim() || '')
          })
          if (cells.length > 0) rows.push(cells)
        } else {
          const cells: string[] = []
          tr.querySelectorAll('td, th').forEach((cell) => {
            cells.push(cell.textContent?.trim() || '')
          })
          if (cells.length > 0) rows.push(cells)
        }
      })

      // Se não tem linhas, retorna vazio
      if (rows.length === 0) return '\n'

      // Garante que todas as linhas tenham o mesmo número de colunas
      const maxCols = Math.max(...rows.map((r) => r.length))
      const normalizedRows = rows.map((row) => {
        while (row.length < maxCols) row.push('')
        return row
      })

      // Constrói a tabela Markdown GFM
      let markdown = '\n\n'

      // Header (primeira linha)
      markdown += '| ' + normalizedRows[0].join(' | ') + ' |\n'

      // Separador (alinhamento centralizado)
      markdown += '| ' + normalizedRows[0].map(() => '---').join(' | ') + ' |\n'

      // Corpo (demais linhas)
      for (let i = 1; i < normalizedRows.length; i++) {
        markdown += '| ' + normalizedRows[i].join(' | ') + ' |\n'
      }

      markdown += '\n'
      return markdown
    },
  })

  // Remove scripts, styles e iframes por segurança
  turndownService.remove(['script', 'style', 'iframe', 'noscript'])

  let markdown = turndownService.turndown(html)

  // INJEÇÃO DO TÍTULO
  // Se o título foi fornecido, adiciona como H1 no topo
  if (title) {
    markdown = `# ${title}\n\n${markdown}`
  }

  return markdown
}
