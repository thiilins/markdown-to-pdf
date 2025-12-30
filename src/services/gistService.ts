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

  update: async (
    gistId: string,
    description: string,
  ): Promise<{ success: boolean; error?: string; data?: Gist }> => {
    const url = `/api/gists/${gistId}`

    try {
      const response = await fetchWithRetry(
        url,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ description }),
        },
        {
          maxRetries: 3,
          initialDelay: 1000,
          maxDelay: 10000,
          retryableStatuses: [503, 504, 429],
          onRetry: (attempt, error) => {
            console.log(`Tentativa ${attempt} de atualizar gist após erro:`, error.message)
          },
        },
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          error: errorData.error || 'Erro ao atualizar gist',
        }
      }

      const data = await response.json()

      return {
        success: true,
        data,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao atualizar gist',
      }
    }
  },
}
