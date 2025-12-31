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
import { AlertTriangle, FileJson, Info, Loader2, Trash2 } from 'lucide-react'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

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
      toast.success('Gist removido com sucesso do GitHub.')
      onOpenChange(false)
    } catch (error) {
      toast.error('Não foi possível excluir o Gist. Verifique sua conexão.')
    } finally {
      setIsDeleting(false)
    }
  }, [gist, onDelete, onOpenChange])

  if (!gist) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='gap-0 overflow-hidden border-none p-0 shadow-2xl sm:max-w-[450px]'>
        {/* Header de Alerta Crítico */}
        <div className='from-destructive/10 flex flex-col items-center justify-center bg-linear-to-b to-transparent pt-8 pb-4'>
          <div className='bg-destructive/10 ring-destructive/5 mb-4 flex h-14 w-14 animate-pulse items-center justify-center rounded-full ring-8'>
            <AlertTriangle className='text-destructive h-7 w-7' />
          </div>
          <DialogHeader className='flex w-full flex-col items-center justify-center px-6'>
            <DialogTitle className='text-foreground text-xl font-bold tracking-tight'>
              Excluir Gist Permanentemente?
            </DialogTitle>
            <DialogDescription className='text-center text-sm'>
              Esta ação removerá o Gist do seu <span className='font-semibold'>GitHub</span> e não
              poderá ser desfeita.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className='space-y-4 px-6 py-4 sm:max-w-[450px]'>
          {/* Card de Identificação do Gist */}
          <div className='group bg-muted/30 hover:bg-muted/50 flex items-center gap-3 rounded-xl border p-4 transition-colors'>
            <div className='bg-background flex h-12 w-12 items-center justify-center rounded-lg border shadow-sm'>
              <FileJson className='text-muted-foreground h-6 w-6' />
            </div>
            <div className='min-w-0 flex-1'>
              <p className='text-foreground flex-wr truncate text-sm font-bold'>
                {gist.description || 'Gist sem descrição'}
              </p>
              <div className='text-muted-foreground flex items-center gap-2 font-mono text-[11px] tracking-wider uppercase'>
                <span>
                  {gist.files.length} {gist.files.length === 1 ? 'arquivo' : 'arquivos'}
                </span>
                <span>•</span>
                <span>ID: {gist.id.substring(0, 8)}</span>
              </div>
            </div>
          </div>

          {/* Banner de Aviso Secundário */}
          <div className='flex gap-3 rounded-xl border border-amber-200/50 bg-amber-500/5 p-4 dark:border-amber-900/30'>
            <Info className='h-5 w-5 shrink-0 text-amber-600 dark:text-amber-500' />
            <p className='text-xs leading-relaxed text-amber-800 dark:text-amber-400/90'>
              <strong className='text-[10px] font-bold uppercase'>Nota importante:</strong>
              <br />
              Ao excluir, todos os forks e comentários vinculados a este Gist no GitHub também serão
              afetados ou removidos.
            </p>
          </div>
        </div>

        {/* Footer com botões reorganizados */}
        <DialogFooter className='bg-muted/30 flex w-full flex-col-reverse items-center gap-3 border-t px-6 py-4 sm:flex-row sm:justify-end'>
          <Button
            variant='ghost'
            className='hover:bg-background w-full font-medium transition-colors sm:w-auto'
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}>
            Manter no GitHub
          </Button>
          <Button
            variant='destructive'
            className='shadow-destructive/20 w-full gap-2 font-bold shadow-lg transition-all active:scale-95 sm:w-auto'
            onClick={handleDelete}
            disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className='h-4 w-4 animate-spin' />
                Excluindo do GitHub...
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
