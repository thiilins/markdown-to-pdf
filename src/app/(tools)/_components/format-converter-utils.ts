/**
 * Utilitários para conversão entre formatos de dados
 * Suporta: JSON, XML, YAML, CSV, TOML, TOON
 */

import { safeJsonParse } from '@/lib/security-utils'

export type FormatType = 'json' | 'xml' | 'yaml' | 'csv' | 'toml' | 'toon'

/**
 * Converte JSON para XML
 */
export function jsonToXml(json: string): string {
  const parseResult = safeJsonParse(json)
  if (!parseResult.success) {
    throw new Error(`JSON inválido: ${parseResult.error || 'Erro ao parsear JSON'}`)
  }

  const obj = parseResult.data
  return objectToXml(obj, 'root')
}

function objectToXml(obj: any, rootName: string = 'root'): string {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>\n`

  function buildXml(value: any, indent: number = 1): string {
    const spaces = '  '.repeat(indent)
    let result = ''

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        result += `${spaces}<item index="${index}">\n`
        result += buildXml(item, indent + 1)
        result += `${spaces}</item>\n`
      })
    } else if (value !== null && typeof value === 'object') {
      Object.entries(value).forEach(([key, val]) => {
        const safeKey = key.replace(/[^a-zA-Z0-9_]/g, '_')
        if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
          result += `${spaces}<${safeKey}>\n`
          result += buildXml(val, indent + 1)
          result += `${spaces}</${safeKey}>\n`
        } else if (Array.isArray(val)) {
          val.forEach((item, idx) => {
            result += `${spaces}<${safeKey} index="${idx}">\n`
            result += buildXml(item, indent + 1)
            result += `${spaces}</${safeKey}>\n`
          })
        } else {
          const escapedValue = escapeXml(String(val))
          result += `${spaces}<${safeKey}>${escapedValue}</${safeKey}>\n`
        }
      })
    } else {
      const escapedValue = escapeXml(String(value))
      result += `${spaces}${escapedValue}\n`
    }

    return result
  }

  xml += buildXml(obj, 1)
  xml += `</${rootName}>`
  return xml
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Converte JSON para YAML
 */
export function jsonToYaml(json: string): string {
  const parseResult = safeJsonParse(json)
  if (!parseResult.success) {
    throw new Error(`JSON inválido: ${parseResult.error || 'Erro ao parsear JSON'}`)
  }

  const obj = parseResult.data
  return objectToYaml(obj, 0)
}

function objectToYaml(obj: any, indent: number = 0): string {
  const spaces = '  '.repeat(indent)
  let yaml = ''

  if (Array.isArray(obj)) {
    obj.forEach((item) => {
      yaml += `${spaces}- `
      if (item !== null && typeof item === 'object' && !Array.isArray(item)) {
        yaml += '\n'
        yaml += objectToYaml(item, indent + 1)
      } else if (Array.isArray(item)) {
        yaml += '\n'
        yaml += objectToYaml(item, indent + 1)
      } else {
        yaml += formatYamlValue(item) + '\n'
      }
    })
  } else if (obj !== null && typeof obj === 'object') {
    Object.entries(obj).forEach(([key, value], index, entries) => {
      const isLast = index === entries.length - 1
      yaml += `${spaces}${key}: `

      if (value === null) {
        yaml += 'null\n'
      } else if (typeof value === 'object' && !Array.isArray(value)) {
        yaml += '\n'
        yaml += objectToYaml(value, indent + 1)
      } else if (Array.isArray(value)) {
        yaml += '\n'
        yaml += objectToYaml(value, indent + 1)
      } else {
        yaml += formatYamlValue(value) + '\n'
      }
    })
  } else {
    yaml += formatYamlValue(obj) + '\n'
  }

  return yaml
}

function formatYamlValue(value: any): string {
  if (typeof value === 'string') {
    // Se contém caracteres especiais ou é multi-linha, usar aspas
    if (value.includes('\n') || value.includes(':') || value.includes('#') || value.includes('|')) {
      return `"${value.replace(/"/g, '\\"')}"`
    }
    return value
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false'
  }
  return String(value)
}

/**
 * Converte JSON para CSV
 */
export function jsonToCsv(json: string): string {
  const parseResult = safeJsonParse(json)
  if (!parseResult.success) {
    throw new Error(`JSON inválido: ${parseResult.error || 'Erro ao parsear JSON'}`)
  }

  const data = parseResult.data

  // Se for array de objetos
  if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
    const headers = Object.keys(data[0])
    const csvRows = [headers.join(',')]

    data.forEach((row) => {
      const values = headers.map((header) => {
        const value = row[header]
        if (value === null || value === undefined) {
          return ''
        }
        // Escapar vírgulas e aspas
        const stringValue = String(value).replace(/"/g, '""')
        return `"${stringValue}"`
      })
      csvRows.push(values.join(','))
    })

    return csvRows.join('\n')
  }

  // Se for objeto único, criar CSV com chave-valor
  if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
    const csvRows = ['key,value']
    Object.entries(data).forEach(([key, value]) => {
      const stringValue = String(value).replace(/"/g, '""')
      csvRows.push(`"${key}","${stringValue}"`)
    })
    return csvRows.join('\n')
  }

  throw new Error('JSON deve ser um objeto ou array de objetos para conversão CSV')
}

