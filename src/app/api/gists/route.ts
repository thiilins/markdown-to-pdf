// src/app/api/gists/route.ts
import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const session = await auth()
  const { searchParams } = new URL(request.url)
  const username = searchParams.get('username')
  const all = searchParams.get('all') === 'true' // Buscar todos (públicos + privados) ou apenas públicos
  let endpoint = ''
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
    'Cache-Control': 'no-store', // Gists mudam, evitamos cache agressivo aqui
  }

  // Lógica de decisão de Endpoint
  if (username) {
    // 1. Busca Pública: Gists de um usuário específico
    // Sempre retorna apenas gists públicos (não temos acesso aos privados de outros usuários)
    endpoint = `https://api.github.com/users/${username}/gists`
    // Nota: Mesmo buscando terceiros, se tivermos token, usamos para ganhar rate-limit
    if (session?.accessToken) {
      headers['Authorization'] = `Bearer ${session.accessToken}`
    }
  } else {
    // 2. Busca Pessoal: Meus Gists (requer login)
    if (!session?.accessToken) {
      return NextResponse.json(
        { error: 'Você precisa estar logado para ver seus gists ou informe um usuário.' },
        { status: 401 },
      )
    }
    // Endpoint /gists retorna todos os gists do usuário autenticado (públicos + privados)
    // Se all=false, filtraremos apenas os públicos no resultado
    endpoint = 'https://api.github.com/gists'
    headers['Authorization'] = `Bearer ${session.accessToken}`
  }

  try {
    const allGists: any[] = []
    let page = 1
    let hasMore = true

    // Se `all=true`, fazemos paginação para buscar todos os gists
    while (hasMore && (all || page === 1)) {
      const url = `${endpoint}?page=${page}&per_page=100` // Máximo permitido pela API
      const res = await fetch(url, { headers })

    if (!res.ok) {
      // Repassa o erro do GitHub (ex: 404 user not found)
        return NextResponse.json(
          { error: `Erro GitHub: ${res.statusText}` },
          { status: res.status },
        )
    }

    const data = await res.json()

      if (Array.isArray(data) && data.length > 0) {
        allGists.push(...data)
        // Verifica se há mais páginas através do header Link
        const linkHeader = res.headers.get('link')
        hasMore = linkHeader?.includes('rel="next"') ?? false
        page++
      } else {
        hasMore = false
      }

      // Limite de segurança: máximo 10 páginas (1000 gists)
      if (page > 10) {
        hasMore = false
      }
    }

    // Sanitização: Retornamos apenas o necessário para o front economizar banda
    let sanitizedGists = allGists.map((gist: any) => ({
          id: gist.id,
          description: gist.description || 'Sem descrição',
          public: gist.public,
          created_at: gist.created_at,
          html_url: gist.html_url,
          owner: {
            login: gist.owner?.login,
            avatar_url: gist.owner?.avatar_url,
          },
          files: Object.keys(gist.files).map((key) => ({
            filename: key,
            language: gist.files[key].language,
            raw_url: gist.files[key].raw_url,
            type: gist.files[key].type,
            size: gist.files[key].size,
          })),
        }))

    // Se all=false e não há username (busca "Meus Gists"), filtrar apenas públicos
    // Quando há username, sempre retorna apenas públicos (não temos acesso aos privados de outros)
    if (!all && !username) {
      sanitizedGists = sanitizedGists.filter((gist) => gist.public === true)
    }

    return NextResponse.json(sanitizedGists)
  } catch (error) {
    console.error('Erro ao buscar gists:', error)
    return NextResponse.json({ error: 'Falha interna ao processar requisição' }, { status: 500 })
  }
}
