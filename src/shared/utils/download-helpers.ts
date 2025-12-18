// src/shared/utils/download-helpers.ts

/**
 * Dispara o download de um arquivo genérico no navegador.
 */
export function triggerDownload(
  content: string | Blob,
  filename: string,
  mimeType: string = 'text/plain',
) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Converte Base64 em Blob e dispara o download do PDF.
 */
export function downloadBase64PDF(base64Data: string, filename: string) {
  const binaryString = atob(base64Data)
  const length = binaryString.length
  const bytes = new Uint8Array(length)
  for (let i = 0; i < length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  const blob = new Blob([bytes], { type: 'application/pdf' })
  triggerDownload(blob, filename, 'application/pdf')
}

/**
 * Helper específico para Markdown (mantido para compatibilidade).
 */
export function downloadMarkdownFile(content: string, filename: string) {
  triggerDownload(content, filename, 'text/markdown')
}
