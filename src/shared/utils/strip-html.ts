export const stripHTML = (html: string): string => {
  if (typeof window !== 'undefined') {
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')
      return doc.body.textContent || ''
    } catch (e) {
      return html.replace(/<[^>]*>?/gm, '')
    }
  } else {
    return html
      .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, '') // Remove scripts
      .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gim, '') // Remove estilos
      .replace(/<[^>]*>?/gm, '') // Remove tags
      .replace(/&nbsp;/g, ' ') // Converte entidades básicas
      .trim()
  }
}

export const hasHTMLTags = (html: string) => {
  const regexTags = /<[^>]+>/gi
  const tagsEncontradas = html.match(regexTags) || []
  const temTags = tagsEncontradas.length > 0

  return {
    contemHTML: temTags,
    tags: tagsEncontradas,
    quantidade: tagsEncontradas.length,
  }
}

export const stripParagraphs = (html: string): string => {
  return html.replace(/<p\b[^>]*>/gi, '').replace(/<\/p>/gi, '')
}
export const validateCleanHtml = (html: HeaderFooterConfig): HeaderFooterConfig => {
  const header = html.header.left || ''
  const footer = html.footer.left || ''
  const resultHeader = stripParagraphs(header)
  const resultFooter = stripParagraphs(footer)
  const cleanerHeader = String(resultHeader).trim().length > 0 ? resultHeader : ''
  const cleanerFooter = String(resultFooter).trim().length > 0 ? resultFooter : ''
  return {
    header: { ...html.header, left: cleanerHeader },
    footer: { ...html.footer, left: cleanerFooter },
  }
}