/**
 * Converte XML para JSON
 */
export function xmlToJson(xml: string): string {
  // Implementação simplificada - para produção, usar uma biblioteca como xml2js
  try {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xml, 'text/xml')
    const errors = xmlDoc.getElementsByTagName('parsererror')
    if (errors.length > 0) {
      throw new Error('XML inválido')
    }

    const obj = xmlToObject(xmlDoc.documentElement)
    return JSON.stringify(obj, null, 2)
  } catch (error) {
    throw new Error('Erro ao converter XML para JSON')
  }
}

function xmlToObject(node: Element): any {
  const obj: any = {}
  const children = Array.from(node.children)

  if (children.length === 0) {
    return node.textContent || ''
  }

  children.forEach((child) => {
    const key = child.tagName
    const value = xmlToObject(child)

    if (obj[key]) {
      if (!Array.isArray(obj[key])) {
        obj[key] = [obj[key]]
      }
      obj[key].push(value)
    } else {
      obj[key] = value
    }
  })

  return obj
}

/**
 * Converte YAML para JSON (requer biblioteca externa - implementação básica)
 */
export function yamlToJson(yaml: string): string {
  // Implementação básica - para produção, usar js-yaml
  throw new Error('Conversão YAML → JSON requer biblioteca js-yaml. Use uma ferramenta externa.')
}

/**
 * Converte CSV para JSON
 */
export function csvToJson(csv: string): string {
  const lines = csv.trim().split('\n')
  if (lines.length === 0) {
    return '[]'
  }

  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''))
  const rows = lines.slice(1).map((line) => {
    const values = parseCsvLine(line)
    const obj: any = {}
    headers.forEach((header, index) => {
      obj[header] = values[index] || ''
    })
    return obj
  })

  return JSON.stringify(rows, null, 2)
}

function parseCsvLine(line: string): string[] {
  const values: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"'
        i++ // Pular próxima aspas
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  values.push(current.trim())

  return values.map((v) => v.replace(/^"|"$/g, ''))
}

/**
 * Converte JSON para TOML
 */
export function jsonToToml(json: string): string {
  const parseResult = safeJsonParse(json)
  if (!parseResult.success) {
    throw new Error(`JSON inválido: ${parseResult.error || 'Erro ao parsear JSON'}`)
  }

  const obj = parseResult.data
  return objectToToml(obj, '')
}

function objectToToml(obj: any, prefix: string = ''): string {
  let toml = ''
  const keys = Object.keys(obj)

  keys.forEach((key, index) => {
    const value = obj[key]
    const fullKey = prefix ? `${prefix}.${escapeTomlKey(key)}` : escapeTomlKey(key)

    if (value === null) {
      toml += `${fullKey} = null\n`
    } else if (typeof value === 'string') {
      toml += `${fullKey} = ${formatTomlString(value)}\n`
    } else if (typeof value === 'number') {
      toml += `${fullKey} = ${value}\n`
    } else if (typeof value === 'boolean') {
      toml += `${fullKey} = ${value}\n`
    } else if (Array.isArray(value)) {
      // Verificar se é array de objetos (array of tables)
      if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
        value.forEach((item) => {
          toml += `\n[[${fullKey}]]\n`
          toml += objectToToml(item, '')
        })
      } else {
        // Array simples
        const arrayStr = value.map((v) => formatTomlValue(v)).join(', ')
        toml += `${fullKey} = [${arrayStr}]\n`
      }
    } else if (typeof value === 'object') {
      // Tabela
      toml += `\n[${fullKey}]\n`
      toml += objectToToml(value, '')
    }

    // Adicionar linha em branco entre tabelas principais
    if (
      index < keys.length - 1 &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      prefix === ''
    ) {
      toml += '\n'
    }
  })

  return toml
}

function escapeTomlKey(key: string): string {
  // Chaves que precisam de aspas
  if (/^[a-zA-Z0-9_-]+$/.test(key)) {
    return key
  }
  return `"${key.replace(/"/g, '\\"')}"`
}

