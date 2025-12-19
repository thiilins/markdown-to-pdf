'use client'

import { TabsContent } from '@/components/ui/tabs'
import { useConfig } from '@/shared/contexts/configContext'
import { Code, Heading1, Heading2, Minus, Quote, Type } from 'lucide-react'
import { FontSelectComponent, FontSizeSliderComponent } from '../custom-ui/custom-inputs'
import { SettingsCard } from './layout'

export const TypographyConfigComponent = () => {
  const { config, updateConfig } = useConfig()
  const fontColors = {
    headings:
      'bg-violet-500/10 text-violet-600 border-violet-200 dark:bg-violet-500/20 dark:text-violet-400 dark:border-violet-800',
    body: 'bg-blue-500/10 text-blue-600 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-800',
    code: 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-800',
    quote:
      'bg-amber-500/10 text-amber-600 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-800',
  }

  return (
    <TabsContent value='typography' className='mt-4 h-full space-y-4'>
      <SettingsCard type='typography' className={{ content: 'space-y-4' }}>
        <FontSelectComponent
          badge={{
            label: config.typography.headings.split(' ')[0],
            className: `${fontColors.headings} border px-2 py-0.5 text-xs font-medium`,
          }}
          value={config.typography.headings}
          label='Títulos'
          key='headings'
          icon={Heading1}
          onChange={(value) =>
            updateConfig({
              typography: { ...config.typography, headings: value },
            })
          }
        />

        <FontSelectComponent
          badge={{
            label: config.typography.body.split(' ')[0],
            className: `${fontColors.body} border px-2 py-0.5 text-xs font-medium`,
          }}
          icon={Type}
          value={config.typography.body}
          label='Corpo'
          key='body'
          onChange={(value) => updateConfig({ typography: { ...config.typography, body: value } })}
        />

        <FontSelectComponent
          badge={{
            label: config.typography.code.split(' ')[0],
            className: `${fontColors.code} border px-2 py-0.5 text-xs font-medium`,
          }}
          icon={Code}
          value={config.typography.code}
          label='Código'
          key='code'
          onChange={(value) =>
            updateConfig({
              typography: { ...config.typography, code: value },
            })
          }
        />

        <FontSelectComponent
          badge={{
            label: config.typography.quote.split(' ')[0],
            className: `${fontColors.quote} border px-2 py-0.5 text-xs font-medium`,
          }}
          icon={Quote}
          value={config.typography.quote}
          label='Citações'
          key='quote'
          onChange={(value) =>
            updateConfig({
              typography: { ...config.typography, quote: value },
            })
          }
        />
      </SettingsCard>

      {/* Tamanhos - Sliders Modernos */}
      <SettingsCard type='spacing' className={{ content: 'space-y-4' }}>
        {/* Tamanho Base */}
        <FontSizeSliderComponent
          value={config.typography.baseSize}
          onChange={(value) =>
            updateConfig({ typography: { ...config.typography, baseSize: value } })
          }
          label='Base'
          key='baseSize'
          icon={Minus}
          min={10}
          max={20}
          step={1}
          className={{
            label: 'text-muted-foreground flex items-center gap-1.5 text-xs font-medium',
            container: 'space-y-2',
            slider: 'w-full',
          }}
          badge={{
            label: `${config.typography.baseSize}px`,
            className:
              'border border-rose-200 bg-rose-500/10 px-2 py-0.5 text-xs font-semibold text-rose-600 dark:border-rose-800 dark:bg-rose-500/20 dark:text-rose-400',
          }}
        />

        {/* H1 */}
        <FontSizeSliderComponent
          value={config.typography.h1Size}
          onChange={(value) =>
            updateConfig({ typography: { ...config.typography, h1Size: value } })
          }
          label='H1'
          key='h1Size'
          icon={Heading1}
          min={20}
          max={40}
          step={1}
          badge={{
            label: `${config.typography.h1Size}px`,
            className:
              'border border-violet-200 bg-violet-500/10 px-2 py-0.5 text-xs font-semibold text-violet-600 dark:border-violet-800 dark:bg-violet-500/20 dark:text-violet-400',
          }}
          className={{
            label: 'text-muted-foreground flex items-center gap-1.5 text-xs font-medium',
            container: 'space-y-2',
            slider: 'w-full',
          }}
        />

        {/* H2 */}
        <FontSizeSliderComponent
          value={config.typography.h2Size}
          onChange={(value) =>
            updateConfig({ typography: { ...config.typography, h2Size: value } })
          }
          label='H2'
          key='h2Size'
          icon={Heading2}
          min={16}
          max={32}
          step={1}
          badge={{
            label: `${config.typography.h2Size}px`,
            className:
              'border border-indigo-200 bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-600 dark:border-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-400',
          }}
          className={{
            label: 'text-muted-foreground flex items-center gap-1.5 text-xs font-medium',
            container: 'space-y-2',
            slider: 'w-full',
          }}
        />

        <FontSizeSliderComponent
          label='Altura da Linha'
          key='lineHeight'
          icon={Minus}
          value={config.typography.lineHeight}
          onChange={(value) =>
            updateConfig({
              typography: { ...config.typography, lineHeight: value },
            })
          }
          badge={{
            label: `${config.typography.lineHeight.toFixed(1)}`,
            className:
              'border border-cyan-200 bg-cyan-500/10 px-2 py-0.5 text-xs font-semibold text-cyan-600 dark:border-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-400',
          }}
          min={1.2}
          max={2.0}
          step={0.1}
          className={{
            label: 'text-muted-foreground flex items-center gap-1.5 text-xs font-medium',
            container: 'space-y-2',
            slider: 'w-full',
          }}
        />
      </SettingsCard>
    </TabsContent>
  )
}
