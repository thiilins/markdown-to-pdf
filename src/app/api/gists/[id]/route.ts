import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  const { id } = await params

  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { description } = body

    if (!description || typeof description !== 'string') {
      return NextResponse.json({ error: 'Descrição inválida' }, { status: 400 })
    }

    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
    }

    // Atualiza o gist via API do GitHub
    const res = await fetch(`https://api.github.com/gists/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        description: description.trim(),
      }),
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.message || 'Erro ao atualizar gist' },
        { status: res.status },
      )
    }

    const updatedGist = await res.json()

    // Sanitiza a resposta
    const sanitizedGist = {
      id: updatedGist.id,
      description: updatedGist.description || '',
      public: updatedGist.public,
      created_at: updatedGist.created_at,
      owner: {
        login: updatedGist.owner?.login,
        avatar_url: updatedGist.owner?.avatar_url,
      },
      files: Object.keys(updatedGist.files).map((key) => ({
        filename: key,
        language: updatedGist.files[key].language,
        raw_url: updatedGist.files[key].raw_url,
        size: updatedGist.files[key].size,
      })),
    }

    return NextResponse.json(sanitizedGist)
  } catch (error) {
    console.error('Erro ao atualizar gist:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

