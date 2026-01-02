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
import { useMarkdown } from '@/shared/contexts/markdownContext'
import { AlertTriangle, FileText, Trash2 } from 'lucide-react'
import { useCallback } from 'react'

export function DeleteDocumentModal() {
  const { markdown, setOpenDeleteDocument, openDeleteDocument, onDeleteMarkdown } = useMarkdown()

  const handleDelete = useCallback(async () => {
    onDeleteMarkdown()
    setOpenDeleteDocument(false)
  }, [onDeleteMarkdown, setOpenDeleteDocument])

  return (
    <Dialog open={openDeleteDocument} onOpenChange={setOpenDeleteDocument}>
      <DialogContent className='max-w-[420px] gap-0 overflow-hidden border-none p-0 shadow-2xl'>
        {/* Header com gradiente de alerta sutil */}
        <div className='from-destructive/10 flex flex-col items-center justify-center bg-linear-to-b to-transparent pt-8 pb-4'>
          <div className='bg-destructive/10 ring-destructive/5 mb-4 flex h-14 w-14 animate-pulse items-center justify-center rounded-full ring-8'>
            <AlertTriangle className='text-destructive h-7 w-7' />
          </div>
          <DialogHeader className='flex w-full flex-col items-center justify-center px-6'>
            <DialogTitle className='text-foreground text-xl font-bold tracking-tight'>
              Excluir Documento?
            </DialogTitle>
            <DialogDescription className='text-muted-foreground text-center text-sm'>
              Esta ação é <span className='text-destructive font-semibold'>permanente</span>. Você
              perderá todo o conteúdo deste arquivo.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className='px-6 py-4'>
          {/* Card de Identificação do Recurso - Mais polido */}
          <div className='group bg-muted/30 hover:bg-muted/50 relative overflow-hidden rounded-xl border p-4 transition-colors'>
            <div className='flex items-center gap-4'>
              <div className='bg-background flex h-12 w-12 items-center justify-center rounded-lg border shadow-sm'>
                <FileText className='text-muted-foreground h-6 w-6' />
              </div>
              <div className='min-w-0 flex-1'>
                <p className='text-foreground truncate text-sm font-bold'>
                  {markdown?.name || 'Documento sem nome'}
                </p>
                <div className='text-muted-foreground flex items-center gap-2 text-xs'>
                  <span className='bg-background inline-block rounded border px-1.5 py-0.5'>
                    {markdown?.content.length.toLocaleString()} caracteres
                  </span>
                  <span>•</span>
                  <span className='font-mono uppercase'>ID: {markdown?.id.substring(0, 8)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer com botões reorganizados por importância */}
        <DialogFooter className='bg-muted/30 flex w-full flex-col-reverse items-center gap-2 border-t px-6 py-4 sm:flex-row sm:justify-end'>
          <Button
            variant='ghost'
            className='hover:bg-background w-full font-medium transition-colors sm:w-auto'
            onClick={() => setOpenDeleteDocument(false)}>
            Manter arquivo
          </Button>
          <Button
            variant='destructive'
            className='shadow-destructive/20 w-full gap-2 font-bold shadow-lg transition-all active:scale-95 sm:w-auto'
            onClick={handleDelete}>
            <Trash2 className='h-4 w-4' />
            Confirmar Exclusão
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