function formatTomlString(str: string): string {
  // Se contém quebras de linha ou caracteres especiais, usar aspas triplas
  if (str.includes('\n') || str.includes('"') || str.includes('\\')) {
    return `"""${str.replace(/\\/g, '\\\\').replace(/"""/g, '\\"""')}"""`
  }
  // Se contém espaços ou caracteres especiais, usar aspas simples
  if (str.includes(' ') || str.includes('#') || str.includes('[') || str.includes(']')) {
    return `"${str.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
  }
  return str
}

function formatTomlValue(value: any): string {
  if (typeof value === 'string') {
    return formatTomlString(value)
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false'
  }
  if (value === null) {
    return 'null'
  }
  return String(value)
}

/**
 * Converte TOML para JSON (implementação básica)
 */
export function tomlToJson(toml: string): string {
  // Implementação básica de parsing TOML
  // Para produção, usar biblioteca como @iarna/toml ou toml
  try {
    const obj: any = {}
    const lines = toml.split('\n')
    let currentTable: string[] = []
    let currentArrayTable: string | null = null
    let inArrayTable = false

    for (const line of lines) {
      const trimmed = line.trim()

      // Ignorar comentários e linhas vazias
      if (!trimmed || trimmed.startsWith('#')) {
        continue
      }

      // Tabela: [table] ou [table.subtable]
      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        const tableName = trimmed.slice(1, -1)
        if (tableName.startsWith('[') && tableName.endsWith(']')) {
          // Array of tables: [[array-of-tables]]
          currentArrayTable = tableName.slice(1, -1)
          inArrayTable = true
          currentTable = []
        } else {
          // Tabela normal
          currentTable = tableName.split('.').map((k) => k.trim().replace(/^"|"$/g, ''))
          currentArrayTable = null
          inArrayTable = false
        }
        continue
      }

      // Key-value pair
      const equalIndex = trimmed.indexOf('=')
      if (equalIndex > 0) {
        const key = trimmed.slice(0, equalIndex).trim().replace(/^"|"$/g, '')
        const valueStr = trimmed.slice(equalIndex + 1).trim()
        const value = parseTomlValue(valueStr)

        if (inArrayTable && currentArrayTable) {
          // Array of tables
          const tablePath = currentArrayTable.split('.').map((k) => k.trim().replace(/^"|"$/g, ''))
          let target = obj
          for (const part of tablePath) {
            if (!target[part]) {
              target[part] = []
            }
            if (!Array.isArray(target[part])) {
              target[part] = [target[part]]
            }
            target = target[part]
          }
          if (target.length === 0 || !target[target.length - 1][key]) {
            if (target.length === 0 || Object.keys(target[target.length - 1]).length > 0) {
              target.push({})
            }
          }
          target[target.length - 1][key] = value
        } else if (currentTable.length > 0) {
          // Tabela aninhada
          let target = obj
          for (const part of currentTable) {
            if (!target[part]) {
              target[part] = {}
            }
            target = target[part]
          }
          target[key] = value
        } else {
          // Raiz
          obj[key] = value
        }
      }
    }

    return JSON.stringify(obj, null, 2)
  } catch (error) {
    throw new Error(
      `Erro ao converter TOML para JSON: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

function parseTomlValue(valueStr: string): any {
  const trimmed = valueStr.trim()

  // String com aspas triplas
  if (trimmed.startsWith('"""') && trimmed.endsWith('"""')) {
    return trimmed.slice(3, -3).replace(/\\"""/g, '"""').replace(/\\\\/g, '\\')
  }

  // String com aspas duplas
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\')
  }

  // String com aspas simples
  if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
    return trimmed.slice(1, -1)
  }

  // Array
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    const content = trimmed.slice(1, -1).trim()
    if (!content) {
      return []
    }
    const items = content.split(',').map((item) => parseTomlValue(item.trim()))
    return items
  }

  // Boolean
  if (trimmed === 'true') return true
  if (trimmed === 'false') return false

  // Null
  if (trimmed === 'null') return null

  // Number
  if (/^-?\d+$/.test(trimmed)) {
    return parseInt(trimmed, 10)
  }
  if (/^-?\d+\.\d+$/.test(trimmed)) {
    return parseFloat(trimmed)
  }

  // String sem aspas (fallback)
  return trimmed
}

/**
 * Converte JSON para TOON (Token-Oriented Object Notation)
 * TOON é um formato compacto otimizado para LLMs
 */
export function jsonToToon(json: string): string {
  const parseResult = safeJsonParse(json)
  if (!parseResult.success) {
    throw new Error(`JSON inválido: ${parseResult.error || 'Erro ao parsear JSON'}`)
  }

  const obj = parseResult.data
  return objectToToon(obj, 0)
}

