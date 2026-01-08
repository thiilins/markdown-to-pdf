/**
 * Utilitário para validação de links em Markdown
 */

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')

export function extractLinks(markdown: string): LinkInfo[] {
  const links: LinkInfo[] = []
  const lines = markdown.split('\n')
  const markdownLinkRegex = /!?\[([^\]]+)\]\(([^)]+)\)/g
  const directUrlRegex = /<(https?:\/\/[^>]+)>/g

  lines.forEach((line, lineIndex) => {
    let match
    while ((match = markdownLinkRegex.exec(line)) !== null) {
      const url = match[2].trim()
      if (url.startsWith('mailto:')) continue
      links.push({
        text: match[1],
        url,
        line: lineIndex + 1,
        column: match.index,
        type: getUrlType(url),
        isValid: null,
      })
    }
    while ((match = directUrlRegex.exec(line)) !== null) {
      const url = match[1].trim()
      links.push({
        text: url,
        url,
        line: lineIndex + 1,
        column: match.index,
        type: 'external',
        isValid: null,
      })
    }
  })
  return links
}

function getUrlType(url: string): 'internal' | 'external' | 'anchor' {
  if (url.startsWith('#')) return 'anchor'
  if (/^https?:\/\//.test(url)) return 'external'
  return 'internal'
}

export async function validateAllLinks(
  links: LinkInfo[],
  markdown: string,
  onProgress?: (validated: number, total: number) => void,
): Promise<LinkInfo[]> {
  if (links.length === 0) return []

  const headerRegex = /^#{1,6}\s+(.+)$/gm
  const availableIds = new Set<string>()
  let headerMatch
  while ((headerMatch = headerRegex.exec(markdown)) !== null) {
    availableIds.add(slugify(headerMatch[1]))
  }

  const results: LinkInfo[] = [...links]
  let validatedCount = 0

  const externalIndices: number[] = []
  const externalUrls: string[] = []

  // Passo 1: Validação Local (Âncoras e Internos)
  results.forEach((link, index) => {
    if (link.type === 'anchor') {
      const anchorId = link.url.replace('#', '')
      const isValid = availableIds.has(anchorId)
      results[index] = { ...link, isValid, error: isValid ? undefined : 'Âncora não encontrada' }
      validatedCount++
    } else if (link.type === 'internal') {
      results[index] = { ...link, isValid: true }
      validatedCount++
    } else {
      externalIndices.push(index)
      externalUrls.push(link.url)
    }
  })

  onProgress?.(validatedCount, links.length)

  // Passo 2: Validação Externa via Server Action
  if (externalUrls.length > 0) {
    try {
      const { validateMultipleLinks } = await import('@/app/actions/validate-links')

      const uniqueUrls = Array.from(new Set(externalUrls))
      const serverResults = await validateMultipleLinks(uniqueUrls)
      const resultMap = new Map(serverResults.map((r) => [r.url, r]))

      // Mapeia os resultados de volta para os índices originais
      externalIndices.forEach((resultIndex) => {
        const url = results[resultIndex].url
        const validation = resultMap.get(url)

        if (validation) {
          results[resultIndex] = {
            ...results[resultIndex],
            isValid: validation.isValid,
            error: validation.error,
          }
        }
        validatedCount++
        onProgress?.(validatedCount, links.length)
      })
    } catch (error: any) {
      externalIndices.forEach((idx) => {
        results[idx].isValid = false
        results[idx].error = 'Erro no servidor de validação'
      })
    }
  }

  return results
}
