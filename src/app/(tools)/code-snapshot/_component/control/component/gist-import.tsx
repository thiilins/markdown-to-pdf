'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GistService } from '@/services/gistService'
import { useCodeSnapshot } from '@/shared/contexts/codeSnapshotContext'
import { Github, Link2, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { WidgetWrapper } from '.'

export function GistImport() {
  const { setCode, updateConfig } = useCodeSnapshot()
  const [gistUrl, setGistUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const extractGistId = (url: string): string | null => {
    const patterns = [/gist\.github\.com\/[\w-]+\/([\w]+)/, /^([a-f0-9]{32}|[a-f0-9]{20})$/]
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1] || match[0]
    }
    return null
  }

  const handleImport = async () => {
    if (!gistUrl.trim()) return toast.error('Insira uma URL ou ID do Gist')
    const gistId = extractGistId(gistUrl.trim())
    if (!gistId) return toast.error('URL ou ID inválido')

    setLoading(true)
    try {
      const gistResponse = await GistService.getById(gistId)
      if (!gistResponse.success || !gistResponse.data)
        throw new Error(gistResponse.error || 'Não encontrado')

      const gist = gistResponse.data
      const firstFile = gist.files[0]
      if (!firstFile) throw new Error('Gist sem arquivos')

      const contentResponse = await GistService.getGistContent(firstFile.raw_url)
      if (!contentResponse.success) throw new Error('Erro ao carregar conteúdo')

      setCode(contentResponse.data)

      if (firstFile.language) {
        const languageMap: Record<string, string> = {
          JavaScript: 'javascript',
          TypeScript: 'typescript',
          Python: 'python',
          Java: 'java',
          'C++': 'cpp',
          'C#': 'csharp',
          Go: 'go',
          Rust: 'rust',
          HTML: 'html',
          CSS: 'css',
          JSON: 'json',
          Markdown: 'markdown',
          Shell: 'bash',
        }
        updateConfig(
          'language',
          languageMap[firstFile.language] || firstFile.language.toLowerCase(),
        )
      }
      toast.success('Gist importado!')
      setGistUrl('')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <WidgetWrapper
      title='Importar Gist'
      subtitle='Integração GitHub'
      icon={Github}
      colorClass='indigo'>
      <div className='space-y-4'>
        <div className='space-y-2.5'>
          <Label className='text-[11px] font-bold text-slate-500 uppercase'>
            URL ou ID do Gist
          </Label>
          <div className='flex flex-col gap-2'>
            <div className='relative'>
              <Link2 className='absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400' />
              <Input
                placeholder='https://gist.github.com/...'
                value={gistUrl}
                onChange={(e) => setGistUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !loading && handleImport()}
                className='h-10 border-slate-200 bg-slate-50/50 pl-9 text-xs focus-visible:ring-indigo-400'
                disabled={loading}
              />
            </div>
            <Button
              onClick={handleImport}
              disabled={loading || !gistUrl.trim()}
              className='h-10 w-full bg-indigo-600 font-bold shadow-md shadow-indigo-200/50 transition-all hover:bg-indigo-700'>
              {loading ? (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                <Github className='mr-2 h-4 w-4' />
              )}
              {loading ? 'Importando...' : 'Importar Código'}
            </Button>
          </div>
        </div>
        <p className='px-1 text-[10px] leading-relaxed font-medium text-slate-400 italic'>
          O primeiro arquivo detectado no Gist será carregado automaticamente no editor.
        </p>
      </div>
    </WidgetWrapper>
  )
}
