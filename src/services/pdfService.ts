'use client'

import { fetchWithRetry } from '@/shared/utils/retry'

export const PdfService = {
  /**
   * Gera PDF via Route Handler com streaming
   * Retorna o blob do PDF direto (sem conversão base64)
   * Inclui retry exponencial para erros 503 (servidor em hot reload)
   */
  generate: async ({ html, config }: GeneratePdfParams): Promise<GeneratePdfResponse> => {
    try {
      const response = await fetchWithRetry(
        '/api/pdf',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            html,
            config,
          }),
        },
        {
          maxRetries: 3,
          initialDelay: 1000, // 1s, 2s, 4s
          maxDelay: 10000, // Máximo 10s entre tentativas
          retryableStatuses: [503, 504], // Servidor indisponível ou timeout
          onRetry: (attempt, error) => {
            console.log(`Tentativa ${attempt} de geração de PDF após erro:`, error.message)
          },
        },
      )

      // Recebe o blob direto - sem conversão base64!
      const blob = await response.blob()

      // Extrai filename do header Content-Disposition
      const contentDisposition = response.headers.get('Content-Disposition')
      let filename = 'documento.pdf'
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/)
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1]
        }
      }

      return {
        success: true,
        blob,
        filename,
      }
    } catch (error) {
      let errorMessage = 'Erro na geração do PDF'
      if (error instanceof Error) {
        errorMessage = error.message
      }
      return {
        success: false,
        error: errorMessage,
      }
    }
  },

  /**
   * Dispara o download do blob como arquivo
   */
  downloadBlob: (blob: Blob, filename: string): void => {
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()

    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  },
}
