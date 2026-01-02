/**
 * Utilitários para conversão Base64
 */

/**
 * Codifica texto para Base64
 */
export function encodeBase64(text: string): string {
  if (!text) return ''
  try {
    return btoa(unescape(encodeURIComponent(text)))
  } catch (error) {
    throw new Error('Erro ao codificar texto para Base64')
  }
}

/**
 * Decodifica Base64 para texto
 */
export function decodeBase64(base64: string): string {
  if (!base64) return ''
  try {
    return decodeURIComponent(escape(atob(base64)))
  } catch (error) {
    throw new Error('Erro ao decodificar Base64. Verifique se o texto é válido.')
  }
}

/**
 * Converte arquivo para Base64 data URL
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Erro ao ler arquivo'))
      }
    }
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'))
    reader.readAsDataURL(file)
  })
}

/**
 * Valida se uma string é Base64 válida
 */
export function isValidBase64(str: string): boolean {
  if (!str.trim()) return false
  try {
    // Remove espaços e quebras de linha
    const cleaned = str.replace(/\s/g, '')
    // Verifica se é Base64 válido
    return /^[A-Za-z0-9+/]*={0,2}$/.test(cleaned) && cleaned.length % 4 === 0
  } catch {
    return false
  }
}

