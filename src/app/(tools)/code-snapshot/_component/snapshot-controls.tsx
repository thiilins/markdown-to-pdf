'use client'

import { SelectWithFilterComponent } from '@/components/custom-ui/select-with-filter'
import { SwitchComponentRv } from '@/components/custom-ui/switch'
import { IconButtonTooltip } from '@/components/custom-ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import {
  CODE_THEMES,
  FONT_FAMILIES,
  FOOTER_POSITIONS,
  GRADIENTS,
  LANGUAGES,
  LANGUAGE_POSITIONS,
  WINDOW_THEMES,
} from '@/shared/constants/snap-code'
import { PRESET_SIZES, useCodeSnapshot } from '@/shared/contexts/codeSnapshotContext'
import { MonitorCog, RotateCcw } from 'lucide-react'
import { useState } from 'react'

export function SnapshotControls({ compact = false }: { compact?: boolean }) {
  const { config, updateConfig, resetConfig } = useCodeSnapshot()
  const [isOpen, setIsOpen] = useState(true)
  // Componente auxiliar para Labels padronizados
  const ControlLabel = ({
    children,
    className,
  }: {
    children: React.ReactNode
    className?: string
  }) => (
    <Label
      className={cn(
        'text-muted-foreground text-[10px] font-bold tracking-wider uppercase',
        className,
      )}>
      {children}
    </Label>
  )

  return (
    <aside className='flex w-full min-w-[400px] transition-all duration-300'>
      <div className='bg-card flex h-full flex-col'>
        <div className='flex items-center justify-between border-b p-2'>
          <div className='bg-muted/30 flex-none px-4 py-3'>
            <div className='flex items-center gap-2'>
              <div className='cursor-pointer p-2 hover:border-violet-700'>
                <MonitorCog className='size-[25px] text-violet-700' />
              </div>
              <div className='space-y-0.1 flex flex-col'>
                <h2 className='text-sm font-semibold text-violet-700'>Configurações do Canva</h2>
                <p className='text-[10px] text-violet-900'>Personalize a aparência do snippet</p>
              </div>
            </div>
          </div>

          <IconButtonTooltip
            content='Resetar Configurações'
            onClick={resetConfig}
            icon={RotateCcw}
            className={{
              button:
                'bg-primary hover:bg-primary/90 h-10 w-10 text-xs text-white hover:text-white',
            }}
          />
        </div>

        <div className='flex-1 overflow-y-auto'>
          <div className={cn('space-y-4 px-2')}>
            <section className='gap-4 space-y-4 rounded-lg p-4'>
              <div className='border-primary/50 bg-primary/10 space-y-2 rounded-lg border p-2'>
                <ControlLabel>Tamanho do Canvas</ControlLabel>
                <SelectWithFilterComponent
                  id='file-selector'
                  placeholder='Selecione o tamanho do canvas...'
                  emptyMessage='Tamanho do canvas não encontrado.'
                  data={PRESET_SIZES.map((size) => ({
                    value: size.id,
                    label: size.name,
                  }))}
                  value={config.presetSize || ''}
                  onChange={(value) => updateConfig('presetSize', value)}
                  className={{
                    buttonTrigger:
                      'bg-background/50 hover:bg-background/80 border-border/60 hover:border-border h-9 w-full border-dashed transition-colors',
                    content: 'w-full',
                  }}
                />
                {config.presetSize === 'custom' ? (
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between'>
                      <ControlLabel>Largura Extra</ControlLabel>
                      <span className='text-muted-foreground font-mono text-xs'>
                        {config.widthOffset > 0 ? '+' : ''}
                        {config.widthOffset}px
                      </span>
                    </div>
                    <Slider
                      value={[config.widthOffset]}
                      min={-400}
                      max={1200}
                      step={10}
                      onValueChange={(val) => updateConfig('widthOffset', val[0])}
                    />
                  </div>
                ) : (
                  <div className='space-y-2'>
                    <ControlLabel>Alinhamento Vertical</ControlLabel>
                    <div className='bg-muted/20 flex rounded-md border p-1'>
                      {['top', 'center', 'bottom'].map((pos) => (
                        <button
                          key={pos}
                          onClick={() => updateConfig('contentVerticalAlign', pos)}
                          className={cn(
                            'flex-1 rounded-sm py-1 text-[10px] font-medium uppercase transition-colors',
                            config.contentVerticalAlign === pos
                              ? 'bg-background text-foreground shadow-sm'
                              : 'text-muted-foreground hover:bg-muted/50',
                          )}>
                          {pos}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className='border-primary/50 bg-primary/10 space-y-2 rounded-lg border p-2'>
                <div className='space-y-2'>
                  <ControlLabel>Estilo da Janela</ControlLabel>
                  <SelectWithFilterComponent
                    id='file-selector'
                    placeholder='Selecione um estilo da janela...'
                    emptyMessage='Estilo da janela não encontrado.'
                    data={WINDOW_THEMES.map((theme) => ({
                      value: theme.value,
                      label: theme.name,
                      icon: theme.icon,
                    }))}
                    value={config.windowTheme || ''}
                    onChange={(value) => updateConfig('windowTheme', value)}
                    className={{
                      buttonTrigger:
                        'bg-background/50 hover:bg-background/80 border-border/60 hover:border-border h-9 w-full border-dashed transition-colors',
                      content: 'w-full',
                    }}
                  />
                  {config.presetSize !== 'custom' && (
                    <div className='text-muted-foreground flex justify-between px-1 text-[10px]'>
                      <span>Dimensões:</span>
                      <span className='font-mono'>
                        {PRESET_SIZES.find((p) => p.id === config.presetSize)?.width}x
                        {PRESET_SIZES.find((p) => p.id === config.presetSize)?.height}
                      </span>
                    </div>
                  )}
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <ControlLabel>Padding</ControlLabel>
                      <span className='text-muted-foreground font-mono text-xs'>
                        {config.padding}px
                      </span>
                    </div>
                    <Slider
                      value={[config.padding]}
                      min={0}
                      max={128}
                      step={8}
                      onValueChange={(val) => updateConfig('padding', val[0])}
                    />
                  </div>
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between'>
                      <ControlLabel>Tamanho</ControlLabel>
                      <span className='text-muted-foreground font-mono text-xs'>
                        {config.fontSize}px
                      </span>
                    </div>
                    <Slider
                      value={[config.fontSize]}
                      min={10}
                      max={28}
                      step={1}
                      onValueChange={(val) => updateConfig('fontSize', val[0])}
                    />
                  </div>

                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <ControlLabel>Borda</ControlLabel>
                      <span className='text-muted-foreground font-mono text-[10px]'>
                        {config.borderRadius}px
                      </span>
                    </div>
                    <Slider
                      value={[config.borderRadius]}
                      min={0}
                      max={24}
                      step={2}
                      onValueChange={(val) => updateConfig('borderRadius', val[0])}
                    />
                  </div>
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <ControlLabel>Sombra</ControlLabel>
                      <span className='text-muted-foreground font-mono text-[10px]'>
                        {config.shadowIntensity}%
                      </span>
                    </div>
                    <Slider
                      value={[config.shadowIntensity]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={(val) => updateConfig('shadowIntensity', val[0])}
                    />
                  </div>
                </div>
                <div className='col-span-2 mt-4 grid grid-cols-2 items-center justify-center gap-4'>
                  <div className='border-primary/50 bg-primary/20 text-primary flex items-center justify-between rounded-lg border p-2'>
                    <Label htmlFor='ln-switch' className='cursor-pointer text-xs font-medium'>
                      Num. Linhas
                    </Label>
                    <Switch
                      id='ln-switch'
                      className='scale-75'
                      checked={config.showLineNumbers}
                      onCheckedChange={(val) => updateConfig('showLineNumbers', val)}
                    />
                  </div>
                  <div className='border-primary/50 bg-primary/20 text-primary flex items-center justify-between rounded-lg border p-2'>
                    <Label
                      htmlFor='ligatures-switch'
                      className='cursor-pointer text-xs font-medium'>
                      Ligaduras
                    </Label>
                    <Switch
                      id='ligatures-switch'
                      className='scale-75'
                      checked={config.fontLigatures}
                      onCheckedChange={(val) => updateConfig('fontLigatures', val)}
                    />
                  </div>
                </div>
              </div>
              <div className='border-primary/50 bg-primary/20 text-primary flexf flex-col items-center justify-between rounded-lg border p-2'>
                <div className='flex w-full items-center justify-between'>
                  <ControlLabel>Rodapé (Footer)</ControlLabel>
                  <Switch
                    checked={config.showFooter}
                    onCheckedChange={(val) => updateConfig('showFooter', val)}
                  />
                </div>

                {config.showFooter && (
                  <div className='my-3 w-full gap-2 p-2'>
                    <div className='grid w-full grid-cols-1 gap-2 py-2'>
                      {['linguagem', 'linhas', 'caracteres', 'texto'].map((option) => (
                        <div key={option} className='flex items-center gap-2'>
                          <SwitchComponentRv
                            id={`opt-${option}`}
                            label={option === 'texto' ? 'Texto Customizado' : option}
                            checked={config.footerOptions.includes(option)}
                            onChange={(checked) => {
                              const newOpts = checked
                                ? [...config.footerOptions, option]
                                : config.footerOptions.filter((o) => o !== option)
                              updateConfig('footerOptions', newOpts)
                            }}
                          />
                        </div>
                      ))}
                    </div>

                    <div className='my-2 space-y-1'>
                      <ControlLabel>Texto Customizado</ControlLabel>
                      <Input
                        value={config.footerCustomText}
                        onChange={(e) => updateConfig('footerCustomText', e.target.value)}
                        placeholder='Ex: @seu_usuario'
                        className='bg-background h-7 text-xs'
                      />
                    </div>

                    <div className='my-2 space-y-1'>
                      <ControlLabel>Alinhamento</ControlLabel>
                      <SelectWithFilterComponent
                        id='file-selector'
                        placeholder='Selecione a posição do rodapé...'
                        emptyMessage='Posição do rodapé não encontrada.'
                        data={FOOTER_POSITIONS.map((position) => ({
                          value: position.value,
                          label: position.name,
                          icon: position.icon,
                        }))}
                        value={config.footerPosition || ''}
                        onChange={(value) => updateConfig('footerPosition', value)}
                        className={{
                          buttonTrigger:
                            'bg-background/50 hover:bg-background/80 border-border/60 hover:border-border h-9 w-full border-dashed transition-colors',
                          content: 'w-full',
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className='border-primary/50 bg-primary/20 my-3 w-full gap-2 rounded-lg border p-2'>
                <div className='flex items-center justify-between'>
                  <ControlLabel>Mostrar Título</ControlLabel>
                  <Switch
                    checked={config.showHeaderTitle}
                    onCheckedChange={(val) => updateConfig('showHeaderTitle', val)}
                  />
                </div>

                {config.showHeaderTitle && (
                  <div className='my-3 w-full gap-2 p-2'>
                    <div className='my-1 space-y-2'>
                      <ControlLabel>Título Customizado</ControlLabel>
                      <Input
                        value={config.headerTitle}
                        onChange={(e) => updateConfig('headerTitle', e.target.value)}
                        placeholder='Nome do arquivo...'
                        className='bg-background h-7 text-xs'
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className='border-primary/50 bg-primary/20 grid gap-3 rounded-lg border p-2'>
                <div className='space-y-2'>
                  <ControlLabel>Linguagem</ControlLabel>
                  <SelectWithFilterComponent
                    id='file-selector'
                    placeholder='Selecione uma linguagem...'
                    emptyMessage='Linguagem não encontrada.'
                    data={LANGUAGES.map((lang) => ({
                      value: lang,
                      label: lang.charAt(0).toUpperCase() + lang.slice(1),
                    }))}
                    value={config.language || ''}
                    onChange={(value) => updateConfig('language', value)}
                    className={{
                      buttonTrigger:
                        'bg-background/50 hover:bg-background/80 border-border/60 hover:border-border h-9 w-full border-dashed transition-colors',
                      content: 'w-full',
                    }}
                  />
                </div>
                <div className='space-y-2'>
                  <ControlLabel> Tema</ControlLabel>
                  <SelectWithFilterComponent
                    id='file-selector'
                    placeholder='Selecione um tema...'
                    emptyMessage='Tema não encontrado.'
                    data={CODE_THEMES.map((theme) => ({
                      value: theme.value,
                      label: theme.name,
                    }))}
                    value={config.theme || ''}
                    onChange={(value) => updateConfig('theme', value)}
                    className={{
                      buttonTrigger:
                        'bg-background/50 hover:bg-background/80 border-border/60 hover:border-border h-9 w-full border-dashed transition-colors',
                      content: 'w-full',
                    }}
                  />
                </div>
                <div className='space-y-2'>
                  <ControlLabel>Fonte</ControlLabel>
                  <SelectWithFilterComponent
                    id='file-selector'
                    placeholder='Selecione uma fonte...'
                    emptyMessage='Fonte não encontrada.'
                    data={FONT_FAMILIES.map((font) => ({
                      value: font,
                      label: font,
                    }))}
                    value={config.fontFamily || ''}
                    onChange={(value) => updateConfig('fontFamily', value)}
                    className={{
                      buttonTrigger:
                        'bg-background/50 hover:bg-background/80 border-border/60 hover:border-border h-9 w-full border-dashed transition-colors',
                      content: 'w-full',
                    }}
                  />
                </div>

                <div className='space-y-2'>
                  <ControlLabel>Posição da Linguagem</ControlLabel>
                  <SelectWithFilterComponent
                    id='file-selector'
                    placeholder='Selecione a posição da linguagem...'
                    emptyMessage='Posição da linguagem não encontrada.'
                    data={LANGUAGE_POSITIONS.map((position) => ({
                      value: position.value,
                      label: position.name,
                      icon: position.icon,
                    }))}
                    value={config.languagePosition || ''}
                    onChange={(value) => updateConfig('languagePosition', value)}
                    className={{
                      buttonTrigger:
                        'bg-background/50 hover:bg-background/80 border-border/60 hover:border-border h-9 w-full border-dashed transition-colors',
                      content: 'w-full',
                    }}
                  />
                </div>
              </div>

              <div className='border-primary/50 bg-primary/20 space-y-2 rounded-lg border p-2'>
                <div className='flex items-center justify-between'>
                  <ControlLabel>Background</ControlLabel>
                  <Badge
                    variant='outline'
                    className={cn(
                      'text-muted-foreground text-[10px]',
                      config.background.startsWith('#')
                        ? 'bg-primary/30 text-primary'
                        : 'bg-violet-500/30 text-violet-500',
                    )}>
                    {config.background.startsWith('#') ? 'Sólido' : 'Gradiente'}
                  </Badge>
                </div>
                <div className='grid grid-cols-8 gap-2'>
                  {GRADIENTS.map((grad, i) => {
                    if (grad.value === 'transparent') {
                      return (
                        <div
                          onClick={() => updateConfig('background', grad.value)}
                          className={cn(
                            'h-full w-full cursor-pointer rounded-full border border-violet-900 bg-[conic-gradient(#e5e7eb_25%,transparent_25%,transparent_50%,#e5e7eb_50%,#e5e7eb_75%,transparent_75%,transparent)] bg-size-[20px_20px] ring-black',
                            config.background === grad.value
                              ? 'border-primary ring-primary ring-2 ring-offset-2'
                              : 'border-border hover:border-primary/50',
                          )}
                          title='Transparent'
                          aria-label='Transparent'
                        />
                      )
                    }
                    return (
                      <Button
                        key={i}
                        variant='ghost'
                        size='icon'
                        className={cn(
                          'relative aspect-square h-full w-full rounded-full border-2 border-black transition-all hover:scale-105 active:scale-95',
                          config.background === grad.value
                            ? 'border-primary ring-primary ring-2 ring-offset-2'
                            : 'border-border hover:border-primary/50',
                        )}
                        style={{ background: grad.value }}
                        onClick={() => updateConfig('background', grad.value)}
                        title={grad.name}
                      />
                    )
                  })}
                </div>
              </div>
            </section>
            <Separator />

            <section className='space-y-4'></section>
          </div>
        </div>
      </div>
    </aside>
  )
}
