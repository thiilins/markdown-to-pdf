/**
 * Utilitários de validação de URL para Web to Markdown
 * Versão mais permissiva (permite qualquer domínio público, mas mantém proteção SSRF)
 */

/**
 * Verifica se uma string é um endereço IP (IPv4 ou IPv6)
 */
function isIpAddress(hostname: string): boolean {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
  const ipv6Regex = /^[0-9a-fA-F:]+$/
  return ipv4Regex.test(hostname) || ipv6Regex.test(hostname)
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
 * Valida se a URL é permitida e segura para scraping
 * Versão permissiva: permite qualquer domínio público, mas bloqueia IPs privados
 */
export function isValidWebUrl(url: string): { valid: boolean; error?: string } {
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
    if (isIpAddress(urlObj.hostname)) {
      // Se for IP privado, bloqueia
      if (isPrivateIp(urlObj.hostname)) {
        return {
          valid: false,
          error: 'URLs com IPs privados não são permitidas por segurança',
        }
      }
      // IPs públicos diretos também são bloqueados (use domínio)
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
      urlObj.hostname.startsWith('localhost.') ||
      urlObj.hostname === '0.0.0.0'
    ) {
      return {
        valid: false,
        error: 'URLs locais não são permitidas por segurança',
      }
    }

    // BLOQUEIA IPs privados por hostname (192.168.x.x, 10.x.x.x, etc.)
    if (
      urlObj.hostname.startsWith('192.168.') ||
      urlObj.hostname.startsWith('10.') ||
      (urlObj.hostname.startsWith('172.') &&
        parseInt(urlObj.hostname.split('.')[1]) >= 16 &&
        parseInt(urlObj.hostname.split('.')[1]) <= 31) ||
      urlObj.hostname.startsWith('169.254.')
    ) {
      return {
        valid: false,
        error: 'URLs locais ou IPs privados não são permitidas por segurança',
      }
    }

    // Permite qualquer outro domínio público
    return { valid: true }
  } catch (error) {
    return {
      valid: false,
      error: 'URL inválida',
    }
  }
}
