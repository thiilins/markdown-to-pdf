'use client'
import { buildUrl } from '@/shared/utils'

export const GistService = {
  getAll: async ({ username, type = 'public' }: FetchGistsParams): Promise<GetAllGistsResponse> => {
    const params = {
      ...(username && { username }),
      ...(type === 'all' && { all: 'true' }),
    }
    const url = buildUrl('/api/gists', params)
    const response = await fetch(url)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`)
    }

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
  },
}
