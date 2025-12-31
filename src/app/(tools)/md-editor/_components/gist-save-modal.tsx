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

interface GistSaveModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  markdown: string
  existingGist?: Gist | null
  gistFiles?: Record<string, string>
  currentFileName?: string
  onSave: (description: string, isPublic: boolean, files: Record<string, string>) => Promise<void>
  onUpdate?: (gistId: string, description: string, isPublic: boolean, files: Record<string, string>) => Promise<void>
}

export function GistSaveModal({
  open,
  onOpenChange,
  markdown,
  existingGist,
  gistFiles = {},
  currentFileName = 'document.md',
  onSave,
  onUpdate,
}: GistSaveModalProps) {
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [filename, setFilename] = useState('document.md')

  // Extrai descrição e tags quando o modal abre com um gist existente
  useEffect(() => {
    if (open && existingGist) {
      const currentTags = extractGistTags(existingGist.description)
      // Remove tags da descrição para mostrar apenas o texto
      let cleanDescription = existingGist.description || ''
      currentTags.forEach((tag) => {
        cleanDescription = cleanDescription.replace(new RegExp(`#${tag}\\b`, 'gi'), '').trim()
      })
      // Remove múltiplos espaços
      cleanDescription = cleanDescription.replace(/\s+/g, ' ').trim()
      setDescription(cleanDescription)
      setTags(currentTags)
      setIsPublic(existingGist.public ?? true)
      // Se o gist tiver arquivos, usa o primeiro nome de arquivo
      if (existingGist.files && existingGist.files.length > 0) {
        setFilename(existingGist.files[0].filename)
      }
    } else if (open && !existingGist) {
      // Reset para novo gist
      setDescription('')
      setTags([])
      setIsPublic(true)
      setFilename('document.md')
    }
  }, [open, existingGist])

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
    // Prepara todos os arquivos para salvar
    // Se há gistFiles (múltiplos arquivos), usa todos eles
    // Caso contrário, usa apenas o arquivo atual
    const filesToSave: Record<string, string> = {}

    if (Object.keys(gistFiles).length > 0) {
      // Múltiplos arquivos: usa todos os arquivos do gist
      // Atualiza o arquivo atual com o markdown do editor
      Object.keys(gistFiles).forEach((file) => {
        if (file === currentFileName) {
          filesToSave[file] = markdown
        } else {
          filesToSave[file] = gistFiles[file]
        }
      })
    } else {
      // Apenas um arquivo: usa o markdown atual
      if (!markdown.trim()) {
        toast.error('O conteúdo do markdown não pode estar vazio')
        return
      }
      if (!filename.trim()) {
        toast.error('O nome do arquivo é obrigatório')
        return
      }
      filesToSave[filename] = markdown
    }

    // Valida se há pelo menos um arquivo com conteúdo
    const hasContent = Object.values(filesToSave).some((content) => content.trim().length > 0)
    if (!hasContent) {
      toast.error('Pelo menos um arquivo deve ter conteúdo')
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

      if (existingGist && onUpdate) {
        await onUpdate(existingGist.id, finalDescription, isPublic, filesToSave)
        toast.success('Gist atualizado com sucesso!')
      } else {
        await onSave(finalDescription, isPublic, filesToSave)
        toast.success('Gist criado com sucesso!')
      }
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao salvar gist:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao salvar gist. Tente novamente.'
      toast.error(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }, [
    markdown,
    filename,
    description,
    tags,
    isPublic,
    existingGist,
    onSave,
    onUpdate,
    onOpenChange,
    gistFiles,
    currentFileName,
  ])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleAddTag()
      }
    },
    [handleAddTag],
  )

  const isUpdateMode = !!existingGist

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>{isUpdateMode ? 'Atualizar Gist' : 'Criar Novo Gist'}</DialogTitle>
          <DialogDescription>
            {isUpdateMode
              ? 'Atualize a descrição, tags e conteúdo do gist. Você pode salvar como novo gist ou atualizar o existente.'
              : 'Crie um novo gist com o conteúdo do editor. Adicione uma descrição e tags para organizar melhor.'}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          {/* Nome do arquivo */}
          <div className='space-y-2'>
            <Label htmlFor='filename'>Nome do Arquivo</Label>
            <Input
              id='filename'
              placeholder='document.md'
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
            />
            <p className='text-muted-foreground text-xs'>
              O arquivo será salvo com este nome no gist. Use extensão .md para markdown.
            </p>
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
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Salvando...' : isUpdateMode ? 'Atualizar Gist' : 'Criar Gist'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

