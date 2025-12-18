'use client'

import { Button } from '@/components/ui/button'
import { useGist } from '@/shared/contexts/gistContext'
import { useMDToPdf } from '@/shared/contexts/mdToPdfContext'
import { mergeGistFiles, wrapContentInMarkdown } from '@/shared/utils/gist-tools'
import { ExternalLink, FileEdit, Import } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { toast } from 'sonner'

export function GistPreviewHeader() {
  const { selectedGist, selectedFile, fileContents } = useGist()
  const { setMarkdown } = useMDToPdf()
  const router = useRouter()

  // Deriva o conteúdo do arquivo atual baseado no dicionário do contexto
  const currentContent = useMemo(() => {
    if (!selectedFile) return ''
    return fileContents[selectedFile.filename] || ''
  }, [selectedFile, fileContents])

  if (!selectedGist) return null

  const handleOpenInGitHub = () => {
    window.open(selectedGist.html_url, '_blank')
  }

  // Ação 1: Importar arquivo atual para o editor
  const handleEditFile = () => {
    if (!selectedFile || !currentContent) return

    const finalContent = wrapContentInMarkdown(selectedFile.filename, currentContent)

    setMarkdown(finalContent)
    toast.success(`Arquivo "${selectedFile.filename}" carregado no editor!`)
    router.push('/md-to-pdf')
  }

  // Ação 2: Importar TODOS os arquivos mesclados
  const handleImportAll = async () => {
    if (!selectedGist) return

    const toastId = toast.loading('Baixando arquivos do Gist...')
    const files = selectedGist.files
    const downloadedContents: Record<string, string> = {}
    let missingFiles = 0

    try {
      await Promise.all(
        files.map(async (file) => {
          // 1. Tenta pegar do cache do contexto primeiro
          if (fileContents[file.filename]) {
            downloadedContents[file.filename] = fileContents[file.filename]
            return
          }

          // 2. Se não tiver, busca via Proxy (para evitar CORS)
          try {
            const res = await fetch(`/api/gists/content?url=${encodeURIComponent(file.raw_url)}`)
            if (res.ok) {
              downloadedContents[file.filename] = await res.text()
            } else {
              missingFiles++
            }
          } catch (e) {
            missingFiles++
          }
        }),
      )

      if (missingFiles > 0) {
        toast.warning(`${missingFiles} arquivos falharam ao carregar.`)
      }

      // Mescla tudo
      const mergedMarkdown = mergeGistFiles(files, downloadedContents)

      setMarkdown(mergedMarkdown)
      toast.dismiss(toastId)
      toast.success('Gist completo importado com sucesso!')
      router.push('/md-to-pdf')
    } catch (error) {
      toast.dismiss(toastId)
      toast.error('Erro ao importar gist.')
      console.error(error)
    }
  }

  return (
    <div className='bg-muted/10 flex h-[60px] shrink-0 items-center justify-between border-b px-4 py-3'>
      <div className='flex flex-col overflow-hidden'>
        <h3
          className='max-w-[200px] truncate text-sm font-medium md:max-w-[400px]'
          title={selectedFile?.filename}>
          {selectedFile?.filename || 'Selecione um arquivo'}
        </h3>
        <span className='text-muted-foreground truncate text-xs'>
          {selectedFile?.language || 'Plain Text'} •{' '}
          {selectedFile ? (selectedFile.size / 1024).toFixed(2) : 0} KB
        </span>
      </div>

      <div className='flex shrink-0 items-center gap-2'>
        <Button variant='ghost' size='icon' onClick={handleOpenInGitHub} title='Ver no GitHub'>
          <ExternalLink className='h-4 w-4' />
        </Button>

        <Button variant='secondary' size='sm' onClick={handleEditFile} disabled={!currentContent}>
          <FileEdit className='mr-2 h-4 w-4' />
          <span className='hidden sm:inline'>Editar</span>
        </Button>

        <Button size='sm' onClick={handleImportAll}>
          <Import className='mr-2 h-4 w-4' />
          <span className='hidden sm:inline'>Importar Tudo</span>
        </Button>
      </div>
    </div>
  )
}
