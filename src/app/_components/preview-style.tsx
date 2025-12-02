import { ThemeConfig } from "@/types/config"

export const PreviewStyle = ({
  theme,
}: {
  theme: ThemeConfig
})=>{
  return (  <style jsx>{`
    .prose {
      font-family: var(--font-body), sans-serif;
      font-size: var(--base-size);
      line-height: var(--line-height);
      color: ${theme.textColor};
      background-color: ${theme.background};
    }
    .prose h1 {
      font-family: var(--font-headings), sans-serif;
      font-size: var(--h1-size);
      font-weight: 700;
      margin-top: 0;
      margin-bottom: 0.5em;
      color: ${theme.headingColor};
    }
    .prose h2 {
      font-family: var(--font-headings), sans-serif;
      font-size: var(--h2-size);
      font-weight: 600;
      margin-top: 1em;
      margin-bottom: 0.5em;
      color: ${theme.headingColor};
    }
    .prose h3 {
      font-family: var(--font-headings), sans-serif;
      font-size: var(--h3-size);
      font-weight: 600;
      margin-top: 0.8em;
      margin-bottom: 0.4em;
      color: ${theme.headingColor};
    }
    .prose p {
      margin-top: 0.5em;
      margin-bottom: 0.5em;
    }
    .prose ul,
    .prose ol {
      margin-top: 0.5em;
      margin-bottom: 0.5em;
      padding-left: 1.5em;
    }
    .prose li {
      margin-top: 0.25em;
      margin-bottom: 0.25em;
    }
    .prose code {
      font-family: var(--font-code), monospace;
      background-color: ${theme.codeBackground};
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-size: 0.9em;
      color: ${theme.codeTextColor};
    }
    .prose pre {
      font-family: var(--font-code), monospace;
      background-color: ${theme.codeBackground};
      color: ${theme.codeTextColor};
      padding: 1em;
      border-radius: 6px;
      overflow-x: auto;
      overflow-wrap: break-word;
      word-wrap: break-word;
      white-space: pre-wrap;
      word-break: break-all;
      margin-top: 1em;
      margin-bottom: 1em;
    }
    .prose pre code {
      background-color: transparent;
      color: inherit;
      padding: 0;
      white-space: pre-wrap;
      word-wrap: break-word;
      word-break: break-all;
    }
    .page-break {
      page-break-after: always;
      break-after: page;
      display: block;
      height: 0;
      margin: 2em 0;
      padding: 0;
      border: none;
      position: relative;
    }
    .page-break::after {
      content: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";
      display: block;
      text-align: center;
      color: #ccc;
      font-size: 0.7em;
      letter-spacing: 0.2em;
      margin: 1em 0;
      opacity: 0.5;
    }
    .prose blockquote {
      font-family: var(--font-quote), serif;
      border-left: 4px solid ${theme.linkColor};
      padding-left: 1em;
      margin-left: 0;
      margin-top: 1em;
      margin-bottom: 1em;
      font-style: italic;
      color: ${theme.blockquoteColor};
    }
    .prose table {
      width: 100%;
      border-collapse: collapse;
      margin: 1em 0;
    }
    .prose table th,
    .prose table td {
      border: 1px solid ${theme.borderColor};
      padding: 0.5em;
      text-align: left;
    }
    .prose table th {
      background-color: ${theme.codeBackground};
      font-weight: 600;
    }
    .prose a {
      color: ${theme.linkColor};
      text-decoration: underline;
    }
    .prose img {
      max-width: 100%;
      height: auto;
      border-radius: 4px;
      margin-top: 1em;
      margin-bottom: 1em;
    }
    .prose hr {
      border: none;
      border-top: 1px solid ${theme.borderColor};
      margin: 2em 0;
    }
    @media print {
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
      .prose {
        color: #000 !important;
        color-adjust: exact;
        print-color-adjust: exact;
      }
      .prose h1,
      .prose h2,
      .prose h3 {
        color: #000 !important;
        page-break-after: avoid;
      }
      .prose pre {
        background-color: #1e1e1e !important;
        color: #d4d4d4 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        page-break-inside: avoid;
        white-space: pre-wrap !important;
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
      }
      .prose pre code {
        white-space: pre-wrap !important;
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
      }
      .page-break {
        page-break-after: always !important;
        break-after: page !important;
      }
      .prose blockquote {
        page-break-inside: avoid;
      }
      .prose table {
        page-break-inside: avoid;
      }
      .prose img {
        page-break-inside: avoid;
      }
    }
  `}</style>)
}