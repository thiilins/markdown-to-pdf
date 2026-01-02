/**
 * Utilitários para extração de dados de texto
 */

export interface ExtractionOptions {
  extractEmails: boolean
  extractUrls: boolean
  extractIps: boolean
  extractCpfs: boolean
}

export interface ExtractionResult {
  emails: string[]
  urls: string[]
  ips: string[]
  cpfs: string[]
  total: number
}

/**
 * Extrai emails de um texto
 */
function extractEmails(text: string): string[] {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  const matches = text.match(emailRegex) || []
  return [...new Set(matches)]
}

/**
 * Extrai URLs de um texto
 */
function extractUrls(text: string): string[] {
  const urls: string[] = []
  const processedIndices = new Set<number>()

  // Função auxiliar para limpar URL
  const cleanUrl = (url: string): string | null => {
    if (!url || url.includes('@')) return null

    // Remover pontuação do final
    let cleaned = url.replace(/[.,;!?)\]}]+$/, '').trim()

    // Remover palavras comuns do final
    cleaned = cleaned.replace(/\s+(e|ou|de|da|do|em|para|com|sem|https?|http?)$/i, '').trim()

    if (cleaned.length < 4) return null
    if (!cleaned.includes('.')) return null
    if (cleaned.startsWith('-') || cleaned.endsWith('-')) return null

    return cleaned
  }

  // 1. URLs completas com protocolo (https:// ou http://)
  const protocolRegex = /https?:\/\/[^\s<>"{}|\\^`\[\]()]+/gi
  let match
  while ((match = protocolRegex.exec(text)) !== null) {
    const cleaned = cleanUrl(match[0])
    if (cleaned) {
      urls.push(cleaned)
      // Marcar índices processados
      for (let i = match.index; i < match.index + match[0].length; i++) {
        processedIndices.add(i)
      }
    }
  }

  // 2. URLs com www.
  const wwwRegex = /www\.[^\s<>"{}|\\^`\[\]()]+/gi
  while ((match = wwwRegex.exec(text)) !== null) {
    // Verificar se já foi processado
    if (processedIndices.has(match.index)) continue

    const cleaned = cleanUrl(match[0])
    if (cleaned) {
      urls.push(cleaned)
      for (let i = match.index; i < match.index + match[0].length; i++) {
        processedIndices.add(i)
      }
    }
  }

  // 3. Domínios simples (sem www e sem protocolo)
  // Usar regex que para em espaços e pontuação
  const domainRegex = /\b([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,})(?:\/[^\s<>"{}|\\^`\[\]()]*)?/gi

  while ((match = domainRegex.exec(text)) !== null) {
    // Verificar se já foi processado
    if (processedIndices.has(match.index)) continue

    // Verificar contexto antes
    const beforeIndex = Math.max(0, match.index - 20)
    const before = text.substring(beforeIndex, match.index)

    // Se tem @ antes, é parte de email
    if (before.includes('@')) continue

    // Verificar contexto depois para encontrar onde a URL realmente termina
    const afterIndex = match.index + match[0].length
    const after = text.substring(afterIndex, Math.min(text.length, afterIndex + 30))

    // Encontrar onde a URL realmente termina (antes de espaço ou palavra comum)
    let urlEnd = match[0].length
    const spaceIndex = after.indexOf(' ')
    if (spaceIndex !== -1) {
      // Verificar se a palavra após o espaço é comum
      const nextWord = after.substring(spaceIndex + 1).split(/\s+/)[0]?.toLowerCase().replace(/[.,;!?)\]}]+$/, '')
      const commonWords = ['e', 'ou', 'de', 'da', 'do', 'em', 'para', 'com', 'sem', 'https', 'http']
      if (nextWord && commonWords.includes(nextWord)) {
        // A URL termina no espaço
        urlEnd = spaceIndex
      }
    }

    let urlText = match[0].substring(0, urlEnd)
    let cleaned = cleanUrl(urlText)
    if (!cleaned) continue

    // Validar TLD
    const parts = cleaned.split('.')
    if (parts.length < 2) continue
    const tld = parts[parts.length - 1]
    if (tld.length < 2) continue

    // Verificar se o TLD não é uma palavra comum
    const commonTlds = ['e', 'ou', 'de', 'da', 'do', 'em', 'para', 'com', 'sem']
    if (commonTlds.includes(tld.toLowerCase())) continue

    urls.push(cleaned)

    // Marcar como processado
    for (let i = match.index; i < match.index + urlEnd; i++) {
      processedIndices.add(i)
    }
  }

  // Remover duplicatas e ordenar
  return [...new Set(urls)]
    .map((url) => url.trim())
    .filter((url) => url.length > 0)
    .sort()
}

/**
 * Extrai endereços IP de um texto
 */
function extractIps(text: string): string[] {
  const ipv4Regex = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g
  const matches = text.match(ipv4Regex) || []
  return [...new Set(matches)]
}

/**
 * Extrai CPFs de um texto
 */
function extractCpfs(text: string): string[] {
  // CPF com ou sem formatação: XXX.XXX.XXX-XX ou XXXXXXXXXXX
  const cpfRegex = /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g
  const matches = text.match(cpfRegex) || []
  return [...new Set(matches)]
}

/**
 * Extrai dados de um texto baseado nas opções fornecidas
 */
export function extractData(text: string, options: ExtractionOptions): ExtractionResult {
  if (!text.trim()) {
    return {
      emails: [],
      urls: [],
      ips: [],
      cpfs: [],
      total: 0,
    }
  }

  const emails = options.extractEmails ? extractEmails(text) : []
  const urls = options.extractUrls ? extractUrls(text) : []
  const ips = options.extractIps ? extractIps(text) : []
  const cpfs = options.extractCpfs ? extractCpfs(text) : []

  const total = emails.length + urls.length + ips.length + cpfs.length

  return {
    emails,
    urls,
    ips,
    cpfs,
    total,
  }
}

/**
 * Formata resultado como CSV
 */
export function formatAsCsv(result: ExtractionResult): string {
  const rows: string[] = []

  if (result.emails.length > 0) {
    rows.push('Tipo,Valor')
    result.emails.forEach((email) => rows.push(`Email,${email}`))
  }

  if (result.urls.length > 0) {
    if (rows.length > 0) rows.push('')
    rows.push('Tipo,Valor')
    result.urls.forEach((url) => rows.push(`URL,${url}`))
  }

  if (result.ips.length > 0) {
    if (rows.length > 0) rows.push('')
    rows.push('Tipo,Valor')
    result.ips.forEach((ip) => rows.push(`IP,${ip}`))
  }

  if (result.cpfs.length > 0) {
    if (rows.length > 0) rows.push('')
    rows.push('Tipo,Valor')
    result.cpfs.forEach((cpf) => rows.push(`CPF,${cpf}`))
  }

  return rows.join('\n')
}

/**
 * Formata resultado como lista
 */
export function formatAsList(result: ExtractionResult): string {
  const items: string[] = []

  if (result.emails.length > 0) {
    items.push('=== EMAILS ===')
    result.emails.forEach((email) => items.push(email))
    items.push('')
  }

  if (result.urls.length > 0) {
    items.push('=== URLs ===')
    result.urls.forEach((url) => items.push(url))
    items.push('')
  }

  if (result.ips.length > 0) {
    items.push('=== IPs ===')
    result.ips.forEach((ip) => items.push(ip))
    items.push('')
  }

  if (result.cpfs.length > 0) {
    items.push('=== CPFs ===')
    result.cpfs.forEach((cpf) => items.push(cpf))
    items.push('')
  }

  return items.join('\n').trim()
}

