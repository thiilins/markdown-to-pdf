'use client'

import { ToolShell } from '@/app/(tools)/_components/tool-shell'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Settings2, Table } from 'lucide-react'
import { ExcelInput } from '../input'
import { ExcelOptionsComponent } from '../options'
import { ExcelOutput } from '../output'

interface ExcelMdDesktopProps {
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
  handleClear: () => void
  handleReset: () => void
}
export const ExcelMdDesktop = ({
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
  handleClear,
  handleReset,
  handleOptionsChange,
  handleTranspose,
  handleSort,
}: ExcelMdDesktopProps) => {
  const optionsMenu = (
    <ExcelOptionsComponent
      headers={result?.headers || []}
      options={options}
      onOptionsChange={handleOptionsChange}
      onTranspose={handleTranspose}
      onSort={handleSort}
    />
  )
  return (
    <ToolShell
      title='Excel/CSV to Markdown'
      description='Converta planilhas em tabelas Markdown com opções avançadas'
      icon={Table}
      layout='resizable'
      orientation='horizontal'
      defaultPanelSizes={[50, 50]}
      inputLabel='Dados de Entrada'
      outputLabel='Tabela Markdown'
      inputComponent={
        <ExcelInput
          value={input}
          onChange={setInput}
          mode={mode}
          onModeChange={handleModeChange}
          onFileUpload={handleFileUpload}
        />
      }
      outputComponent={
        <ExcelOutput
          result={result}
          columnStats={columnStats}
          isProcessing={isProcessing}
          onDownloadMarkdown={handleDownloadMarkdown}
          onCopyMarkdown={handleCopy}
        />
      }
      sidebarSlot={optionsMenu}
      headerSlot={
        <div className='flex items-center gap-2 lg:hidden'>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant='outline' size='sm' className='gap-2'>
                <Settings2 className='h-4 w-4' />
                Opções
              </Button>
            </SheetTrigger>
            <SheetContent side='right' className='w-full p-0 sm:max-w-md'>
              <SheetHeader className='border-b p-4'>
                <SheetTitle className='flex items-center gap-2'>
                  <Settings2 className='h-5 w-5' />
                  Opções Avançadas
                </SheetTitle>
              </SheetHeader>
              {optionsMenu}
            </SheetContent>
          </Sheet>
        </div>
      }
      showCopyButton={true}
      showClearButton={true}
      showResetButton={true}
      onCopyOutput={handleCopy}
      onClear={handleClear}
      onReset={handleReset}
      stats={
        result
          ? [
              {
                label: 'Linhas',
                value: result.rowCount,
                variant: 'default',
              },
              {
                label: 'Colunas',
                value: result.columnCount,
                variant: 'secondary',
              },
              {
                label: 'Formato',
                value: options.format?.toUpperCase() || 'MD',
                variant: 'outline',
              },
            ]
          : []
      }
      mobileTabs={true}
      mobileDefaultTab='input'
    />
  )
}
