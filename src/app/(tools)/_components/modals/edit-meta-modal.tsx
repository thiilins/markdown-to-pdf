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
import { useMarkdown } from '@/shared/contexts/markdownContext'
import { FileEdit, PencilLine, Save } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

export function EditMetaModal() {
  const { onUpdateMarkdown, markdown, setOpenEditMeta, openEditMeta } = useMarkdown()
  const [title, setTitle] = useState<string | undefined>(markdown?.name)

  const handleEdit = useCallback(() => {
    if (!title || !markdown?.id) return
    onUpdateMarkdown(undefined, title)
    setOpenEditMeta(false)
  }, [onUpdateMarkdown, title, setOpenEditMeta, markdown?.id])

  useEffect(() => {
    if (openEditMeta) {
      setTitle(markdown?.name)
    }
  }, [openEditMeta, markdown?.name])

  return (
    <Dialog open={openEditMeta} onOpenChange={setOpenEditMeta}>
      <DialogContent className='gap-0 overflow-hidden border-none p-0 shadow-2xl sm:max-w-[440px]'>
        {/* Header com Gradiente de "Informação/Edição" */}
        <div className='from-primary/10 flex flex-col items-center justify-center bg-linear-to-b to-transparent pt-8 pb-4'>
          <div className='bg-primary/10 ring-primary/5 mb-4 flex h-14 w-14 items-center justify-center rounded-full ring-8'>
            <FileEdit className='text-primary h-7 w-7' />
          </div>
          <DialogHeader className='flex w-full flex-col items-center justify-center px-6 text-center'>
            <DialogTitle className='text-foreground text-xl font-bold tracking-tight'>
              Renomear Arquivo
            </DialogTitle>
            <DialogDescription className='text-sm'>
              Altere o título do documento para facilitar a organização.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className='px-6 py-6'>
          <div className='group space-y-2'>
            <Label
              htmlFor='title'
              className='text-muted-foreground group-focus-within:text-primary text-sm font-semibold transition-colors'>
              Título do arquivo
            </Label>
            <div className='relative'>
              <PencilLine className='text-muted-foreground/50 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
              <Input
                id='title'
                placeholder='Ex: Novo nome do arquivo'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='focus-visible:ring-primary h-11 pl-10 transition-all'
              />
            </div>
          </div>
        </div>

        {/* Footer com contraste de botões correto */}
        <DialogFooter className='bg-muted/30 flex w-full flex-col-reverse items-center gap-3 border-t px-6 py-4 sm:flex-row sm:justify-end'>
          <Button
            variant='ghost'
            className='hover:bg-background w-full font-medium transition-colors sm:w-auto'
            onClick={() => setOpenEditMeta(false)}>
            Cancelar
          </Button>
          <Button
            className='shadow-primary/10 w-full gap-2 font-bold shadow-md transition-all active:scale-95 sm:w-auto'
            onClick={handleEdit}
            disabled={!title || title === markdown?.name}>
            <Save className='h-4 w-4' />
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
