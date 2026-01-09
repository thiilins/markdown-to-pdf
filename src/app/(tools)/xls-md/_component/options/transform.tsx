import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ArrowDownUp, ChevronDown, FlipHorizontal } from 'lucide-react'
interface Props {
  enable: boolean
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void | undefined
  onTranspose?: () => void
  onSort?: (columnIndex: number, direction: 'asc' | 'desc') => void
  headers: string[]
}
export const ExcelOptionsTransform = ({
  enable,
  openSections,
  toggleSection,
  onTranspose,
  headers,
  onSort,
}: Props) => {
  return enable ? (
    <Collapsible open={openSections.transform} onOpenChange={() => toggleSection('transform')}>
      <CollapsibleTrigger className='hover:bg-muted/50 flex w-full items-center justify-between rounded-lg p-2'>
        <div className='flex items-center gap-2'>
          <FlipHorizontal className='h-4 w-4' />
          <span className='text-sm font-medium'>Transformar</span>
        </div>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${openSections.transform ? 'rotate-180' : ''}`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className='space-y-2 pt-3'>
        <div className='space-y-2 px-2'>
          <Button
            variant='outline'
            size='sm'
            className='w-full justify-start gap-2'
            onClick={onTranspose}>
            <FlipHorizontal className='h-3.5 w-3.5' />
            Transpor Tabela
          </Button>

          <Separator />

          <Label className='text-xs'>Ordenar</Label>
          {headers.map((header, index) => (
            <div key={index} className='flex items-center gap-1.5'>
              <span className='text-muted-foreground flex-1 truncate text-xs'>{header}</span>
              <Button
                variant='ghost'
                size='sm'
                className='h-7 gap-1 px-2 text-xs'
                onClick={() => onSort?.(index, 'asc')}>
                <ArrowDownUp className='h-3 w-3' />
                Asc
              </Button>
              <Button
                variant='ghost'
                size='sm'
                className='h-7 gap-1 px-2 text-xs'
                onClick={() => onSort?.(index, 'desc')}>
                <ArrowDownUp className='h-3 w-3 rotate-180' />
                Desc
              </Button>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  ) : null
}
