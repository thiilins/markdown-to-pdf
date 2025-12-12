// app/api/generate-pdf/route.ts

import { NextResponse } from 'next/server'
import puppeteer, { PaperFormat } from 'puppeteer'
import { AppConfig, THEME_PRESETS } from '@/types/config'
import moment from 'moment-timezone'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { html, config } = body as { html: string; config: AppConfig }

    if (!html || !config) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    // 1. Configuração Básica
    const theme = config.theme || THEME_PRESETS.modern
    const { width, height, orientation, size } = config.page
    const isLandscape = orientation === 'landscape'

    // 2. URLs de Fontes
    const fontFamilies = [
      config.typography.headings,
      config.typography.body,
      config.typography.code,
      config.typography.quote,
    ]
    const uniqueFonts = [...new Set(fontFamilies)]
    const fontQuery = uniqueFonts
      .map((font) => `family=${font.replace(/\s+/g, '+')}:wght@400;500;600;700`)
      .join('&')
    const googleFontsUrl = `https://fonts.googleapis.com/css2?${fontQuery}&display=swap`

    // 3. Montagem do CSS
    // Nota: O segredo aqui é garantir que o CSS interno não brigue com as margens do PDF
    const styles = `
      :root {
        --font-headings: '${config.typography.headings}', sans-serif;
        --font-body: '${config.typography.body}', sans-serif;
        --font-code: '${config.typography.code}', monospace;
        --font-quote: '${config.typography.quote}', serif;

        --base-size: ${config.typography.baseSize}px;
        --h1-size: ${config.typography.h1Size}px;
        --h2-size: ${config.typography.h2Size}px;
        --h3-size: ${config.typography.h3Size}px;
        --line-height: ${config.typography.lineHeight};
      }

      html {
        -webkit-print-color-adjust: exact;
      }

      body {
        font-family: var(--font-body);
        font-size: var(--base-size);
        line-height: var(--line-height);
        color: ${theme.textColor};
        background: ${theme.background};
        margin: 0;
        padding: 0;
      }

      /* Container Principal */
      .prose {
        width: 100%;
        max-width: none;
        /* Padding interno do conteúdo (afastamento do texto em relação à margem do papel) */
        padding: ${config.page.padding || '0'};
        box-sizing: border-box;
      }

      /* Tipografia */
      .prose h1 {
        font-family: var(--font-headings);
        font-size: var(--h1-size);
        font-weight: 700;
        color: ${theme.headingColor};
        margin-bottom: 0.5em;
        line-height: 1.2;
        page-break-after: avoid;
      }
      .prose h2 {
        font-family: var(--font-headings);
        font-size: var(--h2-size);
        font-weight: 600;
        color: ${theme.headingColor};
        margin-top: 1.5em;
        margin-bottom: 0.5em;
        page-break-after: avoid;
        border-bottom: 1px solid ${theme.borderColor};
        padding-bottom: 0.2em;
      }
      .prose h3 {
        font-family: var(--font-headings);
        font-size: var(--h3-size);
        font-weight: 600;
        color: ${theme.headingColor};
        margin-top: 1.2em;
        margin-bottom: 0.5em;
        page-break-after: avoid;
      }

      .prose p { margin-bottom: 0.8em; }
      .prose ul, .prose ol { margin: 0.5em 0 0.8em 1.5em; }
      .prose li { margin-bottom: 0.3em; }

      .prose strong { font-weight: 700; color: ${theme.textColor}; }
      .prose a { color: ${theme.linkColor}; text-decoration: underline; }

      .prose code {
        font-family: var(--font-code);
        background-color: ${theme.codeBackground};
        color: ${theme.codeTextColor};
        padding: 0.2em 0.4em;
        border-radius: 3px;
        font-size: 0.9em;
      }

      .prose pre {
        font-family: var(--font-code);
        background-color: ${theme.codeBackground};
        color: ${theme.codeTextColor};
        padding: 1em;
        border-radius: 6px;
        overflow-x: auto;
        margin: 1em 0;
        white-space: pre-wrap;
        page-break-inside: avoid;
      }

      .prose blockquote {
        font-family: var(--font-quote);
        border-left: 4px solid ${theme.linkColor};
        padding-left: 1em;
        margin: 1.5em 0;
        font-style: italic;
        color: ${theme.blockquoteColor};
        page-break-inside: avoid;
      }

      .prose img {
        max-width: 100%;
        height: auto;
        margin: 1em 0;
        page-break-inside: avoid;
      }

      .prose table {
        width: 100%;
        border-collapse: collapse;
        margin: 1em 0;
        page-break-inside: avoid;
      }
      .prose th, .prose td {
        border: 1px solid ${theme.borderColor};
        padding: 0.6em;
        text-align: left;
      }
      .prose th { background-color: ${theme.codeBackground}; font-weight: 600; }
      .prose hr { border: 0; border-top: 1px solid ${theme.borderColor}; margin: 2em 0; }

      /* FORÇA A QUEBRA DE PÁGINA */
      .page-break {
        display: block;
        height: 0;
        margin: 0;
        border: none;
        break-after: page !important;
        page-break-after: always !important;
      }
    `

    // 4. Setup Puppeteer
    // Removemos variáveis de ambiente que causam problemas em Vercel/Docker
    const cleanEnv = { ...process.env }
    const badVars = ['NODE_OPTIONS', 'LD_PRELOAD', 'VSCODE_IPC_HOOK', 'ELECTRON_RUN_AS_NODE']
    badVars.forEach((key) => delete cleanEnv[key])

    const browser = await puppeteer.launch({
      headless: true,
      env: cleanEnv,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--font-render-hinting=none',
      ],
    })

    const page = await browser.newPage()

    // 5. Montagem HTML
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <link href="${googleFontsUrl}" rel="stylesheet">
          <style>${styles}</style>
        </head>
        <body>
          <div class="prose">
            ${html}
          </div>
        </body>
      </html>
    `

    // Carregamento com timeout seguro
    await page.setContent(fullHtml, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    })

    // 6. Configuração PDF
    // Determinando o formato ou dimensões customizadas
    let pdfFormat: PaperFormat | undefined = undefined
    let pdfWidth: string | number | undefined = undefined
    let pdfHeight: string | number | undefined = undefined

    if (size === 'custom') {
      // Se for paisagem, invertemos as medidas para garantir a orientação
      // Nota: Puppeteer aceita strings como '210mm'
      pdfWidth = isLandscape ? height : width
      pdfHeight = isLandscape ? width : height
    } else {
      // Validação simples para garantir que o formato é suportado
      // Ex: 'A4', 'LETTER', 'LEGAL'
      pdfFormat = size.toUpperCase() as PaperFormat
    }

    const pdfBuffer = await page.pdf({
      printBackground: true,
      displayHeaderFooter: false,
      landscape: isLandscape && size !== 'custom', // Landscape só se aplica se usarmos formato padrão
      width: pdfWidth,
      height: pdfHeight,
      format: pdfFormat,
      margin: {
        top: config.page.margin.top,
        right: config.page.margin.right,
        bottom: config.page.margin.bottom,
        left: config.page.margin.left,
      },
    })

    await browser.close()

    // 7. Retorno
    const timestamp = moment().tz('America/Sao_Paulo').format('YYYY-MM-DD_HH-mm-ss')

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="documento_${timestamp}.pdf"`,
      },
    })
  } catch (error) {
    console.error('PDF Generation Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: String(error) },
      { status: 500 },
    )
  }
}
