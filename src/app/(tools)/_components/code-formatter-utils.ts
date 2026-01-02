/**
 * Utilitários para formatação e minificação de código
 */

import * as prettier from 'prettier/standalone'
import * as prettierPluginHtml from 'prettier/plugins/html'
import * as prettierPluginCss from 'prettier/plugins/postcss'
import * as prettierPluginBabel from 'prettier/plugins/babel'
import * as prettierPluginEstree from 'prettier/plugins/estree'
import { format as formatSql, formatDialect, postgresql, mysql } from 'sql-formatter'

export type CodeType = 'html' | 'css' | 'javascript' | 'sql'
export type SqlDialect = 'postgresql' | 'mysql' | 'standard'

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Formata código usando Prettier ou SQL Formatter
 */
export async function formatCode(
  code: string,
  codeType: CodeType,
  sqlDialect: SqlDialect = 'postgresql',
): Promise<string> {
  if (!code.trim()) return ''

  try {
    switch (codeType) {
      case 'html':
        return await prettier.format(code, {
          parser: 'html',
          plugins: [prettierPluginHtml],
          printWidth: 100,
          tabWidth: 2,
          useTabs: false,
        })

      case 'css':
        return await prettier.format(code, {
          parser: 'css',
          plugins: [prettierPluginCss],
          printWidth: 100,
          tabWidth: 2,
          useTabs: false,
        })

      case 'javascript':
        return await prettier.format(code, {
          parser: 'babel',
          plugins: [prettierPluginBabel, prettierPluginEstree],
          printWidth: 100,
          tabWidth: 2,
          useTabs: false,
          semi: true,
          singleQuote: true,
          trailingComma: 'es5',
        })

      case 'sql':
        if (sqlDialect === 'postgresql') {
          return formatDialect(code, { dialect: postgresql })
        } else if (sqlDialect === 'mysql') {
          return formatDialect(code, { dialect: mysql })
        } else {
          return formatSql(code, { language: 'sql' })
        }

      default:
        return code
    }
  } catch (error) {
    console.error(`Erro ao formatar ${codeType}:`, error)
    throw error
  }
}

/**
 * Minifica código removendo espaços, quebras de linha e comentários
 */