function objectToToon(obj: any, indent: number = 0): string {
  const spaces = '  '.repeat(indent)

  if (obj === null) {
    return 'null'
  }

  if (typeof obj === 'string') {
    // Strings simples sem espaços podem ser sem aspas
    if (/^[a-zA-Z0-9_-]+$/.test(obj)) {
      return obj
    }
    // Strings com espaços ou caracteres especiais precisam de aspas
    return `"${obj.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
  }

  if (typeof obj === 'number' || typeof obj === 'boolean') {
    return String(obj)
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      return '[]'
    }
    const items = obj.map((item) => {
      const itemStr = objectToToon(item, indent + 1)
      // Se o item é objeto ou array complexo, adicionar indentação
      if ((typeof item === 'object' && item !== null) || Array.isArray(item)) {
        const lines = itemStr.split('\n')
        return lines.map((line, idx) => (idx === 0 ? line : spaces + '  ' + line)).join('\n')
      }
      return itemStr
    })
    return '[' + items.join(', ') + ']'
  }

  if (typeof obj === 'object') {
    const entries = Object.entries(obj)
    if (entries.length === 0) {
      return '{}'
    }

    let toon = ''
    entries.forEach(([key, value], index) => {
      const isLast = index === entries.length - 1
      const keyStr = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key) ? key : `"${key}"`
      const valueStr = objectToToon(value, indent + 1)

      // Verificar se o valor é complexo (objeto ou array de objetos)
      const isComplexValue =
        (typeof value === 'object' && value !== null && !Array.isArray(value)) ||
        (Array.isArray(value) &&
          value.length > 0 &&
          (typeof value[0] === 'object' || Array.isArray(value[0])))

      if (isComplexValue) {
        toon += `${spaces}${keyStr}:\n`
        const lines = valueStr.split('\n')
        lines.forEach((line, lineIdx) => {
          toon += `${spaces}  ${line}`
          if (lineIdx < lines.length - 1) {
            toon += '\n'
          }
        })
      } else {
        toon += `${spaces}${keyStr}: ${valueStr}`
      }

      if (!isLast) {
        toon += '\n'
      }
    })
    return toon
  }

  return String(obj)
}

/**
 * Converte TOON para JSON (implementação básica)
 */
export function toonToJson(toon: string): string {
  try {
    // TOON é muito similar a JSON, mas mais permissivo
    // Vamos fazer parsing básico convertendo para JSON válido primeiro
    let jsonStr = toon.trim()

    // Converter chaves sem aspas para chaves com aspas
    jsonStr = jsonStr.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')

    // Converter valores sem aspas (strings simples) para strings com aspas
    // Mas apenas se não forem números, booleanos ou null
    jsonStr = jsonStr.replace(/:\s*([a-zA-Z_][a-zA-Z0-9_-]*)([,}\s])/g, (match, value, suffix) => {
      if (value === 'true' || value === 'false' || value === 'null') {
        return match
      }
      if (/^\d+$/.test(value) || /^\d+\.\d+$/.test(value)) {
        return match
      }
      return `: "${value}"${suffix}`
    })

    // Tentar parsear como JSON
    const parseResult = safeJsonParse(jsonStr)
    if (!parseResult.success) {
      // Se falhar, tentar uma abordagem mais manual
      throw new Error('Erro ao parsear TOON')
    }

    return JSON.stringify(parseResult.data, null, 2)
  } catch (error) {
    throw new Error(
      `Erro ao converter TOON para JSON: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

/**
 * Converte entre formatos
 */
export function convertFormat(
  content: string,
  fromFormat: FormatType,
  toFormat: FormatType,
): string {
  if (fromFormat === toFormat) {
    return content
  }

  // Converter para JSON primeiro (formato intermediário)
  let json: string
  if (fromFormat === 'json') {
    json = content
  } else if (fromFormat === 'xml') {
    json = xmlToJson(content)
  } else if (fromFormat === 'yaml') {
    json = yamlToJson(content)
  } else if (fromFormat === 'csv') {
    json = csvToJson(content)
  } else if (fromFormat === 'toml') {
    json = tomlToJson(content)
  } else if (fromFormat === 'toon') {
    json = toonToJson(content)
  } else {
    throw new Error(`Formato de origem não suportado: ${fromFormat}`)
  }

  // Converter de JSON para formato destino
  if (toFormat === 'json') {
    const parseResult = safeJsonParse(json)
    if (!parseResult.success) {
      throw new Error('Erro ao processar JSON intermediário')
    }
    return JSON.stringify(parseResult.data, null, 2)
  } else if (toFormat === 'xml') {
    return jsonToXml(json)
  } else if (toFormat === 'yaml') {
    return jsonToYaml(json)
  } else if (toFormat === 'csv') {
    return jsonToCsv(json)
  } else if (toFormat === 'toml') {
    return jsonToToml(json)
  } else if (toFormat === 'toon') {
    return jsonToToon(json)
  } else {
    throw new Error(`Formato de destino não suportado: ${toFormat}`)
  }
}
