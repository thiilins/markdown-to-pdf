'use client'

import { IconButtonTooltip } from '@/components/custom-ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Toggle } from '@/components/ui/toggle'
import {
  Book,
  Check,
  ChevronDown,
  ChevronUp,
  Code2,
  Copy,
  Eye,
  FileEdit,
  FileText,
  Filter,
  Loader2,
  Search,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { FaMarkdown } from 'react-icons/fa'
import type { ParsedOpenAPI, ParsedPath } from '../utils'
import { OpenApiMdPreview } from './md-preview'
import { OpenApiPreviewComponent } from './openapi'

// --- Tipos e Interfaces ---
interface OpenApiOutputProps {
  result: ParsedOpenAPI | null
  markdown: string
  isProcessing: boolean
  onEditInMdEditor: () => void
  onDownloadMarkdown: () => void
}

// --- Componente Auxiliar: Botão de Copiar ---
const CopyButton = ({ text, className }: { text: string; className?: string }) => {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation() // Evita abrir o accordion se estiver num header
    navigator.clipboard.writeText(text)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <Button
      variant='ghost'
      size='icon'
      className={`h-6 w-6 ${className}`}
      onClick={handleCopy}
      title='Copiar'>
      {isCopied ? (
        <Check className='h-3 w-3 text-green-500' />
      ) : (
        <Copy className='text-muted-foreground h-3 w-3' />
      )}
    </Button>
  )
}
interface OpenApiPreviewHeaderProps {
  result: ParsedOpenAPI
  openHeader: boolean
  setOpenHeader: (openHeader: boolean) => void
  onDownloadMarkdown: () => void
  onEditInMdEditor: () => void
  searchTerm: string
  setSearchTerm: (searchTerm: string) => void
  availableMethods: string[]
  activeMethods: string[]
  handleMethodToggle: (method: string) => void
  setView: (view: 'preview' | 'markdown') => void
}

