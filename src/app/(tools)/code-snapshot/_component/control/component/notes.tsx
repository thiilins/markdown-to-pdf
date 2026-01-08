'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useCodeSnapshot } from '@/shared/contexts/codeSnapshotContext'
import { StickyNote, Trash2 } from 'lucide-react'
import { WidgetWrapper } from '.'

export function NotesControl() {
  const { config, updateConfig } = useCodeSnapshot()

  return (
    <WidgetWrapper title='Anotações' subtitle='Interatividade' icon={StickyNote} colorClass='amber'>
      <div className='space-y-4'>
        <div className='flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50/30 p-4'>
          <div className='space-y-0.5'>
            <Label className='text-sm leading-none font-bold text-amber-900'>Modo Edição</Label>
            <p className='text-[10px] font-medium text-amber-600'>Clique no código para anotar</p>
          </div>
          <Switch
            checked={config.annotationMode || false}
            onCheckedChange={(checked) => updateConfig('annotationMode', checked)}
          />
        </div>

        {config.annotations && config.annotations.length > 0 && (
          <div className='animate-in fade-in slide-in-from-bottom-2 space-y-3 pt-2'>
            <div className='flex items-center justify-between px-1'>
              <div className='flex items-center gap-2'>
                <div className='h-2 w-2 animate-pulse rounded-full bg-amber-500' />
                <span className='text-[11px] font-bold text-slate-600 uppercase'>
                  {config.annotations.length} Anotações ativas
                </span>
              </div>
            </div>

            <Button
              variant='outline'
              size='sm'
              onClick={() => updateConfig('annotations', [])}
              className='h-9 w-full border-amber-200 bg-amber-50/50 text-xs font-bold text-amber-700 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600'>
              <Trash2 className='mr-2 h-3.5 w-3.5' />
              Remover Todas
            </Button>
          </div>
        )}
      </div>
    </WidgetWrapper>
  )
}
