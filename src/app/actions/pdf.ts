'use server'

/**
 * Server Action para gerar PDF
 * Esta função executa no servidor e faz a chamada à API de geração de PDF
 * Mantém a URL e token seguros no servidor
 */
export async function generatePDF(html: string, config: AppConfig) {
  const PDF_GENERATE_URL = process.env.PDF_GENERATE_URL
  const PDF_GENERATE_TOKEN = process.env.PDF_GENERATE_TOKEN
  if (!PDF_GENERATE_URL) {
    throw new Error(
      'URL de geração de PDF não configurada. Configure PDF_GENERATE_URL no .env.local',
    )
  }

  if (!PDF_GENERATE_TOKEN) {
    throw new Error(
      'Token de autenticação não configurado. Configure PDF_GENERATE_TOKEN no .env.local',
    )
  }

  const abortController = new AbortController()
  const timeoutId = setTimeout(() => abortController.abort(), 60000)

  try {
    // Transforma o AppConfig do frontend para o formato esperado pelo backend
    // Remove campos extras (editor, padding) e ajusta tipos
    // IMPORTANTE: Mantém compatibilidade 100% com a API route antiga do Next.js
    const backendConfig = {
      page: {
        width: config.page.width,
        height: config.page.height,
        orientation: config.page.orientation,
        size: config.page.size,
        margin: {
          top: config.page.margin.top,
          right: config.page.margin.right,
          bottom: config.page.margin.bottom,
          left: config.page.margin.left,
        },
      },
      typography: {
        headings: config.typography.headings,
        body: config.typography.body,
        code: config.typography.code,
        quote: config.typography.quote,
        baseSize: config.typography.baseSize,
        h1Size: config.typography.h1Size,
        h2Size: config.typography.h2Size,
        h3Size: config.typography.h3Size,
        // Converte number para string (ex: 1.6 -> "1.6")
        // O backend usa diretamente no CSS: --line-height: ${lineHeight};
        // Isso gera o mesmo resultado que a API route antiga
        lineHeight: String(config.typography.lineHeight),
      },
      // Tema é opcional no backend, então só envia se existir
      // Remove name e description que não são usados no CSS
      ...(config.theme && {
        theme: {
          background: config.theme.background,
          headingColor: config.theme.headingColor,
          borderColor: config.theme.borderColor,
          linkColor: config.theme.linkColor,
          textColor: config.theme.textColor,
          blockquoteColor: config.theme.blockquoteColor,
          codeBackground: config.theme.codeBackground,
          codeTextColor: config.theme.codeTextColor,
        },
      }),
    }

    // Prepara os headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'x-api-key': PDF_GENERATE_TOKEN,
    }

    const response = await fetch(PDF_GENERATE_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        html,
        config: backendConfig,
      }),
      signal: abortController.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      let errorData
      try {
        errorData = await response.json()
      } catch {
        throw new Error(
          `Erro ${response.status}: ${response.statusText || 'Erro desconhecido'}. O servidor pode estar em hot reload.`,
        )
      }

      if (response.status === 401 || response.status === 403) {
        throw new Error(
          errorData.details ||
            errorData.error ||
            'Não autorizado. Verifique se PDF_GENERATE_TOKEN está configurado corretamente no .env.local',
        )
      }

      if (response.status === 503) {
        throw new Error(
          errorData.details ||
            'Servidor temporariamente indisponível. Aguarde alguns segundos e tente novamente.',
        )
      }

      throw new Error(
        errorData.details ||
          errorData.error ||
          `Erro na geração do PDF (${response.status}: ${response.statusText})`,
      )
    }

    // Extrai o filename do header Content-Disposition
    const contentDisposition = response.headers.get('Content-Disposition')
    let filename = 'documento.pdf'
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/)
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1]
      }
    }

    // Converte o blob para base64 para retornar via Server Action
    const blob = await response.blob()
    const arrayBuffer = await blob.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')

    return {
      success: true,
      data: base64,
      filename,
      contentType: blob.type || 'application/pdf',
    }
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof Error) {
      if (error.name === 'AbortError' || error.message.includes('timeout')) {
        throw new Error(
          'Tempo de espera esgotado. O servidor pode estar em hot reload. Aguarde alguns segundos e tente novamente.',
        )
      }
      throw error
    }

    throw new Error('Erro ao gerar PDF. Tente novamente.')
  }
}