export function minifyCode(code: string, codeType: CodeType): string {
  if (!code.trim()) return ''

  try {
    switch (codeType) {
      case 'html':
        return code
          .replace(/<!--[\s\S]*?-->/g, '')
          .replace(/\s+/g, ' ')
          .replace(/>\s+</g, '><')
          .trim()

      case 'css':
        return code
          .replace(/\/\*[\s\S]*?\*\//g, '')
          .replace(/\s+/g, ' ')
          .replace(/;\s*}/g, '}')
          .replace(/\s*{\s*/g, '{')
          .replace(/\s*}\s*/g, '}')
          .replace(/\s*:\s*/g, ':')
          .replace(/\s*;\s*/g, ';')
          .trim()

      case 'javascript':
        return code
          .replace(/\/\*[\s\S]*?\*\//g, '')
          .replace(/\/\/.*$/gm, '')
          .replace(/\s+/g, ' ')
          .replace(/\s*{\s*/g, '{')
          .replace(/\s*}\s*/g, '}')
          .replace(/\s*\(\s*/g, '(')
          .replace(/\s*\)\s*/g, ')')
          .replace(/\s*,\s*/g, ',')
          .replace(/\s*;\s*/g, ';')
          .trim()

      case 'sql':
        return code
          .replace(/--.*$/gm, '')
          .replace(/\/\*[\s\S]*?\*\//g, '')
          .replace(/\s+/g, ' ')
          .trim()

      default:
        return code
    }
  } catch (error) {
    console.error(`Erro ao minificar ${codeType}:`, error)
    return code
  }
}

/**
 * Valida código e retorna erros e avisos
 */
export function validateCode(code: string, codeType: CodeType): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (!code.trim()) {
    return { isValid: true, errors: [], warnings: [] }
  }

  try {
    switch (codeType) {
      case 'html':
        const openTags = (code.match(/<[^/!][^>]*>/g) || []).length
        const closeTags = (code.match(/<\/[^>]+>/g) || []).length
        const selfClosingTags = (code.match(/<[^>]+\/>/g) || []).length

        if (openTags > closeTags + selfClosingTags) {
          const diff = openTags - (closeTags + selfClosingTags)
          if (diff > 0) {
            warnings.push(`Possível tag não fechada: ${diff} tag(s) podem estar abertas`)
          }
        }

        if (!code.match(/<!DOCTYPE\s+html/i)) {
          warnings.push('DOCTYPE não encontrado. Recomenda-se incluir <!DOCTYPE html>')
        }

        if (!code.match(/<html/i)) {
          warnings.push('Tag <html> não encontrada')
        }
        if (!code.match(/<head/i)) {
          warnings.push('Tag <head> não encontrada')
        }
        if (!code.match(/<body/i)) {
          warnings.push('Tag <body> não encontrada')
        }
        break

      case 'css':
        const openBraces = (code.match(/{/g) || []).length
        const closeBraces = (code.match(/}/g) || []).length

        if (openBraces !== closeBraces) {
          errors.push(`Chaves desbalanceadas: ${openBraces} abertas, ${closeBraces} fechadas`)
        }

        const selectorPattern = /[^{}]+{[\s]*}/g
        const emptyRules = code.match(selectorPattern)
        if (emptyRules && emptyRules.length > 0) {
          warnings.push(`${emptyRules.length} regra(s) CSS vazia(s) encontrada(s)`)
        }
        break

      case 'javascript':
        const jsOpenBraces = (code.match(/{/g) || []).length
        const jsCloseBraces = (code.match(/}/g) || []).length
        const jsOpenParens = (code.match(/\(/g) || []).length
        const jsCloseParens = (code.match(/\)/g) || []).length
        const jsOpenBrackets = (code.match(/\[/g) || []).length
        const jsCloseBrackets = (code.match(/\]/g) || []).length

        if (jsOpenBraces !== jsCloseBraces) {
          errors.push(`Chaves desbalanceadas: ${jsOpenBraces} abertas, ${jsCloseBraces} fechadas`)
        }
        if (jsOpenParens !== jsCloseParens) {
          errors.push(`Parênteses desbalanceados: ${jsOpenParens} abertos, ${jsCloseParens} fechados`)
        }
        if (jsOpenBrackets !== jsCloseBrackets) {
          errors.push(`Colchetes desbalanceados: ${jsOpenBrackets} abertos, ${jsCloseBrackets} fechados`)
        }

        const varUsage = (code.match(/\bvar\s+/g) || []).length
        if (varUsage > 0) {
          warnings.push(`Uso de 'var' encontrado (${varUsage}x). Considere usar 'let' ou 'const'`)
        }
        break

      case 'sql':
        const sqlOpenParens = (code.match(/\(/g) || []).length
        const sqlCloseParens = (code.match(/\)/g) || []).length

        if (sqlOpenParens !== sqlCloseParens) {
          errors.push(`Parênteses desbalanceados: ${sqlOpenParens} abertos, ${sqlCloseParens} fechados`)
        }

        const hasSelect = code.match(/\bSELECT\b/i)
        const hasFrom = code.match(/\bFROM\b/i)
        if (hasSelect && !hasFrom) {
          warnings.push('SELECT encontrado sem FROM. Verifique a sintaxe da consulta')
        }

        if (code.match(/\bSELECT\s+\*/i) && !code.match(/\bWHERE\b/i)) {
          warnings.push(
            'SELECT * sem WHERE pode retornar muitos resultados. Considere especificar colunas',
          )
        }
        break
    }
  } catch (error) {
    errors.push('Erro ao validar código')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

