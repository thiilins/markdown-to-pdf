'use client'

import { Label } from '@/components/ui/label'
import { AlignCenter, AlignLeft, AlignRight, Settings2 } from 'lucide-react'
import { useState } from 'react'
import { ExcelOptionsAlign } from './align'
import { ExcelOptionsFormat } from './format'
import { ExcelOptionsTransform } from './transform'
interface TableOptionsMenuProps {
  headers: string[]
  options: ConversionOptions
  onOptionsChange: (options: ConversionOptions) => void
  onTranspose?: () => void
  onSort?: (columnIndex: number, direction: 'asc' | 'desc') => void
}

export function ExcelOptionsComponent({
  headers,
  options,
  onOptionsChange,
  onTranspose,
  onSort,
}: TableOptionsMenuProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    format: true,
    align: false,
    transform: false,
  })
  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }
  const handleAlignmentChange = (columnIndex: number, alignment: XlsMDColumnAlignment) => {
    const newAlignments = [...(options.alignments || Array(headers.length).fill('left'))]
    newAlignments[columnIndex] = alignment
    onOptionsChange({ ...options, alignments: newAlignments })
  }
  const handleFormatChange = (format: XlsMDExportFormat) => {
    onOptionsChange({ ...options, format })
  }
  const getAlignmentIcon = (align: XlsMDColumnAlignment) => {
    switch (align) {
      case 'center':
        return AlignCenter
      case 'right':
        return AlignRight
      default:
        return AlignLeft
    }
  }

  const currentAlignments = options.alignments || Array(headers.length).fill('left')
  return (
    <div className='flex h-full max-w-[300px] flex-col border-l'>
      <div className='border-b p-4'>
        <div className='flex items-center gap-2'>
          <Settings2 className='text-primary h-5 w-5' />
          <Label className='text-base font-semibold'>Opções Avançadas</Label>
        </div>
      </div>
      <div className='flex-1 overflow-y-auto'>
        <div className='space-y-2 p-4'>
          {/* Formato */}
          <ExcelOptionsFormat
            options={options}
            onOptionsChange={onOptionsChange}
            openSections={openSections}
            toggleSection={toggleSection}
            handleFormatChange={handleFormatChange}
          />
          {/* Alinhamento */}
          <ExcelOptionsAlign
            enable={headers.length > 0}
            options={options}
            headers={headers}
            currentAlignments={currentAlignments}
            getAlignmentIcon={getAlignmentIcon}
            handleAlignmentChange={handleAlignmentChange}
            openSections={openSections}
            toggleSection={toggleSection}
            onOptionsChange={onOptionsChange}
          />
          {/* Transformar */}
          <ExcelOptionsTransform
            enable={headers.length > 0}
            openSections={openSections}
            toggleSection={toggleSection}
            onTranspose={onTranspose}
            headers={headers}
            onSort={onSort}
          />
        </div>
      </div>
    </div>
  )
}
