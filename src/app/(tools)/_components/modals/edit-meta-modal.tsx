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
import { FilePlusCorner, Save } from 'lucide-react'
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
        <div className='from-primary/5 flex flex-col items-center justify-center bg-linear-to-b to-transparent pt-8 pb-4'>
          <div className='bg-primary/10 ring-primary/5 mb-4 flex h-12 w-12 items-center justify-center rounded-full ring-8'>
            <FilePlusCorner className='text-primary h-6 w-6' />
          </div>
          <DialogHeader className='flex w-full flex-col items-center justify-center'>
            <DialogTitle className='text-xl font-bold tracking-tight'>Editar arquivo</DialogTitle>
            <DialogDescription className='text-center text-xs'>
              Edite o título do arquivo.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className='flex flex-col gap-2 space-y-4 px-6 py-4'>
          <Label htmlFor='title'>Título do arquivo</Label>
          <Input
            id='title'
            placeholder='Título do arquivo'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <DialogFooter className='flex w-full items-center justify-between gap-4 border-t bg-red-50 px-6 py-4'>
          <Button
            variant='ghost'
            className='bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground w-full sm:w-auto'
            onClick={() => setOpenEditMeta(false)}>
            Cancelar
          </Button>
          <Button
            variant='default'
            className='bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground w-full gap-2 font-semibold transition-all active:scale-95 sm:w-auto'
            onClick={handleEdit}>
            <Save className='h-4 w-4' />
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
