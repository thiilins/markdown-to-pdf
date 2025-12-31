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
import { Separator } from '@/components/ui/separator'
import { ImportUrlService } from '@/services/importUrlService'
import { useMarkdown } from '@/shared/contexts/markdownContext'
import { FilePlus2, Globe, Import, Loader2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

export function CreateMetaModal() {
  const { onAddMarkdown, list, setOpenCreateMeta, openCreateMeta } = useMarkdown()
  const [title, setTitle] = useState<string | undefined>('')
  const [content, setContent] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [url, setUrl] = useState<string | undefined>(undefined)

  const handleCreate = useCallback(() => {
    if (!title?.trim() || isLoading) {
      toast.error('O título é obrigatório')
      return
    }
    setIsLoading(true)
    onAddMarkdown(content || '', title)
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
    if (!url?.trim() || isImporting) {
      toast.error('Por favor, insira uma URL válida')
      return
    }
    setIsImporting(true)
    try {
      const result = await ImportUrlService.import({ url: url.trim() })
      if (!result.success || !result.content) {
        toast.error(result.error || 'Erro ao importar URL')
        return
      }
      const extractedTitle = url.split('/').pop()?.replace('.md', '')
      setContent(result.content)
      setTitle(extractedTitle || `importado_${list.length + 1}`)
      toast.success('Conteúdo importado com sucesso!')
    } catch (error) {
      toast.error('Falha na conexão com o serviço de importação')
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <Dialog open={openCreateMeta} onOpenChange={setOpenCreateMeta}>
      <DialogContent className='gap-0 overflow-hidden border-none p-0 shadow-2xl sm:max-w-[440px]'>
        {/* Header com estilo moderno */}
        <div className='from-primary/10 flex flex-col items-center justify-center bg-gradient-to-b to-transparent pt-8 pb-4'>
          <div className='bg-primary/10 ring-primary/5 mb-4 flex h-14 w-14 items-center justify-center rounded-full ring-8'>
            <FilePlus2 className='text-primary h-7 w-7' />
          </div>
          <DialogHeader className='flex w-full flex-col items-center justify-center px-6'>
            <DialogTitle className='text-xl font-bold tracking-tight'>Novo Documento</DialogTitle>
            <DialogDescription className='text-center text-sm'>
              Inicie um arquivo do zero ou importe de uma URL externa.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className='flex flex-col gap-5 px-6 py-6'>
          {/* Seção de Título */}
          <div className='space-y-2'>
            <Label htmlFor='title' className='text-sm font-semibold'>
              Título do arquivo
            </Label>
            <Input
              id='title'
              placeholder='Ex: notas-de-aula'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='focus-visible:ring-primary h-10 transition-all'
            />
          </div>

          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <Separator />
            </div>
            <div className='relative flex justify-center text-[10px] uppercase'>
              <span className='bg-background text-muted-foreground px-2 font-medium'>
                Ou importe conteúdo
              </span>
            </div>
          </div>

          {/* Seção de URL / Importação */}
          <div className='bg-muted/30 space-y-3 rounded-xl border p-4'>
            <div className='text-muted-foreground flex items-center gap-2 text-xs font-medium'>
              <Globe className='h-3 w-3' />
              <span>Link do arquivo (Markdown Raw)</span>
            </div>
            <div className='flex items-center gap-2'>
              <Input
                id='url'
                placeholder='https://raw.githubusercontent.com/...'
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleImport()}
                disabled={isImporting}
                className='bg-background h-9 text-xs'
              />
              <Button
                size='icon'
                variant='secondary'
                onClick={handleImport}
                disabled={isImporting || !url}
                className='hover:bg-primary hover:text-primary-foreground h-9 w-9 shrink-0 transition-all'>
                {isImporting ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  <Import className='h-4 w-4' />
                )}
              </Button>
            </div>
            <p className='text-muted-foreground text-[10px] leading-relaxed'>
              Suporte para GitHub, GitLab e Gists. O conteúdo será carregado no novo arquivo.
            </p>
          </div>
        </div>

        {/* Footer sem o vermelho, focado em criação */}
        <DialogFooter className='bg-muted/20 flex w-full flex-col-reverse items-center gap-3 border-t px-6 py-4 sm:flex-row sm:justify-end'>
          <Button
            variant='ghost'
            className='w-full font-medium sm:w-auto'
            onClick={() => setOpenCreateMeta(false)}>
            Cancelar
          </Button>
          <Button
            className='w-full gap-2 font-bold shadow-md transition-all active:scale-95 sm:w-auto'
            onClick={handleCreate}
            disabled={isLoading || !title}>
            {isLoading ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <FilePlus2 className='h-4 w-4' />
            )}
            Criar Arquivo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
