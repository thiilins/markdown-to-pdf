export const markdownToHtml = (markdown: string): string => {
  let html = markdown

  // Escapa HTML básico para evitar injeção
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  // Blocos de código inline
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')

  // Cabeçalhos (ordem do maior para o menor é importante)
  html = html.replace(/^###\s+(.*)$/gim, '<h3>$1</h3>')
  html = html.replace(/^##\s+(.*)$/gim, '<h2>$1</h2>')
  html = html.replace(/^#\s+(.*)$/gim, '<h1>$1</h1>')

  // Negrito
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

  // Itálico (evita conflito com **)
  html = html.replace(/(^|[^*])\*(?!\*)(.+?)\*(?!\*)/g, '$1<em>$2</em>')

  // Parágrafos
  html = html
    .split(/\n{2,}/)
    .map((block) => {
      if (/^<h[1-3]>/.test(block)) return block
      return `<p>${block.replace(/\n/g, '<br>')}</p>`
    })
    .join('')

  return html
}
