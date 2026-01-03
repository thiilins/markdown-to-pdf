/**
 * Utilitários para decodificação de JWT
 */

import { safeJsonParse } from '@/lib/security-utils'

export interface JwtParts {
  header: Record<string, any>
  payload: Record<string, any>
  signature: string
  isValid: boolean
  error?: string
}

/**
 * Decodifica um token JWT
 */
export function decodeJwt(token: string): JwtParts {
  if (!token || !token.trim()) {
    return {
      header: {},
      payload: {},
      signature: '',
      isValid: false,
      error: 'Token vazio',
    }
  }

  // Remover espaços
  const cleanToken = token.trim()

  // Validar tamanho máximo do token (prevenir DoS)
  const MAX_TOKEN_SIZE = 64 * 1024 // 64KB
  if (cleanToken.length > MAX_TOKEN_SIZE) {
    return {
      header: {},
      payload: {},
      signature: '',
      isValid: false,
      error: 'Token JWT muito grande. Máximo: 64KB',
    }
  }

  // JWT tem 3 partes separadas por ponto
  const parts = cleanToken.split('.')
  if (parts.length !== 3) {
    return {
      header: {},
      payload: {},
      signature: '',
      isValid: false,
      error: 'Token JWT inválido. Deve ter 3 partes separadas por ponto.',
    }
  }

  try {
    // Decodificar header (Base64URL)
    const headerJson = base64UrlDecode(parts[0])
    const headerResult = safeJsonParse<Record<string, any>>(headerJson, { maxSize: 1024 })
    if (!headerResult.success) {
      return {
        header: {},
        payload: {},
        signature: '',
        isValid: false,
        error: `Erro ao decodificar header: ${headerResult.error}`,
      }
    }

    // Decodificar payload (Base64URL)
    const payloadJson = base64UrlDecode(parts[1])
    const payloadResult = safeJsonParse<Record<string, any>>(payloadJson, { maxSize: 64 * 1024 })
    if (!payloadResult.success) {
      return {
        header: headerResult.data || {},
        payload: {},
        signature: '',
        isValid: false,
        error: `Erro ao decodificar payload: ${payloadResult.error}`,
      }
    }

    // Signature (não decodificamos, apenas retornamos)
    const signature = parts[2]

    return {
      header: headerResult.data || {},
      payload: payloadResult.data || {},
      signature,
      isValid: true,
    }
  } catch (error: any) {
    return {
      header: {},
      payload: {},
      signature: '',
      isValid: false,
      error: error?.message || 'Erro ao decodificar token',
    }
  }
}

/**
 * Decodifica Base64URL (usado em JWT)
 */
function base64UrlDecode(str: string): string {
  // Adicionar padding se necessário
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  while (base64.length % 4) {
    base64 += '='
  }

  try {
    return decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    )
  } catch {
    throw new Error('Erro ao decodificar Base64URL')
  }
}

/**
 * Formata JSON com indentação
 */
export function formatJson(obj: Record<string, any>): string {
  return JSON.stringify(obj, null, 2)
}

