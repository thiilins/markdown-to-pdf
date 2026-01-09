import { Button } from '@/components/ui/button'
import { Table } from 'lucide-react'
import { useState } from 'react'
import { ExcelInput } from '../input'
import { ExcelOptionsComponent } from '../options'
import { ExcelOutput } from '../output'
interface ExcelMdMobileProps {
  input: string
  setInput: (input: string) => void
  mode: 'csv' | 'json' | 'upload'
  handleModeChange: (mode: 'csv' | 'json' | 'upload') => void
  handleFileUpload: (result: any) => void
  result: ConversionResult | null
  columnStats: ColumnStats[]
  isProcessing: boolean
  handleDownloadMarkdown: () => void
  handleCopy: () => void
  options: ConversionOptions
  handleOptionsChange: (options: ConversionOptions) => void
  handleTranspose: () => void
  handleSort: (columnIndex: number, direction: 'asc' | 'desc') => void
}
export const ExcelMdMobile = ({
  input,
  setInput,
  mode,
  handleModeChange,
  handleFileUpload,
  result,
  columnStats,
  isProcessing,
  handleDownloadMarkdown,
  handleCopy,
  options,
  handleOptionsChange,
  handleTranspose,
  handleSort,
}: ExcelMdMobileProps) => {
  const [mobileTab, setMobileTab] = useState<'input' | 'output' | 'options'>('input')

  return (
    <div className='bg-background flex h-[calc(100vh-4rem)] flex-col'>
      {/* Header */}
      <div className='border-b px-4 py-3'>
        <div className='flex items-center gap-2'>
          <div className='bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg'>
            <Table className='h-4 w-4' />
          </div>
          <div>
            <h1 className='text-base font-bold'>Excel/CSV to Markdown</h1>
            <p className='text-muted-foreground text-xs'>Tabelas com opções avançadas</p>
          </div>
        </div>
      </div>

      {/* Tabs Mobile */}
      <div className='bg-muted/30 flex shrink-0 items-center border-b'>
        <Button
          variant={mobileTab === 'input' ? 'secondary' : 'ghost'}
          size='sm'
          className='flex-1 rounded-none'
          onClick={() => setMobileTab('input')}>
          Entrada
        </Button>
        <Button
          variant={mobileTab === 'output' ? 'secondary' : 'ghost'}
          size='sm'
          className='flex-1 rounded-none'
          onClick={() => setMobileTab('output')}>
          Saída
        </Button>
        <Button
          variant={mobileTab === 'options' ? 'secondary' : 'ghost'}
          size='sm'
          className='flex-1 rounded-none'
          onClick={() => setMobileTab('options')}>
          Opções
        </Button>
      </div>

      {/* Content */}
      <div className='flex-1 overflow-hidden'>
        {mobileTab === 'input' && (
          <ExcelInput
            value={input}
            onChange={setInput}
            mode={mode}
            onModeChange={handleModeChange}
            onFileUpload={handleFileUpload}
          />
        )}
        {mobileTab === 'output' && (
          <ExcelOutput
            result={result}
            columnStats={columnStats}
            isProcessing={isProcessing}
            onDownloadMarkdown={handleDownloadMarkdown}
            onCopyMarkdown={handleCopy}
          />
        )}
        {mobileTab === 'options' && (
          <ExcelOptionsComponent
            headers={result?.headers || []}
            options={options}
            onOptionsChange={handleOptionsChange}
            onTranspose={handleTranspose}
            onSort={handleSort}
          />
        )}
      </div>
    </div>
  )
}
