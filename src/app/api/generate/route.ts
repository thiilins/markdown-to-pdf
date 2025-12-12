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

    // 1. Configuração do Tema
    const theme = config.theme || THEME_PRESETS.modern

    // 2. Dimensões e Orientação
    const { width, height, orientation, size } = config.page
    const isLandscape = orientation === 'landscape'

    // Cálculo do formato para o Puppeteer
    let pdfFormat: any = undefined
    let pdfWidth: string | number | undefined = undefined
    let pdfHeight: string | number | undefined = undefined

    if (size === 'custom') {
      // Se for customizado, passamos as medidas exatas
      // Puppeteer aceita strings com unidade (ex: "210mm")
      pdfWidth = isLandscape ? height : width
      pdfHeight = isLandscape ? width : height
    } else {
      // Se for padrão (A4, A3, etc), usamos o formato nomeado
      pdfFormat = size.toUpperCase()
    }

    // 3. URLs de Fontes (para garantir que carreguem no PDF)
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

    // 4. CSS Otimizado para Impressão
    // CORREÇÃO: Removemos o padding do body que simulava a margem.
    // Agora o layout é "fluido" dentro da área útil definida pelo Puppeteer.
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

        /* Reset total de margens e paddings */
        margin: 0;
        padding: 0;

        box-sizing: border-box;
        min-height: 100vh;
        width: 100%;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      /* Container do conteúdo */
      .prose {
        width: 100%;
        max-width: none;
        /* Padding interno configurado pelo usuário (além da margem do papel) */
        padding: ${config.page.padding};
        box-sizing: border-box;
      }

      /* Tipografia e Estilos do Tema */
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
      .prose h4, .prose h5, .prose h6 {
        font-family: var(--font-headings);
        font-weight: 600;
        color: ${theme.headingColor};
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

      .page-break { page-break-after: always; height: 0; display: block; }
    `

    // 5. Setup do Navegador (Clean Environment para Serverless/Docker)
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
        '--disable-extensions',
      ],
    })

    const page = await browser.newPage()

    // 6. Montagem HTML
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <script src="https://cdn.tailwindcss.com"></script>
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

    await page.setContent(fullHtml, {
      waitUntil: 'networkidle0',
      timeout: 60000,
    })

    // 7. Configuração PDF com Margens Reais
    // CORREÇÃO: Aqui aplicamos a margem real no motor do PDF
    const pdfOptions: any = {
      printBackground: true,
      displayHeaderFooter: false,
      margin: {
        top: config.page.margin.top,
        right: config.page.margin.right,
        bottom: config.page.margin.bottom,
        left: config.page.margin.left,
      },
    }

    if (pdfFormat) {
      pdfOptions.format = pdfFormat
      pdfOptions.landscape = isLandscape
    } else {
      // Tamanho customizado
      pdfOptions.width = pdfWidth
      pdfOptions.height = pdfHeight
    }

    const pdfBuffer = await page.pdf(pdfOptions)
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
