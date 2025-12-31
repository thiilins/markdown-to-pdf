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
import { Globe, Lock, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

interface GistEditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  gist: Gist | null
  onSave: (gistId: string, description: string, isPublic: boolean) => Promise<void>
  onConvertPublicToPrivate?: (gist: Gist, description: string) => Promise<void>
}

export function GistEditModal({
  open,
  onOpenChange,
  gist,
  onSave,
  onConvertPublicToPrivate,
}: GistEditModalProps) {
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [isPublic, setIsPublic] = useState(true)
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

  const handleSave = useCallback(async () => {
    if (!gist) return

    // Verifica se está tentando tornar público em privado
    if (gist.public === true && isPublic === false) {
      return
    }

    setIsSaving(true)
    try {
      // Monta a descrição final com tags
      let finalDescription = description.trim()
      if (tags.length > 0) {
        const tagsString = tags.map((tag) => `#${tag}`).join(' ')
        finalDescription = finalDescription ? `${finalDescription} ${tagsString}` : tagsString
      }
      await onSave(gist.id, finalDescription, isPublic)
      toast.success('Gist atualizado com sucesso!')
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao salvar gist:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao salvar gist. Tente novamente.'

      // Verifica se é erro de conversão necessária
      if (errorMessage === 'CONVERSION_REQUIRED') {
      } else {
        toast.error(errorMessage)
      }
    } finally {
      setIsSaving(false)
    }
  }, [gist, description, tags, onSave, isPublic, onOpenChange])

  const handleConvert = useCallback(async () => {
    if (!gist || !onConvertPublicToPrivate) return

    setIsSaving(true)
    try {
      // Monta a descrição final com tags
      let finalDescription = description.trim()
      if (tags.length > 0) {
        const tagsString = tags.map((tag) => `#${tag}`).join(' ')
        finalDescription = finalDescription ? `${finalDescription} ${tagsString}` : tagsString
      }
      await onConvertPublicToPrivate(gist, finalDescription)
      toast.success('Gist convertido para privado com sucesso!')
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao converter gist:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao converter gist. Tente novamente.'
      toast.error(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }, [gist, description, tags, onConvertPublicToPrivate, onOpenChange])

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
          <DialogTitle>Editar Descrição e Tags</DialogTitle>
          <DialogDescription>
            Edite a descrição do gist e gerencie suas tags. As tags serão adicionadas à descrição no
            formato #tag.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
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
          <div className='space-y-3'>
            <div className='flex items-center justify-between rounded-md border p-3'>
              <div className='space-y-0.5'>
                <Label htmlFor='privacy' className='text-base'>
                  Visibilidade
                </Label>
                <p className='text-muted-foreground text-sm'>
                  {isPublic
                    ? 'Qualquer pessoa pode ver este gist'
                    : 'Apenas você pode ver este gist'}
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

            {/* Aviso de conversão */}
            {gist?.public === true && isPublic === false && (
              <div className='rounded-md border border-amber-500/20 bg-amber-500/10 p-3'>
                <p className='text-sm font-medium text-amber-600'>
                  ⚠️ Conversão de Visibilidade Necessária
                </p>
                <p className='mt-1 text-xs text-amber-600/80'>
                  Gists públicos não podem ser tornados privados diretamente. Será criado um novo
                  gist privado e o público será deletado. Isso resultará em uma nova URL.
                </p>
                <ul className='mt-2 list-inside list-disc text-xs text-amber-600/80'>
                  <li>O gist público atual será deletado</li>
                  <li>Um novo gist privado será criado com o mesmo conteúdo</li>
                  <li>A URL do gist mudará</li>
                  <li>Histórico, forks e comentários serão perdidos</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancelar
          </Button>
          {gist?.public === true && isPublic === false && onConvertPublicToPrivate ? (
            <Button onClick={handleConvert} disabled={isSaving} variant='destructive'>
              {isSaving ? 'Convertendo...' : 'Converter para Privado'}
            </Button>
          ) : (
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