const OpenApiPreviewHeader = ({
  result,
  openHeader,
  setOpenHeader,
  onDownloadMarkdown,
  onEditInMdEditor,
  searchTerm,
  setSearchTerm,
  availableMethods,
  activeMethods,
  handleMethodToggle,
  setView,
}: OpenApiPreviewHeaderProps) => {
  return (
    <header className='border-b bg-linear-to-r from-purple-500/5 via-blue-500/5 to-purple-500/5 p-6'>
      {/* Header Superior */}
      <div className='mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start'>
        <div className='flex items-start gap-4'>
          <div className='bg-primary/10 text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-xl'>
            <Book className='h-6 w-6' />
          </div>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>{result.title}</h2>
            <div className='mt-1 flex flex-wrap items-center gap-2'>
              <Badge variant='secondary' className='font-mono text-xs'>
                v{result.version}
              </Badge>
              <span className='text-muted-foreground text-xs'>•</span>
              <span className='text-muted-foreground text-xs'>
                {result.paths.length} endpoints totais
              </span>
            </div>
            {result.description && openHeader && (
              <p className='text-muted-foreground mt-2 line-clamp-2 max-w-2xl text-sm'>
                {result.description}
              </p>
            )}
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <div className='flex shrink-0 gap-2'>
            <IconButtonTooltip
              content='Baixar Markdown'
              onClick={onDownloadMarkdown}
              icon={FileText}
              className={{
                button: 'bg-primary/10 text-primary hover:bg-primary/20 h-8 w-8',
              }}
              variant='outline'
            />
            <IconButtonTooltip
              content='Editar no Editor de Markdown'
              onClick={onEditInMdEditor}
              icon={FileEdit}
              className={{
                button: 'bg-primary/10 text-primary hover:bg-primary/20 h-8 w-8',
              }}
              variant='outline'
            />
            <IconButtonTooltip
              content={openHeader ? 'Ver Menos' : 'Ver Mais'}
              onClick={() => setOpenHeader(!openHeader)}
              icon={openHeader ? ChevronUp : ChevronDown}
              className={{
                button: 'bg-primary/10 text-primary hover:bg-primary/20 h-8 w-8',
              }}
              variant='outline'
            />
          </div>
          <div className='border-primary flex items-center gap-2 rounded-md p-1'>
            <IconButtonTooltip
              content='Visualizar como Markdown'
              onClick={() => setView('markdown')}
              icon={FaMarkdown}
              className={{
                button: 'h-8 w-8 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20',
              }}
              variant='outline'
            />
            <IconButtonTooltip
              content='Preview'
              onClick={() => setView('preview')}
              icon={Eye}
              className={{
                button: 'h-8 w-8 bg-teal-500/10 text-teal-600 hover:bg-teal-500/20',
              }}
              variant='outline'
            />
          </div>
        </div>
      </div>

      {/* Barra de Ferramentas (Busca e Filtro) */}
      {openHeader && (
        <>
          <div className='flex flex-col gap-4 md:flex-row md:items-end'>
            <div className='flex-1 space-y-2'>
              <label className='text-muted-foreground ml-1 text-xs font-medium'>Buscar</label>
              <div className='relative'>
                <Search className='text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4' />
                <Input
                  placeholder='Filtrar por url, resumo ou descrição...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='bg-background/50 pl-9'
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className='text-muted-foreground hover:text-foreground absolute top-2.5 right-2'>
                    <X className='h-4 w-4' />
                  </button>
                )}
              </div>
            </div>

            <div className='space-y-2'>
              <label className='text-muted-foreground ml-1 flex items-center gap-1 text-xs font-medium'>
                <Filter className='h-3 w-3' /> Métodos
              </label>
              <div className='flex flex-wrap gap-1'>
                {availableMethods.map((method) => (
                  <Toggle
                    key={method}
                    pressed={activeMethods.includes(method)}
                    onPressedChange={() => handleMethodToggle(method)}
                    variant='outline'
                    size='sm'
                    className={`data-[state=on]:bg-primary/10 data-[state=on]:text-primary data-[state=on]:border-primary/30 h-9 px-3 text-xs font-bold`}>
                    {method}
                  </Toggle>
                ))}
              </div>
            </div>
          </div>

          <div className='mt-6 w-full! flex-1'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='preview'>
                <Eye className='mr-2 h-4 w-4' />
                Documentação
              </TabsTrigger>
              <TabsTrigger value='markdown'>
                <Code2 className='mr-2 h-4 w-4' />
                Markdown Bruto
              </TabsTrigger>
            </TabsList>
          </div>
        </>
      )}
    </header>
  )
}
export function OpenApiPreview({
  result,
  markdown,
  isProcessing,
  onEditInMdEditor,
  onDownloadMarkdown,
}: OpenApiOutputProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeMethods, setActiveMethods] = useState<string[]>([])
  const [openHeader, setOpenHeader] = useState(false)
  const [view, setView] = useState<'preview' | 'markdown'>('preview')
  const handleMethodToggle = (method: string) => {
    setActiveMethods((prev) =>
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method],
    )
  }

  if (isProcessing) {
    return (
      <div className='flex h-full items-center justify-center'>
        <div className='space-y-4 text-center'>
          <Loader2 className='text-primary mx-auto h-12 w-12 animate-spin' />
          <p className='text-muted-foreground text-sm'>Processando especificação...</p>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className='flex h-full items-center justify-center p-8'>
        <div className='max-w-md space-y-4 text-center'>
          <div className='bg-muted mx-auto flex h-16 w-16 items-center justify-center rounded-full'>
            <Book className='text-muted-foreground h-8 w-8' />
          </div>
          <div className='space-y-2'>
            <h3 className='text-lg font-semibold'>Nenhuma documentação gerada</h3>
            <p className='text-muted-foreground text-sm'>
              Cole uma especificação OpenAPI válida no editor para gerar a documentação.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const lowerSearch = searchTerm.toLowerCase()
  const filteredPaths = result.paths.filter((path) => {
    const matchesSearch =
      path.path.toLowerCase().includes(lowerSearch) ||
      path.summary?.toLowerCase().includes(lowerSearch) ||
      path.description?.toLowerCase().includes(lowerSearch)
    const matchesMethod = activeMethods.length === 0 || activeMethods.includes(path.method)
    return matchesSearch && matchesMethod
  })

  const pathsByTag = new Map<string, ParsedPath[]>()
  const untaggedPaths: ParsedPath[] = []
  for (const path of filteredPaths) {
    if (path.tags && path.tags.length > 0) {
      for (const tag of path.tags) {
        if (!pathsByTag.has(tag)) {
          pathsByTag.set(tag, [])
        }
        pathsByTag.get(tag)!.push(path)
      }
    } else {
      untaggedPaths.push(path)
    }
  }
  const filteredSchemas = result.schemas.filter((schema) =>
    schema.name.toLowerCase().includes(lowerSearch),
  )
  const availableMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  return (
    <div className='flex h-full flex-col'>
      <Tabs
        defaultValue='preview'
        className='flex h-full flex-col'
        value={view}
        onValueChange={(value) => setView(value as 'preview' | 'markdown')}>
        <OpenApiPreviewHeader
          result={result}
          openHeader={openHeader}
          setOpenHeader={setOpenHeader}
          onDownloadMarkdown={onDownloadMarkdown}
          onEditInMdEditor={onEditInMdEditor}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          availableMethods={availableMethods}
          activeMethods={activeMethods}
          handleMethodToggle={handleMethodToggle}
          setView={setView}
        />
        <TabsContent
          value='preview'
          className='mt-0 flex-1 overflow-hidden p-0 data-[state=inactive]:hidden'>
          <OpenApiPreviewComponent
            filteredPaths={filteredPaths}
            filteredSchemas={filteredSchemas}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setActiveMethods={setActiveMethods}
            result={result}
            pathsByTag={pathsByTag}
            untaggedPaths={untaggedPaths}
          />
        </TabsContent>
        <TabsContent
          value='markdown'
          className='mt-0 flex-1 overflow-hidden data-[state=inactive]:hidden'>
          <ScrollArea className='h-full'>
            <OpenApiMdPreview content={markdown} />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
