'use client'

import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useCodeSnapshot } from '@/shared/contexts/codeSnapshotContext'
import { GitCompare, Info } from 'lucide-react'
import { WidgetWrapper } from '.'

export function DiffControl() {
  const { config, updateConfig } = useCodeSnapshot()

  return (
    <WidgetWrapper
      title='Modo Diff'
      subtitle='Controle de Versão'
      icon={GitCompare}
      colorClass='cyan'>
      <div className='space-y-4'>
        <div className='flex items-center justify-between rounded-xl border border-cyan-100 bg-cyan-50/30 p-4'>
          <div className='space-y-0.5'>
            <Label className='text-sm leading-none font-bold text-cyan-900'>
              Ativar Diff (Git)
            </Label>
            <p className='text-[10px] font-medium text-cyan-600/80'>Coloração baseada em + e -</p>
          </div>
          <Switch
            checked={config.diffMode || false}
            onCheckedChange={(checked) => updateConfig('diffMode', checked)}
          />
        </div>

        {config.diffMode && (
          <div className='animate-in fade-in zoom-in-95 space-y-3 duration-200'>
            <div className='flex gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5'>
              <Info className='mt-0.5 h-4 w-4 shrink-0 text-slate-400' />
              <div className='space-y-2'>
                <span className='text-[10px] font-bold text-slate-500 uppercase'>
                  Exemplo de Diff
                </span>
                <pre className='rounded-md border border-slate-100/50 bg-white/50 p-2 font-mono text-[10px] leading-relaxed text-slate-600'>
                  <span className='text-red-500'>- linha removida</span>
                  {'\n'}
                  <span className='text-emerald-500'>+ linha adicionada</span>
                  {'\n'}
                  <span className='text-slate-400'> sem alteração</span>
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </WidgetWrapper>
  )
}
