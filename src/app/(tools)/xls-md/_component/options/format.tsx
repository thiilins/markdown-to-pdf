'use client'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { ChevronDown, Code2, FileCode, FileText, Minimize2, Table2 } from 'lucide-react'

export function ExcelOptionsFormat({
  options,
  onOptionsChange,
  openSections,
  toggleSection,
  handleFormatChange,
}: {
  options: ConversionOptions
  onOptionsChange: (options: ConversionOptions) => void
  openSections: Record<string, boolean>
  handleFormatChange: (format: XlsMDExportFormat) => void
  toggleSection: (section: string) => void
}) {
  return (
    <Collapsible open={openSections.format} onOpenChange={() => toggleSection('format')}>
      <CollapsibleTrigger className='hover:bg-muted/50 flex w-full items-center justify-between rounded-lg p-2'>
        <div className='flex items-center gap-2'>
          <FileText className='h-4 w-4' />
          <span className='text-sm font-medium'>Formato</span>
        </div>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${openSections.format ? 'rotate-180' : ''}`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className='space-y-3 pt-3'>
        <div className='space-y-2 px-2'>
          <Label className='text-xs'>Formato de Exportação</Label>
          <Select
            value={options.format || 'markdown'}
            onValueChange={(value) => handleFormatChange(value as XlsMDExportFormat)}>
            <SelectTrigger className='h-9'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='markdown'>
                <div className='flex items-center gap-2'>
                  <FileText className='h-3.5 w-3.5' />
                  Markdown
                </div>
              </SelectItem>
              <SelectItem value='html'>
                <div className='flex items-center gap-2'>
                  <Code2 className='h-3.5 w-3.5' />
                  HTML
                </div>
              </SelectItem>
              <SelectItem value='latex'>
                <div className='flex items-center gap-2'>
                  <FileCode className='h-3.5 w-3.5' />
                  LaTeX
                </div>
              </SelectItem>
              <SelectItem value='ascii'>
                <div className='flex items-center gap-2'>
                  <Table2 className='h-3.5 w-3.5' />
                  ASCII
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className='space-y-2 px-2'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Minimize2 className='text-muted-foreground h-3.5 w-3.5' />
              <Label className='text-xs'>Modo Compacto</Label>
            </div>
            <Switch
              checked={options.compact || false}
              onCheckedChange={(checked) => onOptionsChange({ ...options, compact: checked })}
            />
          </div>

          <div className='flex items-center justify-between'>
            <Label className='text-xs'>Escapar Caracteres</Label>
            <Switch
              checked={options.escapeSpecialChars || false}
              onCheckedChange={(checked) =>
                onOptionsChange({ ...options, escapeSpecialChars: checked })
              }
            />
          </div>

          <div className='flex items-center justify-between'>
            <Label className='text-xs'>Remover Vazias</Label>
            <Switch
              checked={options.removeEmptyColumns || false}
              onCheckedChange={(checked) =>
                onOptionsChange({ ...options, removeEmptyColumns: checked })
              }
            />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
