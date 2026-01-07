/**
 * Utilitários para formatação e validação de JSON
 */

import { safeJsonParse } from '@/lib/security-utils'

export interface JsonValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Valida JSON e retorna erros e avisos
 */
export function validateJson(json: string): JsonValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (!json.trim()) {
    return { isValid: true, errors: [], warnings: [] }
  }

  const parseResult = safeJsonParse(json)
  if (!parseResult.success) {
    errors.push(parseResult.error || 'JSON inválido')

    // Tentar identificar o problema
    if (parseResult.error?.includes('Unexpected token')) {
      errors.push('Token inesperado encontrado. Verifique vírgulas, colchetes e chaves.')
    }
    if (parseResult.error?.includes('Unexpected end')) {
      errors.push('JSON incompleto. Verifique se todas as chaves e colchetes estão fechados.')
    }
    if (parseResult.error?.includes('Expected')) {
      errors.push('Formato incorreto. Verifique a sintaxe JSON.')
    }

    return {
      isValid: false,
      errors,
      warnings,
    }
  }

  // Verificações adicionais
  const parsed = parseResult.data

  // Verificar se é um objeto ou array válido
  if (typeof parsed !== 'object' || parsed === null) {
    warnings.push('JSON válido, mas não é um objeto ou array')
  }

  // Verificar profundidade (aviso se muito profundo)
  const depth = getDepth(parsed)
  if (depth > 10) {
    warnings.push(`JSON muito profundo (${depth} níveis). Pode ser difícil de ler.`)
  }

  // Verificar tamanho
  const size = JSON.stringify(parsed).length
  if (size > 1000000) {
    warnings.push('JSON muito grande. Pode causar problemas de performance.')
  }

  return {
    isValid: true,
    errors,
    warnings,
  }
}

/**
 * Calcula a profundidade de um objeto JSON
 */
function getDepth(obj: any, currentDepth = 0): number {
  if (typeof obj !== 'object' || obj === null) {
    return currentDepth
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) return currentDepth
    return Math.max(...obj.map((item) => getDepth(item, currentDepth + 1)))
  }

  const keys = Object.keys(obj)
  if (keys.length === 0) return currentDepth

  return Math.max(...keys.map((key) => getDepth(obj[key], currentDepth + 1)))
}

/**
 * Formata JSON com indentação
 */
export function formatJson(json: string): string {
  if (!json.trim()) return ''

  const parseResult = safeJsonParse(json)
  if (!parseResult.success) {
    throw new Error(parseResult.error || 'JSON inválido. Não é possível formatar.')
  }

  return JSON.stringify(parseResult.data, null, 2)
}

/**
 * Minifica JSON removendo espaços e quebras de linha
 */
export function minifyJson(json: string): string {
  if (!json.trim()) return ''

  const parseResult = safeJsonParse(json)
  if (!parseResult.success) {
    throw new Error(parseResult.error || 'JSON inválido. Não é possível minificar.')
  }

  return JSON.stringify(parseResult.data)
}

/**
 * JSON Fixer Inteligente - Corrige erros comuns em JSONs
 * - Aspas simples → aspas duplas
 * - Vírgulas sobrando (antes de } ou ])
 * - Falta de aspas em chaves
 * - Literais em caixa alta (TRUE, FALSE, NULL) → true, false, null
 */
export function fixJson(json: string): { fixed: string; changes: string[] } {
  if (!json.trim()) return { fixed: json, changes: [] }

  const changes: string[] = []
  let fixed = json

  // 1. Corrigir literais em caixa alta (TRUE, FALSE, NULL)
  const upperCaseLiterals = [
    { pattern: /\bTRUE\b/g, replacement: 'true', desc: 'TRUE → true' },
    { pattern: /\bFALSE\b/g, replacement: 'false', desc: 'FALSE → false' },
    { pattern: /\bNULL\b/g, replacement: 'null', desc: 'NULL → null' },
  ]

  upperCaseLiterals.forEach(({ pattern, replacement, desc }) => {
    if (pattern.test(fixed)) {
      fixed = fixed.replace(pattern, replacement)
      changes.push(desc)
    }
  })

  // 2. Corrigir aspas simples em strings (mas não em strings já com aspas duplas)
  // Usar regex para encontrar strings com aspas simples que não são parte de uma string com aspas duplas
  const singleQuotePattern = /'([^'\\]|\\.)*'/g
  const singleQuoteMatches = fixed.match(singleQuotePattern)
  if (singleQuoteMatches) {
    fixed = fixed.replace(singleQuotePattern, (match) => {
      // Substituir aspas simples por duplas, escapando aspas duplas internas
      return `"${match.slice(1, -1).replace(/"/g, '\\"')}"`
    })
    changes.push('Aspas simples → aspas duplas')
  }

  // 3. Remover vírgulas sobrando (antes de } ou ])
  const trailingCommaPattern = /,\s*([}\]])/g
  if (trailingCommaPattern.test(fixed)) {
    fixed = fixed.replace(trailingCommaPattern, '$1')
    changes.push('Vírgulas sobrando removidas')
  }

  // 4. Adicionar aspas em chaves sem aspas (mas apenas se não estiverem dentro de uma string)
  // Este é mais complexo, vamos fazer uma tentativa cuidadosa
  const unquotedKeyPattern = /([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g
  if (unquotedKeyPattern.test(fixed)) {
    fixed = fixed.replace(unquotedKeyPattern, '$1"$2":')
    changes.push('Aspas adicionadas em chaves sem aspas')
  }

  // Tentar parsear o resultado corrigido
  const parseResult = safeJsonParse(fixed)
  if (parseResult.success) {
    // Se conseguiu parsear, formatar novamente para garantir consistência
    fixed = JSON.stringify(parseResult.data, null, 2)
  }

  return { fixed, changes }
}
