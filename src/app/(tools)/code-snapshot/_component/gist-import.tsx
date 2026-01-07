'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCodeSnapshot } from '@/shared/contexts/codeSnapshotContext'
import { GistService } from '@/services/gistService'
import { Loader2, Github } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

/**
 * Componente para importar código de um GitHub Gist
 */
export function GistImport() {
  const { setCode, updateConfig } = useCodeSnapshot()
  const [gistUrl, setGistUrl] = useState('')
  const [loading, setLoading] = useState(false)

  // Extrai ID do Gist da URL
  const extractGistId = (url: string): string | null => {
    // Formato: https://gist.github.com/username/gistId ou apenas gistId
    const patterns = [
      /gist\.github\.com\/[\w-]+\/([\w]+)/, // URL completa
      /^([a-f0-9]{32}|[a-f0-9]{20})$/, // Apenas ID (32 ou 20 caracteres)
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) {
        return match[1] || match[0]
      }
    }

    return null
  }

  const handleImport = async () => {
    if (!gistUrl.trim()) {
      toast.error('Por favor, insira uma URL ou ID do Gist')
      return
    }

    const gistId = extractGistId(gistUrl.trim())
    if (!gistId) {
      toast.error('URL ou ID do Gist inválido')
      return
    }

    setLoading(true)

    try {
      // Busca o Gist
      const gistResponse = await GistService.getById(gistId)

      if (!gistResponse.success || !gistResponse.data) {
        toast.error(gistResponse.error || 'Gist não encontrado')
        return
      }

      const gist = gistResponse.data

      // Pega o primeiro arquivo do Gist
      const firstFile = gist.files[0]
      if (!firstFile) {
        toast.error('Gist não possui arquivos')
        return
      }

      // Busca o conteúdo do arquivo
      const contentResponse = await GistService.getGistContent(firstFile.raw_url)

      if (!contentResponse.success) {
        toast.error(contentResponse.error || 'Erro ao carregar conteúdo do Gist')
        return
      }

      // Define o código
      setCode(contentResponse.data)

      // Tenta detectar a linguagem automaticamente
      if (firstFile.language) {
        // Mapeia linguagem do GitHub para nosso formato
        const languageMap: Record<string, string> = {
          'JavaScript': 'javascript',
          'TypeScript': 'typescript',
          'Python': 'python',
          'Java': 'java',
          'C++': 'cpp',
          'C': 'c',
          'C#': 'csharp',
          'Go': 'go',
          'Rust': 'rust',
          'Ruby': 'ruby',
          'PHP': 'php',
          'Swift': 'swift',
          'Kotlin': 'kotlin',
          'Dart': 'dart',
          'HTML': 'html',
          'CSS': 'css',
          'SCSS': 'scss',
          'JSON': 'json',
          'YAML': 'yaml',
          'Markdown': 'markdown',
          'Shell': 'bash',
          'PowerShell': 'powershell',
          'SQL': 'sql',
          'R': 'r',
          'MATLAB': 'matlab',
          'Dockerfile': 'dockerfile',
          'Makefile': 'makefile',
        }

        const mappedLanguage = languageMap[firstFile.language] || firstFile.language.toLowerCase()
        updateConfig('language', mappedLanguage)
      }

      toast.success('Gist importado com sucesso!')
      setGistUrl('') // Limpa o campo
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao importar Gist')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="gist-url">Importar do GitHub Gist</Label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Github className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="gist-url"
            type="text"
            placeholder="Cole a URL ou ID do Gist (ex: https://gist.github.com/user/abc123...)"
            value={gistUrl}
            onChange={(e) => setGistUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !loading) {
                handleImport()
              }
            }}
            className="pl-9"
            disabled={loading}
          />
        </div>
        <Button onClick={handleImport} disabled={loading || !gistUrl.trim()}>
          {loading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Importando...
            </>
          ) : (
            'Importar'
          )}
        </Button>
      </div>
      <p className="text-muted-foreground text-xs">
        Cole a URL completa do Gist ou apenas o ID. O primeiro arquivo será importado.
      </p>
    </div>
  )
}

