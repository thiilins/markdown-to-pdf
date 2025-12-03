'use client'

import { ThemeConfig } from '@/types/config'

export const PreviewStyle = ({ theme }: { theme: ThemeConfig }) => {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
      .prose {
        font-family: var(--font-body), sans-serif;
        font-size: var(--base-size);
        line-height: var(--line-height);
        color: ${theme.textColor} !important;
        background-color: ${theme.background} !important;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        word-wrap: break-word;
        overflow-wrap: break-word;
        hyphens: auto;
      }
      .prose h1 {
        font-family: var(--font-headings), sans-serif;
        font-size: var(--h1-size);
        font-weight: 700;
        margin-top: 0;
        margin-bottom: 0.5em;
        color: ${theme.headingColor} !important;
      }
      .prose h2 {
        font-family: var(--font-headings), sans-serif;
        font-size: var(--h2-size);
        font-weight: 600;
        margin-top: 1em;
        margin-bottom: 0.5em;
        color: ${theme.headingColor} !important;
      }
      .prose h3 {
        font-family: var(--font-headings), sans-serif;
        font-size: var(--h3-size);
        font-weight: 600;
        margin-top: 0.8em;
        margin-bottom: 0.4em;
        color: ${theme.headingColor} !important;
      }
      .prose h4, .prose h5, .prose h6 {
        font-family: var(--font-headings), sans-serif;
        font-weight: 600;
        color: ${theme.headingColor} !important;
      }
      .prose p {
        margin-top: 0.5em;
        margin-bottom: 0.5em;
        color: ${theme.textColor} !important;
        word-wrap: break-word;
        overflow-wrap: break-word;
        text-align: left;
      }
      .prose ul,
      .prose ol {
        margin-top: 0.5em;
        margin-bottom: 0.5em;
        padding-left: 1.5em;
        color: ${theme.textColor} !important;
      }
      .prose li {
        margin-top: 0.25em;
        margin-bottom: 0.25em;
        color: ${theme.textColor} !important;
      }
      .prose code {
        font-family: var(--font-code), monospace;
        background-color: ${theme.codeBackground} !important;
        padding: 0.2em 0.4em;
        border-radius: 3px;
        font-size: 0.9em;
        color: ${theme.codeTextColor} !important;
      }
      .prose pre {
        font-family: var(--font-code), monospace;
        background-color: ${theme.codeBackground} !important;
        color: ${theme.codeTextColor} !important;
        padding: 1em;
        border-radius: 6px;
        overflow-x: auto;
        overflow-wrap: break-word;
        word-wrap: break-word;
        white-space: pre-wrap;
        word-break: break-word;
        margin-top: 1em;
        margin-bottom: 1em;
      }
      .prose pre code {
        background-color: transparent !important;
        color: inherit !important;
        padding: 0;
        white-space: pre-wrap;
        word-wrap: break-word;
        word-break: break-word;
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
        content: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';
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
        color: ${theme.blockquoteColor} !important;
      }
      .prose table {
        width: 100%;
        border-collapse: collapse;
        margin: 1em 0;
        page-break-inside: avoid;
        break-inside: avoid;
      }
      .prose table th,
      .prose table td {
        border: 1px solid ${theme.borderColor};
        padding: 0.5em;
        text-align: left;
        color: ${theme.textColor} !important;
        page-break-inside: avoid;
        break-inside: avoid;
      }
      .prose table tr {
        page-break-inside: avoid;
        break-inside: avoid;
      }
      .prose table th {
        background-color: ${theme.codeBackground} !important;
        font-weight: 600;
      }
      .prose a {
        color: ${theme.linkColor} !important;
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
      .prose strong {
        color: ${theme.textColor} !important;
      }
      .prose em {
        color: ${theme.textColor} !important;
      }
      @media print {
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        .prose {
          color: ${theme.textColor} !important;
          background-color: ${theme.background} !important;
        }
        .prose h1,
        .prose h2,
        .prose h3,
        .prose h4,
        .prose h5,
        .prose h6 {
          color: ${theme.headingColor} !important;
          page-break-after: avoid;
        }
        .prose p,
        .prose li,
        .prose td,
        .prose th {
          color: ${theme.textColor} !important;
        }
        .prose pre {
          background-color: ${theme.codeBackground} !important;
          color: ${theme.codeTextColor} !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          page-break-inside: avoid;
          white-space: pre-wrap !important;
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
        }
        .prose code {
          background-color: ${theme.codeBackground} !important;
          color: ${theme.codeTextColor} !important;
        }
        .prose pre code {
          background-color: transparent !important;
          color: inherit !important;
          white-space: pre-wrap !important;
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
        }
        .prose a {
          color: ${theme.linkColor} !important;
        }
        .prose blockquote {
          color: ${theme.blockquoteColor} !important;
          border-left-color: ${theme.linkColor} !important;
          page-break-inside: avoid;
        }
        .prose table th {
          background-color: ${theme.codeBackground} !important;
        }
        .page-break {
          page-break-after: always !important;
          break-after: page !important;
        }
        .prose table {
          page-break-inside: avoid;
        }
        .prose img {
          page-break-inside: avoid;
        }
      }
    `,
      }}
    />
  )
}
