'use client'

import { AppConfig, THEME_PRESETS } from '@/types/config'

export const PrintStyle = ({ config }: { config: AppConfig }) => {
  const theme = config.theme || THEME_PRESETS.modern

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
      @media print {
        @page {
          size: ${config.page.width} ${config.page.height};
          margin: ${config.page.margin.top} ${config.page.margin.right} ${config.page.margin.bottom} ${config.page.margin.left};
        }

        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }

        html,
        body {
          background: ${theme.background} !important;
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          height: auto !important;
          overflow: visible !important;
        }

        /* Remove zoom e transformações na impressão */
        .print-content {
          transform: none !important;
          scale: 1 !important;
          width: ${config.page.orientation === 'landscape' ? config.page.height : config.page.width} !important;
          min-height: ${config.page.orientation === 'landscape' ? config.page.width : config.page.height} !important;
          margin: 0 !important;
          padding: ${config.page.padding} !important;
          box-shadow: none !important;
          background-color: ${theme.background} !important;
        }

        /* Esconde elementos que não devem ser impressos */
        header,
        .resizable-panel-group,
        .resizable-handle,
        [data-slot='resizable-panel-group'],
        [data-slot='resizable-handle'] {
          display: none !important;
        }

        /* Garante que o conteúdo seja impresso corretamente com as cores do tema */
        .prose {
          color: ${theme.textColor} !important;
          background-color: ${theme.background} !important;
          max-width: 100% !important;
        }

        .prose h1,
        .prose h2,
        .prose h3,
        .prose h4,
        .prose h5,
        .prose h6 {
          color: ${theme.headingColor} !important;
          page-break-after: avoid;
          break-after: avoid;
        }

        .prose p,
        .prose li,
        .prose td,
        .prose th,
        .prose strong,
        .prose em {
          color: ${theme.textColor} !important;
        }

        .prose pre {
          background-color: ${theme.codeBackground} !important;
          color: ${theme.codeTextColor} !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          page-break-inside: avoid;
          break-inside: avoid;
        }

        .prose code {
          background-color: ${theme.codeBackground} !important;
          color: ${theme.codeTextColor} !important;
        }

        .prose pre code {
          background-color: transparent !important;
          color: inherit !important;
        }

        .prose a {
          color: ${theme.linkColor} !important;
        }

        .prose blockquote {
          color: ${theme.blockquoteColor} !important;
          border-left-color: ${theme.linkColor} !important;
          page-break-inside: avoid;
          break-inside: avoid;
        }

        .prose table th {
          background-color: ${theme.codeBackground} !important;
        }

        .prose table,
        .prose img {
          page-break-inside: avoid;
          break-inside: avoid;
        }
      }
    `,
      }}
    />
  )
}
