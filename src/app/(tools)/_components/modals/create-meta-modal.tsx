'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImportUrlService } from '@/services/importUrlService'
import { useMarkdown } from '@/shared/contexts/markdownContext'
import { FilePlusCorner, Import, Loader2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

export function CreateMetaModal() {
  const { onAddMarkdown, list, setOpenCreateMeta, openCreateMeta } = useMarkdown()
  const [title, setTitle] = useState<string | undefined>(`documento_${list.length + 1}`)
  const [content, setContent] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [url, setUrl] = useState<string | undefined>(undefined)

  const handleCreate = useCallback(() => {
    if (!title || isLoading) return
    setIsLoading(true)
    onAddMarkdown(content || undefined, title)
    setOpenCreateMeta(false)
    setIsLoading(false)
  }, [onAddMarkdown, title, setOpenCreateMeta, content, isLoading])

  useEffect(() => {
    if (openCreateMeta) {
      setTitle(`documento_${list.length + 1}`)
      setContent(undefined)
      setUrl(undefined)
    }
  }, [openCreateMeta, list.length])

  const handleImport = async () => {
    if (!url?.trim() || isLoading) {
      toast.error('Por favor, insira uma URL')
      return
    }
    setIsLoading(true)
    try {
      const result = await ImportUrlService.import({ url: url.trim() })
      console.log(result)
      if (!result.success || !result.content) {
        toast.error(result.error || 'Erro ao importar URL')
        return
      }
      const title = url.split('/').pop()
      setContent(result.content)
      setTitle(title || `documento_${list.length + 1}`)
      toast.success('Conteúdo importado com sucesso')
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <Dialog open={openCreateMeta} onOpenChange={setOpenCreateMeta}>
      <DialogContent className='gap-0 overflow-hidden border-none p-0 shadow-2xl sm:max-w-[440px]'>
        <div className='from-primary/5 flex flex-col items-center justify-center bg-linear-to-b to-transparent pt-8 pb-4'>
          <div className='bg-primary/10 ring-primary/5 mb-4 flex h-12 w-12 items-center justify-center rounded-full ring-8'>
            <FilePlusCorner className='text-primary h-6 w-6' />
          </div>
          <DialogHeader className='flex w-full flex-col items-center justify-center'>
            <DialogTitle className='text-xl font-bold tracking-tight'>
              Criar novo arquivo
            </DialogTitle>
            <DialogDescription className='text-center text-xs'>
              Crie um novo arquivo com o título e conteúdo.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className='flex flex-col gap-4 px-6 py-4'>
          <div className='space-y-2'>
            <Label htmlFor='title'>Título do arquivo</Label>
            <Input
              id='title'
              key='title-input'
              placeholder='Título do arquivo'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='url'>URL do arquivo</Label>
            <div className='flex items-center gap-2'>
              <Input
                key='url-input'
                id='url'
                placeholder='https://raw.githubusercontent.com/user/repo/branch/file.md'
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isLoading) {
                    handleImport()
                  }
                }}
                disabled={isLoading}
              />
              <Button
                variant='outline'
                onClick={handleImport}
                className='bg-primary hover:bg-primary/90 h-9 w-9 cursor-pointer items-center justify-center rounded text-white hover:text-white'>
                {isLoading ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  <Import className='h-4 w-4' />
                )}
              </Button>
            </div>
            <p className='text-muted-foreground text-center text-[12px]'>
              Domínios permitidos: GitHub, GitLab, Bitbucket, Gist
            </p>
          </div>
        </div>

        <DialogFooter className='flex w-full items-center justify-between gap-4 border-t bg-red-50 px-6 py-4'>
          <Button
            variant='ghost'
            className='bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground w-full sm:w-auto'
            onClick={() => setOpenCreateMeta(false)}>
            Cancelar
          </Button>
          <Button
            variant='default'
            className='bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground w-full gap-2 font-semibold transition-all active:scale-95 sm:w-auto'
            onClick={handleCreate}>
            <FilePlusCorner className='h-4 w-4' />
            Criar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
