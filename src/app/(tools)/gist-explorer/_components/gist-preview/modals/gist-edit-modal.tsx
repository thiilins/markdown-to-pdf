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
import { AlertCircle, Globe, Loader2, Lock, Plus, Settings2, Tag, TextQuote, X } from 'lucide-react'
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

  useEffect(() => {
    if (open && gist) {
      const currentTags = extractGistTags(gist.description)
      let cleanDescription = gist.description || ''
      currentTags.forEach((tag) => {
        cleanDescription = cleanDescription.replace(new RegExp(`#${tag}\\b`, 'gi'), '').trim()
      })
      cleanDescription = cleanDescription.replace(/\s+/g, ' ').trim()
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
      toast.error('Tag muito longa')
      return
    }
    if (!/^[a-z0-9_]+$/.test(trimmedTag)) {
      toast.error('Use apenas letras, números e underscore')
      return
    }
    setTags([...tags, trimmedTag])
    setNewTag('')
  }, [newTag, tags])

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSave = useCallback(async () => {
    if (!gist) return

    setIsSaving(true)
    try {
      let finalDescription = description.trim()
      if (tags.length > 0) {
        const tagsString = tags.map((tag) => `#${tag}`).join(' ')
        finalDescription = finalDescription ? `${finalDescription} ${tagsString}` : tagsString
      }
      await onSave(gist.id, finalDescription, isPublic)
      toast.success('Gist atualizado com sucesso!')
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar alterações')
    } finally {
      setIsSaving(false)
    }
  }, [gist, description, tags, onSave, isPublic, onOpenChange])

  const handleConvert = useCallback(async () => {
    if (!gist || !onConvertPublicToPrivate) return

    setIsSaving(true)
    try {
      let finalDescription = description.trim()
      if (tags.length > 0) {
        const tagsString = tags.map((tag) => `#${tag}`).join(' ')
        finalDescription = finalDescription ? `${finalDescription} ${tagsString}` : tagsString
      }
      await onConvertPublicToPrivate(gist, finalDescription)
      toast.success('Gist convertido e recriado como privado!')
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.message || 'Erro na conversão do Gist')
    } finally {
      setIsSaving(false)
    }
  }, [gist, description, tags, onConvertPublicToPrivate, onOpenChange])

  // Flag para detecção de mudança crítica de visibilidade
  const isConversionRequired = gist?.public === true && isPublic === false

  if (!gist) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='gap-0 overflow-hidden border-none p-0 shadow-2xl sm:max-w-[550px]'>
        {/* Header Consistente */}
        <div className='from-primary/10 flex flex-col items-center justify-center bg-gradient-to-b to-transparent pt-8 pb-4'>
          <div className='bg-primary/10 ring-primary/5 mb-4 flex h-14 w-14 items-center justify-center rounded-full ring-8'>
            <Settings2 className='text-primary h-7 w-7' />
          </div>
          <DialogHeader className='flex w-full flex-col items-center justify-center px-6 text-center'>
            <DialogTitle className='text-xl font-bold tracking-tight'>
              Editar Descrição e Tags
            </DialogTitle>
            <DialogDescription className='text-sm'>
              Gerencie os metadados do seu Gist no GitHub.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className='custom-scrollbar max-h-[65vh] space-y-6 overflow-y-auto px-6 py-6'>
          {/* Descrição */}
          <div className='space-y-2'>
            <Label
              htmlFor='description'
              className='text-muted-foreground flex items-center gap-2 text-sm font-semibold'>
              <TextQuote className='h-3.5 w-3.5' /> Descrição do Gist
            </Label>
            <Textarea
              id='description'
              placeholder='Digite a descrição...'
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
                        onClick={() => handleRemoveTag(tag)}
                        className='hover:bg-destructive/20 text-muted-foreground hover:text-destructive rounded-full p-0.5'>
                        <X className='h-3 w-3' />
                      </button>
                    </Badge>
                  ))
                ) : (
                  <span className='text-muted-foreground px-1 text-[11px] italic'>
                    Nenhuma tag...
                  </span>
                )}
              </div>
              <div className='flex gap-2'>
                <Input
                  placeholder='Nova tag...'
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                  className='bg-background h-8 text-xs'
                />
                <Button size='sm' variant='outline' onClick={handleAddTag} className='h-8 px-3'>
                  <Plus className='mr-1 h-3.5 w-3.5' /> Add
                </Button>
              </div>
            </div>
          </div>

          {/* Privacidade Card */}
          <div className='space-y-3'>
            <div
              className={cn(
                'flex items-center justify-between rounded-xl border p-4 transition-all',
                isConversionRequired ? 'border-amber-500/50 bg-amber-500/5' : 'bg-muted/10',
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
                    ? 'Qualquer pessoa pode encontrar e ver.'
                    : 'Apenas quem possui o link pode acessar.'}
                </p>
              </div>
              <Switch checked={isPublic} onCheckedChange={setIsPublic} disabled={isSaving} />
            </div>

            {/* Aviso de Conversão Estilizado */}
            {isConversionRequired && (
              <div className='rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/30 dark:bg-amber-950/20'>
                <div className='flex gap-3'>
                  <AlertCircle className='h-5 w-5 shrink-0 text-amber-600' />
                  <div className='space-y-2'>
                    <p className='text-xs font-bold tracking-wider text-amber-700 uppercase dark:text-amber-400'>
                      Atenção: Ação de Substituição
                    </p>
                    <p className='text-[11px] leading-relaxed text-amber-800 dark:text-amber-500'>
                      Gists públicos não podem ser alterados para privados diretamente. Para
                      realizar esta mudança, o Gist atual será{' '}
                      <span className='font-bold underline'>deletado</span> e um novo Gist privado
                      será criado. Isso alterará a URL e removerá comentários/forks existentes.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Dinâmico */}
        <DialogFooter className='bg-muted/20 flex w-full flex-col-reverse items-center gap-3 border-t px-6 py-4 sm:flex-row sm:justify-end'>
          <Button
            variant='ghost'
            className='hover:bg-background w-full font-medium sm:w-auto'
            onClick={() => onOpenChange(false)}
            disabled={isSaving}>
            Cancelar
          </Button>

          {isConversionRequired ? (
            <Button
              variant='destructive'
              className='shadow-destructive/20 w-full min-w-[160px] gap-2 font-bold shadow-lg sm:w-auto'
              onClick={handleConvert}
              disabled={isSaving}>
              {isSaving ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <Lock className='h-4 w-4' />
              )}
              {isSaving ? 'Convertendo...' : 'Converter para Privado'}
            </Button>
          ) : (
            <Button
              className='w-full min-w-[120px] gap-2 font-bold shadow-md sm:w-auto'
              onClick={handleSave}
              disabled={
                isSaving ||
                (description === gist?.description &&
                  tags.join(' ') === extractGistTags(gist?.description).join(' ') &&
                  isPublic === gist?.public)
              }>
              {isSaving ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <Settings2 className='h-4 w-4' />
              )}
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
