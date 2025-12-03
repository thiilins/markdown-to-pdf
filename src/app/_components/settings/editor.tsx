'use client'

import { SelectComponent } from '@/components/custom-ui/select-component'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { TabsContent } from '@/components/ui/tabs'
import { AppConfig } from '@/types/config'
import { Code, Eye, EyeOff, Maximize2, Monitor, Moon, Sun, Type } from 'lucide-react'

export const EditorConfigComponent = ({
  value,
  config,
  onConfigChange,
}: {
  value: string
  config: AppConfig
  onConfigChange: (config: Partial<AppConfig>) => void
}) => {
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
    <TabsContent value={value} className='mt-4 space-y-4'>
      {/* Tema do Editor */}
      <div className='border-gradient-to-br space-y-3 rounded-xl border-2 bg-linear-to-br from-slate-50 to-gray-50 p-4 dark:from-slate-950/30 dark:to-gray-950/30'>
        <div className='mb-3 flex items-center gap-2'>
          <div className='rounded-lg bg-linear-to-br from-slate-500 to-gray-600 p-2 text-white'>
            <Code className='h-4 w-4' />
          </div>
          <div>
            <h3 className='text-foreground text-sm font-semibold'>Tema do Editor</h3>
            <p className='text-muted-foreground text-xs'>Aparência do editor de código</p>
          </div>
        </div>
        <SelectComponent
          data={[
            { value: 'light', label: 'Claro' },
            { value: 'dark', label: 'Escuro' },
            { value: 'auto', label: 'Automático' },
          ]}
          value={config.editor.theme}
          onValueChange={(value) =>
            onConfigChange({
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
      </div>

      {/* Configurações de Visualização */}
      <div className='border-gradient-to-br space-y-4 rounded-xl border-2 bg-linear-to-br from-indigo-50 to-blue-50 p-4 dark:from-indigo-950/30 dark:to-blue-950/30'>
        <div className='mb-2 flex items-center gap-2'>
          <div className='rounded-lg bg-linear-to-br from-indigo-500 to-blue-600 p-2 text-white'>
            <Maximize2 className='h-4 w-4' />
          </div>
          <div>
            <h3 className='text-foreground text-sm font-semibold'>Visualização</h3>
            <p className='text-muted-foreground text-xs'>Ajuste a aparência do editor</p>
          </div>
        </div>

        <div className='space-y-4'>
          {/* Tamanho da Fonte */}
          <div className='space-y-2'>
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
                onConfigChange({
                  editor: { ...config.editor, fontSize: value },
                })
              }
              min={10}
              max={20}
              step={1}
              className='w-full'
            />
          </div>

          {/* Quebra de Linha */}

          <SelectComponent
            label='Quebra de Linha'
            value={config.editor.wordWrap}
            onValueChange={(value) =>
              onConfigChange({
                editor: { ...config.editor, wordWrap: value as any },
              })
            }
            data={[
              { value: 'on', label: 'Ativado' },
              { value: 'off', label: 'Desativado' },
            ]}
            className={{
              trigger: 'bg-background/80 h-9 backdrop-blur-sm',
            }}
          />
        </div>
      </div>

      {/* Opções Avançadas */}
      <div className='border-gradient-to-br space-y-4 rounded-xl border-2 bg-linear-to-br from-emerald-50 to-teal-50 p-4 dark:from-emerald-950/30 dark:to-teal-950/30'>
        <div className='mb-2 flex items-center gap-2'>
          <div className='rounded-lg bg-linear-to-br from-emerald-500 to-teal-600 p-2 text-white'>
            <Eye className='h-4 w-4' />
          </div>
          <div>
            <h3 className='text-foreground text-sm font-semibold'>Opções Avançadas</h3>
            <p className='text-muted-foreground text-xs'>Recursos adicionais do editor</p>
          </div>
        </div>

        <div className='space-y-3'>
          {/* Minimap */}
          <div className='flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50/50 p-3 dark:border-emerald-800 dark:bg-emerald-900/20'>
            <div className='flex items-center gap-2'>
              {config.editor.minimap ? (
                <Eye className='h-4 w-4 text-emerald-600 dark:text-emerald-400' />
              ) : (
                <EyeOff className='text-muted-foreground h-4 w-4' />
              )}
              <div>
                <Label className='cursor-pointer text-sm font-medium'>Minimap</Label>
                <p className='text-muted-foreground text-xs'>Visualização em miniatura do código</p>
              </div>
            </div>
            <Switch
              checked={config.editor.minimap}
              onCheckedChange={(checked) =>
                onConfigChange({
                  editor: { ...config.editor, minimap: checked },
                })
              }
            />
          </div>

          {/* Números de Linha */}
          <div className='flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50/50 p-3 dark:border-emerald-800 dark:bg-emerald-900/20'>
            <div className='flex items-center gap-2'>
              <Type className='h-4 w-4 text-emerald-600 dark:text-emerald-400' />
              <div>
                <Label className='cursor-pointer text-sm font-medium'>Números de Linha</Label>
                <p className='text-muted-foreground text-xs'>Exibir numeração das linhas</p>
              </div>
            </div>
            <SelectComponent
              value={config.editor.lineNumbers}
              onValueChange={(value) =>
                onConfigChange({
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
        </div>
      </div>
    </TabsContent>
  )
}
