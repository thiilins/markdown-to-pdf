'use client'

import { SwitchComponent } from '@/components/custom-ui/switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { CODE_THEMES, FONT_FAMILIES, GRADIENTS, LANGUAGES } from '@/shared/constants/snap-code'
import { PRESET_SIZES, useCodeSnapshot } from '@/shared/contexts/codeSnapshotContext'
import { RotateCcw } from 'lucide-react'

export function SnapshotControls({ compact = false }: { compact?: boolean }) {
  const { config, updateConfig, resetConfig } = useCodeSnapshot()

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
    <div className='bg-card flex h-full flex-col border-l'>
      <div className='flex items-center justify-between gap-4 border-b px-2 py-2'>
        <div className='bg-muted/30 flex-none px-4 py-3'>
          <h3 className='text-sm font-semibold tracking-tight'>Configurações</h3>
          <p className='text-muted-foreground mt-0.5 text-[10px]'>
            Personalize a aparência do snippet
          </p>
        </div>
        <div className='pt-4'>
          <Button variant='outline' size='icon' className='text-xs' onClick={resetConfig}>
            <RotateCcw className='h-3.5 w-3.5' />
          </Button>
        </div>
      </div>

      <div className='flex-1 overflow-y-auto'>
        <div className={cn('space-y-6 p-4', compact ? 'pb-20' : 'pb-8')}>
          {/* SEÇÃO 1: CÓDIGO E TEMA */}
          <section className='space-y-4'>
            <div className='grid grid-cols-2 gap-3'>
              <div className='space-y-2'>
                <ControlLabel>Linguagem</ControlLabel>
                <Select
                  value={config.language}
                  onValueChange={(val) => updateConfig('language', val)}>
                  <SelectTrigger className='h-8 text-xs'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang} value={lang} className='text-xs'>
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <ControlLabel>Tema</ControlLabel>
                <Select value={config.theme} onValueChange={(val) => updateConfig('theme', val)}>
                  <SelectTrigger className='h-8 text-xs'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='max-h-[300px]'>
                    {CODE_THEMES.map((theme) => (
                      <SelectItem key={theme.value} value={theme.value} className='text-xs'>
                        {theme.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          <Separator />

          {/* SEÇÃO 2: CANVAS E BACKGROUND */}
          <section className='space-y-4'>
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <ControlLabel>Background</ControlLabel>
                <span className='text-muted-foreground text-[10px]'>
                  {config.background.startsWith('#') ? 'Sólido' : 'Gradiente'}
                </span>
              </div>
              <div className='grid grid-cols-10 gap-2'>
                {GRADIENTS.map((grad, i) => (
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
                ))}
              </div>
            </div>

            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <ControlLabel>Padding</ControlLabel>
                <span className='text-muted-foreground font-mono text-xs'>{config.padding}px</span>
              </div>
              <Slider
                value={[config.padding]}
                min={0}
                max={128}
                step={8}
                onValueChange={(val) => updateConfig('padding', val[0])}
              />
            </div>
          </section>

          <Separator />

          {/* SEÇÃO 3: TIPOGRAFIA */}
          <section className='space-y-4'>
            <div className='space-y-2'>
              <ControlLabel>Fonte</ControlLabel>
              <Select
                value={config.fontFamily}
                onValueChange={(val) => updateConfig('fontFamily', val)}>
                <SelectTrigger className='h-8 text-xs'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_FAMILIES.map((font) => (
                    <SelectItem key={font} value={font} className='text-xs'>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <ControlLabel>Tamanho</ControlLabel>
                <span className='text-muted-foreground font-mono text-xs'>{config.fontSize}px</span>
              </div>
              <Slider
                value={[config.fontSize]}
                min={10}
                max={28}
                step={1}
                onValueChange={(val) => updateConfig('fontSize', val[0])}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='bg-muted/30 flex items-center justify-between rounded-lg border p-2'>
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
              <div className='bg-muted/30 flex items-center justify-between rounded-lg border p-2'>
                <Label htmlFor='ligatures-switch' className='cursor-pointer text-xs font-medium'>
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
          </section>

          <Separator />

          {/* SEÇÃO 4: JANELA E EFEITOS */}
          <section className='space-y-4'>
            <div className='space-y-2'>
              <ControlLabel>Estilo da Janela</ControlLabel>
              <Select
                value={config.windowTheme}
                onValueChange={(val) => updateConfig('windowTheme', val)}>
                <SelectTrigger className='h-8 text-xs'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='mac'>macOS</SelectItem>
                  <SelectItem value='windows'>Windows</SelectItem>
                  <SelectItem value='linux'>Linux</SelectItem>
                  <SelectItem value='vscode'>VS Code</SelectItem>
                  <SelectItem value='none'>Nenhum</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='grid grid-cols-2 gap-4'>
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
            </div>

            {config.windowTheme !== 'none' && (
              <div className='bg-muted/30 space-y-3 rounded-lg border p-3'>
                <div className='flex items-center justify-between'>
                  <Label htmlFor='header-title-switch' className='text-xs font-medium'>
                    Mostrar Título
                  </Label>
                  <Switch
                    id='header-title-switch'
                    className='scale-75'
                    checked={config.showHeaderTitle}
                    onCheckedChange={(val) => updateConfig('showHeaderTitle', val)}
                  />
                </div>

                {config.showHeaderTitle && (
                  <Input
                    value={config.headerTitle}
                    onChange={(e) => updateConfig('headerTitle', e.target.value)}
                    placeholder='Nome do arquivo...'
                    className='bg-background h-7 text-xs'
                  />
                )}

                <div className='grid grid-cols-2 gap-2 pt-1'>
                  <div className='space-y-1'>
                    <ControlLabel>Lang Pos</ControlLabel>
                    <Select
                      value={config.languagePosition}
                      onValueChange={(val) => updateConfig('languagePosition', val)}>
                      <SelectTrigger className='bg-background h-7 text-xs'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='header'>Header</SelectItem>
                        <SelectItem value='footer'>Footer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* SEÇÃO 5: FOOTER (CONDICIONAL) */}
          {config.windowTheme !== 'none' && (
            <>
              <Separator />
              <section className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <ControlLabel>Rodapé (Footer)</ControlLabel>
                  <Switch
                    checked={config.showFooter}
                    onCheckedChange={(val) => updateConfig('showFooter', val)}
                  />
                </div>

                {config.showFooter && (
                  <div className='bg-muted/30 space-y-3 rounded-lg border p-3'>
                    <div className='space-y-2'>
                      <Label className='text-xs font-medium'>Elementos Visíveis</Label>
                      <div className='grid grid-cols-2 gap-2'>
                        {['linguagem', 'linhas', 'caracteres', 'texto'].map((option) => (
                          <div key={option} className='flex items-center gap-2'>
                            <SwitchComponent
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
                    </div>

                    <div className='space-y-1'>
                      <ControlLabel>Texto Customizado</ControlLabel>
                      <Input
                        value={config.footerCustomText}
                        onChange={(e) => updateConfig('footerCustomText', e.target.value)}
                        placeholder='Ex: @seu_usuario'
                        className='bg-background h-7 text-xs'
                      />
                    </div>

                    <div className='space-y-1'>
                      <ControlLabel>Alinhamento</ControlLabel>
                      <Select
                        value={config.footerPosition}
                        onValueChange={(val) => updateConfig('footerPosition', val)}>
                        <SelectTrigger className='bg-background h-7 text-xs'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='left'>Esquerda</SelectItem>
                          <SelectItem value='center'>Centro</SelectItem>
                          <SelectItem value='right'>Direita</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </section>
            </>
          )}

          <Separator />

          {/* SEÇÃO 6: EXPORTAÇÃO E LAYOUT */}
          <section className='space-y-4'>
            <div className='space-y-2'>
              <ControlLabel>Tamanho do Canvas</ControlLabel>
              <Select
                value={config.presetSize}
                onValueChange={(val) => updateConfig('presetSize', val)}>
                <SelectTrigger className='h-8 text-xs'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRESET_SIZES.map((preset) => (
                    <SelectItem key={preset.id} value={preset.id} className='text-xs'>
                      {preset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          </section>
        </div>
      </div>
    </div>
  )
}
