import { invalidateGistsCache } from '@/app/api/gists/route'
import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  const { id } = await params

  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    // Primeiro, busca o gist atual para verificar seu status de visibilidade
    // IMPORTANTE: Gists públicos NÃO podem ser tornados privados (restrição do GitHub)
    const currentGistRes = await fetch(`https://api.github.com/gists/${id}`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${session.accessToken}`,
      },
    })

    if (!currentGistRes.ok) {
      return NextResponse.json({ error: 'Gist não encontrado' }, { status: currentGistRes.status })
    }

    const currentGist = await currentGistRes.json()
    const currentIsPublic = currentGist.public === true

    const body = await request.json()
    // Extrai os campos do body (usando acesso direto para evitar problemas com palavra reservada)
    const description = body.description
    const files = body.files
    const isPublic = body.public // Acessa diretamente para garantir que seja capturado

    // Validação crítica: Gists públicos NÃO podem ser tornados privados via PATCH
    // Solução: Criar novo gist privado e deletar o público (conversão)
    if (currentIsPublic && typeof isPublic === 'boolean' && isPublic === false) {
      // Flag especial para indicar que precisa fazer conversão
      return NextResponse.json(
        {
          error: 'CONVERSION_REQUIRED',
          message:
            'Para tornar um gist público em privado, é necessário criar um novo gist privado e deletar o público. Isso resultará em uma nova URL.',
          currentGist: {
            id: currentGist.id,
            description: currentGist.description,
            files: currentGist.files,
          },
        },
        { status: 422 },
      )
    }

    // Nota: Gists privados podem ser tornados públicos enviando public: true no PATCH
    // O GitHub aceita essa mudança, então permitimos o envio do campo public

    // Debug: log do body recebido
    console.log('[PATCH /api/gists/[id]] Body recebido:', JSON.stringify(body, null, 2))
    console.log('[PATCH /api/gists/[id]] isPublic extraído:', isPublic, typeof isPublic)
    console.log('[PATCH /api/gists/[id]] Gist atual é público:', currentIsPublic)

    // Validação: pelo menos description, files ou public deve ser fornecido (conforme documentação GitHub)
    if (!description && !files && isPublic === undefined) {
      return NextResponse.json(
        { error: 'Pelo menos um dos campos: description, files ou public é obrigatório' },
        { status: 400 },
      )
    }

    // Valida description se fornecido
    if (description !== undefined && typeof description !== 'string') {
      return NextResponse.json({ error: 'Descrição deve ser uma string' }, { status: 400 })
    }

    // Valida files se fornecido
    if (files !== undefined && (typeof files !== 'object' || Array.isArray(files))) {
      return NextResponse.json({ error: 'Files deve ser um objeto' }, { status: 400 })
    }

    // Valida public se fornecido
    if (isPublic !== undefined && typeof isPublic !== 'boolean') {
      return NextResponse.json({ error: 'Public deve ser um boolean' }, { status: 400 })
    }

    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
    }

    // Prepara o body para o GitHub
    const githubBody: {
      description?: string
      files?: Record<string, { content: string } | null>
      public?: boolean
    } = {}

    // Adiciona description se fornecido
    if (description !== undefined) {
      githubBody.description = description.trim()
    }

    // Adiciona files se fornecido (formato GitHub: { "filename": { "content": "..." } })
    if (files !== undefined) {
      const formattedFiles: Record<string, { content: string } | null> = {}
      for (const [filename, fileData] of Object.entries(files)) {
        if (fileData === null) {
          // Para deletar arquivo, envia null
          formattedFiles[filename] = null
        } else if (typeof fileData === 'string') {
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
      githubBody.files = formattedFiles
    }

    // Adiciona public se fornecido (sempre envia se for boolean, incluindo false)
    // O GitHub aceita public como boolean para alterar a visibilidade
    if (typeof isPublic === 'boolean') {
      githubBody.public = isPublic
    }

    // Debug: log do body que será enviado ao GitHub
    console.log(
      '[PATCH /api/gists/[id]] Body enviado ao GitHub:',
      JSON.stringify(githubBody, null, 2),
    )

    // Atualiza o gist via API do GitHub
    const res = await fetch(`https://api.github.com/gists/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(githubBody),
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      console.error('[PATCH /api/gists/[id]] Erro do GitHub:', res.status, errorData)
      return NextResponse.json(
        { error: errorData.message || 'Erro ao atualizar gist' },
        { status: res.status },
      )
    }

    const updatedGist = await res.json()
    console.log(
      '[PATCH /api/gists/[id]] Resposta do GitHub:',
      JSON.stringify(
        {
          id: updatedGist.id,
          public: updatedGist.public,
          description: updatedGist.description,
        },
        null,
        2,
      ),
    )

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

    // Invalida o cache para o owner do gist e para o usuário logado
    // Isso garante que a próxima busca retorne os dados atualizados
    invalidateGistsCache(updatedGist.owner?.login, session?.user?.email || undefined)

    return NextResponse.json(sanitizedGist)
  } catch (error) {
    console.error('Erro ao atualizar gist:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  const { id } = await params

  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    // Busca o gist antes de deletar para invalidar o cache corretamente
    const currentGistRes = await fetch(`https://api.github.com/gists/${id}`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${session.accessToken}`,
      },
    })

    let ownerLogin: string | undefined
    if (currentGistRes.ok) {
      const currentGist = await currentGistRes.json()
      ownerLogin = currentGist.owner?.login
    }

    // Deleta o gist via API do GitHub
    const res = await fetch(`https://api.github.com/gists/${id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${session.accessToken}`,
      },
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.message || 'Erro ao deletar gist' },
        { status: res.status },
      )
    }

    // Invalida o cache após deletar
    invalidateGistsCache(ownerLogin, session?.user?.email || undefined)

    return NextResponse.json({ success: true, message: 'Gist deletado com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar gist:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
