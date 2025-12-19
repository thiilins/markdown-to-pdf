'use client'

import { SelectComponent } from '@/components/custom-ui/select-component'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { TabsContent } from '@/components/ui/tabs'
import { useConfig } from '@/shared/contexts/configContext'
import { Eye, EyeOff, Monitor, Moon, Sun, TextWrap, Type } from 'lucide-react'
import { SettingsCard } from './layout'

export const EditorConfigComponent = () => {
  const { config, updateConfig } = useConfig()
  const getThemeIcon = (theme: string) => {
    switch (theme) {
      case 'light':
        return <Sun className='h-3.5 w-3.5' />
      case 'dark':
        return <Moon className='h-3.5 w-3.5' />
      case 'auto':
        return <Monitor className='h-3.5 w-3.5' />
      default:
        return <Monitor className='h-3.5 w-3.5' />
    }
  }

  const getThemeLabel = (theme: string) => {
    switch (theme) {
      case 'light':
        return 'Claro'
      case 'dark':
        return 'Escuro'
      case 'auto':
        return 'Automático'
      default:
        return 'Automático'
    }
  }

  return (
    <TabsContent value='editor' className='mt-4 space-y-4'>
      {/* Tema do Editor */}
      <SettingsCard type='editor'>
        <SelectComponent
          data={[
            { value: 'light', label: 'Claro' },
            { value: 'dark', label: 'Escuro' },
            { value: 'auto', label: 'Automático' },
          ]}
          value={config.editor.theme}
          onValueChange={(value) =>
            updateConfig({
              editor: { ...config.editor, theme: value as 'light' | 'dark' | 'auto' },
            })
          }
          className={{
            trigger: 'bg-background/80 h-9 backdrop-blur-sm',
          }}
        />

        <div className='flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-100/50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900/20'>
          {getThemeIcon(config.editor.theme)}
          <p className='text-xs text-slate-700 dark:text-slate-300'>
            Tema atual: <span className='font-semibold'>{getThemeLabel(config.editor.theme)}</span>
          </p>
        </div>
        {/* Configurações de Visualização */}
        <div className='mt-4 space-y-2'>
          <div className='flex items-center justify-between'>
            <Label className='text-muted-foreground flex items-center gap-1.5 text-xs font-medium'>
              <Type className='h-3.5 w-3.5' />
              Tamanho da Fonte
            </Label>
            <Badge className='border border-indigo-200 bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-600 dark:border-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-400'>
              {config.editor.fontSize}px
            </Badge>
          </div>
          <Slider
            value={[config.editor.fontSize]}
            onValueChange={([value]) =>
              updateConfig({
                editor: { ...config.editor, fontSize: value },
              })
            }
            min={10}
            max={20}
            step={1}
            className='w-full'
          />
        </div>
        <div className='mt-4 flex items-center justify-between space-y-2'>
          <Label htmlFor='word-wrap' className='flex cursor-pointer items-center gap-2'>
            <TextWrap className='text-muted-foreground h-4 w-4' />
            <div>
              <p className='cursor-pointer text-sm font-medium'>Quebra de Linha</p>
              <p className='text-muted-foreground text-xs'>Quebra de linha automática do código</p>
            </div>
          </Label>
          <Switch
            id='word-wrap'
            checked={config.editor.wordWrap === 'on'}
            className='cursor-pointer'
            onCheckedChange={(checked) =>
              updateConfig({
                editor: { ...config.editor, wordWrap: checked ? 'on' : 'off' },
              })
            }
          />
        </div>

        <div className='mt-4 flex items-center justify-between space-y-2'>
          <Label htmlFor='minimap' className='flex cursor-pointer items-center gap-2'>
            {config.editor.minimap ? (
              <Eye className='text-muted-foreground h-4 w-4' />
            ) : (
              <EyeOff className='text-muted-foreground h-4 w-4' />
            )}
            <div>
              <p className='cursor-pointer text-sm font-medium'>Minimap</p>
              <p className='text-muted-foreground text-xs'>Visualização em miniatura do código</p>
            </div>
          </Label>
          <Switch
            id='minimap'
            checked={config.editor.minimap}
            className='cursor-pointer'
            onCheckedChange={(checked) =>
              updateConfig({
                editor: { ...config.editor, minimap: checked },
              })
            }
          />
        </div>

        {/* Números de Linha */}
        <div className='mt-4 grid grid-cols-3 items-center justify-between space-y-2'>
          <div className='col-span-2 flex items-center gap-2'>
            <Type className='h-4 w-4 text-emerald-600 dark:text-emerald-400' />
            <div>
              <Label className='cursor-pointer text-sm font-medium'>Números de Linha</Label>
              <p className='text-muted-foreground text-xs'>Exibir numeração das linhas</p>
            </div>
          </div>
          <SelectComponent
            value={config.editor.lineNumbers}
            onValueChange={(value) =>
              updateConfig({
                editor: { ...config.editor, lineNumbers: value as any },
              })
            }
            data={[
              { value: 'on', label: 'Ativado' },
              { value: 'off', label: 'Desativado' },
              { value: 'relative', label: 'Relativo' },
              { value: 'interval', label: 'Intervalo' },
            ]}
            className={{
              trigger: 'bg-background/80 h-8 w-24 backdrop-blur-sm',
            }}
          />
        </div>
      </SettingsCard>
    </TabsContent>
  )
}
