/**
 * Utilitários de Segurança
 * Funções para prevenir vulnerabilidades comuns (XSS, DoS, etc.)
 */

/**
 * Parse seguro de JSON com validação e limites
 */
export function safeJsonParse<T = any>(
  json: string,
  options?: { maxSize?: number },
): { success: boolean; data?: T; error?: string } {
  if (!json || typeof json !== 'string') {
    return { success: false, error: 'JSON inválido: entrada vazia ou não é uma string' }
  }

  // Validar tamanho máximo (prevenir DoS)
  const MAX_JSON_SIZE = options?.maxSize || 10 * 1024 * 1024 // 10MB padrão
  if (json.length > MAX_JSON_SIZE) {
    return {
      success: false,
      error: `JSON muito grande. Máximo: ${Math.round(MAX_JSON_SIZE / 1024 / 1024)}MB`,
    }
  }

  try {
    const data = JSON.parse(json) as T
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao parsear JSON',
    }
  }
}

/**
 * Sanitiza HTML para prevenir XSS
 */
export function sanitizeHtml(html: string, options?: { allowScripts?: boolean }): string {
  if (!html || typeof html !== 'string') return ''

  // Importação dinâmica do DOMPurify
  const DOMPurify = require('isomorphic-dompurify')

  const config: any = {
    ALLOWED_TAGS: [
      'p',
      'br',
      'strong',
      'em',
      'u',
      'b',
      'i',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'ul',
      'ol',
      'li',
      'a',
      'img',
      'code',
      'pre',
      'blockquote',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
      'div',
      'span',
      'hr',
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'style'],
    ALLOW_DATA_ATTR: false,
    KEEP_CONTENT: true,
  }

  if (!options?.allowScripts) {
    config.FORBID_TAGS = ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button']
    config.FORBID_ATTR = ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur']
  }

  return DOMPurify.sanitize(html, config)
}

/**
 * Valida e decodifica Base64 com proteções de segurança
 */
export function safeDecodeBase64(base64: string): {
  success: boolean
  data?: string
  error?: string
} {
  if (!base64 || typeof base64 !== 'string') {
    return { success: false, error: 'Base64 inválido: entrada vazia ou não é uma string' }
  }

  // Validar tamanho máximo
  const MAX_BASE64_SIZE = 10 * 1024 * 1024 // 10MB
  if (base64.length > MAX_BASE64_SIZE) {
    return {
      success: false,
      error: `Base64 muito grande. Máximo: ${Math.round(MAX_BASE64_SIZE / 1024 / 1024)}MB`,
    }
  }

  try {
    const decoded = decodeURIComponent(escape(atob(base64)))

    // Validar se não contém scripts
    if (
      decoded.includes('<script') ||
      decoded.includes('javascript:') ||
      decoded.includes('data:text/html')
    ) {
      return { success: false, error: 'Conteúdo potencialmente perigoso detectado (scripts)' }
    }

    // Validar event handlers
    if (/on\w+\s*=/i.test(decoded)) {
      return {
        success: false,
        error: 'Conteúdo potencialmente perigoso detectado (event handlers)',
      }
    }

    return { success: true, data: decoded }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao decodificar Base64',
    }
  }
}

/**
 * Executa regex com timeout para prevenir ReDoS
 */
export function safeRegexExec(
  text: string,
  regex: RegExp,
  options?: { timeout?: number; maxSize?: number },
): { success: boolean; matches?: string[]; error?: string } {
  if (!text || typeof text !== 'string') {
    return { success: false, error: 'Texto inválido' }
  }

  const timeout = options?.timeout || 2000 // 2 segundos padrão
  const maxSize = options?.maxSize || 1 * 1024 * 1024 // 1MB padrão

  // Validar tamanho máximo
  if (text.length > maxSize) {
    return {
      success: false,
      error: `Texto muito grande para processamento. Máximo: ${Math.round(maxSize / 1024 / 1024)}MB`,
    }
  }

  const start = Date.now()
  const matches: string[] = []

  try {
    // Limitar número de iterações para prevenir ReDoS
    let iterations = 0
    const MAX_ITERATIONS = 10000

    let match
    while ((match = regex.exec(text)) !== null) {
      // Verificar timeout
      if (Date.now() - start > timeout) {
        return { success: false, error: 'Timeout: regex demorou muito para executar' }
      }

      // Verificar número de iterações
      if (++iterations > MAX_ITERATIONS) {
        return { success: false, error: 'Muitas iterações: regex pode estar causando ReDoS' }
      }

      matches.push(match[0])

      // Prevenir loop infinito em regex sem flag global
      if (!regex.global) break
    }

    return { success: true, matches }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao executar regex',
    }
  }
}
