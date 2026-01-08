'use server'

const MAX_LINKS_PER_BATCH = 50
const ALLOWED_PROTOCOLS = ['http:', 'https:']
const BLOCKED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0']

export interface LinkValidationResult {
  url: string
  isValid: boolean
  error?: string // Adicionado para consistência
  statusCode?: number
  validatedAt?: number
}

function isSafeUrl(urlStr: string): { safe: boolean; error?: string } {
  try {
    const parsed = new URL(urlStr)
    if (!ALLOWED_PROTOCOLS.includes(parsed.protocol)) {
      return { safe: false, error: 'Protocolo não permitido' }
    }
    if (BLOCKED_HOSTS.includes(parsed.hostname)) {
      return { safe: false, error: 'Acesso interno bloqueado' }
    }
    const isPrivateIp = /^(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/.test(parsed.hostname)
    if (isPrivateIp) {
      return { safe: false, error: 'IP privado não permitido' }
    }
    return { safe: true }
  } catch {
    return { safe: false, error: 'URL Inválida' }
  }
}

export async function validateExternalLink(url: string): Promise<LinkValidationResult> {
  const safety = isSafeUrl(url)
  const now = Date.now()

  if (!safety.safe) {
    return { url, isValid: false, error: safety.error, validatedAt: now }
  }

  const commonHeaders = {
    'User-Agent': 'Mozilla/5.0 (LinkValidator/1.0)',
    Accept: '*/*',
  }

  try {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), 5000)

    let response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: commonHeaders,
      redirect: 'follow',
    })

    clearTimeout(id)

    // Fallback para GET se HEAD não for permitido (405) ou falhar (exceto 404)
    if (!response.ok && response.status !== 405 && response.status !== 404) {
      const getController = new AbortController()
      const getId = setTimeout(() => getController.abort(), 5000)

      const getResponse = await fetch(url, {
        method: 'GET',
        signal: getController.signal,
        headers: commonHeaders,
      })

      clearTimeout(getId)
      response = getResponse
    }

    const isValid = response.ok || response.status === 405
    return {
      url,
      isValid,
      statusCode: response.status,
      error: isValid ? undefined : `HTTP ${response.status}`,
      validatedAt: now,
    }
  } catch (err: any) {
    return {
      url,
      isValid: false,
      error: err.name === 'AbortError' ? 'Timeout (5s)' : 'Link inacessível',
      validatedAt: now,
    }
  }
}

export async function validateMultipleLinks(urls: string[]): Promise<LinkValidationResult[]> {
  if (urls.length > MAX_LINKS_PER_BATCH) {
    throw new Error(`Máximo de ${MAX_LINKS_PER_BATCH} links por vez.`)
  }

  const concurrencyLimit = 5
  const results: LinkValidationResult[] = new Array(urls.length)
  let currentIndex = 0

  const worker = async () => {
    while (currentIndex < urls.length) {
      const index = currentIndex++
      results[index] = await validateExternalLink(urls[index])
    }
  }

  await Promise.all(
    Array(Math.min(concurrencyLimit, urls.length))
      .fill(null)
      .map(() => worker()),
  )

  return results
}
