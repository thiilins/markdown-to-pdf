import { auth } from '@/auth'
import { NextResponse } from 'next/server'

// Cache em memória (TTL de 5 minutos)
const gistsCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000

export async function GET(request: Request) {
  const session = await auth()
  const { searchParams } = new URL(request.url)
  const username = searchParams.get('username')
  const all = searchParams.get('all') === 'true'

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
