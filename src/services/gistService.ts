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

  getById: async (gistId: string): Promise<{ success: boolean; error?: string; data?: Gist }> => {
    const url = buildUrl('/api/gists', { id: gistId })

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
            console.log(`Tentativa ${attempt} de buscar gist por ID após erro:`, error.message)
          },
        },
      )

      const data = await response.json()

      if (!Array.isArray(data) || data.length === 0) {
        return {
          success: false,
          error: 'Gist não encontrado',
        }
      }

      return {
        success: true,
        data: data[0],
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao buscar gist',
      }
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
    isPublic: boolean,
    files?: Record<string, string>,
  ): Promise<{ success: boolean; error?: string; data?: Gist }> => {
    const url = `/api/gists/${gistId}`

    try {
      // Validação: description deve ser uma string válida (pode ser vazia após trim)
      const trimmedDescription = typeof description === 'string' ? description.trim() : ''

      // Prepara o body conforme a API route espera
      // A API route valida que pelo menos description ou files seja fornecido
      const body: { description?: string; public?: boolean; files?: Record<string, string> } = {}

      // Só adiciona description se não estiver vazia ou se files não for fornecido
      if (trimmedDescription || !files) {
        body.description = trimmedDescription
      }

      if (files) {
        body.files = files
      }

      // Sempre envia public se fornecido
      body.public = isPublic

      const response = await fetchWithRetry(
        url,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
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
        // Se for erro 422 com CONVERSION_REQUIRED, retorna o erro especial
        if (response.status === 422 && errorData.error === 'CONVERSION_REQUIRED') {
          return {
            success: false,
            error: 'CONVERSION_REQUIRED',
          }
        }
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

  create: async (
    description: string,
    files: Record<string, string>,
    isPublic: boolean,
  ): Promise<{ success: boolean; error?: string; data?: Gist }> => {
    const url = '/api/gists'

    try {
      // Validação: deve ter pelo menos um arquivo com conteúdo
      if (!files || Object.keys(files).length === 0) {
        return {
          success: false,
          error: 'Pelo menos um arquivo é obrigatório',
        }
      }

      // Validação: description deve ser uma string válida
      const trimmedDescription = typeof description === 'string' ? description.trim() : ''

      // Prepara o body conforme a API route espera
      // A API route converte automaticamente strings para { content: "..." }
      const body: { description: string; files: Record<string, string>; public: boolean } = {
        description: trimmedDescription,
        files,
        public: isPublic,
      }

      const response = await fetchWithRetry(
        url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        },
        {
          maxRetries: 3,
          initialDelay: 1000,
          maxDelay: 10000,
          retryableStatuses: [503, 504, 429],
          onRetry: (attempt, error) => {
            console.log(`Tentativa ${attempt} de criar gist após erro:`, error.message)
          },
        },
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          error: errorData.error || 'Erro ao criar gist',
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
        error: error instanceof Error ? error.message : 'Erro ao criar gist',
      }
    }
  },

  duplicate: async (
    gist: Gist,
    description: string,
    isPublic: boolean,
  ): Promise<{ success: boolean; error?: string; data?: Gist }> => {
    const url = '/api/gists'

    try {
      // Validação: gist deve ter pelo menos um arquivo
      if (!gist.files || gist.files.length === 0) {
        return {
          success: false,
          error: 'Gist não possui arquivos para duplicar',
        }
      }

      // Primeiro, busca o conteúdo de todos os arquivos do gist
      const filesContent: Record<string, string> = {}
      const filesPromises = gist.files.map(async (file) => {
        if (!file.raw_url) {
          throw new Error(`Arquivo ${file.filename} não possui URL válida`)
        }
        const contentResponse = await GistService.getGistContent(file.raw_url)
        if (contentResponse.success && contentResponse.data) {
          filesContent[file.filename] = contentResponse.data
        } else {
          throw new Error(
            `Erro ao carregar conteúdo do arquivo ${file.filename}: ${contentResponse.error || 'Conteúdo vazio'}`,
          )
        }
      })

      await Promise.all(filesPromises)

      // Validação: deve ter pelo menos um arquivo com conteúdo
      if (Object.keys(filesContent).length === 0) {
        return {
          success: false,
          error: 'Nenhum arquivo foi carregado com sucesso',
        }
      }

      // Validação: description deve ser uma string válida
      const trimmedDescription = typeof description === 'string' ? description.trim() : ''

      // Prepara o body conforme a API route espera
      // A API route converte automaticamente strings para { content: "..." }
      const body: { description: string; files: Record<string, string>; public: boolean } = {
        description: trimmedDescription,
        files: filesContent,
        public: isPublic,
      }

      const response = await fetchWithRetry(
        url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        },
        {
          maxRetries: 3,
          initialDelay: 1000,
          maxDelay: 10000,
          retryableStatuses: [503, 504, 429],
          onRetry: (attempt, error) => {
            console.log(`Tentativa ${attempt} de duplicar gist após erro:`, error.message)
          },
        },
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          error: errorData.error || 'Erro ao duplicar gist',
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
        error: error instanceof Error ? error.message : 'Erro ao duplicar gist',
      }
    }
  },

  delete: async (gistId: string): Promise<{ success: boolean; error?: string }> => {
    const url = `/api/gists/${gistId}`

    try {
      const response = await fetchWithRetry(
        url,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        },
        {
          maxRetries: 3,
          initialDelay: 1000,
          maxDelay: 10000,
          retryableStatuses: [503, 504, 429],
          onRetry: (attempt, error) => {
            console.log(`Tentativa ${attempt} de deletar gist após erro:`, error.message)
          },
        },
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          error: errorData.error || 'Erro ao deletar gist',
        }
      }

      return {
        success: true,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao deletar gist',
      }
    }
  },

  convertPublicToPrivate: async (
    gist: Gist,
    description: string,
  ): Promise<{ success: boolean; error?: string; data?: Gist }> => {
    try {
      // Usa o gist passado como parâmetro (já temos ele no contexto)
      const currentGist = gist

      if (!currentGist || !currentGist.files || currentGist.files.length === 0) {
        return {
          success: false,
          error: 'Gist inválido ou sem arquivos',
        }
      }

      // 2. Busca o conteúdo de todos os arquivos
      const filesContent: Record<string, string> = {}
      const filesPromises = currentGist.files.map(async (file: GistFile) => {
        const contentResponse = await GistService.getGistContent(file.raw_url)
        if (contentResponse.success && contentResponse.data) {
          filesContent[file.filename] = contentResponse.data
        } else {
          throw new Error(`Erro ao carregar conteúdo do arquivo ${file.filename}`)
        }
      })

      await Promise.all(filesPromises)

      if (Object.keys(filesContent).length === 0) {
        return {
          success: false,
          error: 'Nenhum arquivo foi carregado com sucesso',
        }
      }

      // 3. Cria novo gist privado
      const createResponse = await GistService.duplicate(currentGist, description, false)
      if (!createResponse.success || !createResponse.data) {
        return {
          success: false,
          error: createResponse.error || 'Erro ao criar novo gist privado',
        }
      }

      const newGist = createResponse.data

      // 4. Deleta o gist público antigo
      const deleteResponse = await GistService.delete(currentGist.id)
      if (!deleteResponse.success) {
        // Se falhar ao deletar, pelo menos o novo gist foi criado
        return {
          success: false,
          error: `Novo gist privado criado, mas falha ao deletar o público: ${deleteResponse.error}`,
          data: newGist,
        }
      }

      return {
        success: true,
        data: newGist,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao converter gist',
      }
    }
  },
}
