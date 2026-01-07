import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()

  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${session.accessToken}`,
    }

    const res = await fetch('https://api.github.com/user', { headers })

    if (!res.ok) {
      return NextResponse.json({ error: 'Erro ao buscar usuário' }, { status: res.status })
    }

    const user = await res.json()

    return NextResponse.json({
      login: user.login,
      name: user.name,
      email: user.email,
    })
  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
