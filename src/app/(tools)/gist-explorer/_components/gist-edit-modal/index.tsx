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
import { Textarea } from '@/components/ui/textarea'
import { extractGistTags } from '@/shared/utils/gist-tools'
import { X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

interface GistEditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  gist: Gist | null
  onSave: (gistId: string, description: string) => Promise<void>
}

export function GistEditModal({ open, onOpenChange, gist, onSave }: GistEditModalProps) {
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Extrai descrição e tags quando o modal abre
  useEffect(() => {
    if (open && gist) {
      const currentTags = extractGistTags(gist.description)
      // Remove tags da descrição para mostrar apenas o texto
      let cleanDescription = gist.description || ''
      currentTags.forEach((tag) => {
        cleanDescription = cleanDescription.replace(new RegExp(`#${tag}\\b`, 'gi'), '').trim()
      })
      // Remove múltiplos espaços
      cleanDescription = cleanDescription.replace(/\s+/g, ' ').trim()
      setDescription(cleanDescription)
      setTags(currentTags)
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

  const handleSave = useCallback(async () => {
    if (!gist) return

    setIsSaving(true)
    try {
      // Monta a descrição final com tags
      let finalDescription = description.trim()
      if (tags.length > 0) {
        const tagsString = tags.map((tag) => `#${tag}`).join(' ')
        finalDescription = finalDescription
          ? `${finalDescription} ${tagsString}`
          : tagsString
      }

      await onSave(gist.id, finalDescription)
      toast.success('Gist atualizado com sucesso!')
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao salvar gist:', error)
      toast.error('Erro ao salvar gist. Tente novamente.')
    } finally {
      setIsSaving(false)
    }
  }, [gist, description, tags, onSave, onOpenChange])

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
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Editar Descrição e Tags</DialogTitle>
          <DialogDescription>
            Edite a descrição do gist e gerencie suas tags. As tags serão adicionadas à descrição
            no formato #tag.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
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
            <div className='flex flex-wrap gap-2 rounded-md border p-3 min-h-[60px]'>
              {tags.length > 0 ? (
                tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant='secondary'
                    className='flex items-center gap-1 pr-1'>
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
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

