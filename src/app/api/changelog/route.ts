import fs from 'fs'
import { NextResponse } from 'next/server'
import path from 'path'

export async function GET() {
  try {
    const changelogPath = path.join(process.cwd(), 'CHANGELOG.md')
    const changelog = fs.readFileSync(changelogPath, 'utf-8')

    return new NextResponse(changelog, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch (error) {
    console.error('Erro ao carregar changelog:', error)
    return new NextResponse('Changelog não encontrado', { status: 404 })
  }
}
