/**
 * Sistema de serialização/deserialização de estado para compartilhamento via URL
 * Baseado no Carbon.now.sh (lib/routing.js)
 */

const URL_LIMIT = 4000 // 4KB - mesmo limite do Carbon

/**
 * Serializa o estado completo em base64 para URL
 */
export function serializeState(state: Record<string, any>): string {
  const stateString = encodeURIComponent(JSON.stringify(state))

  if (typeof window !== 'undefined') {
    return encodeURIComponent(btoa(stateString))
  } else {
    // Server-side
    return encodeURIComponent(Buffer.from(stateString).toString('base64'))
  }
}

/**
 * Deserializa o estado de base64 da URL
 */
export function deserializeState(serializedState: string): Record<string, any> {
  let stateString: string

  if (typeof window !== 'undefined') {
    stateString = atob(serializedState)
  } else {
    // Server-side
    stateString = Buffer.from(serializedState, 'base64').toString()
  }

  return JSON.parse(decodeURIComponent(stateString))
}

/**
 * Mapeamento de campos curtos para URLs mais curtas
 * Formato: 'campoOriginal:campoCurto'
 */
const fieldMappings: Record<string, string> = {
  // Configurações básicas
  backgroundColor: 'bg',
  theme: 't',
  windowTheme: 'wt',
  language: 'l',
  padding: 'p',
  showLineNumbers: 'ln',
  fontFamily: 'fm',
  fontSize: 'fs',
  scale: 's',
  borderRadius: 'br',
  shadowIntensity: 'si',
  fontLigatures: 'fl',
  widthOffset: 'wo',
  wordWrap: 'ww',
  showHeaderTitle: 'ht',
  headerTitle: 'htl',
  presetSize: 'ps',
  showFooter: 'sf',
  footerOptions: 'fo',
  footerCustomText: 'fct',
  languagePosition: 'lp',
  footerPosition: 'fp',
  contentVerticalAlign: 'cva',
  diffMode: 'dm',
  lineHighlights: 'lh',
  annotations: 'ann',
  annotationMode: 'am',
  liveEditMode: 'lem',
  // Código
  code: 'c',
}

/**
 * Mapeamento reverso (campo curto -> campo original)
 */
const reverseFieldMappings: Record<string, string> = Object.entries(fieldMappings).reduce(
  (acc, [key, value]) => {
    acc[value] = key
    return acc
  },
  {} as Record<string, string>,
)

/**
 * Converte objeto de estado para query params curtos
 */
export function stateToQueryParams(state: Record<string, any>): Record<string, string> {
  const params: Record<string, string> = {}

  for (const [key, value] of Object.entries(state)) {
    const shortKey = fieldMappings[key] || key

    if (value === undefined || value === null || value === '') {
      continue
    }

    // Tratamento de tipos
    if (typeof value === 'boolean') {
      params[shortKey] = value ? '1' : '0'
    } else if (typeof value === 'number') {
      params[shortKey] = value.toString()
    } else if (typeof value === 'object') {
      // Arrays e objetos são serializados como JSON
      try {
        const encoded = encodeURIComponent(JSON.stringify(value))
        if (encoded.length > URL_LIMIT / 2) {
          // Se muito grande, trunca
          params[shortKey] = encoded.slice(0, URL_LIMIT / 2)
        } else {
          params[shortKey] = encoded
        }
      } catch {
        // Ignora se não conseguir serializar
      }
    } else {
      // String
      const encoded = encodeURIComponent(String(value))
      if (encoded.length > URL_LIMIT / 2) {
        // Se muito grande, trunca
        params[shortKey] = encoded.slice(0, URL_LIMIT / 2)
      } else {
        params[shortKey] = encoded
      }
    }
  }

  return params
}

/**
 * Converte query params curtos de volta para objeto de estado
 */
export function queryParamsToState(params: URLSearchParams): Record<string, any> {
  const state: Record<string, any> = {}

  for (const [shortKey, value] of params.entries()) {
    const originalKey = reverseFieldMappings[shortKey] || shortKey

    if (!value || value === '') {
      continue
    }

    // Tenta detectar o tipo
    if (value === '1' || value === '0') {
      // Boolean
      state[originalKey] = value === '1'
    } else if (!isNaN(Number(value)) && value !== '') {
      // Number (mas não string vazia)
      const num = Number(value)
      if (Number.isInteger(num) && !originalKey.includes('code')) {
        state[originalKey] = num
      } else {
        // Float ou string numérica que não deve ser número
        try {
          // Tenta decodificar como JSON primeiro
          const decoded = decodeURIComponent(value)
          const parsed = JSON.parse(decoded)
          state[originalKey] = parsed
        } catch {
          // Se não for JSON, mantém como string
          state[originalKey] = decodeURIComponent(value)
        }
      }
    } else {
      // String ou JSON
      try {
        const decoded = decodeURIComponent(value)
        const parsed = JSON.parse(decoded)
        state[originalKey] = parsed
      } catch {
        // Não é JSON, mantém como string
        state[originalKey] = decodeURIComponent(value)
      }
    }
  }

  return state
}

/**
 * Obtém o estado da URL (query params ou estado serializado)
 */
export function getUrlState(searchParams: URLSearchParams): Record<string, any> {
  // Prioridade 1: Estado completo serializado em base64
  const serializedState = searchParams.get('state')
  if (serializedState) {
    try {
      return deserializeState(serializedState)
    } catch {
      // Se falhar, continua com query params
    }
  }

  // Prioridade 2: Query params curtos
  return queryParamsToState(searchParams)
}

/**
 * Cria URL com estado compartilhável
 * Retorna URL completa ou apenas query string dependendo do parâmetro
 */
export function createShareableUrl(
  state: Record<string, any>,
  baseUrl: string = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '',
  useSerialized: boolean = false,
): string {
  if (useSerialized) {
    // Usa estado completo serializado (melhor para estados complexos)
    const serialized = serializeState(state)
    return `${baseUrl}?state=${serialized}`
  } else {
    // Usa query params curtos (melhor para URLs curtas)
    const params = stateToQueryParams(state)
    const queryString = new URLSearchParams(params).toString()

    // Se a URL ficar muito grande, usa serialização
    if (queryString.length > URL_LIMIT) {
      const serialized = serializeState(state)
      return `${baseUrl}?state=${serialized}`
    }

    return queryString ? `${baseUrl}?${queryString}` : baseUrl
  }
}

