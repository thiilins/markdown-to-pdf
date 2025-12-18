import { THEME_PRESETS } from '../constants'

/**
 * Estilos de impressão específicos para o Gist Explorer
 * - Usa cores do TEMA GLOBAL (background, textColor, etc.)
 * - Tamanho de página, margem e padding são FIXOS (A4, 15mm)
 */
export function GistPrintStyle({ config }: { config: AppConfig }) {
  const theme = config.theme || THEME_PRESETS.modern

  // Valores FIXOS para o Gist Explorer
  const PAGE_WIDTH = '210mm'
  const PAGE_HEIGHT = '297mm'
  const MARGIN = '15mm'

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
      @media print {
        @page {
          margin: 0 !important;
          size: ${PAGE_WIDTH} ${PAGE_HEIGHT};
        }

        /* Esconde elementos de UI */
        header,
        nav,
        aside,
        .sidebar,
        .gist-sidebar,
        [role="banner"],
        [role="navigation"],
        .no-print,
        ::-webkit-scrollbar {
          display: none !important;
        }

        /* Reset do body - SANGRIA TOTAL */
        html, body {
          background-color: ${theme.background} !important;
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          height: 100% !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        /* Container principal - preenche página toda com padding interno */
        #gist-render-area {
          position: static !important;
          display: block !important;
          width: 100% !important;
          min-height: 100% !important;
          height: auto !important;
          margin: 0 !important;
          padding: ${MARGIN} !important;
          box-sizing: border-box !important;
          overflow: visible !important;

          /* Cores do TEMA GLOBAL - preenche página toda */
          background-color: ${theme.background} !important;
          color: ${theme.textColor} !important;

          box-shadow: none !important;
          border: none !important;
        }

        /* Remove TODOS os containers intermediários */
        #gist-render-area > *,
        #gist-render-area > * > *,
        #gist-render-area > * > * > *,
        #gist-render-area .prose,
        #gist-render-area .custom-scrollbar,
        #gist-render-area [class*="max-w-"],
        #gist-render-area [class*="rounded"],
        #gist-render-area [class*="shadow"],
        #gist-render-area [class*="border"],
        #gist-render-area [class*="p-"],
        #gist-render-area [class*="md:p-"] {
          max-width: none !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          box-shadow: none !important;
          border: none !important;
          border-radius: 0 !important;
          background-color: ${theme.background} !important;
        }

        /* Aplica cores do tema aos elementos internos */
        #gist-render-area h1,
        #gist-render-area h2,
        #gist-render-area h3,
        #gist-render-area h4,
        #gist-render-area h5,
        #gist-render-area h6 {
          color: ${theme.headingColor} !important;
        }

        #gist-render-area a {
          color: ${theme.linkColor} !important;
        }

        #gist-render-area blockquote {
          color: ${theme.blockquoteColor} !important;
          border-color: ${theme.borderColor} !important;
        }

        #gist-render-area pre,
        #gist-render-area code {
          background-color: ${theme.codeBackground} !important;
          color: ${theme.codeTextColor} !important;
          white-space: pre-wrap !important;
          word-wrap: break-word !important;
        }

        #gist-render-area table,
        #gist-render-area th,
        #gist-render-area td {
          border-color: ${theme.borderColor} !important;
        }

        /* Esconde botão de copiar código */
        #copy-code-button,
        [data-pdf-hide] {
          display: none !important;
        }
      }
    `,
      }}
    />
  )
}
