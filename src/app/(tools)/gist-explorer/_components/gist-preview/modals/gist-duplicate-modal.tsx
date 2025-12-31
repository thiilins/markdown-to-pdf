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
import { extractGistTags } from '@/shared/utils/gist-tools'
import { Copy, Globe, Lock, X } from 'lucide-react'
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
      const currentTags = extractGistTags(gist.description)
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
    const trimmedTag = newTag.trim().toLowerCase()
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
    // Valida se contém apenas letras, números e underscore
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

  useEffect(() => {
    console.log('isPublic', isPublic)
  }, [isPublic])
  if (!gist) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Duplicar Gist</DialogTitle>
          <DialogDescription>
            Crie uma cópia deste gist na sua conta. Edite a descrição e adicione tags antes de
            finalizar.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          {/* Info do gist original */}
          <div className='bg-muted/50 rounded-md border p-3'>
            <p className='text-muted-foreground text-xs font-medium'>Gist Original</p>
            <p className='text-sm font-medium'>{gist.files[0]?.filename || 'Sem nome'}</p>
            <p className='text-muted-foreground text-xs'>Por: {gist.owner?.login || 'Anônimo'}</p>
          </div>

          {/* Descrição */}
          <div className='space-y-2'>
            <Label htmlFor='description'>Descrição</Label>
            <Textarea
              id='description'
              placeholder='Digite a descrição do gist...'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className='resize-none'
            />
          </div>

          {/* Tags */}
          <div className='space-y-2'>
            <Label htmlFor='tags'>Tags</Label>
            <div className='flex min-h-[60px] flex-wrap gap-2 rounded-md border p-3'>
              {tags.length > 0 ? (
                tags.map((tag) => (
                  <Badge key={tag} variant='secondary' className='flex items-center gap-1 pr-1'>
                    <span>#{tag}</span>
                    <button
                      type='button'
                      onClick={() => handleRemoveTag(tag)}
                      className='hover:bg-destructive/20 rounded-full p-0.5 transition-colors'>
                      <X className='h-3 w-3' />
                    </button>
                  </Badge>
                ))
              ) : (
                <span className='text-muted-foreground text-sm'>Nenhuma tag adicionada</span>
              )}
            </div>
            <div className='flex gap-2'>
              <Input
                id='tags'
                placeholder='Digite uma tag e pressione Enter'
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleKeyDown}
                className='flex-1'
              />
              <Button type='button' variant='outline' onClick={handleAddTag}>
                Adicionar
              </Button>
            </div>
            <p className='text-muted-foreground text-xs'>
              Use apenas letras, números e underscore. Máximo 20 caracteres.
            </p>
          </div>

          {/* Privacidade */}
          <div className='flex items-center justify-between rounded-md border p-3'>
            <div className='space-y-0.5'>
              <Label htmlFor='privacy' className='text-base'>
                Visibilidade
              </Label>
              <p className='text-muted-foreground text-sm'>
                {isPublic ? 'Qualquer pessoa pode ver este gist' : 'Apenas você pode ver este gist'}
              </p>
            </div>
            <div className='flex items-center gap-2'>
              {isPublic ? (
                <Globe className='text-muted-foreground h-4 w-4' />
              ) : (
                <Lock className='text-muted-foreground h-4 w-4' />
              )}
              <Switch
                id='privacy'
                checked={isPublic}
                onCheckedChange={(checked) => {
                  setIsPublic(checked)
                }}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)} disabled={isDuplicating}>
            Cancelar
          </Button>
          <Button onClick={handleDuplicate} disabled={isDuplicating}>
            <Copy className='mr-2 h-4 w-4' />
            {isDuplicating ? 'Duplicando...' : 'Duplicar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
