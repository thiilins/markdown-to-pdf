/**
 * Utilitários para geração de senhas
 */

export interface PasswordOptions {
  length: number
  includeUppercase: boolean
  includeLowercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
  excludeSimilar: boolean
  excludeAmbiguous: boolean
}

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
const NUMBERS = '0123456789'
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'
const SIMILAR = 'il1Lo0O'
const AMBIGUOUS = '{}[]()/\\\'"`~,;:.<>'

/**
 * Gera uma senha baseada nas opções fornecidas
 */
export function generatePassword(options: PasswordOptions): string {
  let charset = ''

  if (options.includeUppercase) {
    charset += UPPERCASE
  }
  if (options.includeLowercase) {
    charset += LOWERCASE
  }
  if (options.includeNumbers) {
    charset += NUMBERS
  }
  if (options.includeSymbols) {
    charset += SYMBOLS
  }

  if (charset.length === 0) {
    throw new Error('Selecione pelo menos um tipo de caractere')
  }

  // Remover caracteres similares se solicitado
  if (options.excludeSimilar) {
    charset = charset
      .split('')
      .filter((char) => !SIMILAR.includes(char))
      .join('')
  }

  // Remover caracteres ambíguos se solicitado
  if (options.excludeAmbiguous) {
    charset = charset
      .split('')
      .filter((char) => !AMBIGUOUS.includes(char))
      .join('')
  }

  if (charset.length === 0) {
    throw new Error('Nenhum caractere disponível após aplicar filtros')
  }

  // Garantir que pelo menos um caractere de cada tipo selecionado seja incluído
  const requiredChars: string[] = []
  if (options.includeUppercase) {
    const available = UPPERCASE.split('').filter((c) => charset.includes(c))
    if (available.length > 0) {
      requiredChars.push(available[Math.floor(Math.random() * available.length)])
    }
  }
  if (options.includeLowercase) {
    const available = LOWERCASE.split('').filter((c) => charset.includes(c))
    if (available.length > 0) {
      requiredChars.push(available[Math.floor(Math.random() * available.length)])
    }
  }
  if (options.includeNumbers) {
    const available = NUMBERS.split('').filter((c) => charset.includes(c))
    if (available.length > 0) {
      requiredChars.push(available[Math.floor(Math.random() * available.length)])
    }
  }
  if (options.includeSymbols) {
    const available = SYMBOLS.split('').filter((c) => charset.includes(c))
    if (available.length > 0) {
      requiredChars.push(available[Math.floor(Math.random() * available.length)])
    }
  }

  // Gerar o resto da senha
  const remainingLength = Math.max(0, options.length - requiredChars.length)
  const randomChars = Array.from({ length: remainingLength }, () => {
    return charset[Math.floor(Math.random() * charset.length)]
  })

  // Combinar e embaralhar
  const allChars = [...requiredChars, ...randomChars]
  return shuffleArray(allChars).join('')
}

/**
 * Embaralha um array
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Calcula a força da senha
 */
export function calculatePasswordStrength(password: string): {
  score: number
  label: string
  color: string
} {
  let score = 0

  // Comprimento
  if (password.length >= 12) score += 2
  else if (password.length >= 8) score += 1

  // Tipos de caracteres
  if (/[a-z]/.test(password)) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^a-zA-Z0-9]/.test(password)) score += 1

  // Diversidade
  const uniqueChars = new Set(password).size
  if (uniqueChars / password.length >= 0.7) score += 1

  if (score <= 2) return { score, label: 'Muito Fraca', color: 'text-red-500' }
  if (score <= 3) return { score, label: 'Fraca', color: 'text-orange-500' }
  if (score <= 4) return { score, label: 'Média', color: 'text-yellow-500' }
  if (score <= 5) return { score, label: 'Forte', color: 'text-green-500' }
  return { score, label: 'Muito Forte', color: 'text-emerald-500' }
}
