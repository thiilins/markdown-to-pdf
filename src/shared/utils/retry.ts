/**
 * Utilitário de retry com backoff exponencial
 * Reutilizável para todos os services
 */

interface RetryOptions {
  maxRetries?: number
  initialDelay?: number
  maxDelay?: number
  retryableStatuses?: number[]
  onRetry?: (attempt: number, error: Error) => void
}

/**
 * Aguarda um tempo em milissegundos
 */
const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Executa uma função com retry exponencial
 * @param fn Função assíncrona a ser executada
 * @param options Opções de retry
 * @returns Resultado da função ou lança o último erro
 */
export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000, // 1s
    maxDelay = 10000, // 10s
    retryableStatuses = [503, 504, 429], // Servidor indisponível, timeout, rate limit
    onRetry,
  } = options

  let lastError: Error | null = null

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // Verifica se o erro é retryable
      const isRetryable =
        attempt < maxRetries - 1 &&
        (retryableStatuses.includes((error as any)?.status) ||
          lastError.message.includes('timeout') ||
          lastError.message.includes('503') ||
          lastError.message.includes('504'))

      if (!isRetryable) {
        throw lastError
      }

      // Calcula delay com backoff exponencial
      const delay = Math.min(initialDelay * Math.pow(2, attempt), maxDelay)

      if (onRetry) {
        onRetry(attempt + 1, lastError)
      }

      // Aguarda antes de tentar novamente
      await sleep(delay)
    }
  }

  // Se chegou aqui, todas as tentativas falharam
  throw lastError || new Error('Todas as tentativas falharam')
}

/**
 * Wrapper para fetch com retry automático
 * Retry apenas para status codes retryable (503, 504, 429)
 */
export async function fetchWithRetry(
  url: string,
  init?: RequestInit,
  retryOptions?: RetryOptions,
): Promise<Response> {
  return withRetry(async () => {
    const response = await fetch(url, init)

    // Se for status retryable, lança erro para trigger do retry
    if (retryOptions?.retryableStatuses?.includes(response.status)) {
      const error: any = new Error(`HTTP ${response.status}: ${response.statusText}`)
      error.status = response.status
      error.response = response
      throw error
    }

    // Se não for ok e não for retryable, lança erro direto
    if (!response.ok) {
      const error: any = new Error(`HTTP ${response.status}: ${response.statusText}`)
      error.status = response.status
      error.response = response
      throw error
    }

    return response
  }, retryOptions)
}
