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
import { AlertTriangle, FileJson, Loader2, Trash2 } from 'lucide-react'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

// Assumindo o tipo Gist baseado no seu código original
interface Gist {
  id: string
  description?: string
  files: any[]
}

interface GistDeleteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  gist: Gist | null
  onDelete: (gistId: string) => Promise<void>
}

export function GistDeleteModal({ open, onOpenChange, gist, onDelete }: GistDeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = useCallback(async () => {
    if (!gist) return

    setIsDeleting(true)
    try {
      await onDelete(gist.id)
      toast.success('Gist removido permanentemente.')
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao deletar gist:', error)
      toast.error('Não foi possível excluir o Gist. Tente novamente.')
    } finally {
      setIsDeleting(false)
    }
  }, [gist, onDelete, onOpenChange])

  if (!gist) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='gap-0 overflow-hidden border-none p-0 shadow-2xl sm:max-w-[440px]'>
        <div className='from-destructive/5 flex flex-col items-center justify-center bg-linear-to-b to-transparent pt-8 pb-4'>
          <div className='bg-destructive/10 ring-destructive/5 mb-4 flex h-12 w-12 items-center justify-center rounded-full ring-8'>
            <AlertTriangle className='text-destructive h-6 w-6' />
          </div>
          <DialogHeader className='flex w-full flex-col items-center justify-center'>
            <DialogTitle className='text-xl font-bold tracking-tight'>
              Excluir este Gist?
            </DialogTitle>
            <DialogDescription className='text-center text-xs'>
              Esta ação é permanente e removerá todos os arquivos e histórico associados.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className='space-y-4 px-6 py-4'>
          {/* Card de Identificação do Recurso */}
          <div className='bg-muted/30 flex items-center gap-3 rounded-lg border p-3'>
            <div className='bg-background flex h-10 w-10 items-center justify-center rounded border'>
              <FileJson className='text-muted-foreground h-5 w-5' />
            </div>
            <div className='min-w-0 flex-1'>
              <p className='text-foreground truncate text-sm font-semibold'>
                {gist.description || 'Gist sem descrição'}
              </p>
              <p className='text-muted-foreground text-xs'>
                {gist.files.length} {gist.files.length === 1 ? 'arquivo' : 'arquivos'} • ID:{' '}
                {gist.id.substring(0, 8)}...
              </p>
            </div>
          </div>

          <div className='rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/50 dark:bg-amber-950/20'>
            <p className='text-[13px] leading-relaxed text-amber-700 dark:text-amber-400'>
              <strong>Nota:</strong> Forks e comentários vinculados a este Gist também serão
              desconectados ou removidos.
            </p>
          </div>
        </div>

        <DialogFooter className='flex w-full items-center justify-between gap-4 border-t bg-red-50 px-6 py-4'>
          <Button
            variant='ghost'
            className='bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground w-full sm:w-auto'
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}>
            Manter Gist
          </Button>
          <Button
            variant='destructive'
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full gap-2 font-semibold transition-all active:scale-95 sm:w-auto'
            onClick={handleDelete}
            disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className='h-4 w-4 animate-spin' />
                Excluindo...
              </>
            ) : (
              <>
                <Trash2 className='h-4 w-4' />
                Confirmar Exclusão
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
