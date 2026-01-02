'use client'

import { Button } from '@/components/ui/button'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Copy, FileText, GitCompare, RotateCcw, ArrowLeftRight } from 'lucide-react'
import { diffWords, diffLines, type Change } from 'diff'
import { useCallback, useEffect, useState } from 'react'
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

export default function DiffCheckerView() {
  const [originalText, setOriginalText] = useState<string>(DEFAULT_ORIGINAL)
  const [newText, setNewText] = useState<string>(DEFAULT_NEW)
  const [diffMode, setDiffMode] = useState<'words' | 'lines'>('words')
  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    const checkSize = () => setIsDesktop(window.innerWidth >= 1024)
    checkSize()
    window.addEventListener('resize', checkSize)
    return () => window.removeEventListener('resize', checkSize)
  }, [])

  const handleSwap = useCallback(() => {
    setOriginalText(newText)
    setNewText(originalText)
  }, [originalText, newText])

  const handleClear = useCallback(() => {
    setOriginalText('')
    setNewText('')
  }, [])

  const handleReset = useCallback(() => {
    setOriginalText(DEFAULT_ORIGINAL)
    setNewText(DEFAULT_NEW)
  }, [])

  const handleCopyOriginal = useCallback(async () => {
    if (!originalText) {
      toast.error('Nenhum texto original para copiar')
      return
    }
    try {
      await navigator.clipboard.writeText(originalText)
      toast.success('Texto original copiado!')
    } catch {
      toast.error('Erro ao copiar texto')
    }
  }, [originalText])

  const handleCopyNew = useCallback(async () => {
    if (!newText) {
      toast.error('Nenhum texto novo para copiar')
      return
    }
    try {
      await navigator.clipboard.writeText(newText)
      toast.success('Texto novo copiado!')
    } catch {
      toast.error('Erro ao copiar texto')
    }
  }, [newText])

  const changes = diffMode === 'words' ? diffWords(originalText, newText) : diffLines(originalText, newText)

  return (
    <div className='bg-background flex h-[calc(100vh-4rem)] flex-col overflow-hidden'>
      {/* Header */}
      <div className='from-card to-card/95 shrink-0 border-b bg-gradient-to-b shadow-sm'>
        <div className='px-4 py-3 sm:px-6 sm:py-4'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex items-center gap-3'>
              <div className='bg-primary/10 ring-primary/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 sm:h-12 sm:w-12'>
                <GitCompare className='text-primary h-5 w-5 sm:h-6 sm:w-6' />
              </div>
              <div className='min-w-0 flex-1'>
                <h1 className='text-lg font-bold tracking-tight sm:text-xl'>Diff Checker</h1>
                <p className='text-muted-foreground mt-0.5 text-xs sm:text-sm'>
                  Compare textos e visualize diferenças
                </p>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleSwap}
                className='h-9 gap-1.5 px-3 text-xs'>
                <ArrowLeftRight className='h-3.5 w-3.5' />
                Trocar
              </Button>
              <Button variant='ghost' size='sm' onClick={handleClear} className='h-9 w-9 p-0'>
                <RotateCcw className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className='bg-muted/20 border-t px-4 py-2.5 sm:px-6'>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium'>Modo de Comparação</span>
            <div className='flex gap-2'>
              <Button
                variant={diffMode === 'words' ? 'default' : 'outline'}
                size='sm'
                onClick={() => setDiffMode('words')}
                className='h-8 gap-1.5 px-3 text-xs font-medium'>
                Palavras
              </Button>
              <Button
                variant={diffMode === 'lines' ? 'default' : 'outline'}
                size='sm'
                onClick={() => setDiffMode('lines')}
                className='h-8 gap-1.5 px-3 text-xs font-medium'>
                Linhas
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex flex-1 overflow-hidden'>
        {!isDesktop ? (
          <div className='flex h-full w-full flex-col'>
            <DiffMobileView
              originalText={originalText}
              newText={newText}
              onOriginalChange={setOriginalText}
              onNewChange={setNewText}
              changes={changes}
              diffMode={diffMode}
              onCopyOriginal={handleCopyOriginal}
              onCopyNew={handleCopyNew}
            />
          </div>
        ) : (
          <ResizablePanelGroup direction='vertical' className='h-full'>
            <ResizablePanel defaultSize={50} minSize={30}>
              <ResizablePanelGroup direction='horizontal' className='h-full'>
                <ResizablePanel defaultSize={50} minSize={30}>
                  <DiffEditorPanel
                    title='Texto Original'
                    value={originalText}
                    onChange={setOriginalText}
                    onCopy={handleCopyOriginal}
                    icon={FileText}
                  />
                </ResizablePanel>

                <ResizableHandle withHandle />

                <ResizablePanel defaultSize={50} minSize={30}>
                  <DiffEditorPanel
                    title='Texto Novo'
                    value={newText}
                    onChange={setNewText}
                    onCopy={handleCopyNew}
                    icon={GitCompare}
                  />
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={50} minSize={20}>
              <DiffVisualizationPanel changes={changes} mode={diffMode} />
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </div>
  )
}

