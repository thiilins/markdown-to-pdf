/**
 * Utilitários para conversão de JSON para TypeScript
 */

/**
 * Converte um objeto JSON para interfaces TypeScript
 */
export function convertJsonToTypeScript(
  obj: any,
  rootName: string = 'Root',
  depth: number = 0,
): string {
  if (depth > 20) {
    // Prevenir recursão infinita
    return '// Profundidade máxima atingida\n'
  }

  const indent = '  '.repeat(depth)
  let result = ''

  if (obj === null) {
    return 'null'
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      return 'any[]'
    }

    // Analisar o primeiro elemento para determinar o tipo
    const firstType = inferType(obj[0], depth + 1)
    return `${firstType}[]`
  }

  if (typeof obj === 'object') {
    const keys = Object.keys(obj)
    if (keys.length === 0) {
      return 'Record<string, never>'
    }

    result += `{\n`

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const value = obj[key]
      const isOptional = value === null || value === undefined

      // Nome da propriedade (com escape se necessário)
      const propertyName = isValidIdentifier(key) ? key : `"${key}"`

      // Tipo do valor
      let valueType = inferType(value, depth + 1)

      // Se for objeto aninhado, criar interface separada
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        const nestedInterfaceName = capitalizeFirst(key)
        valueType = nestedInterfaceName
        // Adicionar interface aninhada depois
      }

      result += `${indent}  ${propertyName}${isOptional ? '?' : ''}: ${valueType}`

      if (i < keys.length - 1) {
        result += ';'
      }
      result += '\n'
    }

    result += `${indent}}`

    // Adicionar interfaces aninhadas
    const nestedInterfaces: string[] = []
    for (const key of keys) {
      const value = obj[key]
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        const nestedName = capitalizeFirst(key)
        const nestedInterface = convertJsonToTypeScript(value, nestedName, depth + 1)
        nestedInterfaces.push(`export interface ${nestedName} ${nestedInterface}\n`)
      } else if (
        Array.isArray(value) &&
        value.length > 0 &&
        typeof value[0] === 'object' &&
        value[0] !== null
      ) {
        const nestedName = capitalizeFirst(key) + 'Item'
        const nestedInterface = convertJsonToTypeScript(value[0], nestedName, depth + 1)
        nestedInterfaces.push(`export interface ${nestedName} ${nestedInterface}\n`)
      }
    }

    if (nestedInterfaces.length > 0) {
      result = nestedInterfaces.join('\n') + '\n' + result
    }

    return result
  }

  return inferType(obj, depth)
}

/**
 * Infere o tipo TypeScript de um valor
 */
function inferType(value: any, depth: number = 0): string {
  if (value === null || value === undefined) {
    return 'null'
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return 'any[]'
    }
    const itemType = inferType(value[0], depth + 1)
    return `${itemType}[]`
  }

  if (typeof value === 'object') {
    return 'object'
  }

  switch (typeof value) {
    case 'string':
      return 'string'
    case 'number':
      return Number.isInteger(value) ? 'number' : 'number'
    case 'boolean':
      return 'boolean'
    default:
      return 'any'
  }
}

/**
 * Verifica se uma string é um identificador válido em TypeScript
 */
function isValidIdentifier(str: string): boolean {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(str)
}

/**
 * Capitaliza a primeira letra de uma string
 */
function capitalizeFirst(str: string): string {
  if (!str) return 'Item'
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/[^a-zA-Z0-9_$]/g, '')
}

/**
 * Converte JSON para interfaces TypeScript completas
 */
export function convertJsonToTypeScriptInterfaces(
  obj: any,
  rootName: string = 'Root',
  useExport: boolean = true,
): string {
  const interfaces = new Map<string, string>()

  function processObject(obj: any, name: string, depth: number = 0): string {
    if (depth > 15) return 'any'

    if (obj === null || obj === undefined) {
      return 'null'
    }

    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        return 'any[]'
      }
      const itemType = processObject(obj[0], name + 'Item', depth + 1)
      return `${itemType}[]`
    }

    if (typeof obj !== 'object') {
      return inferType(obj, depth)
    }

    const keys = Object.keys(obj)
    if (keys.length === 0) {
      return 'Record<string, never>'
    }

    let interfaceBody = '{\n'
    const indent = '  '

    for (const key of keys) {
      const value = obj[key]
      const propertyName = isValidIdentifier(key) ? key : `"${key}"`
      const isOptional = value === null || value === undefined

      let valueType: string
      if (Array.isArray(value)) {
        if (value.length === 0) {
          valueType = 'any[]'
        } else {
          const itemName = capitalizeFirst(key) + 'Item'
          valueType = processObject(value[0], itemName, depth + 1)
          if (!valueType.includes('{')) {
            valueType = `${valueType}[]`
          } else {
            valueType = `${itemName}[]`
          }
        }
      } else if (typeof value === 'object' && value !== null) {
        const nestedName = capitalizeFirst(key)
        valueType = processObject(value, nestedName, depth + 1)
        if (valueType.includes('{')) {
          valueType = nestedName
        }
      } else {
        valueType = inferType(value, depth)
      }

      interfaceBody += `${indent}${indent}${propertyName}${isOptional ? '?' : ''}: ${valueType};\n`
    }

    interfaceBody += `${indent}}`

    if (!interfaces.has(name)) {
      const exportKeyword = useExport ? 'export ' : ''
      interfaces.set(name, `${exportKeyword}interface ${name} ${interfaceBody}\n`)
    }

    return name
  }

  const rootType = processObject(obj, rootName, 0)

  // Coletar todas as interfaces
  const allInterfaces = Array.from(interfaces.values()).reverse()

  // Se a interface raiz não foi adicionada, adicionar
  if (!interfaces.has(rootName)) {
    const exportKeyword = useExport ? 'export ' : ''
    allInterfaces.push(
      `${exportKeyword}interface ${rootName} ${rootType.includes('{') ? rootType : 'any'}\n`,
    )
  }

  const exportKeyword = useExport ? 'export ' : ''
  const rootTypeLine = useExport
    ? `\n// Tipo raiz\n${exportKeyword}type Root = ${rootName};\n`
    : `\n// Tipo raiz\ntype Root = ${rootName};\n`

  return allInterfaces.join('\n') + rootTypeLine
}
