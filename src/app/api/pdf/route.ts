'use server'

import { NextRequest, NextResponse } from 'next/server'

/**
 * Route Handler para gerar PDF com streaming
 * Faz proxy para a API externa, mantendo credenciais seguras no servidor
 * Retorna o PDF como stream binário (sem conversão base64)
 */
export async function POST(request: NextRequest) {
  const PDF_GENERATE_URL = process.env.PDF_GENERATE_URL
  const PDF_GENERATE_TOKEN = process.env.PDF_GENERATE_TOKEN

  if (!PDF_GENERATE_URL) {
    return NextResponse.json({ error: 'URL de geração de PDF não configurada' }, { status: 500 })
  }

  if (!PDF_GENERATE_TOKEN) {
    return NextResponse.json({ error: 'Token de autenticação não configurado' }, { status: 500 })
  }

  try {
    const body = await request.json()
    const { html, config } = body

    if (!html) {
      return NextResponse.json({ error: 'HTML é obrigatório' }, { status: 400 })
    }

    // Transforma o AppConfig do frontend para o formato esperado pelo backend
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
        lineHeight: String(config.typography.lineHeight),
      },
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

    const abortController = new AbortController()
    const timeoutId = setTimeout(() => abortController.abort(), 60000)

    const response = await fetch(PDF_GENERATE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': PDF_GENERATE_TOKEN,
      },
      body: JSON.stringify({
        html,
        config: backendConfig,
      }),
      signal: abortController.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      let errorMessage = `Erro ${response.status}: ${response.statusText}`

      try {
        const errorData = await response.json()
        errorMessage = errorData.details || errorData.error || errorMessage
      } catch {
        // Ignora erro de parse
      }

      if (response.status === 401 || response.status === 403) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
      }

      if (response.status === 503) {
        return NextResponse.json(
          { error: 'Servidor temporariamente indisponível. Tente novamente.' },
          { status: 503 },
        )
      }

      return NextResponse.json({ error: errorMessage }, { status: response.status })
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

    // Stream direto do binário - sem conversão base64!
    const pdfBuffer = await response.arrayBuffer()

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(pdfBuffer.byteLength),
      },
    })
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Tempo de espera esgotado. Tente novamente.' },
          { status: 504 },
        )
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ error: 'Erro ao gerar PDF' }, { status: 500 })
  }
}
