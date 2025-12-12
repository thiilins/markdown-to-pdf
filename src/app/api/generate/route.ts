import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer'
import { AppConfig, THEME_PRESETS } from '@/types/config'
import moment from 'moment-timezone'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { html, config } = body as { html: string; config: AppConfig }

    if (!html || !config) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    const theme = config.theme || THEME_PRESETS.modern
    const { width, height, orientation } = config.page
    const isLandscape = orientation === 'landscape'

    // URLs de Fontes
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

    // CSS para o Puppeteer
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

      /* Reseta margens da página para garantir fundo total (sangria) */
      @page {
        margin: 0;
        size: ${width} ${height};
      }

      html {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
      }

      body {
        font-family: var(--font-body);
        font-size: var(--base-size);
        line-height: var(--line-height);
        color: ${theme.textColor};
        background-color: ${theme.background} !important;
        margin: 0;
        width: 100%;
        min-height: 100%;

        /* AQUI É O SEGREDO: Margem vira Padding do Body */
        /* Isso garante que o fundo pinte a folha toda, mas o texto respeite a margem */
        padding-top: ${config.page.margin.top};
        padding-right: ${config.page.margin.right};
        padding-bottom: ${config.page.margin.bottom};
        padding-left: ${config.page.margin.left};

        box-sizing: border-box;
      }

      /* Container do conteúdo */
      .prose {
        width: 100%;
        max-width: none;
        /* Padding interno extra do usuário */
        padding: ${config.page.padding};
      }

      /* Estilos Markdown */
      .prose h1 {
        font-family: var(--font-headings);
        font-size: var(--h1-size);
        font-weight: 700;
        color: ${theme.headingColor};
        margin-top: 0;
        margin-bottom: 0.5em;
        page-break-after: avoid;
      }
      .prose h2 {
        font-family: var(--font-headings);
        font-size: var(--h2-size);
        font-weight: 600;
        color: ${theme.headingColor};
        margin-top: 1em;
        margin-bottom: 0.5em;
        page-break-after: avoid;
        border-bottom: 1px solid ${theme.borderColor};
        padding-bottom: 0.3em;
      }
      .prose h3 {
        font-family: var(--font-headings);
        font-size: var(--h3-size);
        font-weight: 600;
        color: ${theme.headingColor};
        margin-top: 0.8em;
        margin-bottom: 0.4em;
        page-break-after: avoid;
      }
      .prose p { margin-top: 0.5em; margin-bottom: 0.5em; }
      .prose ul, .prose ol { margin-top: 0.5em; margin-bottom: 0.5em; padding-left: 1.5em; }
      .prose li { margin-top: 0.25em; margin-bottom: 0.25em; }
      .prose strong { font-weight: 700; color: ${theme.textColor}; }

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
        margin: 1em 0;
        font-style: italic;
        color: ${theme.blockquoteColor};
        page-break-inside: avoid;
      }

      .prose a { color: ${theme.linkColor}; text-decoration: underline; }

      .prose img {
        max-width: 100%;
        height: auto;
        border-radius: 4px;
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
        padding: 0.5em;
        text-align: left;
      }
      .prose th { background-color: ${theme.codeBackground}; font-weight: 600; }
      .prose hr { border: 0; border-top: 1px solid ${theme.borderColor}; margin: 2em 0; }

      .page-break { page-break-after: always; height: 1px; width: 100%; display: block; }
    `

    // --- CORREÇÃO CRÍTICA DO CRASH ---
    // Removemos variáveis injetadas por ferramentas de dev (Console Ninja, etc)
    const env = { ...process.env }

    // Forçamos undefined ou string vazia para garantir que o spawn não herde
    const blockedVars = [
      'NODE_OPTIONS',
      'LD_PRELOAD',
      'VSCODE_IPC_HOOK',
      'ELECTRON_RUN_AS_NODE',
      'VSCODE_INSPECTOR_OPTIONS',
    ]

    blockedVars.forEach((key) => {
      delete env[key]
      // @ts-ignore
      env[key] = undefined
    })
    // ----------------------------------

    const browser = await puppeteer.launch({
      headless: true,
      env: env, // Passamos o ambiente limpo
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--font-render-hinting=none',
        '--disable-extensions', // Garante que extensões não carreguem
      ],
    })

    const page = await browser.newPage()

    await page.setContent(
      `
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
    `,
      {
        waitUntil: 'networkidle0',
        timeout: 60000,
      },
    )

    const pdfBuffer = await page.pdf({
      printBackground: true,
      displayHeaderFooter: false,
      // Margem zero no PDF, pois a margem visual é feita pelo padding do body
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      width: isLandscape ? height : width,
      height: isLandscape ? width : height,
      preferCSSPageSize: true,
    })

    await browser.close()

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