function DiffEditorPanel({
  title,
  value,
  onChange,
  onCopy,
  icon: Icon,
}: {
  title: string
  value: string
  onChange: (value: string) => void
  onCopy: () => void
  icon: React.ElementType
}) {
  return (
    <div className='flex h-full flex-col bg-background'>
      <div className='bg-muted/30 flex shrink-0 items-center justify-between border-b px-4 py-2.5'>
        <div className='flex items-center gap-2'>
          <Icon className='text-muted-foreground h-4 w-4' />
          <span className='text-sm font-semibold'>{title}</span>
        </div>
        <Button variant='ghost' size='sm' onClick={onCopy} className='h-7 gap-1.5 px-2 text-xs'>
          <Copy className='h-3.5 w-3.5' />
          Copiar
        </Button>
      </div>
      <div className='flex-1 overflow-hidden'>
        <CodeFormatterEditor value={value} onChange={onChange} language='plaintext' />
      </div>
    </div>
  )
}

function DiffMobileView({
  originalText,
  newText,
  onOriginalChange,
  onNewChange,
  changes,
  diffMode,
  onCopyOriginal,
  onCopyNew,
}: {
  originalText: string
  newText: string
  onOriginalChange: (value: string) => void
  onNewChange: (value: string) => void
  changes: Change[]
  diffMode: 'words' | 'lines'
  onCopyOriginal: () => void
  onCopyNew: () => void
}) {
  const [activeTab, setActiveTab] = useState<'original' | 'new' | 'diff'>('original')

  return (
    <>
      <div className='bg-muted/30 flex shrink-0 items-center border-b p-1'>
        <Button
          variant={activeTab === 'original' ? 'secondary' : 'ghost'}
          size='sm'
          className='flex-1 gap-2'
          onClick={() => setActiveTab('original')}>
          <FileText className='h-4 w-4' />
          Original
        </Button>
        <Button
          variant={activeTab === 'new' ? 'secondary' : 'ghost'}
          size='sm'
          className='flex-1 gap-2'
          onClick={() => setActiveTab('new')}>
          <GitCompare className='h-4 w-4' />
          Novo
        </Button>
        <Button
          variant={activeTab === 'diff' ? 'secondary' : 'ghost'}
          size='sm'
          className='flex-1 gap-2'
          onClick={() => setActiveTab('diff')}>
          <GitCompare className='h-4 w-4' />
          Diff
        </Button>
      </div>

      {activeTab === 'original' && (
        <div className='flex flex-1 flex-col overflow-hidden'>
          <DiffEditorPanel
            title='Texto Original'
            value={originalText}
            onChange={onOriginalChange}
            onCopy={onCopyOriginal}
            icon={FileText}
          />
        </div>
      )}

      {activeTab === 'new' && (
        <div className='flex flex-1 flex-col overflow-hidden'>
          <DiffEditorPanel
            title='Texto Novo'
            value={newText}
            onChange={onNewChange}
            onCopy={onCopyNew}
            icon={GitCompare}
          />
        </div>
      )}

      {activeTab === 'diff' && (
        <div className='flex flex-1 flex-col overflow-hidden'>
          <DiffVisualizationPanel changes={changes} mode={diffMode} />
        </div>
      )}
    </>
  )
}

