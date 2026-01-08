'use client'

import { SelectWithFilterComponent } from '@/components/custom-ui/select-with-filter'
import { SwitchComponentRv } from '@/components/custom-ui/switch'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  PRESET_SIZES,
  WINDOW_THEMES,
} from '@/shared/constants/snap-code'
import { useCodeSnapshot } from '@/shared/contexts/codeSnapshotContext'
import {
  AlignCenter,
  Check,
  FileText,
  Hash,
  Layout,
  Maximize,
  MousePointer2,
  Palette,
  Settings2,
  Sparkles,
  Type,
  Wallpaper,
} from 'lucide-react'
import { WidgetWrapper } from '.'

// --- Componente de Container Refinado (UX Improved) ---

// --- 1. Tamanho do Canvas ---
export const CanvasSizeControl = () => {
  const { config, updateConfig } = useCodeSnapshot()
  return (
    <WidgetWrapper
      title='Dimensões'
      subtitle='Área de Trabalho'
      icon={Maximize}
      colorClass='primary'>
      <div className='space-y-4'>
        <div className='space-y-2'>
          <Label className='text-[11px] font-bold text-slate-500 uppercase'>
            Formato do Canvas
          </Label>
          <SelectWithFilterComponent
            placeholder='Selecione o tamanho...'
            data={PRESET_SIZES.map((size) => ({ value: size.id, label: size.name }))}
            value={config.presetSize || ''}
            onChange={(value) => updateConfig('presetSize', value)}
            className={{ buttonTrigger: 'h-10 border-slate-200 bg-slate-50/50 font-medium' }}
          />
        </div>

        {config.presetSize === 'custom' ? (
          <div className='animate-in fade-in slide-in-from-top-2 space-y-3'>
            <div className='flex items-center justify-between'>
              <Label className='text-[11px] font-bold text-slate-500 uppercase'>
                Largura Extra
              </Label>
              <span className='rounded bg-blue-50 px-2 py-0.5 font-mono text-[11px] font-bold text-blue-600'>
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
          <div className='space-y-3'>
            <Label className='block text-center text-[11px] font-bold text-slate-500 uppercase'>
              Alinhamento Vertical
            </Label>
            <div className='grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1'>
              {['top', 'center', 'bottom'].map((pos) => (
                <button
                  key={pos}
                  onClick={() => updateConfig('contentVerticalAlign', pos)}
                  className={cn(
                    'rounded-lg py-2 text-[10px] font-bold uppercase transition-all',
                    config.contentVerticalAlign === pos
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:bg-white/50',
                  )}>
                  {pos}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </WidgetWrapper>
  )
}

// --- 2. Estilo da Janela ---
export const CanvasStyleControl = () => {
  const { config, updateConfig } = useCodeSnapshot()
  const currentSize = PRESET_SIZES.find((p) => p.id === config.presetSize)

  return (
    <WidgetWrapper
      title='Estilo da Janela'
      subtitle='Frame e Tipografia'
      icon={Palette}
      colorClass='emerald'>
      <div className='space-y-6'>
        <div className='space-y-2'>
          <Label className='text-[11px] font-bold text-slate-500 uppercase'>
            Estilo da Moldura
          </Label>
          <SelectWithFilterComponent
            data={WINDOW_THEMES.map((theme) => ({
              value: theme.value,
              label: theme.name,
              icon: theme.icon,
            }))}
            value={config.windowTheme || ''}
            onChange={(value) => updateConfig('windowTheme', value)}
            className={{ buttonTrigger: 'h-10 border-slate-200 bg-slate-50/50' }}
          />
          {config.presetSize !== 'custom' && (
            <div className='flex justify-end px-1 pt-1'>
              <span className='rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600/70 italic'>
                {currentSize?.width} × {currentSize?.height}
              </span>
            </div>
          )}
        </div>

        <div className='grid grid-cols-2 gap-x-6 gap-y-5'>
          {[
            { label: 'Padding', val: config.padding, key: 'padding', min: 0, max: 128, step: 8 },
            { label: 'Fonte', val: config.fontSize, key: 'fontSize', min: 10, max: 28, step: 1 },
            {
              label: 'Borda',
              val: config.borderRadius,
              key: 'borderRadius',
              min: 0,
              max: 24,
              step: 2,
            },
            {
              label: 'Sombra',
              val: config.shadowIntensity,
              key: 'shadowIntensity',
              min: 0,
              max: 100,
              step: 5,
            },
          ].map((s) => (
            <div key={s.key} className='space-y-2.5'>
              <div className='flex items-end justify-between'>
                <Label className='text-[10px] leading-none font-bold text-slate-400 uppercase'>
                  {s.label}
                </Label>
                <span className='text-[10px] leading-none font-bold text-emerald-600'>
                  {s.val}
                  {s.key === 'shadowIntensity' ? '%' : 'px'}
                </span>
              </div>
              <Slider
                value={[s.val]}
                min={s.min}
                max={s.max}
                step={s.step}
                onValueChange={(v) => updateConfig(s.key as any, v[0])}
              />
            </div>
          ))}
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div className='flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/30 p-3 transition-colors hover:bg-slate-50'>
            <Label
              htmlFor='ln-switch'
              className='cursor-pointer text-[11px] font-bold text-slate-600'>
              Nº Linhas
            </Label>
            <Switch
              id='ln-switch'
              checked={config.showLineNumbers}
              onCheckedChange={(v) => updateConfig('showLineNumbers', v)}
              className='scale-75'
            />
          </div>
          <div className='flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/30 p-3 transition-colors hover:bg-slate-50'>
            <Label
              htmlFor='lg-switch'
              className='cursor-pointer text-[11px] font-bold text-slate-600'>
              Ligaduras
            </Label>
            <Switch
              id='lg-switch'
              checked={config.fontLigatures}
              onCheckedChange={(v) => updateConfig('fontLigatures', v)}
              className='scale-75'
            />
          </div>
        </div>
      </div>
    </WidgetWrapper>
  )
}

export const CanvasFooterControl = () => {
  const { config, updateConfig } = useCodeSnapshot()
  return (
    <WidgetWrapper
      title='Rodapé'
      subtitle='Informações e Branding'
      icon={Layout}
      colorClass='purple'>
      <div className='flex items-center justify-between rounded-xl border border-purple-100 bg-purple-50/30 p-4'>
        <div className='space-y-0.5'>
          <Label className='text-sm leading-none font-bold text-purple-900'>Exibir Footer</Label>
          <p className='text-[10px] font-medium text-purple-500'>Metadados na base do código</p>
        </div>
        <Switch
          checked={config.showFooter}
          onCheckedChange={(val) => updateConfig('showFooter', val)}
        />
      </div>

      {config.showFooter && (
        <div className='animate-in fade-in zoom-in-95 space-y-6 pt-2 duration-200'>
          <div className='grid grid-cols-2 gap-3'>
            {['linguagem', 'linhas', 'caracteres', 'texto'].map((option) => (
              <div key={option} className='flex items-center gap-2'>
                <SwitchComponentRv
                  id={`opt-${option}`}
                  label={option === 'texto' ? 'Custom Text' : option}
                  checked={config.footerOptions.includes(option)}
                  onChange={(checked) => {
                    const newOpts = checked
                      ? [...config.footerOptions, option]
                      : config.footerOptions.filter((o: string) => o !== option)
                    updateConfig('footerOptions', newOpts)
                  }}
                />
              </div>
            ))}
          </div>

          <div className='space-y-2'>
            <Label className='text-[11px] font-bold text-slate-500 uppercase'>
              Conteúdo do Texto
            </Label>
            <Input
              value={config.footerCustomText}
              onChange={(e) => updateConfig('footerCustomText', e.target.value)}
              placeholder='Ex: @seu_usuario'
              className='h-9 border-slate-200 bg-slate-50/50 text-xs transition-all focus-visible:ring-purple-400'
            />
          </div>

          <div className='space-y-2'>
            <Label className='text-[11px] font-bold text-slate-500 uppercase'>Alinhamento</Label>
            <SelectWithFilterComponent
              data={FOOTER_POSITIONS.map((p) => ({ value: p.value, label: p.name, icon: p.icon }))}
              value={config.footerPosition || ''}
              onChange={(value) => updateConfig('footerPosition', value)}
              className={{ buttonTrigger: 'h-10 border-slate-200 bg-slate-50/50' }}
            />
          </div>
        </div>
      )}
    </WidgetWrapper>
  )
}

export const CanvasHeaderControl = () => {
  const { config, updateConfig } = useCodeSnapshot()
  return (
    <WidgetWrapper
      title='Cabeçalho'
      subtitle='Identificação'
      icon={MousePointer2}
      colorClass='amber'>
      <div className='flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50/30 p-4'>
        <Label className='text-sm leading-none font-bold text-amber-900'>Título do Arquivo</Label>
        <Switch
          checked={config.showHeaderTitle}
          onCheckedChange={(val) => updateConfig('showHeaderTitle', val)}
        />
      </div>

      {config.showHeaderTitle && (
        <div className='animate-in slide-in-from-left-2 space-y-2 pt-2 duration-200'>
          <Label className='text-[11px] font-bold text-slate-500 uppercase'>Nome do Arquivo</Label>
          <div className='relative'>
            <FileText className='absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400' />
            <Input
              value={config.headerTitle}
              onChange={(e) => updateConfig('headerTitle', e.target.value)}
              placeholder='Ex: main.tsx'
              className='h-9 border-slate-200 bg-slate-50/50 pl-9 text-xs font-medium focus-visible:ring-amber-400'
            />
          </div>
        </div>
      )}
    </WidgetWrapper>
  )
}

export const CanvasConfigControl = () => {
  const { config, updateConfig } = useCodeSnapshot()

  const selects = [
    {
      label: 'Linguagem',
      key: 'language',
      icon: Hash,
      data: LANGUAGES.map((l) => ({ value: l, label: l.charAt(0).toUpperCase() + l.slice(1) })),
    },
    {
      label: 'Tema de Sintaxe',
      key: 'theme',
      icon: Sparkles,
      data: CODE_THEMES.map((t) => ({ value: t.value, label: t.name })),
    },
    {
      label: 'Fonte',
      key: 'fontFamily',
      icon: Type,
      data: FONT_FAMILIES.map((f) => ({ value: f, label: f })),
    },
    {
      label: 'Posição da Tag',
      key: 'languagePosition',
      icon: AlignCenter,
      data: LANGUAGE_POSITIONS.map((p) => ({ value: p.value, label: p.name, icon: p.icon })),
    },
  ]

  return (
    <WidgetWrapper
      title='Configurações'
      subtitle='Lógica do Editor'
      icon={Settings2}
      colorClass='rose'>
      <div className='space-y-4'>
        {selects.map((sel) => (
          <div key={sel.key} className='space-y-2'>
            <Label className='flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase'>
              <sel.icon className='h-3 w-3 opacity-60' /> {sel.label}
            </Label>
            <SelectWithFilterComponent
              data={sel.data}
              value={(config[sel.key as keyof typeof config] as string) || ''}
              onChange={(value) => updateConfig(sel.key as any, value)}
              className={{
                buttonTrigger: 'h-10 border-slate-200 bg-slate-50/50 text-xs font-semibold',
              }}
            />
          </div>
        ))}
      </div>
    </WidgetWrapper>
  )
}

export const CanvasBackgroundControl = () => {
  const { config, updateConfig } = useCodeSnapshot()
  return (
    <WidgetWrapper
      title='Background'
      subtitle='Estilo do Fundo'
      icon={Wallpaper}
      colorClass='primary'>
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <Label className='text-[11px] font-bold text-slate-500 uppercase'>Coleção de Cores</Label>
          <Badge
            className={cn(
              'border-none px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase',
              config.background.startsWith('#')
                ? 'bg-blue-100 text-blue-700'
                : 'bg-purple-100 text-purple-700 shadow-sm',
            )}>
            {config.background.startsWith('#') ? 'Sólido' : 'Premium Gradient'}
          </Badge>
        </div>

        <div className='grid grid-cols-6 gap-3'>
          {GRADIENTS.map((grad, i) => {
            const isSelected = config.background === grad.value
            return (
              <button
                key={i}
                onClick={() => updateConfig('background', grad.value)}
                title={grad.name}
                className={cn(
                  'relative aspect-square w-full cursor-pointer rounded-full transition-all hover:scale-110 active:scale-90',
                  isSelected
                    ? 'z-10 scale-110 shadow-md ring-2 ring-blue-500 ring-offset-2'
                    : 'ring-1 ring-slate-200',
                )}
                style={{
                  background:
                    grad.value === 'transparent'
                      ? 'conic-gradient(#f1f5f9 25%, white 0 50%, #f1f5f9 0 75%, white 0)'
                      : grad.value,
                  backgroundSize: grad.value === 'transparent' ? '6px 6px' : 'cover',
                }}>
                {isSelected && (
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <Check className='h-3 w-3 text-white drop-shadow-sm' />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </WidgetWrapper>
  )
}
