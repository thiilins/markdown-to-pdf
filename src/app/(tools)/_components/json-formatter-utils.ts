/**
 * Utilitários para formatação e validação de JSON
 */

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

  try {
    JSON.parse(json)
  } catch (error: any) {
    errors.push(error.message || 'JSON inválido')

    // Tentar identificar o problema
    if (error.message.includes('Unexpected token')) {
      errors.push('Token inesperado encontrado. Verifique vírgulas, colchetes e chaves.')
    }
    if (error.message.includes('Unexpected end')) {
      errors.push('JSON incompleto. Verifique se todas as chaves e colchetes estão fechados.')
    }
    if (error.message.includes('Expected')) {
      errors.push('Formato incorreto. Verifique a sintaxe JSON.')
    }
  }

  // Verificações adicionais
  try {
    const parsed = JSON.parse(json)

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
  } catch {
    // Já tratado acima
  }

  return {
    isValid: errors.length === 0,
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

  try {
    const parsed = JSON.parse(json)
    return JSON.stringify(parsed, null, 2)
  } catch (error) {
    throw new Error('JSON inválido. Não é possível formatar.')
  }
}

/**
 * Minifica JSON removendo espaços e quebras de linha
 */
export function minifyJson(json: string): string {
  if (!json.trim()) return ''

  try {
    const parsed = JSON.parse(json)
    return JSON.stringify(parsed)
  } catch (error) {
    throw new Error('JSON inválido. Não é possível minificar.')
  }
}

