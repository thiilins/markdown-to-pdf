/**
 * Utilitários para processamento de texto extraído de HTML
 */

/**
 * Remove emojis do texto usando regex Unicode
 * Suporta emojis Unicode, variações de cor de pele e sequências de emojis
 *
 * @param text - Texto a ser processado
 * @returns Texto sem emojis
 */
export function removeEmojis(text: string): string {
  // Regex para remover emojis Unicode
  // Inclui: emojis básicos, variações de cor de pele, flags, símbolos, etc.
  const emojiRegex =
    /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]/gu
  return text.replace(emojiRegex, '').trim()
}

/**
 * Remove links (URLs) do texto
 * Suporta URLs HTTP/HTTPS, FTP, mailto, e outros protocolos
 *
 * @param text - Texto a ser processado
 * @returns Texto sem links
 */
export function removeLinks(text: string): string {
  // Regex para remover URLs
  // Suporta: http://, https://, ftp://, mailto:, www., e outros protocolos
  const urlRegex =
    /(https?:\/\/[^\s]+|ftp:\/\/[^\s]+|mailto:[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}[^\s]*)/gi
  return text.replace(urlRegex, '').trim()
}

/**
 * Remove espaços extras do texto
 * Remove múltiplos espaços consecutivos e quebras de linha duplicadas
 *
 * @param text - Texto a ser processado
 * @returns Texto sem espaços extras
 */
export function removeExtraSpaces(text: string): string {
  // Remover múltiplos espaços consecutivos (exceto quebras de linha)
  let cleaned = text.replace(/[ \t]+/g, ' ')
  // Remover múltiplas quebras de linha consecutivas (máximo 2)
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n')
  return cleaned
}

/**
 * Remove espaços no início e fim de cada linha
 *
 * @param text - Texto a ser processado
 * @returns Texto com linhas sem espaços nas extremidades
 */
export function trimLines(text: string): string {
  return text
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
}

/**
 * Remove todas as quebras de linha do texto
 *
 * @param text - Texto a ser processado
 * @returns Texto sem quebras de linha
 */
export function removeLineBreaks(text: string): string {
  return text.replace(/\n+/g, ' ').trim()
}

/**
 * Remove tags HTML dentro de elementos <code> e <pre>
 * Isso é útil porque código HTML dentro desses elementos pode aparecer como texto
 *
 * @param doc - Documento DOM a ser processado
 */
export function removeHtmlInCodeElements(doc: Document): void {
  // Encontrar todos os elementos code e pre
  const codeElements = doc.querySelectorAll('code, pre')

  codeElements.forEach((element) => {
    // Obter o texto interno (já sem tags HTML)
    const textContent = element.textContent || (element as HTMLElement).innerText || ''

    // Substituir todo o conteúdo do elemento pelo texto puro
    element.textContent = textContent
  })
}

/**
 * Formata o texto para melhorar a legibilidade
 * Adiciona quebras de linha apropriadas, formata parágrafos e melhora a estrutura geral
 *
 * @param text - Texto a ser formatado
 * @returns Texto formatado e mais legível
 */
export function formatText(text: string): string {
  if (!text.trim()) return text

  let formatted = text

  // Adicionar quebra de linha após pontos finais, exclamação e interrogação (se não houver)
  // Mas apenas se não for um número decimal ou abreviação comum
  formatted = formatted.replace(
    /([.!?])\s+([A-ZÀÁÂÃÉÊÍÓÔÕÚÇ])/g,
    (match, punct, next) => {
      // Verificar se não é um número decimal ou abreviação
      const before = formatted.substring(0, formatted.indexOf(match))
      const lastChar = before.trim().slice(-1)
      if (/\d/.test(lastChar)) return match // É um número, não adicionar quebra
      return `${punct}\n\n${next}`
    },
  )

  // Adicionar quebra de linha após dois pontos seguidos de letra maiúscula
  formatted = formatted.replace(/:\s+([A-ZÀÁÂÃÉÊÍÓÔÕÚÇ][a-zàáâãéêíóôõúç])/g, ':\n\n$1')

  // Formatar listas numeradas e com marcadores
  formatted = formatted.replace(/(\d+[\.\)])\s+/g, '\n$1 ')
  formatted = formatted.replace(/([•\-\*])\s+/g, '\n$1 ')

  // Adicionar quebra de linha antes de padrões que indicam novos parágrafos
  formatted = formatted.replace(/\n{3,}/g, '\n\n') // Normalizar múltiplas quebras

  // Remover espaços extras no início de linhas
  formatted = formatted
    .split('\n')
    .map((line) => line.trim())
    .join('\n')

  // Adicionar quebra de linha após parágrafos longos (mais de 80 caracteres)
  // mas apenas se não houver quebra próxima
  const lines = formatted.split('\n')
  const formattedLines: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.length > 80 && !line.includes('\n')) {
      // Tentar quebrar em pontos naturais
      const sentences = line.split(/([.!?]\s+)/)
      if (sentences.length > 2) {
        formattedLines.push(sentences.join(''))
      } else {
        formattedLines.push(line)
      }
    } else {
      formattedLines.push(line)
    }
  }

  formatted = formattedLines.join('\n')

  // Limpar múltiplas quebras de linha consecutivas (máximo 2)
  formatted = formatted.replace(/\n{3,}/g, '\n\n')

  // Remover espaços extras no início e fim
  return formatted.trim()
}

/**
 * Calcula estatísticas do texto
 *
 * @param text - Texto a ser analisado
 * @returns Objeto com linhas, caracteres e palavras
 */
export function calculateStats(text: string): { lines: number; chars: number; words: number } {
  const lines = text.split('\n').filter((line) => line.trim().length > 0).length
  const chars = text.length
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return { lines, chars, words }
}

