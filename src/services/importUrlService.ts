'use client'

interface ImportUrlParams {
  url: string
}

interface ImportUrlResponse {
  success: boolean
  error?: string
  content?: string
  url?: string
  isMarkdown?: boolean
}

export const ImportUrlService = {
  /**
   * Importa conteúdo de uma URL
   * Faz validação e normalização da URL
   */
  import: async ({ url }: ImportUrlParams): Promise<ImportUrlResponse> => {
    try {
      const response = await fetch('/api/import-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        let errorMessage = 'Erro ao importar URL'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          // Ignora erro de parse
        }
        return {
          success: false,
          error: errorMessage,
        }
      }

      const data = await response.json()

      return {
        success: true,
        content: data.content,
        url: data.url,
        isMarkdown: data.isMarkdown,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido ao importar URL',
      }
    }
  },
}
