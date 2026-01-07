import { auth } from '@/auth'
import { NextResponse } from 'next/server'

// Cache em memória (TTL de 5 minutos)
export const gistsCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000

/**
 * Invalida o cache de gists para um usuário específico
 * @param username - Username do GitHub ou email do usuário
 */
export function invalidateGistsCache(username?: string, sessionEmail?: string) {
  if (username) {
    // Invalida cache para busca por username
    gistsCache.delete(`${username}-true`)
    gistsCache.delete(`${username}-false`)
  }
  if (sessionEmail) {
    // Invalida cache para "meus gists"
    gistsCache.delete(`${sessionEmail}-true`)
    gistsCache.delete(`${sessionEmail}-false`)
  }
  // Se não especificar, invalida todos (último recurso)
  if (!username && !sessionEmail) {
    gistsCache.clear()
  }
}

export async function GET(request: Request) {
  const session = await auth()
  const { searchParams } = new URL(request.url)
  const gistId = searchParams.get('id')
  const username = searchParams.get('username')
  const all = searchParams.get('all') === 'true'

  // Se buscar por ID específico
  if (gistId) {
    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
    }
    if (session?.accessToken) {
      headers['Authorization'] = `Bearer ${session.accessToken}`
    }

    try {
      const res = await fetch(`https://api.github.com/gists/${gistId}`, { headers })
      if (!res.ok)
        return NextResponse.json({ error: 'Gist não encontrado' }, { status: res.status })

      const gist = await res.json()
      // Sanitiza a resposta
      const sanitizedGist = {
        id: gist.id,
        description: gist.description || 'Sem descrição',
        public: gist.public,
        created_at: gist.created_at,
        owner: { login: gist.owner?.login, avatar_url: gist.owner?.avatar_url },
        files: Object.keys(gist.files).map((key) => ({
          filename: key,
          language: gist.files[key].language,
          raw_url: gist.files[key].raw_url,
          size: gist.files[key].size,
        })),
      }

      return NextResponse.json([sanitizedGist]) // Retorna como array para manter compatibilidade
    } catch (error) {
      return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
    }
  }

  // Chave do cache baseada no usuário/sessão
  const cacheKey = `${username || session?.user?.email}-${all}`
  const cached = gistsCache.get(cacheKey)

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data)
  }

  let endpoint = ''
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
  }

  if (username) {
    endpoint = `https://api.github.com/users/${username}/gists`
    if (session?.accessToken) {
      headers['Authorization'] = `Bearer ${session.accessToken}`
    }
  } else {
    if (!session?.accessToken) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }
    endpoint = 'https://api.github.com/gists'
    headers['Authorization'] = `Bearer ${session.accessToken}`
  }

  try {
    const res = await fetch(`${endpoint}?per_page=100`, { headers })
    if (!res.ok) return NextResponse.json({ error: 'Erro GitHub' }, { status: res.status })

    const data = await res.json()
    // Sanitização mantida conforme seu código original
    const sanitizedGists = data.map((gist: any) => ({
      id: gist.id,
      description: gist.description || 'Sem descrição',
      public: gist.public,
      created_at: gist.created_at,
      owner: { login: gist.owner?.login, avatar_url: gist.owner?.avatar_url },
      files: Object.keys(gist.files).map((key) => ({
        filename: key,
        language: gist.files[key].language,
        raw_url: gist.files[key].raw_url,
        size: gist.files[key].size,
      })),
    }))

    // Salva no cache antes de retornar
    gistsCache.set(cacheKey, { data: sanitizedGists, timestamp: Date.now() })

    return NextResponse.json(sanitizedGists)
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { description, files, public: isPublic = false } = body

    // Validação: files é obrigatório e deve ser um objeto (não array)
    if (
      !files ||
      typeof files !== 'object' ||
      Array.isArray(files) ||
      Object.keys(files).length === 0
    ) {
      return NextResponse.json(
        { error: 'Arquivos são obrigatórios e devem ser um objeto com pelo menos um arquivo' },
        { status: 400 },
      )
    }

    // Converte o formato de arquivos para o formato esperado pela API do GitHub
    // GitHub espera: { "filename": { "content": "..." } }
    // Recebemos: { "filename": "..." } ou { "filename": { "content": "..." } }
    const formattedFiles: Record<string, { content: string }> = {}
    for (const [filename, fileData] of Object.entries(files)) {
      if (typeof fileData === 'string') {
        // Se for string, converte para objeto com content
        formattedFiles[filename] = { content: fileData }
      } else if (fileData && typeof fileData === 'object' && 'content' in fileData) {
        // Se já for objeto com content, usa diretamente
        formattedFiles[filename] = fileData as { content: string }
      } else {
        return NextResponse.json(
          { error: `Formato inválido para arquivo ${filename}` },
          { status: 400 },
        )
      }
    }

    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
    }

    // Cria o gist via API do GitHub
    const res = await fetch('https://api.github.com/gists', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        description: description?.trim() || '',
        public: isPublic,
        files: formattedFiles,
      }),
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.message || 'Erro ao criar gist' },
        { status: res.status },
      )
    }

    const newGist = await res.json()

    // Sanitiza a resposta
    const sanitizedGist = {
      id: newGist.id,
      description: newGist.description || '',
      public: newGist.public,
      created_at: newGist.created_at,
      owner: {
        login: newGist.owner?.login,
        avatar_url: newGist.owner?.avatar_url,
      },
      files: Object.keys(newGist.files).map((key) => ({
        filename: key,
        language: newGist.files[key].language,
        raw_url: newGist.files[key].raw_url,
        size: newGist.files[key].size,
      })),
    }

    // Invalida o cache para que o novo gist apareça na próxima busca
    invalidateGistsCache(undefined, session?.user?.email || undefined)

    return NextResponse.json(sanitizedGist)
  } catch (error) {
    console.error('Erro ao criar gist:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
