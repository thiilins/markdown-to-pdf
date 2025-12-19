import { NextRequest, NextResponse } from 'next/server'

/**
 * Whitelist de domínios permitidos para importação
 * Previne SSRF e garante segurança
 */
const ALLOWED_DOMAINS = [
  'github.com',
  'raw.githubusercontent.com',
  'gitlab.com',
  'gitlab.io',
  'gist.github.com',
  'gist.githubusercontent.com',
  'bitbucket.org',
]

/**
 * Converte diferentes formatos de URL para raw
 * Ex: GitHub blob → raw, GitLab → raw
 */
function normalizeUrl(url: string): string {
  try {
    const urlObj = new URL(url)

    // GitHub blob → raw
    if (urlObj.hostname === 'github.com' && urlObj.pathname.includes('/blob/')) {
      const pathParts = urlObj.pathname.split('/blob/')
      if (pathParts.length === 2) {
        return `https://raw.githubusercontent.com${pathParts[0]}/${pathParts[1]}`
      }
    }

    // GitLab → raw
    if (urlObj.hostname.includes('gitlab.com') || urlObj.hostname.includes('gitlab.io')) {
      if (!urlObj.pathname.includes('/-/raw/')) {
        // Tenta converter para raw
        const pathParts = urlObj.pathname.split('/-/blob/')
        if (pathParts.length === 2) {
          return `https://${urlObj.hostname}${pathParts[0]}/-/raw/${pathParts[1]}`
        }
      }
    }

    // Se já for raw ou gist, retorna como está
    return url
  } catch {
    return url
  }
}

/**
 * Verifica se uma string é um endereço IP (IPv4)
 */
function isIpAddress(hostname: string): boolean {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
  return ipv4Regex.test(hostname)
}

/**
 * Verifica se um IP é privado (RFC 1918)
 */
function isPrivateIp(ip: string): boolean {
  const parts = ip.split('.').map(Number)

  // 10.0.0.0/8
  if (parts[0] === 10) return true

  // 172.16.0.0/12 (172.16.0.0 até 172.31.255.255)
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true

  // 192.168.0.0/16
  if (parts[0] === 192 && parts[1] === 168) return true

  // 127.0.0.0/8 (localhost)
  if (parts[0] === 127) return true

  // 169.254.0.0/16 (link-local)
  if (parts[0] === 169 && parts[1] === 254) return true

  return false
}

/**
 * Valida se a URL é permitida e segura
 */
function isValidUrl(url: string): { valid: boolean; error?: string } {
  try {
    const urlObj = new URL(url)

    // Verifica se é HTTP/HTTPS
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return {
        valid: false,
        error: 'Apenas URLs HTTP/HTTPS são permitidas',
      }
    }

    // BLOQUEIA IPs diretos (prevenção SSRF)
    // Não permite URLs com IP ao invés de domínio
    if (isIpAddress(urlObj.hostname)) {
      return {
        valid: false,
        error: 'URLs com endereço IP não são permitidas. Use o domínio correspondente.',
      }
    }

    // BLOQUEIA localhost e variações
    if (
      urlObj.hostname === 'localhost' ||
      urlObj.hostname === '127.0.0.1' ||
      urlObj.hostname === '::1' ||
      urlObj.hostname.startsWith('localhost.')
    ) {
      return {
        valid: false,
        error: 'URLs locais não são permitidas por segurança',
      }
    }

    // Verifica se o domínio está na whitelist
    const isAllowed = ALLOWED_DOMAINS.some(
      (domain) => urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`),
    )

    if (!isAllowed) {
      return {
        valid: false,
        error: `Domínio não permitido. Domínios permitidos: ${ALLOWED_DOMAINS.join(', ')}`,
      }
    }

    return { valid: true }
  } catch (error) {
    return {
      valid: false,
      error: 'URL inválida',
    }
  }
}

/**
 * Route Handler para importar conteúdo de URL
 * Faz proxy para resolver CORS e valida segurança
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url } = body

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL é obrigatória' }, { status: 400 })
    }

    // Valida URL
    const validation = isValidUrl(url)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    // Normaliza URL (converte blob para raw, etc.)
    const normalizedUrl = normalizeUrl(url)

    // Faz fetch do conteúdo (server-side resolve CORS)
    const abortController = new AbortController()
    const timeoutId = setTimeout(() => abortController.abort(), 10000) // 10s timeout

    try {
      const response = await fetch(normalizedUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; md-to-pdf-pro/1.0)',
          Accept: 'text/plain, text/markdown, text/*',
        },
        signal: abortController.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        if (response.status === 404) {
          return NextResponse.json({ error: 'Arquivo não encontrado (404)' }, { status: 404 })
        }
        return NextResponse.json(
          { error: `Erro ao buscar arquivo: ${response.status} ${response.statusText}` },
          { status: response.status },
        )
      }

      // Lê o conteúdo
      const content = await response.text()

      // Valida tamanho (deixar disponível mas não aplicar ainda - conforme especificação)
      // const MAX_SIZE = 5 * 1024 * 1024 // 5MB
      // if (content.length > MAX_SIZE) {
      //   return NextResponse.json({ error: 'Arquivo muito grande (máximo 5MB)' }, { status: 413 })
      // }

      // Valida se parece ser markdown (opcional, mas recomendado)
      // Aceita qualquer conteúdo de texto, mas pode validar extensão na URL
      const isMarkdownLike =
        normalizedUrl.toLowerCase().includes('.md') ||
        normalizedUrl.toLowerCase().includes('.markdown')

      return NextResponse.json({
        success: true,
        content,
        url: normalizedUrl,
        isMarkdown: isMarkdownLike,
      })
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return NextResponse.json({ error: 'Timeout ao buscar arquivo' }, { status: 504 })
        }
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ error: 'Erro desconhecido ao buscar arquivo' }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao processar requisição' },
      { status: 500 },
    )
  }
}
