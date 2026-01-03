'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Progress } from '@/components/ui/progress'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { diffLines, diffWords, type Change } from 'diff'
import {
  ArrowLeftRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardPaste,
  Copy,
  Download,
  FileText,
  Filter,
  GitCompare,
  Info,
  Minus,
  Plus,
  RotateCcw,
  Settings,
  Sparkles,
  X,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { CodeFormatterEditor } from '../../_components/code-formatter-editor'

const DEFAULT_ORIGINAL = `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}`

const DEFAULT_NEW = `function calculateTotal(items) {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  return total;
}`

type DiffFilter = 'all' | 'added' | 'removed' | 'unchanged'

export default function DiffCheckerView() {
  const [originalText, setOriginalText] = useState<string>(DEFAULT_ORIGINAL)
  const [newText, setNewText] = useState<string>(DEFAULT_NEW)
  const [diffMode, setDiffMode] = useState<'words' | 'lines'>('lines')
  const [diffFilter, setDiffFilter] = useState<DiffFilter>('all')
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false)
  const [caseSensitive, setCaseSensitive] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    setIsMounted(true)
    const checkSize = () => setIsDesktop(window.innerWidth >= 1024)
    checkSize()
    window.addEventListener('resize', checkSize)
    return () => window.removeEventListener('resize', checkSize)
  }, [])

  // Cálculo otimizado do diff
  const { changes, stats, filteredChanges } = useMemo(() => {
    if (!isMounted) return { changes: [], stats: { added: 0, removed: 0, unchanged: 0 }, filteredChanges: [] }

    let original = originalText
    let modified = newText

    if (!caseSensitive) {
      original = original.toLowerCase()
      modified = modified.toLowerCase()
    }

    const calculatedChanges: Change[] =
      diffMode === 'words' ? diffWords(original, modified) : diffLines(original, modified, { ignoreWhitespace })

    const stats = calculatedChanges.reduce(
      (acc, curr) => {
        if (curr.added) {
          acc.added += diffMode === 'lines' ? curr.value.split('\n').filter((l) => l).length : 1
        } else if (curr.removed) {
          acc.removed += diffMode === 'lines' ? curr.value.split('\n').filter((l) => l).length : 1
        } else {
          acc.unchanged += diffMode === 'lines' ? curr.value.split('\n').filter((l) => l).length : 1
        }
        return acc
      },
      { added: 0, removed: 0, unchanged: 0 },
    )

    // Aplicar filtro
    const filtered = calculatedChanges.filter((change) => {
      if (diffFilter === 'all') return true
      if (diffFilter === 'added') return change.added
      if (diffFilter === 'removed') return change.removed
      if (diffFilter === 'unchanged') return !change.added && !change.removed
      return true
    })

    return { changes: calculatedChanges, stats, filteredChanges: filtered }
  }, [originalText, newText, diffMode, ignoreWhitespace, caseSensitive, diffFilter, isMounted])

  const hasChanges = changes.some((c) => c.added || c.removed)
  const totalChanges = stats.added + stats.removed
  const similarity = totalChanges > 0 ? Math.round((stats.unchanged / (stats.added + stats.removed + stats.unchanged)) * 100) : 100

  const handleSwap = useCallback(() => {
    setOriginalText(newText)
    setNewText(originalText)
    toast.success('Textos trocados')
  }, [originalText, newText])

  const handleClear = useCallback(() => {
    setOriginalText('')
    setNewText('')
    toast.success('Campos limpos')
  }, [])

  const handleReset = useCallback(() => {
    setOriginalText(DEFAULT_ORIGINAL)
    setNewText(DEFAULT_NEW)
    toast.success('Valores padrão restaurados')
  }, [])

  const copyToClipboard = useCallback(async (text: string, label: string) => {
    if (!text) return toast.error(`Nenhum texto em ${label} para copiar`)
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`${label} copiado!`)
    } catch {
      toast.error('Erro ao copiar')
    }
  }, [])

  const handlePaste = useCallback(async (target: 'original' | 'new') => {
    try {
      const text = await navigator.clipboard.readText()
      if (target === 'original') {
        setOriginalText(text)
      } else {
        setNewText(text)
      }
      toast.success('Texto colado')
    } catch {
      toast.error('Erro ao colar')
    }
  }, [])

  const handleDownload = useCallback(() => {
    const content = `=== DIFF RESULT ===
Data: ${new Date().toLocaleString('pt-BR')}
Modo: ${diffMode === 'lines' ? 'Linhas' : 'Palavras'}
Estatísticas: +${stats.added} adições, -${stats.removed} remoções

=== ORIGINAL ===
${originalText}

=== MODIFICADO ===
${newText}

=== DIFF ===
${filteredChanges.map((c) => (c.added ? `+${c.value}` : c.removed ? `-${c.value}` : ` ${c.value}`)).join('')}`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `diff-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Diff exportado')
  }, [originalText, newText, diffMode, stats, filteredChanges])

  if (!isMounted) return null

  return (
    <div className='bg-background flex h-[calc(100vh-4rem)] flex-col overflow-hidden'>
      {/* Header Moderno */}
      <header className='bg-gradient-to-r from-background via-muted/20 to-background border-b p-4 shadow-sm supports-backdrop-filter:bg-background/60'>
        <div className='mx-auto flex max-w-[1800px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
          {/* Title Section */}
          <div className='flex items-center gap-3'>
            <div className='bg-primary/10 text-primary ring-primary/20 flex h-11 w-11 items-center justify-center rounded-xl ring-2 shadow-lg'>
              <GitCompare className='h-6 w-6' />
            </div>
            <div>
              <h1 className='text-xl font-bold tracking-tight'>Diff Checker Pro</h1>
              <p className='text-muted-foreground mt-0.5 flex items-center gap-2 text-xs'>
                <Sparkles className='h-3 w-3' />
                Comparação avançada de código e texto
              </p>
            </div>
          </div>

          {/* Stats & Actions */}
          <div className='flex flex-wrap items-center gap-3'>
            {/* Estatísticas Rápidas */}
            {hasChanges && (
              <div className='bg-muted/50 flex items-center gap-3 rounded-lg border px-3 py-1.5'>
                <div className='flex items-center gap-1.5'>
                  <div className='bg-green-500/20 text-green-600 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold'>
                    <Plus className='h-3 w-3' />
                  </div>
                  <span className='font-mono text-xs font-semibold'>{stats.added}</span>
                </div>
                <Separator orientation='vertical' className='h-4' />
                <div className='flex items-center gap-1.5'>
                  <div className='bg-red-500/20 text-red-600 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold'>
                    <Minus className='h-3 w-3' />
                  </div>
                  <span className='font-mono text-xs font-semibold'>{stats.removed}</span>
                </div>
                <Separator orientation='vertical' className='h-4' />
                <div className='flex items-center gap-1.5'>
                  <span className='text-muted-foreground text-[10px] font-medium'>Similaridade</span>
                  <Badge variant='secondary' className='h-5 px-2 text-xs font-bold'>
                    {similarity}%
                  </Badge>
                </div>
              </div>
            )}

            {/* Controles Principais */}
            <div className='flex items-center gap-2'>
              {/* Modo de Diff */}
              <div className='bg-background flex items-center rounded-lg border p-1 shadow-sm'>
                <Button
                  variant={diffMode === 'lines' ? 'secondary' : 'ghost'}
                  size='sm'
                  onClick={() => setDiffMode('lines')}
                  className='h-8 px-3 text-xs font-medium'>
                  Linhas
                </Button>
                <Button
                  variant={diffMode === 'words' ? 'secondary' : 'ghost'}
                  size='sm'
                  onClick={() => setDiffMode('words')}
                  className='h-8 px-3 text-xs font-medium'>
                  Palavras
                </Button>
              </div>

              <Separator orientation='vertical' className='h-6' />

              {/* Configurações */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant='outline' size='sm' className='h-9 gap-2'>
                    <Settings className='h-4 w-4' />
                    <span className='hidden sm:inline'>Opções</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-64' align='end'>
                  <div className='space-y-4'>
                    <div>
                      <h4 className='font-semibold text-sm'>Configurações de Comparação</h4>
                      <p className='text-muted-foreground text-xs'>Ajuste como as diferenças são detectadas</p>
                    </div>
                    <div className='space-y-3'>
                      <div className='flex items-center justify-between'>
                        <Label htmlFor='ignore-whitespace' className='text-xs font-medium'>
                          Ignorar Espaços
                        </Label>
                        <Switch
                          id='ignore-whitespace'
                          checked={ignoreWhitespace}
                          onCheckedChange={setIgnoreWhitespace}
                        />
                      </div>
                      <div className='flex items-center justify-between'>
                        <Label htmlFor='case-sensitive' className='text-xs font-medium'>
                          Sensível a Maiúsculas
                        </Label>
                        <Switch id='case-sensitive' checked={caseSensitive} onCheckedChange={setCaseSensitive} />
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Filtros */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' size='sm' className='h-9 gap-2'>
                    <Filter className='h-4 w-4' />
                    <span className='hidden sm:inline'>Filtro</span>
                    <ChevronDown className='h-3 w-3' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-48'>
                  <DropdownMenuLabel>Filtrar Diferenças</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setDiffFilter('all')}>
                    <div className={cn('mr-2 h-2 w-2 rounded-full', diffFilter === 'all' && 'bg-primary')} />
                    Todos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDiffFilter('added')}>
                    <div className={cn('mr-2 h-2 w-2 rounded-full bg-green-500', diffFilter === 'added' && 'ring-2 ring-green-500')} />
                    Apenas Adições
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDiffFilter('removed')}>
                    <div className={cn('mr-2 h-2 w-2 rounded-full bg-red-500', diffFilter === 'removed' && 'ring-2 ring-red-500')} />
                    Apenas Remoções
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDiffFilter('unchanged')}>
                    <div className={cn('mr-2 h-2 w-2 rounded-full bg-muted-foreground', diffFilter === 'unchanged' && 'ring-2')} />
                    Apenas Iguais
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Separator orientation='vertical' className='h-6' />

              {/* Ações Rápidas */}
              <Button variant='outline' size='sm' onClick={handleSwap} className='h-9 gap-2' title='Trocar textos'>
                <ArrowLeftRight className='h-4 w-4' />
                <span className='hidden sm:inline'>Trocar</span>
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={handleDownload}
                className='h-9 gap-2'
                title='Exportar diff'
                disabled={!hasChanges}>
                <Download className='h-4 w-4' />
                <span className='hidden sm:inline'>Exportar</span>
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={handleClear}
                className='text-muted-foreground hover:text-destructive h-9 w-9 p-0'
                title='Limpar tudo'>
                <X className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className='flex flex-1 overflow-hidden'>
        {!isDesktop ? (
          <DiffMobileView
            originalText={originalText}
            newText={newText}
            onOriginalChange={setOriginalText}
            onNewChange={setNewText}
            changes={filteredChanges}
            mode={diffMode}
            stats={stats}
            onPaste={handlePaste}
            onCopy={copyToClipboard}
            onReset={handleReset}
          />
        ) : (
          <ResizablePanelGroup direction='vertical' className='h-full'>
            {/* Painel Superior: Editores */}
            <ResizablePanel defaultSize={45} minSize={25} maxSize={70} className='bg-background'>
              <ResizablePanelGroup direction='horizontal' className='h-full'>
                <ResizablePanel defaultSize={50} minSize={20}>
                  <EditorPanel
                    title='Original'
                    value={originalText}
                    onChange={setOriginalText}
                    onCopy={() => copyToClipboard(originalText, 'Original')}
                    onPaste={() => handlePaste('original')}
                    variant='original'
                  />
                </ResizablePanel>

                <ResizableHandle withHandle className='bg-border hover:bg-primary/20 transition-colors' />

                <ResizablePanel defaultSize={50} minSize={20}>
                  <EditorPanel
                    title='Modificado'
                    value={newText}
                    onChange={setNewText}
                    onCopy={() => copyToClipboard(newText, 'Modificado')}
                    onPaste={() => handlePaste('new')}
                    variant='modified'
                  />
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>

            <ResizableHandle withHandle className='bg-border hover:bg-primary/20 transition-colors' />

            {/* Painel Inferior: Resultado */}
            <ResizablePanel defaultSize={55} minSize={30}>
              <DiffOutputPanel
                changes={filteredChanges}
                mode={diffMode}
                stats={stats}
                hasChanges={hasChanges}
                similarity={similarity}
                filter={diffFilter}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Subcomponents                                                              */
/* -------------------------------------------------------------------------- */

function EditorPanel({
  title,
  value,
  onChange,
  onCopy,
  onPaste,
  variant,
}: {
  title: string
  value: string
  onChange: (value: string) => void
  onCopy: () => void
  onPaste: () => void
  variant: 'original' | 'modified'
}) {
  const isOriginal = variant === 'original'
  const lines = value.split('\n').length
  const words = value.split(/\s+/).filter((w) => w).length

  return (
    <Card className='flex h-full flex-col overflow-hidden border-none shadow-sm'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 border-b bg-muted/30 py-3'>
        <div className='flex items-center gap-3'>
          <div
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg',
              isOriginal ? 'bg-red-500/10 text-red-600' : 'bg-green-500/10 text-green-600',
            )}>
            <FileText className='h-4 w-4' />
          </div>
          <div>
            <CardTitle className='text-sm font-semibold'>{title}</CardTitle>
            <div className='flex items-center gap-2 text-xs text-muted-foreground'>
              <span>{lines} linhas</span>
              <span>•</span>
              <span>{words} palavras</span>
              <span>•</span>
              <span className='font-mono'>{value.length} chars</span>
            </div>
          </div>
        </div>
        <div className='flex items-center gap-1'>
          <Button variant='ghost' size='icon' className='h-7 w-7' onClick={onPaste} title='Colar'>
            <ClipboardPaste className='h-3.5 w-3.5' />
          </Button>
          <Button variant='ghost' size='icon' className='h-7 w-7' onClick={onCopy} title='Copiar'>
            <Copy className='h-3.5 w-3.5' />
          </Button>
        </div>
      </CardHeader>
      <CardContent className='flex-1 p-0'>
        <div className='relative h-full'>
          <CodeFormatterEditor value={value} onChange={onChange} language='plaintext' />
        </div>
      </CardContent>
    </Card>
  )
}

function DiffOutputPanel({
  changes,
  mode,
  stats,
  hasChanges,
  similarity,
  filter,
}: {
  changes: Change[]
  mode: 'words' | 'lines'
  stats: { added: number; removed: number; unchanged: number }
  hasChanges: boolean
  similarity: number
  filter: DiffFilter
}) {
  return (
    <Card className='flex h-full flex-col overflow-hidden border-none shadow-sm'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 border-b bg-gradient-to-r from-muted/30 to-muted/20 py-3'>
        <div className='flex items-center gap-3'>
          <div className='bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg'>
            <GitCompare className='h-4 w-4' />
          </div>
          <div>
            <CardTitle className='text-sm font-semibold'>Resultado da Comparação</CardTitle>
            <div className='flex items-center gap-2 text-xs text-muted-foreground'>
              <span>Modo: {mode === 'lines' ? 'Linhas' : 'Palavras'}</span>
              {filter !== 'all' && (
                <>
                  <span>•</span>
                  <span>Filtro: {filter === 'added' ? 'Adições' : filter === 'removed' ? 'Remoções' : 'Iguais'}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {hasChanges && (
          <div className='flex items-center gap-2'>
            <Badge variant='outline' className='border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400'>
              <Plus className='mr-1 h-3 w-3' />
              {stats.added}
            </Badge>
            <Badge variant='outline' className='border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400'>
              <Minus className='mr-1 h-3 w-3' />
              {stats.removed}
            </Badge>
            <div className='bg-muted/50 flex items-center gap-2 rounded-md border px-2 py-1'>
              <Info className='text-muted-foreground h-3 w-3' />
              <span className='text-xs font-medium'>{similarity}% similar</span>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className='flex-1 overflow-auto p-0'>
        {!hasChanges ? (
          <div className='text-muted-foreground flex h-full flex-col items-center justify-center p-8'>
            <div className='bg-green-500/10 mb-4 rounded-full p-6'>
              <CheckCircle2 className='h-12 w-12 text-green-600' />
            </div>
            <h3 className='mb-2 text-lg font-semibold'>Textos Idênticos</h3>
            <p className='text-center text-sm'>Nenhuma diferença encontrada entre os textos</p>
            <div className='mt-4 w-64'>
              <Progress value={100} className='h-2' />
              <p className='mt-2 text-center text-xs'>100% de similaridade</p>
            </div>
          </div>
        ) : (
          <div className='font-mono text-sm'>
            {mode === 'lines' ? (
              <div className='divide-border/30 divide-y'>
                {changes.map((change, idx) => (
                  <LineDiffRow key={idx} change={change} />
                ))}
              </div>
            ) : (
              <div className='p-4 leading-relaxed break-words whitespace-pre-wrap'>
                {changes.map((change, idx) => (
                  <WordDiffSpan key={idx} change={change} />
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function LineDiffRow({ change }: { change: Change }) {
  if (change.added) {
    return (
      <div className='group flex border-l-4 border-green-500 bg-green-500/10 transition-colors hover:bg-green-500/15 dark:bg-green-500/5'>
        <div className='bg-green-500/20 text-green-700 flex w-12 shrink-0 items-center justify-center border-r border-green-500/30 py-2 text-xs font-bold dark:text-green-400'>
          +
        </div>
        <div className='text-green-900 flex-1 py-2 pl-4 break-all font-medium dark:text-green-100'>
          {change.value}
        </div>
      </div>
    )
  }
  if (change.removed) {
    return (
      <div className='group flex border-l-4 border-red-500 bg-red-500/10 transition-colors hover:bg-red-500/15 dark:bg-red-500/5'>
        <div className='bg-red-500/20 text-red-700 flex w-12 shrink-0 items-center justify-center border-r border-red-500/30 py-2 text-xs font-bold dark:text-red-400'>
          −
        </div>
        <div className='text-red-900 flex-1 py-2 pl-4 break-all font-medium line-through decoration-red-600/50 dark:text-red-100'>
          {change.value}
        </div>
      </div>
    )
  }
  return (
    <div className='hover:bg-muted/20 group flex border-l-4 border-transparent transition-colors'>
      <div className='text-muted-foreground/40 flex w-12 shrink-0 items-center justify-center border-r py-2 text-xs'>
        <span className='opacity-0 group-hover:opacity-100'>·</span>
      </div>
      <div className='text-foreground/70 flex-1 py-2 pl-4 break-all'>{change.value}</div>
    </div>
  )
}

function WordDiffSpan({ change }: { change: Change }) {
  if (change.added) {
    return (
      <span className='bg-green-500/20 text-green-800 mx-0.5 rounded px-1 py-0.5 font-semibold underline decoration-green-600 decoration-2 underline-offset-2 dark:bg-green-500/30 dark:text-green-200'>
        {change.value}
      </span>
    )
  }
  if (change.removed) {
    return (
      <span className='bg-red-500/20 text-red-800 mx-0.5 rounded px-1 py-0.5 font-semibold line-through decoration-red-600/60 dark:bg-red-500/30 dark:text-red-200'>
        {change.value}
      </span>
    )
  }
  return <span className='text-foreground/80'>{change.value}</span>
}

function DiffMobileView({
  originalText,
  newText,
  onOriginalChange,
  onNewChange,
  changes,
  mode,
  stats,
  onPaste,
  onCopy,
  onReset,
}: {
  originalText: string
  newText: string
  onOriginalChange: (value: string) => void
  onNewChange: (value: string) => void
  changes: Change[]
  mode: 'words' | 'lines'
  stats: { added: number; removed: number; unchanged: number }
  onPaste: (target: 'original' | 'new') => void
  onCopy: (text: string, label: string) => void
  onReset: () => void
}) {
  const [activeTab, setActiveTab] = useState<'original' | 'new' | 'diff'>('original')

  return (
    <div className='flex h-full flex-col'>
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className='flex h-full flex-col'>
        <div className='bg-muted/30 border-b px-4 py-2'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='original' className='text-xs'>
              Original
            </TabsTrigger>
            <TabsTrigger value='new' className='text-xs'>
              Novo
            </TabsTrigger>
            <TabsTrigger value='diff' className='gap-1 text-xs'>
              Diff
              {changes.some((c) => c.added || c.removed) && (
                <Badge variant='destructive' className='h-4 w-4 p-0 text-[8px]'>
                  {stats.added + stats.removed}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <div className='flex-1 overflow-hidden'>
          <TabsContent value='original' className='m-0 h-full border-0'>
            <EditorPanel
              title='Texto Original'
              value={originalText}
              onChange={onOriginalChange}
              onCopy={() => onCopy(originalText, 'Original')}
              onPaste={() => onPaste('original')}
              variant='original'
            />
          </TabsContent>
          <TabsContent value='new' className='m-0 h-full border-0'>
            <EditorPanel
              title='Texto Novo'
              value={newText}
              onChange={onNewChange}
              onCopy={() => onCopy(newText, 'Novo')}
              onPaste={() => onPaste('new')}
              variant='modified'
            />
          </TabsContent>
          <TabsContent value='diff' className='m-0 h-full border-0'>
            <DiffOutputPanel
              changes={changes}
              mode={mode}
              stats={stats}
              hasChanges={changes.some((c) => c.added || c.removed)}
              similarity={stats.added + stats.removed > 0 ? Math.round((stats.unchanged / (stats.added + stats.removed + stats.unchanged)) * 100) : 100}
              filter='all'
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
