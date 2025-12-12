// src/app/api/generate/route.ts

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
    const { width, height, orientation, size } = config.page

    // Define o tamanho da folha para o CSS @page
    const pageSizeValue = size === 'custom' ? `${width} ${height}` : size.toUpperCase()

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

      /* 1. Configuração da Folha Física */
      @page {
        size: ${pageSizeValue} ${orientation};
        margin: 0; /* Margem ZERO. A margem visual vem do padding das divs internas */
      }

      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        background-color: ${theme.background};
        -webkit-print-color-adjust: exact;
      }

      /* 2. Estilização dos Containers de Página (.print-page) vindos do Front */
      .print-page {
        /* Remove estilos de "tela" que atrapalham a impressão */
        box-shadow: none !important;
        margin: 0 !important; /* Remove espaçamento entre páginas */
        border: none !important;

        /* Força fidelidade de layout */
        position: relative;
        width: 100% !important;
        height: 100% !important; /* Ocupa a folha toda */
        overflow: hidden; /* Corta conteúdo excedente */
        box-sizing: border-box; /* Garante que padding não estoure largura */

        /* --- CORREÇÃO AQUI: Forçar padding vindo da config --- */
        padding-top: ${config.page.margin.top} !important;
        padding-right: ${config.page.margin.right} !important;
        padding-bottom: ${config.page.margin.bottom} !important;
        padding-left: ${config.page.margin.left} !important;
        /* ----------------------------------------------------- */

        /* Quebra de página forçada após cada container */
        break-after: page;
        page-break-after: always;
      }

      /* Evita folha em branco após a última página */
      .print-page:last-child {
        break-after: auto;
        page-break-after: auto;
      }

      /* 3. Esconde elementos de UI (como o número da página do preview) */
      .no-print,
      [class*="print:hidden"] {
        display: none !important;
      }

      /* Estilos internos do conteúdo (Prose) */
      .prose {
        width: 100%;
        max-width: none;
        /* Padding removido - as margens já são aplicadas nas .print-page */
        padding: 0;
      }

      /* Tipografia Base (cópia simplificada para garantir renderização) */
      .prose h1 { font-family: var(--font-headings); font-size: var(--h1-size); font-weight: 700; color: ${theme.headingColor}; margin-bottom: 0.5em; line-height: 1.2; }
      .prose h2 { font-family: var(--font-headings); font-size: var(--h2-size); font-weight: 600; color: ${theme.headingColor}; margin-top: 1em; margin-bottom: 0.5em; border-bottom: 1px solid ${theme.borderColor}; padding-bottom: 0.2em; }
      .prose h3 { font-family: var(--font-headings); font-size: var(--h3-size); font-weight: 600; color: ${theme.headingColor}; margin-top: 0.8em; margin-bottom: 0.4em; }
      .prose p { margin: 0.5em 0; }
      .prose ul, .prose ol { margin: 0.5em 0 0.5em 1.5em; }
      .prose li { margin: 0.25em 0; }
      .prose a { color: ${theme.linkColor}; text-decoration: underline; }
      .prose strong { color: ${theme.textColor}; font-weight: 700; }
      .prose img { max-width: 100%; height: auto; margin: 1em 0; }
      .prose blockquote { font-family: var(--font-quote); border-left: 4px solid ${theme.linkColor}; padding-left: 1em; margin: 1em 0; font-style: italic; color: ${theme.blockquoteColor}; }

      .prose code { font-family: var(--font-code); background-color: ${theme.codeBackground}; color: ${theme.codeTextColor}; padding: 0.2em 0.4em; border-radius: 3px; font-size: 0.9em; }
      .prose pre { font-family: var(--font-code); background-color: ${theme.codeBackground}; color: ${theme.codeTextColor}; padding: 1em; border-radius: 6px; white-space: pre-wrap; margin: 1em 0; }

      .prose table { width: 100%; border-collapse: collapse; margin: 1em 0; }
      .prose th, .prose td { border: 1px solid ${theme.borderColor}; padding: 0.5em; text-align: left; }
      .prose th { background-color: ${theme.codeBackground}; font-weight: 600; }
    `

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

    // IMPORTANTE: Simula mídia de impressão para ativar classes como 'print:hidden'
    // Isso remove os números de página "1", "2" que apareciam no topo do seu PDF.
    await page.emulateMediaType('print')

    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <link href="${googleFontsUrl}" rel="stylesheet">
          <style>${styles}</style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `

    await page.setContent(fullHtml, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    })

    const pdfBuffer = await page.pdf({
      printBackground: true,
      displayHeaderFooter: false,
      preferCSSPageSize: true, // Obedece estritamente o @page do CSS
      margin: { top: 0, right: 0, bottom: 0, left: 0 }, // Zera margens da API
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
