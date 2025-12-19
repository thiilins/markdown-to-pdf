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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ImportUrlService } from '@/services/importUrlService'
import { useMDToPdf } from '@/shared/contexts/mdToPdfContext'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface ImportUrlModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type ImportMode = 'replace' | 'append'

function ImportUrlModal({ open, onOpenChange }: ImportUrlModalProps) {
  const { markdown, setMarkdown } = useMDToPdf()
  const [url, setUrl] = useState('')
  const [mode, setMode] = useState<ImportMode>('replace')
  const [isLoading, setIsLoading] = useState(false)

  const handleImport = async () => {
    if (!url.trim()) {
      toast.error('Por favor, insira uma URL')
      return
    }

    setIsLoading(true)

    try {
      const result = await ImportUrlService.import({ url: url.trim() })

      if (!result.success || !result.content) {
        toast.error(result.error || 'Erro ao importar URL')
        return
      }

      // Aplica o conteúdo conforme o modo selecionado
      if (mode === 'replace') {
        await setMarkdown(result.content)
        toast.success('Conteúdo importado com sucesso')
      } else {
        // Append: adiciona ao final do conteúdo atual
        const separator = markdown ? '\n\n---\n\n' : ''
        await setMarkdown(markdown + separator + result.content)
        toast.success('Conteúdo adicionado ao documento')
      }

      // Fecha o modal e limpa o campo
      onOpenChange(false)
      setUrl('')
    } catch (error) {
      console.error('Erro ao importar URL:', error)
      toast.error('Erro ao importar URL. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false)
      setUrl('')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Importar de URL</DialogTitle>
          <DialogDescription>
            Cole a URL de um arquivo Markdown (GitHub, GitLab, etc.) para importar o conteúdo.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <div className='space-y-2'>
            <Label htmlFor='url'>URL do arquivo</Label>
            <Input
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
            <p className='text-muted-foreground text-xs'>
              Domínios permitidos: GitHub, GitLab, Bitbucket, Gist
            </p>
          </div>

          <div className='space-y-2'>
            <Label>Como importar?</Label>
            <RadioGroup value={mode} onValueChange={(value) => setMode(value as ImportMode)}>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='replace' id='replace' />
                <Label htmlFor='replace' className='cursor-pointer font-normal'>
                  Substituir conteúdo atual
                </Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='append' id='append' />
                <Label htmlFor='append' className='cursor-pointer font-normal'>
                  Adicionar ao final do documento
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleImport} disabled={isLoading || !url.trim()}>
            {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Importar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

import { Download } from 'lucide-react'
import { IconButtonTooltip } from '../../../../components/custom-ui/tooltip'

export const ImportUrlButton = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <IconButtonTooltip
        onClick={() => setOpen(true)}
        content='Importar de URL'
        className={{
          button: 'flex h-8 w-10 cursor-pointer items-center justify-center',
        }}
        icon={Download}
      />
      <ImportUrlModal open={open} onOpenChange={setOpen} />
    </>
  )
}