function DiffVisualizationPanel({
  changes,
  mode,
}: {
  changes: Change[]
  mode: 'words' | 'lines'
}) {
  const hasChanges = changes.some((c) => c.added || c.removed)

  if (!hasChanges) {
    return (
      <div className='flex h-full flex-col'>
        <div className='bg-muted/30 flex shrink-0 items-center justify-between border-b px-4 py-2.5'>
          <div className='flex items-center gap-2'>
            <GitCompare className='text-muted-foreground h-4 w-4' />
            <span className='text-sm font-semibold'>Visualização de Diferenças</span>
          </div>
        </div>
        <div className='flex flex-1 items-center justify-center p-4'>
          <div className='text-center'>
            <GitCompare className='text-muted-foreground/50 mx-auto mb-3 h-12 w-12' />
            <p className='text-sm font-semibold'>Nenhuma diferença encontrada</p>
            <p className='text-muted-foreground/70 mt-1 text-xs'>Os textos são idênticos</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='flex h-full flex-col'>
      <div className='bg-muted/30 flex shrink-0 items-center justify-between border-b px-4 py-2.5'>
        <div className='flex items-center gap-2'>
          <GitCompare className='text-muted-foreground h-4 w-4' />
          <span className='text-sm font-semibold'>Visualização de Diferenças</span>
        </div>
        <div className='flex items-center gap-3 text-xs'>
          <div className='flex items-center gap-1.5'>
            <div className='h-3 w-3 rounded bg-green-500/20 ring-1 ring-green-500/50' />
            <span className='text-muted-foreground font-medium'>Adicionado</span>
          </div>
          <div className='flex items-center gap-1.5'>
            <div className='h-3 w-3 rounded bg-red-500/20 ring-1 ring-red-500/50' />
            <span className='text-muted-foreground font-medium'>Removido</span>
          </div>
        </div>
      </div>
      <div className='custom-scrollbar flex-1 overflow-auto bg-[#1e1e1e] p-4'>
        <div className='font-mono text-sm leading-relaxed'>
          {mode === 'lines' ? (
            <div className='space-y-0.5'>
              {changes.map((change, idx) => {
                if (change.added) {
                  return (
                    <div
                      key={idx}
                      className='bg-green-500/10 border-l-2 border-green-500 pl-3 py-1 text-green-300'>
                      <span className='text-green-500/50 mr-2'>+</span>
                      {change.value}
                    </div>
                  )
                }
                if (change.removed) {
                  return (
                    <div
                      key={idx}
                      className='bg-red-500/10 border-l-2 border-red-500 pl-3 py-1 text-red-300 line-through'>
                      <span className='text-red-500/50 mr-2'>-</span>
                      {change.value}
                    </div>
                  )
                }
                return (
                  <div key={idx} className='pl-3 py-1 text-gray-400'>
                    {change.value}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className='whitespace-pre-wrap break-words'>
              {changes.map((change, idx) => {
                if (change.added) {
                  return (
                    <span
                      key={idx}
                      className='bg-green-500/20 text-green-300 ring-1 ring-green-500/30 px-0.5 rounded'>
                      {change.value}
                    </span>
                  )
                }
                if (change.removed) {
                  return (
                    <span
                      key={idx}
                      className='bg-red-500/20 text-red-300 ring-1 ring-red-500/30 px-0.5 rounded line-through'>
                      {change.value}
                    </span>
                  )
                }
                return (
                  <span key={idx} className='text-gray-300'>
                    {change.value}
                  </span>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

