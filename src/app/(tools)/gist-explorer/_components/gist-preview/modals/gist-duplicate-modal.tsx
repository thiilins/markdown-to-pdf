'use client'

import { Badge } from '@/components/ui/badge'
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
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { extractGistTags } from '@/shared/utils/gist-tools'
import { Copy, FileJson, Globe, Loader2, Lock, Plus, Tag, TextQuote, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

interface GistDuplicateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  gist: Gist | null
  onDuplicate: (gist: Gist, description: string, isPublic: boolean) => Promise<void>
}

export function GistDuplicateModal({
  open,
  onOpenChange,
  gist,
  onDuplicate,
}: GistDuplicateModalProps) {
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [isDuplicating, setIsDuplicating] = useState(false)

  useEffect(() => {
    if (open && gist) {
      const currentTags = extractGistTags(gist.description || '')
      let cleanDescription = gist.description || ''
      currentTags.forEach((tag) => {
        cleanDescription = cleanDescription.replace(new RegExp(`#${tag}\\b`, 'gi'), '').trim()
      })
      cleanDescription = cleanDescription.replace(/\s+/g, ' ').trim()

      if (cleanDescription && !cleanDescription.toLowerCase().includes('cópia')) {
        cleanDescription = `Cópia: ${cleanDescription}`
      } else if (!cleanDescription) {
        cleanDescription = 'Cópia de gist'
      }

      setDescription(cleanDescription)
      setTags(currentTags)
      setIsPublic(gist.public ?? true)
    }
  }, [open, gist])

  const handleAddTag = useCallback(() => {
    const trimmedTag = newTag.trim().toLowerCase().replace(/\s+/g, '_')
    if (!trimmedTag) return
    if (tags.includes(trimmedTag)) {
      toast.error('Tag já existe')
      setNewTag('')
      return
    }
    if (trimmedTag.length > 20) {
      toast.error('Tag muito longa (máximo 20 caracteres)')
      return
    }
    if (!/^[a-z0-9_]+$/.test(trimmedTag)) {
      toast.error('Tag inválida. Use apenas letras, números e underscore')
      return
    }
    setTags([...tags, trimmedTag])
    setNewTag('')
  }, [newTag, tags])

  const handleRemoveTag = useCallback(
    (tagToRemove: string) => {
      setTags(tags.filter((tag) => tag !== tagToRemove))
    },
    [tags],
  )

  const handleDuplicate = useCallback(async () => {
    if (!gist) return
    setIsDuplicating(true)
    try {
      let finalDescription = description.trim()
      if (tags.length > 0) {
        const tagsString = tags.map((tag) => `#${tag}`).join(' ')
        finalDescription = finalDescription ? `${finalDescription} ${tagsString}` : tagsString
      }

      await onDuplicate(gist, finalDescription, isPublic)
      toast.success('Gist duplicado com sucesso!')
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao duplicar gist:', error)
      toast.error('Erro ao duplicar gist. Tente novamente.')
    } finally {
      setIsDuplicating(false)
    }
  }, [gist, description, tags, onDuplicate, isPublic, onOpenChange])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleAddTag()
      }
    },
    [handleAddTag],
  )

  if (!gist) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='gap-0 overflow-hidden border-none p-0 shadow-2xl sm:max-w-[550px]'>
        {/* Header Estilizado */}
        <div className='from-primary/10 flex flex-col items-center justify-center bg-gradient-to-b to-transparent pt-8 pb-4'>
          <div className='bg-primary/10 ring-primary/5 mb-4 flex h-14 w-14 items-center justify-center rounded-full ring-8'>
            <Copy className='text-primary h-7 w-7' />
          </div>
          <DialogHeader className='flex w-full flex-col items-center justify-center px-6 text-center'>
            <DialogTitle className='text-xl font-bold tracking-tight'>Duplicar Gist</DialogTitle>
            <DialogDescription className='text-sm'>
              Crie uma cópia deste gist na sua conta. Você pode editar os detalhes abaixo.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Corpo com Scroll */}
        <div className='custom-scrollbar max-h-[65vh] space-y-6 overflow-y-auto px-6 py-6'>
          {/* Card Info do Gist Original */}
          <div className='group bg-muted/30 hover:bg-muted/50 flex items-center gap-3 rounded-xl border p-3 transition-colors'>
            <div className='bg-background flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border shadow-sm'>
              <FileJson className='text-muted-foreground h-5 w-5' />
            </div>
            <div className='min-w-0 flex-1'>
              <p className='text-muted-foreground text-[10px] font-bold tracking-wider uppercase'>
                Origem
              </p>
              <p className='text-foreground truncate text-sm font-medium'>
                {gist.files[0]?.filename || 'Sem nome'}
              </p>
              <p className='text-muted-foreground text-xs'>
                Por: <span className='font-medium'>{gist.owner?.login || 'Anônimo'}</span>
              </p>
            </div>
          </div>

          {/* Descrição */}
          <div className='space-y-2'>
            <Label
              htmlFor='description'
              className='text-muted-foreground flex items-center gap-2 text-sm font-semibold'>
              <TextQuote className='h-3.5 w-3.5' /> Nova Descrição
            </Label>
            <Textarea
              id='description'
              placeholder='Digite a descrição do gist...'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className='focus-visible:ring-primary resize-none'
            />
          </div>

          {/* Tags */}
          <div className='space-y-3'>
            <Label className='text-muted-foreground flex items-center gap-2 text-sm font-semibold'>
              <Tag className='h-3.5 w-3.5' /> Tags (#tag)
            </Label>
            <div className='bg-muted/20 focus-within:border-primary/50 space-y-3 rounded-xl border p-3 transition-colors'>
              <div className='flex min-h-[32px] flex-wrap gap-1.5'>
                {tags.length > 0 ? (
                  tags.map((tag) => (
                    <Badge key={tag} variant='secondary' className='gap-1 py-1 pr-1 pl-2'>
                      <span className='text-[11px]'>#{tag}</span>
                      <button
                        type='button'
                        onClick={() => handleRemoveTag(tag)}
                        className='hover:bg-destructive/20 text-muted-foreground hover:text-destructive rounded-full p-0.5 transition-colors'>
                        <X className='h-3 w-3' />
                      </button>
                    </Badge>
                  ))
                ) : (
                  <span className='text-muted-foreground px-1 text-[11px] italic'>
                    Nenhuma tag adicionada...
                  </span>
                )}
              </div>
              <div className='flex gap-2'>
                <Input
                  id='tags'
                  placeholder='Nova tag...'
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className='bg-background h-8 text-xs'
                />
                <Button
                  type='button'
                  size='sm'
                  variant='outline'
                  onClick={handleAddTag}
                  className='h-8 px-3'>
                  <Plus className='mr-1 h-3.5 w-3.5' /> Add
                </Button>
              </div>
            </div>
          </div>

          {/* Privacidade */}
          <div className='space-y-3'>
            <div
              className={cn(
                'flex items-center justify-between rounded-xl border p-4 transition-all',
                'bg-muted/10',
              )}>
              <div className='space-y-0.5'>
                <div className='flex items-center gap-2 text-sm font-semibold'>
                  {isPublic ? (
                    <Globe className='text-primary h-4 w-4' />
                  ) : (
                    <Lock className='h-4 w-4 text-amber-500' />
                  )}
                  {isPublic ? 'Visibilidade Pública' : 'Visibilidade Privada'}
                </div>
                <p className='text-muted-foreground text-[11px] leading-tight'>
                  {isPublic
                    ? 'A cópia será visível para todos.'
                    : 'A cópia será visível apenas para você.'}
                </p>
              </div>
              <Switch id='privacy' checked={isPublic} onCheckedChange={setIsPublic} />
            </div>
          </div>
        </div>

        <DialogFooter className='bg-muted/20 flex w-full flex-col-reverse items-center gap-3 border-t px-6 py-4 sm:flex-row sm:justify-end'>
          <Button
            variant='ghost'
            onClick={() => onOpenChange(false)}
            disabled={isDuplicating}
            className='hover:bg-background w-full font-medium sm:w-auto'>
            Cancelar
          </Button>
          <Button
            onClick={handleDuplicate}
            disabled={isDuplicating}
            className='w-full min-w-[120px] gap-2 font-bold shadow-md sm:w-auto'>
            {isDuplicating ? (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              <Copy className='mr-2 h-4 w-4' />
            )}
            {isDuplicating ? 'Duplicando...' : 'Duplicar Gist'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
