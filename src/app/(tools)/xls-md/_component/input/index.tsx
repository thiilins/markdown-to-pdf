'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, FileJson, FileSpreadsheet, FileText } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { EXAMPLE_CSV, EXAMPLE_JSON } from '../constants'
import { excelToMarkdown } from '../excel-utils'
import { ExcelMdCsvInput } from './csv'
import { ExcelMdJsonInput } from './json'
import { ExcelMdUploadInput } from './upload'

interface ExcelInputProps {
  value: string
  onChange: (value: string) => void
  mode: 'csv' | 'json' | 'upload'
  onModeChange: (mode: 'csv' | 'json' | 'upload') => void
  onFileUpload: (result: any) => void
}

export function ExcelInput({ value, onChange, mode, onModeChange, onFileUpload }: ExcelInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const processFile = async (file: File) => {
    const validExtensions = ['.xlsx', '.xls', '.csv']
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()

    if (!validExtensions.includes(fileExtension)) {
      toast.error('Formato inválido. Use .xlsx, .xls ou .csv')
      return
    }

    try {
      const result = await excelToMarkdown(file)
      onFileUpload(result)
      toast.success(`Arquivo processado: ${result.rowCount} linhas, ${result.columnCount} colunas`)
    } catch (error: any) {
      toast.error(error.message || 'Erro ao processar arquivo')
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    await processFile(file)
    // Limpa o input para permitir upload do mesmo arquivo novamente
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Só ativa se tiver arquivos sendo arrastados
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Só desativa se realmente saiu do componente (não de um filho)
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY

    if (x <= rect.left || x >= rect.right || y <= rect.top || y >= rect.bottom) {
      setIsDragging(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)

    if (files.length === 0) {
      toast.error('Nenhum arquivo detectado')
      return
    }

    if (files.length > 1) {
      toast.error('Por favor, envie apenas um arquivo por vez')
      return
    }

    await processFile(files[0])
  }

  const examples = [
    {
      id: 'csv',
      label: 'Exemplo CSV',
      description: 'Tabela simples com 5 colunas',
      icon: FileText,
      data: EXAMPLE_CSV,
    },
    {
      id: 'json',
      label: 'Exemplo JSON',
      description: 'Array de objetos com 5 propriedades',
      icon: FileJson,
      data: EXAMPLE_JSON,
    },
  ]

  return (
    <div className='flex h-full flex-col'>
      {/* Informação no topo */}
      <div className='border-b border-blue-500/20 bg-blue-500/10 p-4'>
        <div className='flex gap-3'>
          <AlertCircle className='h-5 w-5 shrink-0 text-blue-500' />
          <div className='space-y-1'>
            <p className='text-sm font-medium'>Suporte a múltiplos formatos</p>
            <p className='text-muted-foreground text-xs leading-relaxed'>
              Cole CSV/JSON ou faça upload de arquivos Excel (.xlsx, .xls) e CSV.
            </p>
          </div>
        </div>
      </div>

      <Tabs
        value={mode}
        onValueChange={(v) => onModeChange(v as 'csv' | 'json' | 'upload')}
        className='flex flex-1 flex-col overflow-hidden'>
        <div className='border-b p-4'>
          <Label className='mb-3 block text-base font-semibold'>Entrada de Dados</Label>

          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='csv'>
              <FileText className='mr-2 h-4 w-4' />
              CSV
            </TabsTrigger>
            <TabsTrigger value='json'>
              <FileJson className='mr-2 h-4 w-4' />
              JSON
            </TabsTrigger>
            <TabsTrigger value='upload'>
              <FileSpreadsheet className='mr-2 h-4 w-4' />
              Upload
            </TabsTrigger>
          </TabsList>
        </div>
        <ExcelMdCsvInput value={value} onChange={onChange} />
        <ExcelMdJsonInput value={value} onChange={onChange} />
        <ExcelMdUploadInput
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          handleDrop={handleDrop}
          isDragging={isDragging}
          fileInputRef={fileInputRef}
          handleFileUpload={handleFileUpload}
        />
      </Tabs>

      {/* Exemplos */}
      <div className='border-t p-4'>
        <Label className='mb-2 block text-sm font-medium'>Exemplos Rápidos</Label>
        <ScrollArea className='h-24'>
          <div className='flex gap-2'>
            {examples.map((example) => {
              const Icon = example.icon
              return (
                <Button
                  key={example.id}
                  variant='outline'
                  size='sm'
                  className='h-auto shrink-0 flex-col items-start gap-1 p-3 text-left'
                  onClick={() => {
                    onChange(example.data)
                    onModeChange(example.id as 'csv' | 'json')
                  }}>
                  <div className='flex items-center gap-2'>
                    <Icon className='text-primary h-4 w-4' />
                    <span className='text-xs font-semibold'>{example.label}</span>
                  </div>
                  <span className='text-muted-foreground text-[10px]'>{example.description}</span>
                </Button>
              )
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
