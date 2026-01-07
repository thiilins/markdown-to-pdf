/**
 * Utilitários para conversão entre formatos de dados
 * Suporta: JSON, XML, YAML, CSV
 */

import { safeJsonParse } from '@/lib/security-utils'

export type FormatType = 'json' | 'xml' | 'yaml' | 'csv'

/**
 * Converte JSON para XML
 */
export function jsonToXml(json: string): string {
  const parseResult = safeJsonParse(json)
  if (!parseResult.success) {
    throw new Error('JSON inválido')
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
    throw new Error('JSON inválido')
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
    throw new Error('JSON inválido')
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
  } else {
    throw new Error(`Formato de destino não suportado: ${toFormat}`)
  }
}

