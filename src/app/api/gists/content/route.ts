import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) return new NextResponse('URL Required', { status: 400 })

  // Segurança básica: permite apenas domínios do GitHub
  if (
    !url.startsWith('https://gist.githubusercontent.com/') &&
    !url.startsWith('https://raw.githubusercontent.com/')
  ) {
    return new NextResponse('Invalid Domain', { status: 400 })
  }

  const session = await auth()
  const headers: HeadersInit = {}

  if (session?.accessToken) {
    headers['Authorization'] = `Bearer ${session.accessToken}`
  }

  try {
    const response = await fetch(url, { headers })
    if (!response.ok) throw new Error(response.statusText)

    const content = await response.text()

    return new NextResponse(content, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch (error) {
    return new NextResponse('Failed to fetch content', { status: 500 })
  }
}
