'use client'

import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Label } from '@/components/ui/label'
import { AlignCenter, AlignLeft, AlignRight, ChevronDown } from 'lucide-react'
interface Props {
  enable: boolean
  options: ConversionOptions
  headers: string[]
  currentAlignments: XlsMDColumnAlignment[]
  getAlignmentIcon: (align: XlsMDColumnAlignment) => React.ElementType
  handleAlignmentChange: (columnIndex: number, alignment: XlsMDColumnAlignment) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
  onOptionsChange: (options: ConversionOptions) => void
}
export const ExcelOptionsAlign = ({
  enable,
  openSections,
  toggleSection,
  onOptionsChange,
  options,
  headers,
  currentAlignments,
  getAlignmentIcon,
  handleAlignmentChange,
}: Props) => {
  return enable ? (
    <Collapsible open={openSections.align} onOpenChange={() => toggleSection('align')}>
      <CollapsibleTrigger className='hover:bg-muted/50 flex w-full items-center justify-between rounded-lg p-2'>
        <div className='flex items-center gap-2'>
          <AlignCenter className='h-4 w-4' />
          <span className='text-sm font-medium'>Alinhamento</span>
        </div>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${openSections.align ? 'rotate-180' : ''}`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className='space-y-2 pt-3'>
        <div className='flex items-center justify-between px-2'>
          <Label className='text-xs'>Por Coluna</Label>
          <Button
            variant='ghost'
            size='sm'
            className='h-7 text-xs'
            onClick={() =>
              onOptionsChange({
                ...options,
                alignments: Array(headers.length).fill('left'),
              })
            }>
            Resetar
          </Button>
        </div>

        <div className='space-y-1.5 px-2'>
          {headers.map((header, index) => {
            const currentAlign = currentAlignments[index]
            const AlignIcon = getAlignmentIcon(currentAlign) as React.ElementType

            return (
              <div
                key={index}
                className='bg-muted/30 flex items-center justify-between rounded-md border p-2'>
                <div className='flex items-center gap-1.5 overflow-hidden'>
                  <AlignIcon className='text-muted-foreground h-3.5 w-3.5 shrink-0' />
                  <span className='truncate text-xs font-medium'>{header}</span>
                </div>
                <div className='flex gap-0.5'>
                  <Button
                    variant={currentAlign === 'left' ? 'default' : 'ghost'}
                    size='sm'
                    className='h-7 w-7 p-0'
                    onClick={() => handleAlignmentChange(index, 'left')}>
                    <AlignLeft className='h-3.5 w-3.5' />
                  </Button>
                  <Button
                    variant={currentAlign === 'center' ? 'default' : 'ghost'}
                    size='sm'
                    className='h-7 w-7 p-0'
                    onClick={() => handleAlignmentChange(index, 'center')}>
                    <AlignCenter className='h-3.5 w-3.5' />
                  </Button>
                  <Button
                    variant={currentAlign === 'right' ? 'default' : 'ghost'}
                    size='sm'
                    className='h-7 w-7 p-0'
                    onClick={() => handleAlignmentChange(index, 'right')}>
                    <AlignRight className='h-3.5 w-3.5' />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  ) : null
}
