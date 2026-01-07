/**
 * Utilitários para extração de dados de texto
 */

import { safeRegexExec } from '@/lib/security-utils'

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
  errors?: string[]
}

/**
 * Extrai emails de um texto (com proteção ReDoS)
 */
function extractEmails(text: string): { emails: string[]; error?: string } {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  const result = safeRegexExec(text, emailRegex, { timeout: 2000, maxSize: 1 * 1024 * 1024 })

  if (!result.success) {
    return { emails: [], error: result.error }
  }

  return { emails: [...new Set(result.matches || [])] }
}

/**
 * Extrai URLs de um texto (com proteção ReDoS)
 */
function extractUrls(text: string): { urls: string[]; error?: string } {
  const urls: string[] = []
  const errors: string[] = []
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
  const protocolResult = safeRegexExec(text, protocolRegex, {
    timeout: 2000,
    maxSize: 1 * 1024 * 1024,
  })
  if (protocolResult.success && protocolResult.matches) {
    protocolResult.matches.forEach((match) => {
      const cleaned = cleanUrl(match)
      if (cleaned) {
        urls.push(cleaned)
      }
    })
  } else if (protocolResult.error) {
    errors.push(`Erro ao extrair URLs com protocolo: ${protocolResult.error}`)
  }

  // 2. URLs com www.
  const wwwRegex = /www\.[^\s<>"{}|\\^`\[\]()]+/gi
  const wwwResult = safeRegexExec(text, wwwRegex, { timeout: 2000, maxSize: 1 * 1024 * 1024 })
  if (wwwResult.success && wwwResult.matches) {
    wwwResult.matches.forEach((match) => {
      const cleaned = cleanUrl(match)
      if (cleaned) {
        urls.push(cleaned)
      }
    })
  } else if (wwwResult.error) {
    errors.push(`Erro ao extrair URLs com www: ${wwwResult.error}`)
  }

  // 3. Domínios simples (sem www e sem protocolo) - limitado para prevenir ReDoS
  const domainRegex =
    /\b([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,})(?:\/[^\s<>"{}|\\^`\[\]()]*)?/gi
  const domainResult = safeRegexExec(text, domainRegex, { timeout: 3000, maxSize: 1 * 1024 * 1024 })
  if (domainResult.success && domainResult.matches) {
    domainResult.matches.forEach((match) => {
      const cleaned = cleanUrl(match)
      if (cleaned) {
        // Validar TLD
        const parts = cleaned.split('.')
        if (parts.length >= 2) {
          const tld = parts[parts.length - 1]
          if (tld.length >= 2) {
            const commonTlds = ['e', 'ou', 'de', 'da', 'do', 'em', 'para', 'com', 'sem']
            if (!commonTlds.includes(tld.toLowerCase())) {
              urls.push(cleaned)
            }
          }
        }
      }
    })
  } else if (domainResult.error) {
    errors.push(`Erro ao extrair domínios: ${domainResult.error}`)
  }

  // Remover duplicatas e ordenar
  const uniqueUrls = [...new Set(urls)]
    .map((url) => url.trim())
    .filter((url) => url.length > 0)
    .sort()

  return { urls: uniqueUrls, error: errors.length > 0 ? errors.join('; ') : undefined }
}

/**
 * Extrai endereços IP de um texto (com proteção ReDoS)
 */
function extractIps(text: string): { ips: string[]; error?: string } {
  const ipv4Regex =
    /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g
  const result = safeRegexExec(text, ipv4Regex, { timeout: 2000, maxSize: 1 * 1024 * 1024 })

  if (!result.success) {
    return { ips: [], error: result.error }
  }

  return { ips: [...new Set(result.matches || [])] }
}

/**
 * Extrai CPFs de um texto (com proteção ReDoS)
 */
function extractCpfs(text: string): { cpfs: string[]; error?: string } {
  // CPF com ou sem formatação: XXX.XXX.XXX-XX ou XXXXXXXXXXX
  const cpfRegex = /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g
  const result = safeRegexExec(text, cpfRegex, { timeout: 2000, maxSize: 1 * 1024 * 1024 })

  if (!result.success) {
    return { cpfs: [], error: result.error }
  }

  return { cpfs: [...new Set(result.matches || [])] }
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

  const errors: string[] = []

  const emailsResult = options.extractEmails ? extractEmails(text) : { emails: [] }
  const emails = emailsResult.emails
  if (emailsResult.error) errors.push(emailsResult.error)

  const urlsResult = options.extractUrls ? extractUrls(text) : { urls: [] }
  const urls = urlsResult.urls
  if (urlsResult.error) errors.push(urlsResult.error)

  const ipsResult = options.extractIps ? extractIps(text) : { ips: [] }
  const ips = ipsResult.ips
  if (ipsResult.error) errors.push(ipsResult.error)

  const cpfsResult = options.extractCpfs ? extractCpfs(text) : { cpfs: [] }
  const cpfs = cpfsResult.cpfs
  if (cpfsResult.error) errors.push(cpfsResult.error)

  const total = emails.length + urls.length + ips.length + cpfs.length

  return {
    emails,
    urls,
    ips,
    cpfs,
    total,
    errors: errors.length > 0 ? errors : undefined,
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
