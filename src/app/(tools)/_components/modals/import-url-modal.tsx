'use client'

import { IconButtonTooltip } from '@/components/custom-ui/tooltip' // Ajuste o path se necessário
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
import { cn } from '@/lib/utils'
import { ImportUrlService } from '@/services/importUrlService'
import { useMarkdown } from '@/shared/contexts/markdownContext'
import { CopyPlus, Download, FileText, Globe, Link2, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface ImportUrlModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type ImportMode = 'replace' | 'append'

export function ImportUrlModal({ open, onOpenChange }: ImportUrlModalProps) {
  const { markdown, onUpdateMarkdown } = useMarkdown()
  const [url, setUrl] = useState('')
  const [mode, setMode] = useState<ImportMode>('replace')
  const [isLoading, setIsLoading] = useState(false)

  const handleImport = async () => {
    if (!url.trim()) {
      toast.error('Por favor, insira uma URL válida')
      return
    }
    setIsLoading(true)
    try {
      const result = await ImportUrlService.import({ url: url.trim() })

      if (!result.success || !result.content) {
        toast.error(result.error || 'Erro ao importar URL')
        return
      }

      if (mode === 'replace') {
        await onUpdateMarkdown(result.content)
        toast.success('Conteúdo substituído com sucesso')
      } else {
        const separator = markdown?.content ? '\n\n---\n\n' : ''
        const newContent = (markdown?.content || '') + separator + result.content
        await onUpdateMarkdown(newContent)
        toast.success('Conteúdo anexado ao documento')
      }

      onOpenChange(false)
      setUrl('')
    } catch (error) {
      toast.error('Erro ao processar importação. Verifique a URL.')
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
      <DialogContent className='gap-0 overflow-hidden border-none p-0 shadow-2xl sm:max-w-[440px]'>
        {/* Header com estilo moderno */}
        <div className='from-primary/10 flex flex-col items-center justify-center bg-gradient-to-b to-transparent pt-8 pb-4'>
          <div className='bg-primary/10 ring-primary/5 mb-4 flex h-14 w-14 items-center justify-center rounded-full ring-8'>
            <Globe className='text-primary h-7 w-7' />
          </div>
          <DialogHeader className='flex w-full flex-col items-center justify-center px-6'>
            <DialogTitle className='text-xl font-bold tracking-tight'>
              Importar Conteúdo Externo
            </DialogTitle>
            <DialogDescription className='text-center text-sm'>
              Traga textos de fontes externas como GitHub ou GitLab.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className='flex flex-col gap-6 px-6 py-6'>
          {/* Campo de URL */}
          <div className='space-y-2'>
            <Label htmlFor='url' className='text-sm font-semibold'>
              URL do arquivo (.md)
            </Label>
            <div className='relative'>
              <Link2 className='text-muted-foreground/50 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
              <Input
                id='url'
                placeholder='https://raw.githubusercontent.com/...'
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
                className='focus-visible:ring-primary h-11 pl-10'
              />
            </div>
          </div>

          {/* Opções de Importação Estilizadas */}
          <div className='space-y-3'>
            <Label className='text-sm font-semibold'>Modo de Importação</Label>
            <RadioGroup
              value={mode}
              onValueChange={(v) => setMode(v as ImportMode)}
              className='grid grid-cols-2 gap-3'>
              <div className='relative'>
                <RadioGroupItem value='replace' id='replace' className='peer sr-only' />
                <Label
                  htmlFor='replace'
                  className={cn(
                    'bg-background flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 text-center transition-all',
                    'hover:bg-muted peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5',
                  )}>
                  <FileText
                    className={cn(
                      'h-5 w-5',
                      mode === 'replace' ? 'text-primary' : 'text-muted-foreground',
                    )}
                  />
                  <div className='flex flex-col gap-1'>
                    <span className='text-xs font-bold'>Substituir</span>
                    <span className='text-muted-foreground text-[10px] leading-tight'>
                      Apaga o atual
                    </span>
                  </div>
                </Label>
              </div>

              <div className='relative'>
                <RadioGroupItem value='append' id='append' className='peer sr-only' />
                <Label
                  htmlFor='append'
                  className={cn(
                    'bg-background flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 text-center transition-all',
                    'hover:bg-muted peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5',
                  )}>
                  <CopyPlus
                    className={cn(
                      'h-5 w-5',
                      mode === 'append' ? 'text-primary' : 'text-muted-foreground',
                    )}
                  />
                  <div className='flex flex-col gap-1'>
                    <span className='text-xs font-bold'>Anexar</span>
                    <span className='text-muted-foreground text-[10px] leading-tight'>
                      Adiciona ao fim
                    </span>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className='bg-muted/20 flex w-full flex-col-reverse items-center gap-3 border-t px-6 py-4 sm:flex-row sm:justify-end'>
          <Button
            variant='ghost'
            className='hover:bg-background w-full font-medium sm:w-auto'
            onClick={handleClose}
            disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            className='w-full gap-2 font-bold shadow-md transition-all active:scale-95 sm:w-auto'
            onClick={handleImport}
            disabled={isLoading || !url.trim()}>
            {isLoading ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <Download className='h-4 w-4' />
            )}
            {isLoading ? 'Importando...' : 'Confirmar Importação'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/** * Botão que aciona o modal
 */
export const ImportUrlButton = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <IconButtonTooltip
        onClick={() => setOpen(true)}
        content='Importar de URL'
        className={{
          button:
            'hover:text-primary flex h-8 w-10 cursor-pointer items-center justify-center transition-colors',
        }}
        icon={Download}
      />
      <ImportUrlModal open={open} onOpenChange={setOpen} />
    </>
  )
}
