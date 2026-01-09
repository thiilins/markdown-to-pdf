'use client'

import { IconButtonTooltip } from '@/components/custom-ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  CheckCircle2,
  Code2,
  Download,
  Eye,
  FileText,
  Loader2,
  Table,
  TrendingUp,
} from 'lucide-react'
import { ExcelMdAnalytics } from './analytics'
import { ExcelMdMarkdown } from './markdown'
import { ExcelPreview } from './preview'

interface ExcelOutputProps {
  result: ConversionResult | null
  columnStats?: ColumnStats[]
  isProcessing: boolean
  onDownloadMarkdown: () => void
  onCopyMarkdown: () => void
}

export function ExcelOutput({
  result,
  columnStats,
  isProcessing,
  onDownloadMarkdown,
  onCopyMarkdown,
}: ExcelOutputProps) {
  if (isProcessing) {
    return (
      <div className='flex h-full items-center justify-center'>
        <div className='space-y-4 text-center'>
          <Loader2 className='text-primary mx-auto h-12 w-12 animate-spin' />
          <p className='text-muted-foreground text-sm'>Convertendo...</p>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className='flex h-full items-center justify-center p-8'>
        <div className='max-w-md space-y-4 text-center'>
          <div className='bg-muted mx-auto flex h-16 w-16 items-center justify-center rounded-full'>
            <Table className='text-muted-foreground h-8 w-8' />
          </div>
          <div className='space-y-2'>
            <h3 className='text-lg font-semibold'>Nenhuma tabela gerada</h3>
            <p className='text-muted-foreground text-sm'>
              Cole dados CSV/JSON ou faça upload de um arquivo Excel para gerar a tabela Markdown.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='flex h-full flex-col'>
      <Tabs defaultValue='preview' className='flex h-full flex-col'>
        {/* Header */}
        <div className='border-b bg-linear-to-r from-green-500/10 via-blue-500/10 to-green-500/10 p-6'>
          <div className='mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
            <div className='space-y-2'>
              <div className='flex items-center gap-3'>
                <div className='bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg'>
                  <Table className='h-5 w-5' />
                </div>
                <div>
                  <h2 className='text-xl font-bold'>Tabela Gerada</h2>
                  <div className='flex items-center gap-2'>
                    <Badge variant='secondary' className='gap-1 text-xs'>
                      <CheckCircle2 className='h-3 w-3' />
                      {result.rowCount} linhas
                    </Badge>
                    <Badge variant='outline' className='text-xs'>
                      {result.columnCount} colunas
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className='flex gap-2'>
              <IconButtonTooltip
                content='Copiar'
                icon={FileText}
                onClick={onCopyMarkdown}
                className={{ button: 'h-8 w-8' }}
              />
              <IconButtonTooltip
                content='Download'
                icon={Download}
                onClick={onDownloadMarkdown}
                className={{ button: 'h-8 w-8' }}
              />
            </div>
          </div>

          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='preview'>
              <Eye className='mr-2 h-4 w-4' />
              Preview
            </TabsTrigger>
            <TabsTrigger value='markdown'>
              <Code2 className='mr-2 h-4 w-4' />
              Markdown
            </TabsTrigger>
            <TabsTrigger value='stats'>
              <TrendingUp className='mr-2 h-4 w-4' />
              Estatísticas
            </TabsTrigger>
          </TabsList>
        </div>

        <ExcelPreview result={result} />
        <ExcelMdMarkdown result={result} />
        {/* Tab: Estatísticas */}
        <ExcelMdAnalytics columnStats={columnStats || []} />
      </Tabs>
    </div>
  )
}
