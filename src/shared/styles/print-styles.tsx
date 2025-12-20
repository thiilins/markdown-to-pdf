'use client'

import { THEME_PRESETS } from '@/shared/constants'

export const PrintStyle = ({ config }: { config: AppConfig }) => {
  const theme = config.theme || THEME_PRESETS.modern
  const headerFooter = config.headerFooter

  // Calcula padding considerando header/footer
  // IMPORTANTE: A margem superior fica ACIMA do header
  const headerHeight = headerFooter?.header.enabled ? headerFooter.header.height || '15mm' : '0'
  const footerHeight = headerFooter?.footer.enabled ? headerFooter.footer.height || '15mm' : '0'

  const paddingTop = headerFooter?.header.enabled
    ? `calc(${config.page.margin.top} + ${headerHeight})`
    : config.page.margin.top
  const paddingBottom = headerFooter?.footer.enabled
    ? `calc(${config.page.margin.bottom} + ${footerHeight})`
    : config.page.margin.bottom

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
      @media print {
        @page {
          /* Remove margem do navegador para permitir sangria (fundo colorido total) */
          margin: 0 !important;
          size: ${config.page.width} ${config.page.height};
        }

        html,
        body {
          background-color: ${theme.background} !important;
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          height: 100% !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        /* Esconde UI */
        header,
        .markdown-toolbar,
        .sidebar,
        [role="banner"],
        .no-print,
        /* Esconde scrollbars */
        ::-webkit-scrollbar {
          display: none !important;
        }

        /* Ajusta container */
        .print-content {
          margin: 0 !important;
          padding: 0 !important;
          border: none !important;
          box-shadow: none !important;
          transform: none !important;
          width: 100% !important;
        }

        /* Cada página visualizada na tela vira uma página impressa */
        .print-page {
          width: ${config.page.width} !important;
          height: ${config.page.height} !important;
          position: relative !important;

          /* Garante quebra */
          break-after: page !important;
          page-break-after: always !important;
          break-inside: avoid !important;

          /* Estilo real */
          background-color: ${theme.background} !important;
          color: ${theme.textColor} !important;

          /* Remove sombras de tela */
          box-shadow: none !important;
          margin: 0 !important;
          border: none !important;

          /* Margens internas - considera header/footer */
          padding-top: ${paddingTop} !important;
          padding-right: ${config.page.margin.right} !important;
          padding-bottom: ${paddingBottom} !important;
          padding-left: ${config.page.margin.left} !important;
        }

        /* Header - posicionado após a margem superior */
        .print-page .print-header {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          height: calc(${config.page.margin.top} + ${headerHeight}) !important;
          padding-top: ${config.page.margin.top} !important;
          padding-left: ${config.page.margin.left} !important;
          padding-right: ${config.page.margin.right} !important;
          box-sizing: border-box !important;
        }

        /* Footer - posicionado antes da margem inferior */
        .print-page .print-footer {
          position: absolute !important;
          bottom: 0 !important;
          left: 0 !important;
          right: 0 !important;
          height: calc(${config.page.margin.bottom} + ${footerHeight}) !important;
          padding-bottom: ${config.page.margin.bottom} !important;
          padding-left: ${config.page.margin.left} !important;
          padding-right: ${config.page.margin.right} !important;
          display: flex !important;
          align-items: flex-end !important;
          box-sizing: border-box !important;
        }

        /* Esconde numero de página visual na impressão se o navegador já colocar */
        .print-page .absolute {
           display: none !important;
        }
      }
    `,
      }}
    />
  )
}
