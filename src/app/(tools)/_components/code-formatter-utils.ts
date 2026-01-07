'use client'
/**
 * Utilitários para formatação e minificação de código
 */

import type { Plugin } from 'prettier'
import { format } from 'prettier/standalone'
import { formatDialect, format as formatSql, mysql, postgresql } from 'sql-formatter'

// Cache de plugins carregados dinamicamente para evitar problemas de minificação no Turbopack
const pluginCache: Record<string, Plugin | any> = {}

// Função auxiliar para carregar plugins de forma mais segura
async function loadPlugin(modulePath: string, cacheKey: string): Promise<Plugin> {
  if (pluginCache[cacheKey]) {
    return pluginCache[cacheKey]
  }

  try {
    // Usar import dinâmico com tratamento de erro mais robusto
    // No Turbopack, precisa usar strings literais para análise estática
    let module: any
    try {
      // Usar eval para permitir import dinâmico com variável (necessário para Turbopack)
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      module = await Function(`return import("${modulePath}")`)()
    } catch (importError) {
      // Tentar com caminho alternativo se disponível
      console.warn(`Tentativa de import falhou para ${modulePath}, tentando alternativa...`)
      throw importError
    }

    // Tentar diferentes formas de acessar o plugin
    let plugin = module.default
    if (!plugin && typeof module === 'object') {
      // Se default não existir, tentar pegar a primeira exportação
      const keys = Object.keys(module)
      if (keys.length > 0) {
        plugin = module[keys[0]]
      }
    }
    if (!plugin) {
      plugin = module
    }

    if (!plugin || (typeof plugin !== 'object' && typeof plugin !== 'function')) {
      throw new Error(`Plugin inválido em ${modulePath}`)
    }

    pluginCache[cacheKey] = plugin
    return plugin
  } catch (error: any) {
    console.error(`Erro ao carregar plugin ${modulePath}:`, error)
    // Limpar cache em caso de erro para permitir nova tentativa
    delete pluginCache[cacheKey]
    throw new Error(`Falha ao carregar plugin: ${modulePath}. ${error?.message || String(error)}`)
  }
}

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
        if (!pluginCache.html) {
          const htmlModule = await import('prettier/plugins/html')
          pluginCache.html = htmlModule.default
        }
        return await format(code, {
          parser: 'html',
          plugins: [pluginCache.html],
          printWidth: 100,
          tabWidth: 2,
          useTabs: false,
        })

      case 'css':
        if (!pluginCache.postcss) {
          const postcssModule = await import('prettier/plugins/postcss')
          pluginCache.postcss = postcssModule.default
        }
        return await format(code, {
          parser: 'css',
          plugins: [pluginCache.postcss],
          printWidth: 100,
          tabWidth: 2,
          useTabs: false,
        })

      case 'javascript':
        try {
          // Carregar plugins de forma mais robusta
          const babelPlugin = await loadPlugin('prettier/plugins/babel', 'babel')
          const estreePlugin = await loadPlugin('prettier/plugins/estree', 'estree')

          return await format(code, {
            parser: 'babel',
            plugins: [babelPlugin, estreePlugin],
            printWidth: 100,
            tabWidth: 2,
            useTabs: false,
            semi: true,
            singleQuote: true,
            trailingComma: 'es5',
          })
        } catch (error: any) {
          // Se houver erro, tentar recarregar os plugins
          console.warn('Erro ao formatar JavaScript, tentando recarregar plugins:', error)
          delete pluginCache.babel
          delete pluginCache.estree

          // Aguardar um pouco antes de tentar novamente
          await new Promise((resolve) => setTimeout(resolve, 100))

          const babelPlugin = await loadPlugin('prettier/plugins/babel', 'babel')
          const estreePlugin = await loadPlugin('prettier/plugins/estree', 'estree')

          return await format(code, {
            parser: 'babel',
            plugins: [babelPlugin, estreePlugin],
            printWidth: 100,
            tabWidth: 2,
            useTabs: false,
            semi: true,
            singleQuote: true,
            trailingComma: 'es5',
          })
        }

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
          errors.push(
            `Parênteses desbalanceados: ${jsOpenParens} abertos, ${jsCloseParens} fechados`,
          )
        }
        if (jsOpenBrackets !== jsCloseBrackets) {
          errors.push(
            `Colchetes desbalanceados: ${jsOpenBrackets} abertos, ${jsCloseBrackets} fechados`,
          )
        }

        const varUsage = (code.match(/\bvar\s+/g) || []).length
        if (varUsage > 0) {
          warnings.push(`Uso de 'var' encontrado (${varUsage}x). Considere usar 'let' ou 'const'`)
        }
        break

      case 'sql':
        // Validação de parênteses
        const sqlOpenParens = (code.match(/\(/g) || []).length
        const sqlCloseParens = (code.match(/\)/g) || []).length

        if (sqlOpenParens !== sqlCloseParens) {
          errors.push(
            `Parênteses desbalanceados: ${sqlOpenParens} abertos, ${sqlCloseParens} fechados`,
          )
        }

        // Validação de vírgulas duplicadas ou sobrando
        const trailingCommas = code.match(/,\s*,/g)
        if (trailingCommas) {
          errors.push(`Vírgulas duplicadas encontradas (${trailingCommas.length} ocorrência(s))`)
        }

        const commaBeforeFrom = code.match(/,\s*FROM\b/i)
        if (commaBeforeFrom) {
          errors.push('Vírgula antes de FROM encontrada. Remova a vírgula extra.')
        }

        // Validação de SELECT
        const hasSelect = code.match(/\bSELECT\b/i)
        const hasFrom = code.match(/\bFROM\b/i)

        if (hasSelect && !hasFrom) {
          warnings.push('SELECT encontrado sem FROM. Verifique a sintaxe da consulta')
        }

        // Validação de SELECT *
        if (code.match(/\bSELECT\s+\*/i) && !code.match(/\bWHERE\b/i)) {
          warnings.push(
            'SELECT * sem WHERE pode retornar muitos resultados. Considere especificar colunas',
          )
        }

        // Validação de JOIN sem ON
        const hasJoin = code.match(/\b(INNER|LEFT|RIGHT|FULL)?\s*JOIN\b/i)
        const hasOn = code.match(/\bON\b/i)
        if (hasJoin && !hasOn) {
          errors.push('JOIN encontrado sem cláusula ON. JOINs requerem condição ON')
        }

        // Validação de GROUP BY sem agregação
        const hasGroupBy = code.match(/\bGROUP\s+BY\b/i)
        const hasAggregation = code.match(/\b(COUNT|SUM|AVG|MAX|MIN)\s*\(/i)
        if (hasGroupBy && !hasAggregation && hasSelect) {
          warnings.push(
            'GROUP BY encontrado sem funções de agregação. Verifique se é necessário',
          )
        }

        // Validação de HAVING sem GROUP BY
        const hasHaving = code.match(/\bHAVING\b/i)
        if (hasHaving && !hasGroupBy) {
          errors.push('HAVING encontrado sem GROUP BY. HAVING requer GROUP BY')
        }

        // Validação de ORDER BY sem SELECT
        const hasOrderBy = code.match(/\bORDER\s+BY\b/i)
        if (hasOrderBy && !hasSelect) {
          warnings.push('ORDER BY encontrado sem SELECT. Verifique a sintaxe')
        }

        // Validação de aspas não fechadas em strings
        const singleQuotes = (code.match(/'/g) || []).length
        if (singleQuotes % 2 !== 0) {
          errors.push('Aspas simples não fechadas encontradas')
        }

        // Validação de chaves desbalanceadas (para blocos PL/SQL)
        const sqlOpenBraces = (code.match(/{/g) || []).length
        const sqlCloseBraces = (code.match(/}/g) || []).length
        if (sqlOpenBraces !== sqlCloseBraces) {
          warnings.push(`Chaves desbalanceadas: ${sqlOpenBraces} abertas, ${sqlCloseBraces} fechadas`)
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
