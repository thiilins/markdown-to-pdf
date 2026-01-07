/**
 * Utilitários para extração de JSON Path
 */

/**
 * Calcula o caminho JSON (JSONPath) para uma posição específica no texto JSON
 * Exemplo: data.users[0].profile.name
 */
export function getJsonPathAtPosition(
  jsonText: string,
  line: number,
  column: number,
): string | null {
  try {
    const parsed = JSON.parse(jsonText)
    const lines = jsonText.split('\n')

    // Encontrar a linha atual e calcular a posição relativa
    let currentLine = 0
    let charCount = 0

    for (let i = 0; i < lines.length && i < line; i++) {
      charCount += lines[i].length + 1 // +1 para o \n
    }

    charCount += column

    // Tentar encontrar a chave mais próxima
    const path = findPathAtChar(parsed, jsonText, charCount)
    return path
  } catch {
    return null
  }
}

/**
 * Encontra o caminho JSON baseado na posição do caractere
 */
function findPathAtChar(obj: any, jsonText: string, charPosition: number): string | null {
  const path: string[] = []

  try {
    // Usar uma abordagem mais simples: encontrar a chave mais próxima
    const beforeCursor = jsonText.substring(0, charPosition)

    // Procurar por padrões de chaves JSON antes do cursor
    const keyMatches = [...beforeCursor.matchAll(/"([^"]+)":/g)]

    if (keyMatches.length === 0) {
      return null
    }

    // Pegar a última chave encontrada antes do cursor
    const lastMatch = keyMatches[keyMatches.length - 1]
    const keyName = lastMatch[1]

    // Construir o caminho navegando pelo objeto
    const pathResult = findKeyPath(obj, keyName, [])

    if (pathResult) {
      return formatJsonPath(pathResult)
    }

    return null
  } catch {
    return null
  }
}

/**
 * Encontra o caminho até uma chave específica no objeto
 */
function findKeyPath(
  obj: any,
  targetKey: string,
  currentPath: (string | number)[],
): (string | number)[] | null {
  if (obj === null || typeof obj !== 'object') {
    return null
  }

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      const newPath = [...currentPath, i]
      const result = findKeyPath(obj[i], targetKey, newPath)
      if (result) return result
    }
  } else {
    for (const [key, value] of Object.entries(obj)) {
      const newPath = [...currentPath, key]

      if (key === targetKey) {
        return newPath
      }

      const result = findKeyPath(value, targetKey, newPath)
      if (result) return result
    }
  }

  return null
}

/**
 * Formata o caminho como string (ex: data.users[0].profile.name)
 */
export function formatJsonPath(path: (string | number)[]): string {
  if (path.length === 0) return ''

  let result = String(path[0])

  for (let i = 1; i < path.length; i++) {
    if (typeof path[i] === 'number') {
      result += `[${path[i]}]`
    } else {
      result += `.${path[i]}`
    }
  }

  return result
}

/**
 * Versão melhorada: encontra o JSON Path baseado na seleção do editor
 */
export function getJsonPathFromSelection(
  jsonText: string,
  selectedText: string,
  selectionStart: number,
): string | null {
  try {
    const parsed = JSON.parse(jsonText)

    // Se há texto selecionado, tentar encontrar a chave correspondente
    if (selectedText.trim()) {
      // Remover aspas e espaços
      const cleanSelection = selectedText.replace(/^["']|["']$/g, '').trim()

      // Procurar a chave no objeto
      const path = findKeyPath(parsed, cleanSelection, [])
      if (path) {
        return formatJsonPath(path)
      }
    }

    // Encontrar a chave mais próxima antes do cursor
    const textBeforeCursor = jsonText.substring(0, selectionStart)

    // Procurar por padrões de chaves JSON antes do cursor
    // Padrão: "chave": ou "chave": valor
    const keyPattern = /"([^"]+)":\s*/g
    const matches = [...textBeforeCursor.matchAll(keyPattern)]

    if (matches.length === 0) {
      return null
    }

    // Pegar a última chave encontrada antes do cursor
    const lastMatch = matches[matches.length - 1]
    const keyName = lastMatch[1]

    // Construir o caminho navegando pelo objeto
    const path = findKeyPath(parsed, keyName, [])

    if (path) {
      return formatJsonPath(path)
    }

    // Fallback: tentar encontrar pelo contexto (arrays)
    const arrayPattern = /\[(\d+)\]/g
    const arrayMatches = [...textBeforeCursor.matchAll(arrayPattern)]

    if (arrayMatches.length > 0) {
      // Tentar construir caminho com índices de array
      const indices = arrayMatches.map((m) => parseInt(m[1], 10))
      return buildPathWithIndices(parsed, indices, keyName)
    }

    return null
  } catch {
    return null
  }
}

/**
 * Constrói um caminho usando índices de array
 */
function buildPathWithIndices(obj: any, indices: number[], lastKey: string | null): string | null {
  let current: any = obj
  const path: (string | number)[] = []

  // Navegar pelos índices
  for (const index of indices) {
    if (Array.isArray(current) && current[index] !== undefined) {
      path.push(index)
      current = current[index]
    } else {
      return null
    }
  }

  // Se há uma última chave, tentar encontrá-la
  if (lastKey && typeof current === 'object' && current !== null && !Array.isArray(current)) {
    if (current.hasOwnProperty(lastKey)) {
      path.push(lastKey)
      return formatJsonPath(path)
    }
  }

  return path.length > 0 ? formatJsonPath(path) : null
}
