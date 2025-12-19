'use client'
import { buildUrl } from '@/shared/utils'
import { fetchWithRetry } from '@/shared/utils/retry'

export const GistService = {
  getAll: async ({ username, type = 'public' }: FetchGistsParams): Promise<GetAllGistsResponse> => {
    const params = {
      ...(username && { username }),
      ...(type === 'all' && { all: 'true' }),
    }
    const url = buildUrl('/api/gists', params)

    try {
      const response = await fetchWithRetry(
        url,
        {},
        {
          maxRetries: 3,
          initialDelay: 1000,
          maxDelay: 10000,
          retryableStatuses: [503, 504, 429],
          onRetry: (attempt, error) => {
            console.log(`Tentativa ${attempt} de buscar gists após erro:`, error.message)
          },
        },
      )

      const data = await response.json()

      if (!Array.isArray(data)) {
        const response = {
          success: false,
          error: 'Formato de resposta inválido (esperado array).',
          data: [],
          rawData: data,
        }
        console.error(response)
        return response
      }

      return {
        success: true,
        data,
      }
    } catch (error) {
      const errorData = error instanceof Error ? { error: error.message } : {}
      throw new Error(
        errorData.error ||
          `Erro ao buscar gists: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      )
    }
  },

  getGistContent: async (
    fileRawUrl: string,
  ): Promise<{ success: boolean; error?: string; data: string; rawData?: Response }> => {
    const params = {
      url: fileRawUrl,
    }
    const url = buildUrl('/api/gists/content', params)

    try {
      const response = await fetchWithRetry(
        url,
        {},
        {
          maxRetries: 3,
          initialDelay: 1000,
          maxDelay: 10000,
          retryableStatuses: [503, 504, 429],
          onRetry: (attempt, error) => {
            console.log(
              `Tentativa ${attempt} de carregar conteúdo do gist após erro:`,
              error.message,
            )
          },
        },
      )
      const content = await response.text()
      return {
        success: true,
        data: content,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Falha ao carregar arquivo',
        data: '',
      }
    }
  },
}
