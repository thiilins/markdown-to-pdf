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
import {
  Copy,
  FileCode,
  Github,
  Globe,
  Loader2,
  Lock,
  Plus,
  Save,
  Tag,
  TextQuote,
  X,
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

interface MarkdownItem {
  id: string
  content: string
  name: string
}

interface GistSaveModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  markdown: string
  existingGist?: any | null
  gistFiles?: Record<string, string>
  currentFileName?: string
  markdownList?: MarkdownItem[]
  gistMetadataMap?: Record<string, any>
  currentGistId?: string | null
  canSaveGist?: boolean
  onSave: (description: string, isPublic: boolean, files: Record<string, string>) => Promise<void>
  onUpdate?: (
    gistId: string,
    description: string,
    isPublic: boolean,
    files: Record<string, string>,
  ) => Promise<void>
}

export function GistSaveModal({
  open,
  onOpenChange,
  markdown,
  existingGist,
  gistFiles = {},
  currentFileName = 'document.md',
  markdownList = [],
  gistMetadataMap = {},
  currentGistId = null,
  canSaveGist = false,
  onSave,
  onUpdate,
}: GistSaveModalProps) {
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [filename, setFilename] = useState('document.md')
  const [createAsNew, setCreateAsNew] = useState(false)

  useEffect(() => {
    if (open && existingGist) {
      const currentTags = extractGistTags(existingGist.description)
      let cleanDescription = existingGist.description || ''
      currentTags.forEach((tag: string) => {
        cleanDescription = cleanDescription.replace(new RegExp(`#${tag}\\b`, 'gi'), '').trim()
      })
      cleanDescription = cleanDescription.replace(/\s+/g, ' ').trim()
      setDescription(cleanDescription)
      setTags(currentTags)
      setIsPublic(existingGist.public ?? true)
      if (existingGist.files && Object.keys(existingGist.files).length > 0) {
        setFilename(Object.keys(existingGist.files)[0])
      }
      // Se pode salvar, permite escolher; se não pode, força criar novo
      setCreateAsNew(!canSaveGist)
    } else if (open && !existingGist) {
      setDescription('')
      setTags([])
      setIsPublic(true)
      setFilename(currentFileName || 'document.md')
      setCreateAsNew(false)
    }
  }, [open, existingGist, currentFileName, canSaveGist])

  const handleAddTag = useCallback(() => {
    const trimmedTag = newTag.trim().toLowerCase().replace(/\s+/g, '_')
    if (!trimmedTag) return
    if (tags.includes(trimmedTag)) {
      toast.error('Tag já adicionada')
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

  const handleRemoveTag = useCallback(
    (tagToRemove: string) => {
      setTags(tags.filter((tag) => tag !== tagToRemove))
    },
    [tags],
  )

  const handleSave = useCallback(async () => {
    const filesToSave: Record<string, string> = {}

    // Se está atualizando um gist existente (e não está duplicando), usa os arquivos da lista markdown
    if (existingGist && currentGistId && markdownList.length > 0 && !createAsNew) {
      // Pega todos os arquivos da lista markdown que pertencem a este gist
      markdownList.forEach((item) => {
        if (gistMetadataMap[item.id]?.gistId === currentGistId) {
          // Se é o arquivo atual, usa o conteúdo do editor (markdown)
          // Caso contrário, usa o conteúdo da lista
          if (item.name === currentFileName) {
            filesToSave[item.name] = markdown
          } else {
            filesToSave[item.name] = item.content
          }
        }
      })
    } else if (Object.keys(gistFiles).length > 0) {
      // Criando novo gist com múltiplos arquivos (duplicar ou criar novo)
      Object.keys(gistFiles).forEach((file) => {
        if (file === currentFileName) {
          // Se o nome do arquivo mudou, usa o novo nome
          filesToSave[filename] = markdown
        } else {
          filesToSave[file] = gistFiles[file]
        }
      })
      // Se o nome do arquivo mudou e não está nos arquivos originais, adiciona
      if (filename !== currentFileName && !filesToSave[filename]) {
        filesToSave[filename] = markdown
      }
    } else {
      // Criando novo gist com um único arquivo
      if (!markdown.trim() || !filename.trim()) {
        toast.error('Preencha o conteúdo e o nome do arquivo')
        return
      }
      filesToSave[filename] = markdown
    }

    setIsSaving(true)
    try {
      let finalDescription = description.trim()
      if (tags.length > 0) {
        const tagsString = tags.map((tag) => `#${tag}`).join(' ')
        finalDescription = finalDescription ? `${finalDescription} ${tagsString}` : tagsString
      }

      // Se está editando um gist existente e escolheu atualizar (e pode)
      if (existingGist && onUpdate && !createAsNew && canSaveGist) {
        await onUpdate(existingGist.id, finalDescription, isPublic, filesToSave)
      } else {
        // Criar novo gist (duplicar ou criar do zero)
        await onSave(finalDescription, isPublic, filesToSave)
      }
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.message || 'Erro ao sincronizar com GitHub')
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
    currentGistId,
    gistMetadataMap,
    markdownList,
    canSaveGist,
    createAsNew,
  ])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='gap-0 overflow-hidden border-none p-0 shadow-2xl sm:max-w-[550px]'>
        {/* Header Consistente */}
        <div className='from-primary/10 flex flex-col items-center justify-center bg-linear-to-b to-transparent pt-8 pb-4'>
          <div className='bg-primary/10 ring-primary/5 mb-4 flex h-14 w-14 items-center justify-center rounded-full ring-8'>
            <Github className='text-primary h-7 w-7' />
          </div>
          <DialogHeader className='flex w-full flex-col items-center justify-center px-6 text-center'>
            <DialogTitle className='text-xl font-bold tracking-tight'>
              {existingGist
                ? createAsNew
                  ? 'Duplicar Gist'
                  : 'Atualizar Gist'
                : 'Salvar no GitHub Gist'}
            </DialogTitle>
            <DialogDescription className='text-sm'>
              {existingGist
                ? createAsNew
                  ? 'Crie uma cópia deste gist com suas alterações.'
                  : 'Atualize o gist existente com suas alterações.'
                : 'Sincronize seu documento com sua conta do GitHub de forma rápida.'}
          </DialogDescription>
        </DialogHeader>
        </div>

        <div className='custom-scrollbar max-h-[60vh] space-y-6 overflow-y-auto px-6 py-6'>
          {/* Lista de Arquivos (apenas ao atualizar) */}
          {existingGist && currentGistId && markdownList.length > 0 && (
            <div className='space-y-2'>
              <Label className='flex items-center gap-2 text-sm font-semibold'>
                <FileCode className='text-primary h-3.5 w-3.5' /> Arquivos do Gist
              </Label>
              <div className='bg-muted/20 max-h-[200px] space-y-2 overflow-y-auto scroll-smooth rounded-xl border p-3'>
                {markdownList
                  .filter((item) => gistMetadataMap[item.id]?.gistId === currentGistId)
                  .map((item) => (
                    <div
                      key={item.id}
                      className='bg-background flex items-center justify-between rounded-md border px-3 py-2'>
                      <span className='text-sm font-medium'>{item.name}</span>
                      {item.name === currentFileName && (
                        <Badge variant='secondary' className='text-[10px]'>
                          Atual
                        </Badge>
                      )}
                    </div>
                  ))}
              </div>
              <p className='bg-primary flex items-center justify-center rounded-md p-2 text-[11px] text-white italic'>
                Os nomes dos arquivos são editados no editor. Aqui você edita apenas a descrição e
                tags.
              </p>
            </div>
          )}

          {/* Grid de Inputs Principais */}
          <div className='grid gap-4'>
            {/* Nome do arquivo (ao criar novo ou ao duplicar) */}
            {(!existingGist || createAsNew) && (
          <div className='space-y-2'>
                <Label htmlFor='filename' className='flex items-center gap-2 text-sm font-semibold'>
                  <FileCode className='text-primary h-3.5 w-3.5' /> Nome do Arquivo
                </Label>
            <Input
              id='filename'
                  placeholder='documento.md'
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
                  className='focus-visible:ring-primary h-10'
            />
                {createAsNew && existingGist && (
                  <p className='text-muted-foreground text-[11px] italic'>
                    Você pode alterar o nome do arquivo ao duplicar o gist.
            </p>
                )}
          </div>
            )}

          <div className='space-y-2'>
              <Label
                htmlFor='description'
                className='flex items-center gap-2 text-sm font-semibold'>
                <TextQuote className='text-primary h-3.5 w-3.5' /> Descrição
              </Label>
            <Textarea
              id='description'
                placeholder='Sobre o que é este documento?'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className='focus-visible:ring-primary resize-none'
            />
            </div>
          </div>

          {/* Seção de Tags */}
          <div className='space-y-3'>
            <Label className='flex items-center gap-2 text-sm font-semibold'>
              <Tag className='text-primary h-3.5 w-3.5' /> Tags de Organização
            </Label>
            <div className='bg-muted/20 space-y-3 rounded-xl border p-3'>
              <div className='flex min-h-[32px] flex-wrap gap-1.5'>
              {tags.length > 0 ? (
                tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant='secondary'
                      className='hover:bg-secondary/80 gap-1 py-1 pr-1 pl-2 transition-all'>
                      <span className='text-[11px] font-medium'>#{tag}</span>
                    <button
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
                  placeholder='Adicionar tag...'
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

          {/* Card de Ação (Atualizar ou Duplicar) - apenas quando editando gist existente */}
          {existingGist && canSaveGist && (
            <div className='bg-muted/10 hover:bg-muted/20 flex items-center justify-between rounded-xl border p-4 transition-colors'>
              <div className='space-y-0.5'>
                <div className='text-foreground flex items-center gap-2 text-sm font-semibold'>
                  {createAsNew ? (
                    <Copy className='text-primary h-4 w-4' />
                  ) : (
                    <Save className='text-primary h-4 w-4' />
                  )}
                  {createAsNew ? 'Criar Novo Gist (Duplicar)' : 'Atualizar Gist Existente'}
                </div>
                <p className='text-muted-foreground text-[11px] leading-tight'>
                  {createAsNew
                    ? 'Cria uma cópia independente com suas alterações. O gist original não será modificado.'
                    : 'Atualiza o gist existente com suas alterações. Todas as mudanças serão salvas no gist original.'}
                </p>
              </div>
              <Switch
                checked={createAsNew}
                onCheckedChange={setCreateAsNew}
                className='data-[state=checked]:bg-primary'
              />
            </div>
          )}

          {/* Card de Visibilidade */}
          <div className='bg-muted/10 hover:bg-muted/20 flex items-center justify-between rounded-xl border p-4 transition-colors'>
            <div className='space-y-0.5'>
              <div className='text-foreground flex items-center gap-2 text-sm font-semibold'>
                {isPublic ? (
                  <Globe className='text-primary h-4 w-4' />
                ) : (
                  <Lock className='h-4 w-4 text-amber-500' />
                )}
                {isPublic ? 'Gist Público' : 'Gist Secreto'}
              </div>
              <p className='text-muted-foreground text-[11px] leading-tight'>
                {isPublic
                  ? 'Visível para todos e indexado em mecanismos de busca.'
                  : 'Apenas pessoas com o link direto podem acessar.'}
              </p>
            </div>
            <Switch
              checked={isPublic}
              onCheckedChange={setIsPublic}
              className='data-[state=checked]:bg-primary'
            />
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className='bg-muted/20 flex w-full flex-col-reverse items-center gap-3 border-t px-6 py-4 sm:flex-row sm:justify-end'>
          <Button
            variant='ghost'
            className='hover:bg-background w-full font-medium sm:w-auto'
            onClick={() => onOpenChange(false)}
            disabled={isSaving}>
            Cancelar
          </Button>
          <Button
            className='w-full min-w-[140px] gap-2 font-bold shadow-md transition-all active:scale-95 sm:w-auto'
            onClick={handleSave}
            disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className='h-4 w-4 animate-spin' />
                Salvando...
              </>
            ) : (
              <>
                <Github className='h-4 w-4' />
                {existingGist ? (createAsNew ? 'Duplicar Gist' : 'Atualizar Gist') : 'Criar Gist'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
