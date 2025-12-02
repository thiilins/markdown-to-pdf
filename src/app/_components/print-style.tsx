import { AppConfig } from "@/types/config"

export const PrintStyle = ({config}: {config: AppConfig})=>{
 return ( <style jsx global>{`
    @media print {
      @page {
        size: ${config.page.width} ${config.page.height};
        margin: ${config.page.margin.top} ${config.page.margin.right}
          ${config.page.margin.bottom} ${config.page.margin.left};
      }

      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }

      html,
      body {
        background: white !important;
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
        width: ${config.page.orientation === "landscape" ? config.page.height : config.page.width} !important;
        min-height: ${config.page.orientation === "landscape" ? config.page.width : config.page.height} !important;
        margin: 0 !important;
        padding: ${config.page.padding} !important;
        box-shadow: none !important;
      }

      /* Esconde elementos que não devem ser impressos */
      header,
      .resizable-panel-group,
      .resizable-handle,
      [data-slot="resizable-panel-group"],
      [data-slot="resizable-handle"] {
        display: none !important;
      }

      /* Garante que o conteúdo seja impresso corretamente */
      .prose {
        color: #000 !important;
        max-width: 100% !important;
      }

      .prose pre {
        background-color: #1e1e1e !important;
        color: #d4d4d4 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        page-break-inside: avoid;
        break-inside: avoid;
      }

      /* Suporte a múltiplas páginas */
      .prose h1,
      .prose h2,
      .prose h3 {
        page-break-after: avoid;
        break-after: avoid;
      }

      .prose blockquote,
      .prose table,
      .prose img {
        page-break-inside: avoid;
        break-inside: avoid;
      }
    }
  `}</style>)
}