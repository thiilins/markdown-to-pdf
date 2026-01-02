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
